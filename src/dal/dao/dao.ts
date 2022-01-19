import { deepCopy, getTraversing, reversed, setTraversing } from '../../utils/utils'
import { AbstractDAOContext } from '../daoContext/daoContext'
import {
  MiddlewareContext,
  DAO,
  DAOParams,
  DeleteParams,
  FilterParams,
  FindParams,
  InsertParams,
  ReplaceParams,
  UpdateParams,
  DAOGenerics,
  AggregateParams,
  AggregateResults,
  AggregatePostProcessing,
  FindOneParams,
} from './dao.types'
import { LogArgs, LogFunction } from './log/log.types'
import { DAOMiddleware, MiddlewareInput, MiddlewareOutput, SelectAfterMiddlewareOutputType, SelectBeforeMiddlewareOutputType } from './middlewares/middlewares.types'
import { AnyProjection, GenericProjection, ModelProjection } from './projections/projections.types'
import { getProjection, projection } from './projections/projections.utils'
import { DAORelation, DAORelationReference, DAORelationType } from './relations/relations.types'
import { Schema } from './schemas/schemas.types'
import DataLoader from 'dataloader'
import { GraphQLResolveInfo } from 'graphql'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'

export abstract class AbstractDAO<T extends DAOGenerics> implements DAO<T> {
  protected idField: T['idKey']
  protected idGeneration: T['idGeneration']
  protected daoContext: AbstractDAOContext<T['scalars'], T['metadata']>
  protected relations: DAORelation[]
  protected middlewares: DAOMiddleware<T>[]
  protected pageSize: number
  protected dataLoaders: Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>
  protected metadata?: T['metadata']
  protected driverContext: T['driverContext']
  protected schema: Schema<T['scalars']>
  protected idGenerator?: () => T['scalars'][T['idScalar']]
  protected name: T['name']
  private logger?: LogFunction<T['name']>

  protected constructor({
    idField,
    idScalar,
    idGeneration,
    idGenerator,
    daoContext,
    name,
    logger,
    pageSize = 50,
    relations = [],
    middlewares = [],
    schema,
    metadata,
    driverContext: driverOptions,
  }: DAOParams<T>) {
    this.dataLoaders = new Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>()
    this.idField = idField
    this.idGenerator = idGenerator
    this.daoContext = daoContext
    this.pageSize = pageSize
    this.relations = relations
    this.idGeneration = idGeneration
    this.name = name
    this.logger = logger
    if (this.idGeneration === 'generator' && !this.idGenerator) {
      throw new Error(`ID generator for scalar ${idScalar} is missing. Define one in DAOContext or in DAOParams.`)
    }
    this.middlewares = [
      {
        before: async (args, context) => {
          if (args.operation === 'find') {
            return {
              continue: true,
              operation: args.operation,
              params: {
                ...args.params,
                projection: this.addNeededProjectionForRelations(args.params.projection),
              },
            }
          }
          if (args.operation === 'insert' && this.idGeneration === 'generator' && this.idGenerator && !Object.keys(args.params.record).includes(context.idField)) {
            return {
              continue: true,
              operation: args.operation,
              params: { ...args.params, record: { ...args.params.record, [context.idField]: this.idGenerator() } },
            }
          }
        },
      },
      ...middlewares,
    ]
    this.metadata = metadata
    this.driverContext = driverOptions
    this.schema = schema
  }

