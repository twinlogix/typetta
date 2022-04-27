import { equals } from '../../dal/drivers/in-memory/utils.memory'
import { getTraversing, reversed, setTraversing } from '../../utils/utils'
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
  DriverType,
  IdGenerationStrategy,
} from './dao.types'
import { LogArgs, LogFunction } from './log/log.types'
import { DAOMiddleware, MiddlewareInput, MiddlewareOutput, SelectAfterMiddlewareOutputType, SelectBeforeMiddlewareOutputType } from './middlewares/middlewares.types'
import { buildMiddleware } from './middlewares/utils/builder'
import { AnyProjection, GenericProjection, ModelProjection } from './projections/projections.types'
import { getProjection, infoToProjection } from './projections/projections.utils'
import { DAORelation } from './relations/relations.types'
import { Schema } from './schemas/schemas.types'
import DataLoader from 'dataloader'
import { getNamedType, GraphQLResolveInfo } from 'graphql'
import _ from 'lodash'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractDAO<T extends DAOGenerics> implements DAO<T> {
  public build<P extends T['projection']>(p: P): P {
    return p
  }

  protected idField: T['idKey']
  protected idScalar: T['idScalar']
  protected idGeneration: IdGenerationStrategy
  protected daoContext: T['daoContext']
  protected relations: DAORelation[]
  protected middlewares: DAOMiddleware<T>[]
  protected pageSize: number
  protected dataLoaders: Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>
  protected dataLoaderRefs: Map<string, string[]>
  protected metadata?: T['metadata']
  protected driverContext: T['driverContext']
  protected schema: Schema<T['scalars']>
  protected idGenerator?: () => T['scalars'][T['idScalar']]
  protected name: T['name']
  private logger?: LogFunction<T['name']>

  protected constructor({ idField, idScalar, idGeneration, idGenerator, daoContext, name, logger, pageSize = 50, relations = [], middlewares = [], schema, metadata, driverContext }: DAOParams<T>) {
    this.dataLoaders = new Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>()
    this.dataLoaderRefs = new Map<string, string[]>()
    this.idField = idField
    this.idScalar = idScalar
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
    Object.entries(schema)
      .flatMap(([k, v]) => (v.defaultGenerationStrategy === 'generator' && 'scalar' in v ? [[k, v.scalar] as const] : []))
      .forEach(([key, scalar]) => {
        if (!daoContext.adapters[this._driver()][scalar].generate) {
          throw new Error(`Generator for scalar ${scalar} is needed for generate default fields ${key}. Define one in DAOContext or in DAOParams.`)
        }
      })
    const defaultMiddleware = buildMiddleware<T>({
      beforeInsert: async (params, context) => {
        const fieldsToGenerate = Object.entries(context.schema).flatMap(([k, v]) => (v.defaultGenerationStrategy === 'generator' && 'scalar' in v ? [[k, v] as const] : []))
        const record = fieldsToGenerate.reduce((record, [key, schema]) => {
          const generator = this.daoContext.adapters[context.daoDriver][schema.scalar].generate
          if (record[key] == null && generator) {
            return {
              ...record,
              [key]: generator(),
            }
          }
          return record
        }, params.record)
        const fieldsToHave = Object.entries(schema).flatMap(([k, v]) => (v.defaultGenerationStrategy === 'middleware' ? [[k, v] as const] : []))
        fieldsToHave.forEach(([key, schema]) => {
          if (schema.required && record[key] == null) {
            throw new Error(`Fields ${key} should have been generated from a middleware but it is ${record[key]}`)
          }
        })
        return { continue: true, params: { ...params, record } }
      },
    })
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
      ...(Object.values(schema).some((v) => v.defaultGenerationStrategy) ? [defaultMiddleware] : []),
    ]
    this.metadata = metadata
    this.driverContext = driverContext
    this.schema = schema
  }

  async findAll<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindParams<T, P> = {}): Promise<ModelProjection<T, P>[]> {
    return this.logOperation('findAll', params, async () => {
      const [isRootOperation, operationId] = params.operationId ? [false, params.operationId] : [true, uuidv4()]
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection({ ...params, operationId }) }, 'findAll')
      const records = beforeResults.continue ? await this._findAll(beforeResults.params) : beforeResults.records
      const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations, beforeResults.params.operationId)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors }, beforeResults.middlewareIndex, 'findAll')
      if (isRootOperation) {
        this.clearDataLoader(operationId)
      }
      return afterResults.records as ModelProjection<T, P>[]
    })
  }

  async findOne<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindOneParams<T, P> = {}): Promise<ModelProjection<T, P> | null> {
    const results = await this.findAll({ ...params, limit: 1 })
    return results.length > 0 ? results[0] : null
  }

  async findPage<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindParams<T, P> = {}): Promise<{ totalCount: number; records: ModelProjection<T, P>[] }> {
    return this.logOperation('findPage', params, async () => {
      const [isRootOperation, operationId] = params.operationId ? [false, params.operationId] : [true, uuidv4()]
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection({ ...params, operationId }) }, 'findPage')
      const { totalCount, records } = beforeResults.continue ? await this._findPage(beforeResults.params) : { records: beforeResults.records, totalCount: beforeResults.totalCount ?? 0 }
      const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations, beforeResults.params.operationId)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors, totalCount }, beforeResults.middlewareIndex, 'findPage')
      if (isRootOperation) {
        this.clearDataLoader(operationId)
      }
      return {
        totalCount: afterResults.totalCount ?? 0,
        records: afterResults.records as ModelProjection<T, P>[],
      }
    })
  }

  async exists(params: FilterParams<T>): Promise<boolean> {
    return this.logOperation('exists', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params }, 'exists')
      const exists = (beforeResults.continue ? await this._exists(beforeResults.params) : beforeResults.totalCount ?? 0) > 0
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: [], totalCount: exists ? 1 : 0 }, beforeResults.middlewareIndex, 'exists')
      return (afterResults.totalCount ?? 0) > 0
    })
  }

  async count(params: FilterParams<T> = {}): Promise<number> {
    return this.logOperation('count', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params }, 'count')
      const count = beforeResults.continue ? await this._count(beforeResults.params) : beforeResults.totalCount ?? 0
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: [], totalCount: count }, beforeResults.middlewareIndex, 'count')
      return afterResults.totalCount ?? 0
    })
  }

  async aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    return this.logOperation('aggregate', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'aggregate', params, args }, 'aggregate')
      const result = beforeResults.continue ? await this._aggregate(beforeResults.params, beforeResults.args) : beforeResults.result
      const afterResults = await this.executeAfterMiddlewares(
        { operation: 'aggregate', params: beforeResults.params, args: beforeResults.args, result: result as AggregateResults<T, AggregateParams<T>> },
        beforeResults.middlewareIndex,
        'aggregate',
      )
      return afterResults.result as AggregateResults<T, A>
    })
  }

  protected async loadAll<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: Omit<FindParams<T, P>, 'start' | 'limit' | 'filter'>,
    filterKey: K,
    filterValues: T['filter'][K][],
    buildFilter?: (filterKey: K, filterValues: readonly T['filter'][K][]) => T['filter'],
  ): Promise<ModelProjection<T, P>[]> {
    const hash =
      (params.operationId ?? '') +
      filterKey +
      '-' +
      objectHash(params.projection || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.sorts || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.metadata || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.options || null, { respectType: false, unorderedArrays: true }) +
      objectHash(params.relations || null, { respectType: false, unorderedArrays: true })
    const hasKeyF = (record: ModelProjection<T, P>, key: T['filter'][K]) => getTraversing(record, filterKey as string).some((v) => equals(v, key))
    const buildFilterF = buildFilter ?? ((key, values) => ({ [key]: { in: values } }))
    if (!this.dataLoaders.has(hash)) {
      const newDataLoader = new DataLoader<T['filter'][K], PartialDeep<T['model']>[]>(
        async (keys) => {
          const proj = _.cloneDeep(params.projection)
          setTraversing(proj, filterKey as string, true)
          const records = await this.findAll({ ...params, projection: proj, filter: buildFilterF(filterKey, keys) })
          return keys.map((key) => records.filter((r) => hasKeyF(r, key)))
        },
        {
          maxBatchSize: this.pageSize,
        },
      )
      this.dataLoaders.set(hash, newDataLoader)
      const hashs = this.dataLoaderRefs.get(params.operationId ?? '')
      if (hashs) {
        this.dataLoaderRefs.set(params.operationId ?? '', [...hashs, hash])
      } else {
        this.dataLoaderRefs.set(params.operationId ?? '', [hash])
      }
    }
    const dataLoader = this.dataLoaders.get(hash)
    if (!dataLoader) {
      return []
    }
    const results = await dataLoader.loadMany(filterValues)
    return results.flatMap((r) => {
      if (r instanceof Error) {
        throw r
      }
      return r
    }) as ModelProjection<T, P>[]
  }

  private clearDataLoader(operationId: string): void {
    const hashs = this.dataLoaderRefs.get(operationId)
    this.dataLoaderRefs.delete(operationId)
    for (const hash of hashs ?? []) {
      const dt = this.dataLoaders.get(hash)
      if (dt) {
        dt.clearAll()
        this.dataLoaders.delete(hash)
      }
      for (const relation of this.relations) {
        if (relation.reference === 'relation') {
          this.daoContext.dao(relation.entityDao).clearDataLoader(operationId)
          this.daoContext.dao(relation.relationDao).clearDataLoader(operationId)
        } else {
          this.daoContext.dao(relation.dao).clearDataLoader(operationId)
        }
      }
    }
  }

  private addNeededProjectionForRelations<P extends AnyProjection<T['projection']>>(proj?: P): P | undefined {
    if (proj === true || !proj) {
      return proj
    }
    const dbProjections = _.cloneDeep(proj)
    this.relations.forEach((relation) => {
      if (relation.reference === 'inner') {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refFrom, true)
        }
      } else if (relation.reference === 'foreign') {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refTo, true)
        }
      } else if (relation.reference === 'relation') {
        if (getTraversing(dbProjections, relation.field).length > 0) {
          setTraversing(dbProjections, relation.refThis.refTo, true)
        }
      }
    })
    return dbProjections
  }

  private async resolveRelations(
    records: PartialDeep<T['model']>[],
    projections?: AnyProjection<T['projection']>,
    relations?: T['relations'],
    operationId?: string,
  ): Promise<PartialDeep<T['model']>[]> {
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
          metadata: relationFilter?.metadata,
          operationId,
        }
        if (relation.reference === 'relation') {
          const rels = await this.daoContext.dao(relation.relationDao).loadAll(
            {
              projection: { [relation.refThis.refFrom]: true, [relation.refOther.refFrom]: true },
            },
            relation.refThis.refFrom,
            records.flatMap((r) => getTraversing(r, relation.refThis.refTo)),
          )
          for (const record of records) {
            const results = await this.daoContext.dao(relation.entityDao).findAllWithBatching(
              params,
              relation.refOther.refTo,
              rels
                .filter((r: unknown) => getTraversing(r, relation.refThis.refFrom)[0] === getTraversing(record, relation.refThis.refTo)[0])
                .flatMap((r: unknown) => getTraversing(r, relation.refOther.refFrom)),
            )
            this.setResult(record, relation, results)
          }
        } else if (relation.reference === 'inner') {
          for (const record of records) {
            const keys = getTraversing(record, relation.refFrom)
            const results = await this.daoContext.dao(relation.dao).findAllWithBatching(params, relation.refTo, keys)
            this.setResult(record, relation, results)
          }
        } else if (relation.reference === 'foreign') {
          for (const record of records) {
            const results = await this.daoContext.dao(relation.dao).findAllWithBatching(params, relation.refFrom, getTraversing(record, relation.refTo))
            this.setResult(record, relation, results)
          }
        }
      }
    }
    return records
  }

  private setResult(record: PartialDeep<T['model']>, relation: DAORelation, results: ModelProjection<DAOGenerics, T['projection']>[]) {
    if (relation.type === '1-n') {
      setTraversing(record, relation.field, results)
    } else {
      if (relation.reference === 'inner') {
        const map = _.mapKeys(results, (r) => getTraversing(r, relation.refTo)[0])
        this.setInnerRefResults(map, { refFrom: relation.refFrom, field: relation.field, schema: this.schema }, record)
        return
      }
      if (results.length > 0) {
        setTraversing(record, relation.field, results[0])
      } else if (relation.required) {
        // TODO: this is not logged
        throw new Error(`dao: ${this.name}, a relation field is required but the relation reference is broken: ${JSON.stringify(relation)}`)
      } else {
        setTraversing(record, relation.field, null)
      }
    }
  }

  private setInnerRefResults(
    results: _.Dictionary<ModelProjection<DAOGenerics, T['projection']>>,
    reference: { refFrom: string; field: string; ref?: Record<string, unknown>; schema: Schema<T['scalars']> },
    record: PartialDeep<T['model']>,
  ) {
    const [subRefFrom, ...tailRefFrom] = reference.refFrom.split('.')
    const [subField, ...tailField] = reference.field.split('.')
    const ref = reference.ref != null ? reference.ref : record[subRefFrom]
    if (tailRefFrom.length === 0) {
      reference.ref = ref
    }
    if (tailField.length === 0) {
      if (reference.ref == null) {
        throw new Error('TODO') // TODO
      }
      record[subField] = results[reference.ref.toString()] ?? null
      return
    }
    const subSchema = reference.schema[subField]
    if (!('embedded' in subSchema)) {
      throw new Error('Unreachable')
    }
    if (record[subField] == null) {
      record[subField] = subSchema.array ? [] : {}
    }
    if (Array.isArray(record[subField])) {
      for (const r of record[subField]) {
        this.setInnerRefResults(results, { refFrom: tailRefFrom.join('.'), field: tailField.join('.'), ref: reference.ref, schema: subSchema.embedded }, r)
      }
    } else {
      this.setInnerRefResults(results, { refFrom: tailRefFrom.join('.'), field: tailField.join('.'), ref: reference.ref, schema: subSchema.embedded }, record[subField])
    }
  }

  private async findAllWithBatching<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: FindParams<T, P>,
    filterKey: K,
    filterValues: T['filter'][K] | T['filter'][K][],
  ): Promise<ModelProjection<T, P>[]> {
    const values = Array.isArray(filterValues) ? filterValues : [filterValues]
    if (params.skip != null || params.limit != null || params.filter != null) {
      return this.findAll({ ...params, filter: params.filter ? { $and: [{ [filterKey]: { in: values } }, params.filter] } : { [filterKey]: { in: values } } })
    }
    return await this.loadAll(params, filterKey, values)
  }

  async insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>> {
    return this.logOperation('insertOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'insert', params }, 'insertOne')
      const insertedRecord = beforeResults.continue ? await this._insertOne(beforeResults.params) : beforeResults.insertedRecord
      const afterResults = await this.executeAfterMiddlewares({ operation: 'insert', params: beforeResults.params, insertedRecord }, beforeResults.middlewareIndex, 'insertOne')
      return afterResults.insertedRecord
    })
  }

  async updateOne(params: UpdateParams<T>): Promise<void> {
    return this.logOperation('updateOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params }, 'updateOne')
      if (beforeResults.continue) {
        await this._updateOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex, 'updateOne')
    })
  }

  async updateAll(params: UpdateParams<T>): Promise<void> {
    return this.logOperation('updateAll', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params }, 'updateAll')
      if (beforeResults.continue) {
        await this._updateAll(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex, 'updateAll')
    })
  }

  async replaceOne(params: ReplaceParams<T>): Promise<void> {
    return this.logOperation('replaceOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'replace', params }, 'replaceOne')
      if (beforeResults.continue) {
        await this._replaceOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'replace', params: beforeResults.params }, beforeResults.middlewareIndex, 'replaceOne')
    })
  }

  async deleteOne(params: DeleteParams<T>): Promise<void> {
    return this.logOperation('deleteOne', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params }, 'deleteOne')
      if (beforeResults.continue) {
        await this._deleteOne(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex, 'deleteOne')
    })
  }

  async deleteAll(params: DeleteParams<T>): Promise<void> {
    return this.logOperation('deleteAll', params, async () => {
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params }, 'deleteAll')
      if (beforeResults.continue) {
        await this._deleteAll(beforeResults.params)
      }
      await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex, 'deleteAll')
    })
  }

  private createMiddlewareContext(operation: MiddlewareContext<T>['specificOperation']): MiddlewareContext<T> {
    return {
      schema: this.schema,
      idField: this.idField,
      driver: this.driverContext,
      metadata: this.metadata,
      logger: this.logger,
      daoName: this.name,
      daoDriver: this._driver(),
      specificOperation: operation,
      dao: this,
      daoContext: this.daoContext,
    }
  }

  private async executeBeforeMiddlewares<I extends MiddlewareInput<T>>(
    input: I,
    operation: MiddlewareContext<T>['specificOperation'],
  ): Promise<SelectBeforeMiddlewareOutputType<T, I> & { middlewareIndex?: number }> {
    const middlewareContext = this.createMiddlewareContext(operation)
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

  private async executeAfterMiddlewares<I extends MiddlewareOutput<T>>(
    input: I,
    middlewareIndex: number | undefined,
    operation: MiddlewareContext<T>['specificOperation'],
  ): Promise<SelectAfterMiddlewareOutputType<T, I>> {
    const middlewareContext = this.createMiddlewareContext(operation)
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
      const info = params.projection as GraphQLResolveInfo
      return {
        ...params,
        projection: infoToProjection(info, undefined, info.fieldNodes[0], getNamedType(info.returnType), info.schema) as P,
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
  protected abstract _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>>
  protected abstract _updateOne(params: UpdateParams<T>): Promise<void>
  protected abstract _updateAll(params: UpdateParams<T>): Promise<void>
  protected abstract _replaceOne(params: ReplaceParams<T>): Promise<void>
  protected abstract _deleteOne(params: DeleteParams<T>): Promise<void>
  protected abstract _deleteAll(params: DeleteParams<T>): Promise<void>
  protected abstract _driver(): DriverType
}
