import { transformObject } from '../../../../generation/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../../dao/dao.types'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDAOGenerics, MongoDBDAOParams } from './dao.mongodb.types'
import { adaptFilter, adaptProjection, adaptSorts, adaptUpdate, modelNameToDbName } from './utils.mongodb'
import { Collection, Document, WithId, Filter, UpdateOptions, FindOptions, OptionalId, SortDirection } from 'mongodb'
import { PartialDeep } from 'type-fest'

export class AbstractMongoDBDAO<T extends MongoDBDAOGenerics> extends AbstractDAO<T> {
  protected collection: Collection

  protected constructor({ collection, idGenerator, ...params }: MongoDBDAOParams<T>) {
    super({ ...params, driverContext: { collection }, idGenerator: idGenerator ?? params.daoContext.adapters.mongo[params.idScalar]?.generate })
    this.collection = collection
  }

  private dbsToModels(objects: WithId<Document>[]): PartialDeep<T['model']>[] {
    return objects.map((o) => this.dbToModel(o))
  }

  private dbToModel(object: WithId<Document>): PartialDeep<T['model']> {
    return transformObject(this.daoContext.adapters.mongo, 'dbToModel', object, this.schema)
  }

  private modelToDb(object: T['insert'] | T['update']): OptionalId<Document> {
    return transformObject(this.daoContext.adapters.mongo, 'modelToDB', object, this.schema)
  }

  private buildProjection(projection?: AnyProjection<T['projection']>): Document | undefined {
    return adaptProjection(projection, this.schema) as Document
  }

  private buildFilter(filter?: T['filter']): Filter<Document> {
    if (typeof filter === 'function') {
      return filter()
    }
    return filter ? adaptFilter(filter as unknown as AbstractFilter, this.schema, this.daoContext.adapters.mongo) : {}
  }

  private buildSort(sort?: T['sort']): [string, SortDirection][] {
    if (typeof sort === 'function') {
      return sort()
    }
    return sort ? adaptSorts(sort, this.schema) : []
  }

  private buildChanges(update: T['update']) {
    if (typeof update === 'function') {
      return update()
    }
    return { $set: adaptUpdate(update, this.schema, this.daoContext.adapters.mongo) }
  }

  protected async _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['projection']>[]> {
    if (params.limit === 0) {
      return []
    }
    const filter = this.buildFilter(params.filter)
    const projection = this.buildProjection(params.projection)
    const sort = this.buildSort(params.sorts)
    const results = await this.collection.find(filter, { ...(params.options ?? {}), projection, sort, skip: params.skip, limit: params.limit ?? this.pageSize } as FindOptions).toArray()
    const records = this.dbsToModels(results)
    return records
  }

  protected async _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }> {
    const totalCount = await this._count(params)
    const records = await this._findAll(params)
    return { totalCount, records }
  }

  protected async _exists(params: FilterParams<T>): Promise<boolean> {
    return (await this._count(params)) > 0
  }

  protected async _count(params: FilterParams<T>): Promise<number> {
    const filter = this.buildFilter(params.filter)
    return this.collection.countDocuments(filter, params.options ?? {})
  }

  protected async _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    if (params.by && Object.keys(params.by).length === 0) {
      throw new Error("'by' params must contains at least one key.")
    }
    const groupKeys: { [key: string]: string } = {}
    const byKeys = Object.keys(params.by || {})
    const groupId = params.by
      ? byKeys.reduce<object>((p, k) => {
          const mappedName = k.split('.').join('_')
          if (mappedName !== k) {
            groupKeys[k] = mappedName
          }
          return { ...p, [mappedName]: `$${modelNameToDbName(k, this.schema)}` }
        }, {})
      : {}
    const aggregation = Object.entries(params.aggregations).reduce<object>((p, [k, v]) => {
      if (v.operation === 'count' && v.field) {
        throw new Error('field value is not supported with aggregate count operation (MongoDB)')
      }
      return { ...p, [k]: v.operation === 'count' ? { [`$${v.operation}`]: {} } : { [`$${v.operation}`]: `$${modelNameToDbName(v.field as string, this.schema)}` } }
    }, {})

    const sort = args?.sorts
      ? [
          {
            // @ts-ignore
            $sort: args.sorts.reduce<object>((p, s) => {
              const [k, v] = Object.entries(s)[0]
              return {
                ...p,
                [byKeys.includes(k) ? `_id.${k}` : k]: (v as SortDirection) === 'asc' ? 1 : -1,
              }
            }, {}),
          },
        ]
      : []
    const filter = params.filter ? [{ $match: this.buildFilter(params.filter) }] : []
    const having = args?.having ? [{ $match: args.having }] : []
    const skip = params.skip != null ? [{ $skip: params.skip }] : []
    const limit = params.limit != null ? [{ $limit: params.limit }] : []
    const results = await this.collection
      .aggregate(
        [
          ...filter,
          {
            $group: {
              _id: groupId,
              ...aggregation,
            },
          },
          ...having,
          ...sort,
          ...skip,
          ...limit,
        ],
        params.options ?? {},
      )
      .toArray()

    const mappedResults = results.map((r) => {
      const rId = r._id
      for (const [k, v] of Object.entries(groupKeys)) {
        if (rId[v]) {
          rId[k] = rId[v]
          delete rId[v]
        }
      }
      delete r._id
      return {
        ...rId,
        ...r,
      }
    })

    if (params.by) {
      return mappedResults as AggregateResults<T, A>
    } else {
      if (mappedResults.length === 0) {
        return Object.keys(params.aggregations).reduce((p, k) => {
          return {
            ...p,
            [k]: params.aggregations[k].operation === 'count' ? 0 : null,
          }
        }, {}) as AggregateResults<T, A>
      }
      return mappedResults[0] as AggregateResults<T, A>
    }
  }

  protected async _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>> {
    const record = this.modelToDb(params.record)
    const result = await this.collection.insertOne(record, params.options ?? {})
    const inserted = await this.collection.findOne({ _id: result.insertedId }, params.options ?? {})
    return this.dbToModel(inserted!) as Omit<T['model'], T['exludedFields']>
  }

  protected async _updateOne(params: UpdateParams<T>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateOne(filter, changes, { ...(params.options ?? {}), upsert: false, ignoreUndefined: true } as UpdateOptions)
  }

  protected async _updateAll(params: UpdateParams<T>): Promise<void> {
    const changes = this.buildChanges(params.changes)
    const filter = this.buildFilter(params.filter)
    await this.collection.updateMany(filter, changes, params.options ?? {})
  }

  protected async _replaceOne(params: ReplaceParams<T>): Promise<void> {
    const replace = this.modelToDb(params.replace)
    const filter = this.buildFilter(params.filter)
    await this.collection.replaceOne(filter, replace, params.options ?? {})
  }

  protected async _deleteOne(params: DeleteParams<T>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteOne(filter, params.options ?? {})
  }

  protected async _deleteAll(params: DeleteParams<T>): Promise<void> {
    const filter = this.buildFilter(params.filter)
    await this.collection.deleteMany(filter, params.options ?? {})
  }
}
