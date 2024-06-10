import { AbstractScalars, equals, Indexes, IndexesApplyResults, IndexesPlanResults, Schema, TypettaCache } from '..'
import { toFirstLower } from '../generation/utils'
import { AbstractDAO } from './dao/dao'
import { DAOGenerics, TransactionData } from './dao/dao.types'
import { DriverDataTypeAdapterMap } from './drivers/drivers.adapters'
import { DefaultModelScalars } from './drivers/drivers.types'
import { inMemoryAdapters } from './drivers/in-memory/adapters.memory'
import { mongoDbAdapters } from './drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters } from './drivers/sql/knexjs/adapters.knexjs'
import { Knex } from 'knex'
import { ClientSession, Collection, CreateIndexesOptions, IndexDirection } from 'mongodb'

export abstract class AbstractEntityManager<
  MongoDBDatasources extends string,
  KnexDataSources extends string,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = DefaultModelScalars,
  MetadataType = unknown,
> {
  public Transaction: this & { __transaction_enabled__: true } = this as this & { __transaction_enabled__: true }

  public adapters: DriverDataTypeAdapterMap<Scalars>
  public metadata?: MetadataType
  private transactionData: TransactionData<MongoDBDatasources, KnexDataSources> | null = null
  public readonly cache?: TypettaCache

  public constructor(args: { scalars?: DriverDataTypeAdapterMap<Scalars>; metadata?: MetadataType; idGenerators?: { [K in keyof Scalars]?: () => Scalars[K] }; cache?: { engine: TypettaCache } }) {
    this.adapters = args?.scalars
      ? args.scalars
      : ({
          knex: knexJsAdapters,
          mongo: mongoDbAdapters,
          memory: inMemoryAdapters,
        } as DriverDataTypeAdapterMap<Scalars>)
    this.cache = args.cache?.engine
    this.metadata = args?.metadata
    this.postTransactions = []
  }

  public dao(daoName: string): AbstractDAO<DAOGenerics> {
    return (this as unknown as Record<string, AbstractDAO<DAOGenerics>>)[daoName]
  }

  public isTransacting(): boolean {
    return this.transactionData !== null
  }

  public abstract execQuery<T>(run: (dbs: Record<string, unknown>, entities: Record<string, unknown>) => Promise<T>): Promise<T>

  protected async planIndexes(args: { indexes: Indexes }, schemas?: Record<string, () => Schema>): Promise<IndexesPlanResults> {
    function getDbName(field: string, schema: Schema): string {
      const [head, ...tail] = field.split('.')
      const schemaField = schema[head]
      const name = schemaField.alias ?? head
      return tail.length > 0 && schemaField.type === 'embedded' ? `${name}.${getDbName(tail.join('.'), schemaField.schema())}` : name
    }
    if (!schemas) {
      throw new Error('schemas is required')
    }
    const result: IndexesPlanResults = { mongodb: { toCreate: [], toDelete: [] } }
    await this.execQuery(async (dbs, collections) => {
      for (const [name, indexes] of Object.entries(args.indexes.mongodb ?? {})) {
        if (!indexes) continue
        const key = toFirstLower(name)
        const collection = collections[key] as Collection
        if (collection) {
          // tricky way to create collection
          const inserted = await collection.insertOne({ empty: true })
          await collection.deleteOne({ _id: inserted.insertedId })
          const schema = schemas[name]()
          const loadedIndexes = await collection.indexes()
          const indexesThatAreEquals = loadedIndexes.filter((li) => {
            const index = (indexes as Record<string, unknown>[]).find((i) => li.name === i.name)
            if (!index) {
              return false
            }
            const li2: Partial<typeof li> = { ...li }
            delete li2.v
            delete li2.background
            delete li2.key
            delete li2.name
            const specs = Object.fromEntries(
              Object.entries(index.specs as Record<string, unknown>).map(([field, value]) => {
                const dbName = getDbName(field, schema)
                return [dbName, value]
              }),
            )
            if (equals(specs, li.key) && equals(index.opts ?? {}, li2)) {
              return true
            }
            return false
          })
          //same name but not equals
          const indexesToDrop = loadedIndexes.filter((li) => li.name !== '_id_' && !indexesThatAreEquals.find((i) => li.name === i.name))
          const indexesToCreate = (indexes as Record<string, unknown>[]).filter((i) => !indexesThatAreEquals.find((li) => li.name === i.name))
          for (const index of indexesToDrop) {
            result.mongodb.toDelete.push({ collection: key, name: index.name ?? '' })
          }
          for (const index of indexesToCreate) {
            const specs = Object.fromEntries(
              Object.entries(index.specs as Record<string, unknown>).map(([field, value]) => {
                const dbName = getDbName(field, schema)
                return [dbName, value]
              }),
            )
            result.mongodb.toCreate.push({
              collection: key,
              name: index.name as string,
              specs: specs as Record<string, IndexDirection>,
              opts: index.opts as Omit<CreateIndexesOptions, 'name'> | undefined,
            })
          }
        }
      }
    })
    return result
  }

  protected async applyIndexes(args: ({ plan: IndexesPlanResults } | { indexes: Indexes }) & { logs?: boolean }, schemas?: Record<string, () => Schema>): Promise<IndexesApplyResults> {
    const plan: IndexesPlanResults = 'plan' in args ? args.plan : await this.planIndexes(args, schemas)
    const results: IndexesApplyResults = { mongodb: { created: [], failed: [], deleted: [] } }
    await this.execQuery(async (dbs, collections) => {
      for (const index of plan.mongodb.toDelete) {
        const collection = collections[index.collection] as Collection
        if (!collection) continue
        if (args.logs) console.log(`Dropping ${index.name} index of collection ${index.collection}...`)
        await collection.dropIndex(index.name)
        results.mongodb.deleted.push({ ...index })
      }
      for (const index of plan.mongodb.toCreate) {
        try {
          const collection = collections[index.collection] as Collection
          if (!collection) continue
          if (args.logs) console.log(`Creating ${index.name} index of collection ${index.collection}...`)
          await collection.createIndex(index.specs, { ...(index.opts ?? {}), name: index.name })
          results.mongodb.created.push({ ...index })
        } catch (error) {
          results.mongodb.failed.push({ ...index, error })
        }
      }
    })
    return results
  }

  public getMongoSession(datasource: string): ClientSession | undefined {
    return ((this.transactionData?.mongodb ?? {}) as Record<string, ClientSession>)[datasource]
  }

  public getKenxTransaction(datasource: string): Knex.Transaction | undefined {
    return ((this.transactionData?.knex ?? {}) as Record<string, Knex.Transaction>)[datasource]
  }

  public async transaction<T>(transaction: TransactionData<MongoDBDatasources, KnexDataSources>, f: (dao: this['Transaction']) => Promise<T>): Promise<T> {
    const dao = this.clone()
    dao.transactionData = transaction
    const result = await f(dao as this & { __transaction_enabled__: true })
    return result
  }

  private postTransactions: (() => Promise<void>)[]
  public addPostTransactionProcessing(f: () => Promise<void>) {
    this.postTransactions.push(f)
  }
  public async executePostTransactionProcessing(): Promise<void> {
    const fs = [...this.postTransactions]
    this.postTransactions = []
    for (const f of fs) {
      await f()
    }
  }

  public abstract clone(): this
}