  async findAll<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    return this.logOperation('findAll', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection(params) })
      const records = beforeResults.continue ? await this._findAll(beforeResults.params) : beforeResults.records
      const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors }, beforeResults.middlewareIndex)
      return afterResults.records as ModelProjection<T['model'], T['projection'], P>[]
    })
  }

  async findOne<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindOneParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P> | null> {
    const results = await this.findAll({ ...params, limit: 1 })
    return results.length > 0 ? results[0] : null
  }

  async findPage<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(
    params: FindParams<T, P> = {},
  ): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }> {
    return this.logOperation('findPage', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection(params) })
      const { totalCount, records } = beforeResults.continue ? await this._findPage(beforeResults.params) : { records: beforeResults.records, totalCount: beforeResults.totalCount ?? 0 }
      const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors, totalCount }, beforeResults.middlewareIndex)
      return {
        totalCount: afterResults.totalCount ?? 0,
        records: afterResults.records as ModelProjection<T['model'], T['projection'], P>[],
      }
    })
  }

  async exists(params: FilterParams<T>): Promise<boolean> {
    return this.logOperation('exists', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
      return this._exists(beforeResults.params)
    })
  }

  async count(params: FilterParams<T> = {}): Promise<number> {
    return this.logOperation('count', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
      return this._count(beforeResults.params)
    })
  }

  async aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    return this.logOperation('aggregate', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'aggregate', params, args })
      const result = beforeResults.continue ? await this._aggregate(params, args) : beforeResults.result
      const afterResults = await this.executeAfterMiddlewares(
        { operation: 'aggregate', params: beforeResults.params, args: beforeResults.args, result: result as AggregateResults<T, AggregateParams<T>> },
        beforeResults.middlewareIndex,
      )
      return afterResults.result as AggregateResults<T, A>
    })
  }

  protected async loadAll<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: Omit<FindParams<T, P>, 'start' | 'limit' | 'filter'>,
    filterKey: K,
    filterValues: T['filter'][K][],
    hasKey?: (record: ModelProjection<T['model'], T['projection'], P>, key: T['filter'][K]) => boolean,
    buildFilter?: (filterKey: K, filterValues: readonly T['filter'][K][]) => T['filter'],
  ): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    const hash =
      filterKey +
      '-' +
      objectHash(params.projection || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.sorts || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.metadata || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.options || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.relations || null, { respectType: false, unorderedArrays: true })
    const hasKeyF = hasKey ?? ((record, key) => getTraversing(record, filterKey as string).includes(key))
    const buildFilterF = buildFilter ?? ((key, values) => ({ [key]: { $in: values } }))
    if (!this.dataLoaders.has(hash)) {
      const newDataLoader = new DataLoader<T['filter'][K], PartialDeep<T['model']>[]>(
        async (keys) => {
          const proj = deepCopy(params.projection) as P
          setTraversing(proj, filterKey as string, true)
          const records = await this.findAll({ ...params, projection: proj, filter: buildFilterF(filterKey, keys) })
          return keys.map((key) => records.filter((r) => hasKeyF(r, key)))
        },
        {
          maxBatchSize: this.pageSize,
        },
      )
      this.dataLoaders.set(hash, newDataLoader)
    }
    const dataLoader = this.dataLoaders.get(hash)!
    const results = await dataLoader.loadMany(filterValues)
    return results.flatMap((r) => {
      if (r instanceof Error) {
        throw r
      }
      return r
    }) as ModelProjection<T['model'], T['projection'], P>[]
  }

  private addNeededProjectionForRelations<P extends AnyProjection<T['projection']>>(proj?: P): P | undefined {
    if (proj === true || !proj) {
      return proj
    }
    const dbProjections = deepCopy(proj)
    this.relations.forEach((relation) => {
      if (relation.reference === DAORelationReference.INNER) {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refFrom, true)
        }
      } else if (relation.reference === DAORelationReference.FOREIGN) {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refTo, true)
        }
      } else if (relation.reference === DAORelationReference.RELATION) {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refThis.refTo, true)
        }
      }
    })
    return dbProjections
  }

  private async resolveRelations(records: PartialDeep<T['model']>[], projections?: AnyProjection<T['projection']>, relations?: T['relations']): Promise<PartialDeep<T['model']>[]> {
    if (projections === undefined || projections === true) {
      return records
    }
    for (const relation of this.relations) {
      const relationProjection = getProjection(projections as GenericProjection, relation.field)
      const relationsFilter = getTraversing(relations, relation.field)
      const relationFilter: FindParams<T>['relations'] = relationsFilter.length > 0 ? relationsFilter[0] : undefined
      if (relationProjection) {
        const params: FindParams<T> = {
          filter: relationFilter?.filter,
          projection: relationProjection,
          limit: relationFilter?.limit,
          skip: relationFilter?.skip,
          sorts: relationFilter?.sorts,
          relations: relationFilter?.relations,
          options: relationFilter?.options,
        }
        if (relation.reference === DAORelationReference.RELATION) {
          const rels = await this.daoContext.dao(relation.relationDao).loadAll(
            {
              projection: { [relation.refThis.refFrom]: true, [relation.refOther.refFrom]: true },
            },
            relation.refThis.refFrom,
            records.flatMap((r) => getTraversing(r, relation.refThis.refTo)),
          )
          for (const record of records) {
            const results = await this.daoContext.dao(relation.entityDao).loadAllOrFindAll(
              params,
              relation.refOther.refTo,
              rels.filter((r) => getTraversing(r, relation.refThis.refFrom)[0] === getTraversing(record, relation.refThis.refTo)[0]).flatMap((r) => getTraversing(r, relation.refOther.refFrom)),
            )
            if (relation.type === DAORelationType.ONE_TO_MANY) {
              setTraversing(record, relation.field, results)
            } else {
              setTraversing(record, relation.field, results.length > 0 ? results[0] : null)
            }
          }
        } else if (relation.reference === DAORelationReference.INNER) {
          for (const record of records) {
            const results = await this.daoContext.dao(relation.dao).loadAllOrFindAll(params, relation.refTo, getTraversing(record, relation.refFrom))
            if (relation.type === DAORelationType.ONE_TO_MANY) {
              setTraversing(record, relation.field, results)
            } else {
              setTraversing(record, relation.field, results.length > 0 ? results[0] : null)
            }
          }
        } else if (relation.reference === DAORelationReference.FOREIGN) {
          for (const record of records) {
            const results = await this.daoContext.dao(relation.dao).loadAllOrFindAll(params, relation.refFrom, getTraversing(record, relation.refTo))
            if (relation.type === DAORelationType.ONE_TO_MANY) {
              setTraversing(record, relation.field, results)
            } else {
              setTraversing(record, relation.field, results.length > 0 ? results[0] : null)
            }
          }
        }
      }
    }
    return records
  }

  private async loadAllOrFindAll<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: FindParams<T, P>,
    filterKey: K,
    filterValues: T['filter'][K][],
  ): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    if (params.skip != null || params.limit != null || params.filter != null) {
      return this.findAll({ ...params, filter: { $and: [{ [filterKey]: { $in: filterValues } }, params.filter ?? {}] } })
    }
    return await this.loadAll(params, filterKey, filterValues)
  }

  async insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>> {
    return this.logOperation('insertOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'insert', params })
      const record = beforeResults.continue ? await this._insertOne(beforeResults.params) : beforeResults.record
      const afterResults = await this.executeAfterMiddlewares({ operation: 'insert', params: beforeResults.params, record }, beforeResults.middlewareIndex)
      return afterResults.record
    })
  }

  async updateOne(params: UpdateParams<T>): Promise<void> {
    return this.logOperation('updateOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params })
      if (beforeResults.continue) {
        await this._updateOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex)
    })
  }

  async updateAll(params: UpdateParams<T>): Promise<void> {
    return this.logOperation('updateAll', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params })
      if (beforeResults.continue) {
        await this._updateAll(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex)
    })
  }

  async replaceOne(params: ReplaceParams<T>): Promise<void> {
    return this.logOperation('replaceOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'replace', params })
      if (beforeResults.continue) {
        await this._replaceOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'replace', params: beforeResults.params }, beforeResults.middlewareIndex)
    })
  }

  async deleteOne(params: DeleteParams<T>): Promise<void> {
    return this.logOperation('deleteOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params })
      if (beforeResults.continue) {
        await this._deleteOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex)
    })
  }

  async deleteAll(params: DeleteParams<T>): Promise<void> {
    return this.logOperation('deleteAll', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params })
      if (beforeResults.continue) {
        await this._deleteAll(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex)
    })
  }

  private createMiddlewareContext(): MiddlewareContext<T> {
    return { schema: this.schema, idField: this.idField, driver: this.driverContext, metadata: this.metadata }
  }

  private async executeBeforeMiddlewares<I extends MiddlewareInput<T>>(input: I): Promise<SelectBeforeMiddlewareOutputType<T, I> & { middlewareIndex?: number }> {
    const middlewareContext = this.createMiddlewareContext()
    for (const [before, index] of this.middlewares.flatMap((m, i) => (m.before ? [[m.before, i] as const] : []))) {
      const result = await before(input, middlewareContext)
      if (!result) {
        continue
      }
      if (result.operation !== input.operation) {
        throw new Error(`Invalid operation. Expecting '${input.operation}' but received '${result.operation}'.`)
      }
      if (result.continue) {
        const newInput = { ...result, continue: undefined }
        delete newInput.continue
        input = newInput as unknown as I
      } else {
        const newResult = { ...result, continue: undefined }
        delete newResult.continue
        return { ...newResult, middlewareIndex: index } as unknown as SelectBeforeMiddlewareOutputType<T, I> & { middlewareIndex?: number }
      }
    }
    return { ...input, continue: true } as unknown as SelectBeforeMiddlewareOutputType<T, I> & { middlewareIndex?: number }
  }

  private async executeAfterMiddlewares<I extends MiddlewareOutput<T>>(input: I, middlewareIndex: number | undefined): Promise<SelectAfterMiddlewareOutputType<T, I>> {
    const middlewareContext = this.createMiddlewareContext()
    for (const after of reversed((middlewareIndex ? this.middlewares.slice(0, middlewareIndex + 1) : this.middlewares).flatMap((m) => (m.after ? [m.after] : [])))) {
      const result = await after(input, middlewareContext)
      if (!result) {
        continue
      }
      if (result.operation !== input.operation) {
        throw new Error(`Invalid operation. Expecting '${input.operation}' but received '${result.operation}'.`)
      }
      if (result.continue) {
        const newInput = { ...result, continue: undefined }
        delete newInput.continue
        input = newInput as unknown as I
      } else {
        const newResult = { ...result, continue: undefined }
        delete newResult.continue
        return newResult as unknown as SelectAfterMiddlewareOutputType<T, I>
      }
    }
    return input as unknown as SelectAfterMiddlewareOutputType<T, I>
  }

  private infoToProjection<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindParams<T, P>): FindParams<T, P> {
    if (params.projection && typeof params.projection === 'object' && (typeof params.projection.path === 'object' || typeof params.projection.schema === 'object')) {
      return {
        ...params,
        projection: projection().fromInfo(params.projection as GraphQLResolveInfo) as P,
      }
    }
    return params
  }

  private async logOperation<R>(
    operation: LogArgs<T['name']>['operation'],
    params: FindParams<T> | FindOneParams<T> | InsertParams<T> | UpdateParams<T> | ReplaceParams<T> | DeleteParams<T>,
    body: () => Promise<R>,
  ): Promise<R> {
    if (this.logger) {
      const start = new Date()
      const result = await body()
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      const query = JSON.stringify({ ...params, options: undefined })
      this.log(this.createLog({ date: start, level: 'debug', duration, operation, query }))
      return result
    }
    return body()
  }

  protected createLog(log: Omit<LogArgs<T['name']>, 'raw' | 'dao'>): LogArgs<T['name']> {
    return {
      ...log,
      raw: `[${log.date.toISOString()}] (dao: ${this.name}, op: ${log.operation}${log.driver ? `, driver: ${log.driver}` : ''}):${log.query ? ` ${log.query}` : ''} [${log.duration} ms${
        log.error ? `, ${log.error}` : ''
      }]`,
      dao: this.name,
    }
  }

  protected log(args: LogArgs<T['name']>) {
    if (this.logger) {
      // this method is not await in order to avoid system slowdowns
      // the order of the emission of logs is not guaranteed
      this.logger(args)
        .then(() => {
          return
        })
        .catch(() => {
          return
        })
    }
  }

  // -----------------------------------------------------------------------
  // ------------------------------ ABSTRACTS ------------------------------
  // -----------------------------------------------------------------------
  protected abstract _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]>
  protected abstract _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }>
  protected abstract _exists(params: FilterParams<T>): Promise<boolean>
  protected abstract _count(params: FilterParams<T>): Promise<number>
  protected abstract _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>>
  protected abstract _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>>
  protected abstract _updateOne(params: UpdateParams<T>): Promise<void>
  protected abstract _updateAll(params: UpdateParams<T>): Promise<void>
  protected abstract _replaceOne(params: ReplaceParams<T>): Promise<void>
  protected abstract _deleteOne(params: DeleteParams<T>): Promise<void>
  protected abstract _deleteAll(params: DeleteParams<T>): Promise<void>
}
