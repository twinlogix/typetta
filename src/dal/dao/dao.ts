import { daoRelationsFromSchema, idInfoFromSchema, Project } from '../..'
import { equals } from '../../dal/drivers/in-memory/utils.memory'
import { adaptResolverFilterToTypettaFilter, flattenEmbeddeds, getTraversing, mapObject, reversed, setTraversing } from '../../utils/utils'
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
import { BeforeMiddlewareResult, DAOMiddleware, MiddlewareInput, MiddlewareOutput, SelectAfterMiddlewareOutputType, SelectBeforeMiddlewareOutputType } from './middlewares/middlewares.types'
import { buildMiddleware } from './middlewares/utils/builder'
import { AnyProjection, GenericProjection } from './projections/projections.types'
import { getProjection, getProjectionDepth, infoToProjection, mergeProjections, SelectProjection } from './projections/projections.utils'
import { DAORelation } from './relations/relations.types'
import { Schema } from './schemas/schemas.types'
import DataLoader from 'dataloader'
import { getNamedType, GraphQLResolveInfo } from 'graphql'
import _ from 'lodash'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractDAO<T extends DAOGenerics> implements DAO<T> {
  protected readonly idField: T['idFields']
  protected readonly name: T['entity']
  protected readonly idGeneration: IdGenerationStrategy
  protected readonly entityManager: T['entityManager']
  protected readonly relations: DAORelation[]
  protected readonly middlewares: DAOMiddleware<T>[]
  protected readonly pageSize: number
  protected readonly dataLoaders: Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>
  protected readonly dataLoaderRefs: Map<string, string[]>
  protected readonly metadata?: T['metadata']
  protected readonly driverContext: T['driverContext']
  protected readonly schema: Schema<T['scalars']>
  protected readonly idGenerator?: DAOParams<T>['idGenerator']
  private readonly logger?: LogFunction<T['entity']>
  private readonly awaitLog: boolean
  protected readonly datasource: string | null

  protected constructor({ datasource, idGenerator, entityManager, name, logger, awaitLog, pageSize = 50, middlewares = [], schema, metadata, driverContext }: DAOParams<T>) {
    this.dataLoaders = new Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>()
    this.dataLoaderRefs = new Map<string, string[]>()
    const { idField, idScalar, idGeneration } = idInfoFromSchema(schema)
    this.idField = idField
    this.idGeneration = idGeneration
    this.idGenerator = idGenerator
    this.entityManager = entityManager
    this.pageSize = pageSize
    this.relations = daoRelationsFromSchema(schema)
    this.name = name
    this.logger = logger
    this.awaitLog = awaitLog ?? true
    this.datasource = datasource
    if (this.idGeneration === 'generator' && !this.idGenerator) {
      throw new Error(`ID generator for scalar ${idScalar} is missing. Define one in EntityManager or in DAOParams.`)
    }
    Object.entries(schema)
      .flatMap(([k, v]) => (v.generationStrategy === 'generator' && !v.isId && v.type === 'scalar' ? [[k, v.scalar] as const] : []))
      .forEach(([key, scalar]) => {
        if (!entityManager.adapters[this._driver()][scalar].generate) {
          throw new Error(`Generator for scalar ${scalar} is needed for generate default fields ${key}. Define one in EntityManager or in DAOParams.`)
        }
      })
    const autogeneratedFieldsMiddleware = buildMiddleware<T>({
      name: 'Typetta - Check default field presence',
      beforeInsert: async (params, context) => {
        const fieldsToGenerate = Object.entries(context.schema).flatMap(([k, v]) => (v.generationStrategy === 'generator' && v.type === 'scalar' ? [[k, v] as const] : []))
        const record = fieldsToGenerate.reduce((record, [key, schema]) => {
          const generator = this.entityManager.adapters[context.daoDriver][schema.scalar].generate
          if (record[key] == null && generator) {
            return {
              ...record,
              [key]: generator(),
            }
          }
          return record
        }, params.record)
        const fieldsToHave = Object.entries(schema).flatMap(([k, v]) => (v.generationStrategy === 'middleware' ? [[k, v] as const] : []))
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
        name: 'Typetta - Transaction injector',
        before: async (args) => {
          if (this.entityManager.isTransacting() && this.datasource !== null) {
            const driver = this._driver()
            if (driver === 'mongo') {
              const session = this.entityManager.getMongoSession(this.datasource)
              if (session) {
                return {
                  continue: true,
                  ...args,
                  params: {
                    ...args.params,
                    options: {
                      ...args.params.options,
                      session,
                    },
                  },
                } as BeforeMiddlewareResult<T>
              }
            }
            if (driver === 'knex') {
              const trx = this.entityManager.getKenxTransaction(this.datasource)
              if (trx) {
                return {
                  continue: true,
                  ...args,
                  params: {
                    ...args.params,
                    options: {
                      ...args.params.options,
                      trx,
                    },
                  },
                } as BeforeMiddlewareResult<T>
              }
            }
            //if (driver === 'memory') {
            // TODO
            //}
          }
        },
      },
      {
        name: 'Typetta - Relation projection injector',
        before: async (args) => {
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
        },
      },
      {
        name: 'Typetta - Ignore required null on update',
        before: async (args) => {
          if (args.operation === 'update' && typeof args.params.changes !== 'function') {
            const changes = this.ignoreNullsWhenRequired(args.params.changes)
            if (Object.keys(changes).length === 0) {
              return {
                continue: false,
                operation: 'update',
                params: {
                  ...args.params,
                  changes: changes,
                },
              }
            }
            return {
              continue: true,
              operation: 'update',
              params: {
                ...args.params,
                changes: changes,
              },
            }
          }
        },
      },
      {
        name: 'Typetta - Max depth',
        before: async (args) => {
          if (args.operation === 'find') {
            if (args.params.maxDepth != null) {
              const depth = getProjectionDepth<T>((args.params.projection ?? {}) as GenericProjection, this.schema)
              if (depth > args.params.maxDepth) {
                throw new Error(`Max depth is ${args.params.maxDepth} but the specified projection reach a depth of ${depth}`)
              }
            }
          }
        },
      },
      {
        name: 'Typetta - Default field from generator',
        before: async (args, context) => {
          if (args.operation === 'insert' && this.idGeneration === 'generator' && this.idGenerator && !Object.keys(args.params.record).includes(context.idField)) {
            return {
              continue: true,
              operation: args.operation,
              params: { ...args.params, record: { ...args.params.record, ...this.idGenerator() } },
            }
          }
        },
      },
      ...middlewares,
      ...(Object.values(schema).some((v) => v.generationStrategy) ? [autogeneratedFieldsMiddleware] : []),
    ]
    this.metadata = metadata
    this.driverContext = driverContext
    this.schema = schema
  }

  async findAll<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindParams<T, P> = {}): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]> {
    return this.logOperation('findAll', params, async () => {
      const [isRootOperation, operationId] = params.operationId ? [false, params.operationId] : [true, uuidv4()]
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection({ ...params, operationId }) }, 'findAll')
      const records = beforeResults.continue ? await this._findAll(beforeResults.params) : beforeResults.records
      const resolvedRecords = await this.internalResolveRelations(records, beforeResults.params.projection, beforeResults.params.relations, beforeResults.params.operationId, params.relationParents)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecords }, beforeResults.middlewareIndex, 'findAll')
      if (isRootOperation) {
        this.clearDataLoader(operationId)
      }
      return afterResults.records as Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]
    })
  }

  async findOne<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: FindOneParams<T, P> = {}): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']> | null> {
    const results = await this.findAll({ ...params, limit: 1 })
    return results.length > 0 ? results[0] : null
  }

  async findPage<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(
    params: FindParams<T, P> = {},
  ): Promise<{ totalCount: number; records: Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[] }> {
    return this.logOperation('findPage', params, async () => {
      const [isRootOperation, operationId] = params.operationId ? [false, params.operationId] : [true, uuidv4()]
      const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params: this.infoToProjection({ ...params, operationId }) }, 'findPage')
      const { totalCount, records } = beforeResults.continue ? await this._findPage(beforeResults.params) : { records: beforeResults.records, totalCount: beforeResults.totalCount ?? 0 }
      const resolvedRecords = await this.internalResolveRelations(records, beforeResults.params.projection, beforeResults.params.relations, beforeResults.params.operationId, params.relationParents)
      const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecords, totalCount }, beforeResults.middlewareIndex, 'findPage')
      if (isRootOperation) {
        this.clearDataLoader(operationId)
      }
      return {
        totalCount: afterResults.totalCount ?? 0,
        records: afterResults.records as Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[],
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
  ): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]> {
    const hash =
      (params.operationId ?? '') +
      filterKey +
      '-' +
      objectHash({ sort: params.sorts, projection: params.projection, metadata: params.metadata, relations: params.relations, maxDepth: params.maxDepth } || null, {
        respectType: false,
      })
    const hasKeyF = (record: Project<T['entity'], T['ast'], T['scalars'], P, T['types']>, key: T['filter'][K]) => getTraversing(record, filterKey as string).some((v) => equals(v, key))
    const buildFilterF = buildFilter ?? ((key, values) => ({ [key]: { in: values } }))
    if (!this.dataLoaders.has(hash)) {
      const newDataLoader = new DataLoader<T['filter'][K], PartialDeep<T['model']>[]>(
        async (keys) => {
          const proj = _.cloneDeep(params.projection)
          setTraversing(proj, filterKey as string, true)
          const records = await this.findAll({ ...params, projection: proj, filter: buildFilterF(filterKey, keys) })
          return keys.map((key) => records.filter((r) => hasKeyF(r, key))) as PartialDeep<T['model']>[]
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
    }) as Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]
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
          this.entityManager.dao(relation.refOther.dao).clearDataLoader(operationId)
          this.entityManager.dao(relation.relationDao).clearDataLoader(operationId)
        } else {
          this.entityManager.dao(relation.dao).clearDataLoader(operationId)
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

  public async resolveRelations<I extends T['plainModel'] | T['plainModel'][], P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params: {
    input: I
    projection: P
    relations?: T['relations']
  }): Promise<I extends Array<unknown> ? Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[] : Project<T['entity'], T['ast'], T['scalars'], P, T['types']>> {
    const operationId = uuidv4()
    const newParams = this.infoToProjection({ projection: params.projection })
    const res = await this.internalResolveRelations((Array.isArray(params.input) ? params.input : [params.input]) as PartialDeep<T['model']>[], newParams.projection, params.relations, operationId)
    this.clearDataLoader(operationId)
    return (Array.isArray(params.input) ? res : res[0]) as I extends Array<unknown>
      ? Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]
      : Project<T['entity'], T['ast'], T['scalars'], P, T['types']>
  }

  private async internalResolveRelations(
    records: PartialDeep<T['model']>[],
    projections?: AnyProjection<T['projection']>,
    relations?: T['relations'],
    operationId?: string,
    relationParents?: FindParams<T>['relationParents'],
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
          relationParents: [...(relationParents ?? []), { field: relation.field, schema: this.schema }],
        }
        if (relation.reference === 'relation') {
          const rels = await this.entityManager.dao(relation.relationDao).loadAll(
            {
              projection: { [relation.refThis.refFrom]: true, [relation.refOther.refFrom]: true },
            },
            relation.refThis.refFrom,
            records.flatMap((r) => getTraversing(r, relation.refThis.refTo)),
          )
          for (const record of records) {
            const filterValues = rels
              .filter((r: unknown) => getTraversing(r, relation.refThis.refFrom)[0] === getTraversing(record, relation.refThis.refTo)[0])
              .flatMap((r: unknown) => getTraversing(r, relation.refOther.refFrom))
            if (filterValues.length > 0) {
              const results = await this.entityManager.dao(relation.refOther.dao).findAllWithBatching(params, relation.refOther.refTo, filterValues)
              this.setResult(record, relation, results)
            } else {
              this.setResult(record, relation, [])
            }
          }
        } else if (relation.reference === 'inner') {
          for (const record of records) {
            const keys = getTraversing(record, relation.refFrom)
            const results = keys.length > 0 ? await this.entityManager.dao(relation.dao).findAllWithBatching(params, relation.refTo, keys) : []
            this.setResult(record, relation, results)
          }
        } else if (relation.reference === 'foreign') {
          for (const record of records) {
            const results = await this.entityManager.dao(relation.dao).findAllWithBatching(params, relation.refFrom, getTraversing(record, relation.refTo))
            this.setResult(record, relation, results)
          }
        }
      }
    }
    return records
  }

  private setResult(record: PartialDeep<T['model']>, relation: DAORelation, results: unknown[]) {
    if (relation.type === '1-n') {
      setTraversing(record, relation.field, results)
    } else {
      if (relation.reference === 'inner') {
        const map = _.mapKeys(results, (r) => getTraversing(r, relation.refTo)[0])
        try {
          this.setInnerRefResults(map, { refFrom: relation.refFrom, field: relation.field, schema: this.schema, required: relation.required }, record)
        } catch (e: unknown) {
          throw new Error(`dao: ${this.name}, a relation field is required but the relation reference is broken: ${JSON.stringify(relation)}. Details: ${(e as Error).message}`)
        }
      } else {
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
  }

  private setInnerRefResults(
    results: _.Dictionary<unknown>,
    reference: { refFrom: string; field: string; ref?: Record<string, unknown>; schema: Schema<T['scalars']>; required: boolean },
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
        reference.ref = getTraversing(record, reference.refFrom)[0]
      }
      if (reference.ref == null && reference.required) {
        throw new Error(`Broken inner ref: from: ${reference.refFrom}, field: ${reference.field}`)
      }
      record[subField] = reference.ref ? results[reference.ref.toString()] ?? null : null
      if (record[subField] === null && reference.required) {
        throw new Error(`Broken inner ref: from: ${reference.refFrom}, field: ${reference.field}`)
      }
      return
    }
    const subSchema = reference.schema[subField]
    if (!(subSchema.type === 'embedded')) {
      throw new Error('Unreachable')
    }
    if (record[subField] == null) {
      //record[subField] = subSchema.array ? [] : {}
      return
    }
    if (Array.isArray(record[subField])) {
      for (const r of record[subField]) {
        this.setInnerRefResults(results, { ...reference, refFrom: tailRefFrom.join('.'), field: tailField.join('.'), schema: subSchema.schema() }, r)
      }
    } else {
      this.setInnerRefResults(results, { ...reference, refFrom: tailRefFrom.join('.'), field: tailField.join('.'), schema: subSchema.schema() }, record[subField])
    }
  }

  private async findAllWithBatching<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: FindParams<T, P>,
    filterKey: K,
    filterValues: T['filter'][K] | T['filter'][K][],
  ): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]> {
    const values = Array.isArray(filterValues) ? filterValues : [filterValues]
    if (params.skip != null || params.limit != null || params.filter != null || params.sorts != null) {
      return this.findAll({ ...params, filter: params.filter ? { $and: [{ [filterKey]: { in: values } }, params.filter] } : { [filterKey]: { in: values } } })
    }
    return await this.loadAll(params, filterKey, values)
  }

  async insertOne(params: InsertParams<T>): Promise<T['plainModel']> {
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
      entityManager: this.entityManager,
    }
  }

  private async executeBeforeMiddlewares<I extends MiddlewareInput<T>>(
    input: I,
    operation: MiddlewareContext<T>['specificOperation'],
  ): Promise<SelectBeforeMiddlewareOutputType<T, I> & { middlewareIndex?: number }> {
    const middlewareContext = this.createMiddlewareContext(operation)
    for (const [before, index, name] of this.middlewares.flatMap((m, i) => (m.before ? [[m.before, i, m.name] as const] : []))) {
      const start = new Date()
      const result = await before(input, middlewareContext)
      const end = new Date()
      await this.log(() => this.createLog({ date: start, level: 'debug', duration: end.getTime() - start.getTime(), operation: 'middlewareBefore', query: name ?? 'Unnamend middleware' }))

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
    for (const [after, name] of reversed((middlewareIndex ? this.middlewares.slice(0, middlewareIndex + 1) : this.middlewares).flatMap((m) => (m.after ? [[m.after, m.name] as const] : [])))) {
      const start = new Date()
      const result = await after(input, middlewareContext)
      const end = new Date()
      await this.log(() => this.createLog({ date: start, level: 'debug', duration: end.getTime() - start.getTime(), operation: 'middlewareAfter', query: name ?? 'Unnamend middleware' }))
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
    operation: LogArgs<T['entity']>['operation'],
    params: FindParams<T> | FindOneParams<T> | InsertParams<T> | UpdateParams<T> | ReplaceParams<T> | DeleteParams<T>,
    body: () => Promise<R>,
  ): Promise<R> {
    if (this.logger) {
      const start = new Date()
      const result = await body()
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      const parsedParams = this.infoToProjection(params)
      const query = JSON.stringify({ ...parsedParams, options: undefined })
      await this.log(() => this.createLog({ date: start, level: 'debug', duration, operation, query }))
      return result
    }
    return body()
  }

  protected createLog(log: Omit<LogArgs<T['entity']>, 'raw' | 'dao'>): LogArgs<T['entity']> {
    return {
      ...log,
      raw: `[${log.date.toISOString()}] (dao: ${this.name}, op: ${log.operation}${log.driver ? `, driver: ${log.driver}` : ''}):${log.query ? ` ${log.query}` : ''} [${log.duration} ms${
        log.error ? `, ${log.error}` : ''
      }]`,
      dao: this.name,
    }
  }

  protected async log(args: () => LogArgs<T['entity']>): Promise<void> {
    if (this.logger) {
      if (this.awaitLog) {
        try {
          await this.logger(args())
        } catch {
          return
        }
      } else {
        this.logger(args())
          .then(() => {
            return
          })
          .catch(() => {
            return
          })
      }
    }
  }

  private ignoreNullsWhenRequired(changes: T['update']): T['update'] {
    function isNullAndRequired(schema: Schema<T['scalars']>, key: string, value: string): boolean {
      if (value !== null) {
        return false
      }
      if (key in schema && schema[key].required && value === null) {
        return true
      }
      const [hk, ...tk] = key.split('.')
      if (hk in schema) {
        const schemaField = schema[hk]
        if (schemaField.type === 'embedded') {
          return isNullAndRequired(schemaField.schema(), tk.join('.'), value)
        }
      }
      return false
    }
    const newChanges = mapObject(changes, ([k, v]) => (isNullAndRequired(this.schema, k, v) ? [] : [[k, v]]))
    return newChanges
  }

  // -----------------------------------------------------------------------
  // ------------------------------ ABSTRACTS ------------------------------
  // -----------------------------------------------------------------------
  protected abstract _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]>
  protected abstract _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }>
  protected abstract _exists(params: FilterParams<T>): Promise<boolean>
  protected abstract _count(params: FilterParams<T>): Promise<number>
  protected abstract _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>>
  protected abstract _insertOne(params: InsertParams<T>): Promise<T['plainModel']>
  protected abstract _updateOne(params: UpdateParams<T>): Promise<void>
  protected abstract _updateAll(params: UpdateParams<T>): Promise<void>
  protected abstract _replaceOne(params: ReplaceParams<T>): Promise<void>
  protected abstract _deleteOne(params: DeleteParams<T>): Promise<void>
  protected abstract _deleteAll(params: DeleteParams<T>): Promise<void>
  protected abstract _driver(): DriverType

  // -----------------------------------------------------------------------
  // ------------------------------ UTILS ----------------------------------
  // -----------------------------------------------------------------------
  public projection<P extends T['projection']>(p: P): P {
    return p
  }
  public mergeProjection<P1 extends T['projection'], P2 extends T['projection']>(p1: P1, p2: P2): SelectProjection<T['projection'], P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<T['projection'], P1, P2>
  }
  get info(): { name: T['entity']; idField: T['idFields']; schema: Schema<T['scalars']> } {
    return { name: this.name, idField: this.idField, schema: this.schema }
  }
  private mapResolverFindParams(params: FindParams<T>): FindParams<T> {
    const relations = Object.fromEntries(
      this.relations.flatMap((r) => {
        if (params.relations && params.relations[r.field]) {
          const relationDao = this.entityManager.dao(r.reference === 'relation' ? r.refOther.dao : r.dao)
          return [[r.field, relationDao.mapResolverFindParams(params.relations[r.field])]]
        }
        return []
      }),
    )
    return {
      ...params,
      filter: params.filter ? adaptResolverFilterToTypettaFilter(params.filter, this.schema) : params.filter,
      sorts: params.sorts ? (params.sorts.map((s: Record<string, unknown>) => flattenEmbeddeds(s, this.schema)) as T['pureSort']) : undefined,
      relations,
    }
  }
  get resolvers(): {
    read: (params: Record<string, unknown>, info: GraphQLResolveInfo) => Promise<PartialDeep<T['model']>[]>
    create: (params: InsertParams<T>, info: GraphQLResolveInfo) => Promise<PartialDeep<T['model']>>
    update: (params: Record<string, Record<string, unknown>>) => Promise<boolean>
    delete: (params: Record<string, Record<string, unknown>>) => Promise<boolean>
  } {
    return {
      read: async (params, info) => {
        return (await this.findAll({ ...this.mapResolverFindParams(params), projection: info })) as PartialDeep<T['model']>[]
      },
      create: async (params, info) => {
        const inserted = await this.insertOne(params)
        return this.resolveRelations({ input: inserted, projection: info }) as PartialDeep<T['model']>
      },
      update: async (params) => {
        await this.updateAll({
          filter: adaptResolverFilterToTypettaFilter(params.filter, this.schema),
          changes: flattenEmbeddeds(params.changes, this.info.schema),
        })
        return true
      },
      delete: async (params) => {
        await this.deleteAll({
          filter: adaptResolverFilterToTypettaFilter(params.filter, this.schema),
        })
        return true
      },
    }
  }
}
