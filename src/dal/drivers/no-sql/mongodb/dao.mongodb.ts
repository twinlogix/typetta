import { transformObject } from '../../../../generation/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FindOneParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams } from '../../../dao/dao.types'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDAOGenerics, MongoDBDAOParams } from './dao.mongodb.types'
import { adaptFilter, adaptProjection, adaptSorts, adaptUpdate } from './utils.mongodb'
import { Collection, Document, WithId, Filter, UpdateOptions, FindOptions, OptionalId } from 'mongodb'
import { PartialDeep } from 'type-fest'

export class AbstractMongoDBDAO<T extends MongoDBDAOGenerics> extends AbstractDAO<T> {
  protected collection: Collection

  protected constructor({ collection, ...params }: MongoDBDAOParams<T>) {
    super({ ...params, driverOptions: { collection } })
    this.collection = collection
  }

  private dbsToModels(objects: WithId<Document>[]): PartialDeep<T['modelType']>[] {
    return objects.map((o) => this.dbToModel(o))
  }

  private dbToModel(object: WithId<Document>): PartialDeep<T['modelType']> {
    return transformObject(this.daoContext.adapters.mongoDB, 'dbToModel', object, this.schema)
  }

  private modelToDb(object: T['insertType'] | T['updateType']): OptionalId<Document> {
    return transformObject(this.daoContext.adapters.mongoDB, 'modelToDB', object, this.schema)
  }

  private buildProjection(projection?: AnyProjection<T['projectionType']>): Document | undefined {
    return adaptProjection(projection, this.schema) as Document
  }

  private buildFilter(filter?: T['filterType']): Filter<Document> {
    return filter ? adaptFilter(filter as unknown as AbstractFilter, this.schema, this.daoContext.adapters.mongoDB) : {}
  }

  private buildSort(sorts?: T['sortType'][]): [string, 1 | -1][] {
    return sorts ? adaptSorts(sorts, this.schema) : []
  }

  private buildChanges(update: T['updateType']) {
    return adaptUpdate(update, this.schema, this.daoContext.adapters.mongoDB)
  }

  protected async _find<P extends AnyProjection<T['projectionType']>>(params: FindParams<T, P>): Promise<PartialDeep<T['projectionType']>[]> {
    if (params.limit === 0) {
      return []
    }
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const sort = this.buildSort(params.sorts)
    const results = await this.collection.find(filter, { projection, sort, skip: params.start, limit: params.limit || this.pageSize } as FindOptions).toArray()
    const records = this.dbsToModels(results)
    return records
  }

  protected async _findOne<P extends AnyProjection<T['projectionType']>>(params: FindOneParams<T, P>): Promise<PartialDeep<T['modelType']> | null> {
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const result = await this.collection.findOne(filter, { projection } as FindOptions)
    if (!result) {
      return null
    }
    return this.dbToModel(result)
  }

  protected async _findPage<P extends AnyProjection<T['projectionType']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['modelType']>[] }> {
    const totalCount = await this._count(params)
    const records = await this._find(params)
    return { totalCount, records }
  }

  protected async _exists(params: FilterParams<T>): Promise<boolean> {
    return (await this._count(params)) > 0
  }

  protected async _count(params: FilterParams<T>): Promise<number> {
    const filter = this.buildFilter(params.filter)
    return this.collection.countDocuments(filter)
  }

  protected async _insertOne(params: InsertParams<T>): Promise<Omit<T['modelType'], T['exludedFields']>> {
    const record = this.modelToDb(params.record)
    const result = await this.collection.insertOne(record)
    const inserted = await this.collection.findOne(result.insertedId)
    return this.dbToModel(inserted!) as Omit<T['modelType'], T['exludedFields']>
  }

  protected async _updateOne(params: UpdateParams<T>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateOne(filter, { $set: changes }, { upsert: false, ignoreUndefined: true } as UpdateOptions)
  }

  protected async _updateMany(params: UpdateParams<T>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateMany(filter, changes)
  }

  protected async _replaceOne(params: ReplaceParams<T>): Promise<void> {
    const replace = this.modelToDb(params.replace)
    const filter = this.buildFilter(params.filter)
    await this.collection.replaceOne(filter, replace)
  }

  protected async _deleteOne(params: DeleteParams<T>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteOne(filter)
  }

  protected async _deleteMany(params: DeleteParams<T>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteMany(filter)
  }
}
