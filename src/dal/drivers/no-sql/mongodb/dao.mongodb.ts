import { transformObject } from '../../../../generation/utils'
import { ConditionalPartialBy } from '../../../../utils/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FindOneParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams } from '../../../dao/dao.types'
import { AnyProjection, Projection } from '../../../dao/projections/projections.types'
import { DefaultModelScalars } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDAOParams } from './dao.mongodb.types'
import { adaptFilter, adaptProjection } from './utils.mongodb'
import { Collection, Document, WithId, Filter, UpdateOptions, FindOptions, OptionalId, InsertOneOptions } from 'mongodb'
import { PartialDeep } from 'type-fest'

export class AbstractMongoDBDAO<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDType,
  IDAutogenerated extends boolean,
  FilterType,
  ProjectionType extends Projection<ModelType>,
  SortType,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  OptionsType extends { mongoDB?: any },
  ScalarsType extends DefaultModelScalars,
> extends AbstractDAO<ModelType, IDKey, IDType, IDAutogenerated, FilterType, ProjectionType, SortType, UpdateType, ExcludedFields, OptionsType, ScalarsType> {
  protected collection: Collection

  protected constructor({
    collection,
    ...params
  }: MongoDBDAOParams<ModelType, IDKey, IDType, IDAutogenerated, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType, ScalarsType>) {
    super(params)
    this.collection = collection
  }

  private dbsToModels(objects: WithId<Document>[]): PartialDeep<ModelType>[] {
    return objects.map((o) => this.dbToModel(o))
  }

  private dbToModel(object: WithId<Document>): PartialDeep<ModelType> {
    return transformObject(this.daoContext.adapters.mongodb, 'dbToModel', object, this.schema)
  }

  private modelToDb(object: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated> | UpdateType): OptionalId<Document> {
    return transformObject(this.daoContext.adapters.mongodb, 'modelToDB', object, this.schema)
  }

  private buildProjection(projection?: AnyProjection<ModelType, ProjectionType>): Document | undefined {
    if (projection === true) {
      return undefined
    }
    return adaptProjection(projection, this.schema) as Document
  }

  private buildFilter(filter?: FilterType): Filter<Document> {
    if (filter) {
      return adaptFilter(filter as unknown as AbstractFilter, this.schema, this.daoContext.adapters.mongodb)
    }
    return {}
  }

  private buildSort(sorts?: SortType[]): [string, 1 | -1][] {
    return (
      sorts?.flatMap((s) => {
        return Object.entries(s).map(([k, v]) => {
          return [k, v.valueOf()] as [string, 1 | -1]
        })
      }) || []
    )
  }

  protected async _find<P extends AnyProjection<ModelType, ProjectionType>>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<PartialDeep<ModelType>[]> {
    if (params.limit === 0) {
      return []
    }
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const sort = this.buildSort(params.sorts)
    const results = await this.collection.find(filter, { projection, sort, skip: params.start, limit: params.limit || this.pageSize, ...params.options?.mongoDB } as FindOptions).toArray()
    const records = this.dbsToModels(results)
    return records
  }

  protected async _findOne<P extends AnyProjection<ModelType, ProjectionType>>(params: FindOneParams<FilterType, P, OptionsType>): Promise<PartialDeep<ModelType> | null> {
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const result = await this.collection.findOne(filter, { projection, ...params.options?.mongoDB } as FindOptions)
    if (!result) {
      return null
    }
    return this.dbToModel(result)
  }

  protected async _findPage<P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
  ): Promise<{ totalCount: number; records: PartialDeep<ModelType>[] }> {
    const totalCount = await this._count(params)
    const records = await this._find(params)
    return { totalCount, records }
  }

  protected async _exists(params: FilterParams<FilterType, OptionsType>): Promise<boolean> {
    return (await this._count(params)) > 0
  }

  protected async _count(params: FilterParams<FilterType, OptionsType>): Promise<number> {
    const filter = this.buildFilter(params.filter)
    return this.collection.countDocuments(filter, params.options?.mongoDB)
  }

  protected async _insertOne(params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>): Promise<Omit<ModelType, ExcludedFields>> {
    const record = this.modelToDb(params.record)
    const result = await this.collection.insertOne(record, params.options?.mongoDB as InsertOneOptions)
    const inserted = await this.collection.findOne(result.insertedId)
    return this.dbToModel(inserted!) as Omit<ModelType, ExcludedFields>
  }

  protected async _updateOne(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const changes = this.modelToDb(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateOne(filter, { $set: changes }, { upsert: false, ignoreUndefined: true, ...params.options?.mongoDB } as UpdateOptions)
  }

  protected async _updateMany(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const changes = this.modelToDb(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateMany(filter, changes, params.options?.mongoDB)
  }

  protected async _replaceOne(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<void> {
    const replace = this.modelToDb(params.replace)
    const filter = this.buildFilter(params.filter)
    await this.collection.replaceOne(filter, replace, params.options?.mongoDB)
  }

  protected async _deleteOne(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteOne(filter, params.options?.mongoDB)
  }

  protected async _deleteMany(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteMany(filter, params.options?.mongoDB)
  }
}
