import { DriverDataTypeAdapterMap } from './drivers/drivers.adapters'
import { AbstractDAO } from './dao/dao'
import { DAOGenerics, TransactionData } from './dao/dao.types'
import { DefaultModelScalars } from './drivers/drivers.types'
import { inMemoryAdapters } from './drivers/in-memory/adapters.memory'
import { mongoDbAdapters } from './drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters } from './drivers/sql/knexjs/adapters.knexjs'
import { Knex } from 'knex'
import { ClientSession } from 'mongodb'

export abstract class AbstractEntityManager<MongoDBDatasources extends string, KnexDataSources extends string, ScalarsType extends DefaultModelScalars = DefaultModelScalars, MetadataType = unknown> {
  public Transaction: this & { __transaction_enabled__: true } = this as this & { __transaction_enabled__: true }

  public adapters: DriverDataTypeAdapterMap<ScalarsType>
  public metadata?: MetadataType
  private transactionData: TransactionData<MongoDBDatasources, KnexDataSources> | null = null

  public constructor(args?: { scalars?: DriverDataTypeAdapterMap<ScalarsType>; metadata?: MetadataType; idGenerators?: { [K in keyof ScalarsType]?: () => ScalarsType[K] } }) {
    this.adapters = args?.scalars
      ? args.scalars
      : ({
          knex: knexJsAdapters,
          mongo: mongoDbAdapters,
          memory: inMemoryAdapters,
        } as DriverDataTypeAdapterMap<ScalarsType>)
    this.metadata = args?.metadata
  }

  public dao(daoName: string): AbstractDAO<DAOGenerics> {
    return (this as unknown as Record<string, AbstractDAO<DAOGenerics>>)[daoName]
  }

  public isTransacting(): boolean {
    return this.transactionData !== null
  }

  public getMongoSession(datasource: string): ClientSession | undefined {
    return ((this.transactionData?.mongodb ?? {}) as Record<string, ClientSession>)[datasource]
  }

  public getKenxTransaction(datasource: string): Knex.Transaction | undefined {
    return ((this.transactionData?.knex ?? {}) as Record<string, Knex.Transaction>)[datasource]
  }

  public async transaction<T>(transaction: TransactionData<MongoDBDatasources, KnexDataSources>, f: (dao: this['Transaction']) => Promise<T>): Promise<T> {
    const dao = this.clone()
    try {
      dao.transactionData = transaction
      const result = await f(dao as this & { __transaction_enabled__: true })
      dao.transactionData = null
      return result
    } catch (e) {
      dao.transactionData = null
      throw e
    }
  }

  protected abstract clone(): this
}
