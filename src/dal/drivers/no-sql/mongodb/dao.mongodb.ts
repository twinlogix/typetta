import { transformObject } from '../../../../generation/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FindOneParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { DefaultModelScalars } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDAOParams } from './dao.mongodb.types'
import { adaptFilter, adaptProjection, adaptSorts, adaptUpdate, modelNameToDbName } from './utils.mongodb'
import { Collection, Document, WithId, Filter, UpdateOptions, FindOptions, OptionalId, InsertOneOptions, Db } from 'mongodb'
import { PartialDeep } from 'type-fest'

export class AbstractMongoDBDAO<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDScalar extends keyof ScalarsType,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType extends object,
  SortType,
  InsertType extends object,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  OptionsType extends object,
  ScalarsType extends DefaultModelScalars,
> extends AbstractDAO<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, SortType, InsertType, UpdateType, ExcludedFields, OptionsType, { collection: Collection }, ScalarsType> {
  protected collection: Collection

  protected constructor({
    collection,
    ...params
  }: MongoDBDAOParams<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, InsertType, UpdateType, ExcludedFields, SortType, OptionsType, ScalarsType>) {
    super({ ...params, driverOptions: { collection } })
    this.collection = collection
  }

  private dbsToModels(objects: WithId<Document>[]): PartialDeep<ModelType>[] {
    return objects.map((o) => this.dbToModel(o))
  }

  private dbToModel(object: WithId<Document>): PartialDeep<ModelType> {
    return transformObject(this.daoContext.adapters.mongoDB, 'dbToModel', object, this.schema)
  }

  private modelToDb(object: InsertType | UpdateType): OptionalId<Document> {
    return transformObject(this.daoContext.adapters.mongoDB, 'modelToDB', object, this.schema)
  }

  private buildProjection(projection?: AnyProjection<ProjectionType>): Document | undefined {
    return adaptProjection(projection, this.schema) as Document
  }

  private buildFilter(filter?: FilterType): Filter<Document> {
    return filter ? adaptFilter(filter as unknown as AbstractFilter, this.schema, this.daoContext.adapters.mongoDB) : {}
  }

  private buildSort(sorts?: SortType[]): [string, 1 | -1][] {
    return sorts ? adaptSorts(sorts, this.schema) : []
  }

  private buildChanges(update: UpdateType) {
    return adaptUpdate(update, this.schema, this.daoContext.adapters.mongoDB)
  }

  protected async _find<P extends AnyProjection<ProjectionType>>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<PartialDeep<ModelType>[]> {
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

  protected async _findOne<P extends AnyProjection<ProjectionType>>(params: FindOneParams<FilterType, P, OptionsType>): Promise<PartialDeep<ModelType> | null> {
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const result = await this.collection.findOne(filter, { projection } as FindOptions)
    if (!result) {
      return null
    }
    return this.dbToModel(result)
  }

  protected async _findPage<P extends AnyProjection<ProjectionType>>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<{ totalCount: number; records: PartialDeep<ModelType>[] }> {
    const totalCount = await this._count(params)
    const records = await this._find(params)
    return { totalCount, records }
  }

  protected async _exists(params: FilterParams<FilterType, OptionsType>): Promise<boolean> {
    return (await this._count(params)) > 0
  }

  protected async _count(params: FilterParams<FilterType, OptionsType>): Promise<number> {
    const filter = this.buildFilter(params.filter)
    return this.collection.countDocuments(filter)
  }

  protected async _insertOne(params: InsertParams<InsertType, OptionsType>): Promise<Omit<ModelType, ExcludedFields>> {
    const record = this.modelToDb(params.record)
    const result = await this.collection.insertOne(record)
    const inserted = await this.collection.findOne(result.insertedId)
    return this.dbToModel(inserted!) as Omit<ModelType, ExcludedFields>
  }

  protected async _updateOne(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateOne(filter, { $set: changes }, { upsert: false, ignoreUndefined: true } as UpdateOptions)
  }

  protected async _updateMany(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateMany(filter, changes)
  }

  protected async _replaceOne(params: ReplaceParams<FilterType, InsertType, OptionsType>): Promise<void> {
    const replace = this.modelToDb(params.replace)
    const filter = this.buildFilter(params.filter)
    await this.collection.replaceOne(filter, replace)
  }

  protected async _deleteOne(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteOne(filter)
  }

  protected async _deleteMany(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteMany(filter)
  }
}
