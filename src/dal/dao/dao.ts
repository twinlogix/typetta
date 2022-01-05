import { deepCopy, getTraversing, OneKey, reversed, setTraversing } from '../../utils/utils'
import { AbstractDAOContext } from '../daoContext/daoContext'
import { DAOWrapperAPIv1 } from '../legacy/daoWrapperAPIv1'
import {
  MiddlewareContext,
  DAO,
  DAOParams,
  DAOResolver,
  DeleteParams,
  FilterParams,
  FindOneParams,
  FindParams,
  InsertParams,
  ReferenceChecksResponse,
  ReplaceParams,
  UpdateParams,
  DAOGenerics,
} from './dao.types'
import { DAOMiddleware, MiddlewareInput, MiddlewareOutput, SelectAfterMiddlewareOutputType, SelectBeforeMiddlewareOutputType } from './middlewares/middlewares.types'
import { AnyProjection, GenericProjection, ModelProjection } from './projections/projections.types'
import { getProjection } from './projections/projections.utils'
import { addRelationRefToProjection } from './relations/relations'
import { DAORelation, DAORelationReference, DAORelationType } from './relations/relations.types'
import { Schema } from './schemas/schemas.types'
import DataLoader from 'dataloader'
import _, { isArray } from 'lodash'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'

export abstract class AbstractDAO<T extends DAOGenerics> implements DAO<T> {
  protected idField: T['idKey']
  protected idGeneration: T['idGeneration']
  protected daoContext: AbstractDAOContext<T['scalars'], T['metadata']>
  protected relations: DAORelation[]
  protected middlewares: DAOMiddleware<T>[]
  protected pageSize: number
  /*protected resolvers: { [key: string]: DAOResolver | undefined }*/
  protected dataLoaders: Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>
  protected metadata?: T['metadata']
  protected driverContext: T['driverContext']
  protected schema: Schema<T['scalars']>
  protected idGenerator?: () => T['scalars'][T['idScalar']]
  public apiV1: DAOWrapperAPIv1<T>

  protected constructor({ idField, idScalar, idGeneration, idGenerator, daoContext, pageSize = 50, relations = [], middlewares = [], schema, metadata, driverContext: driverOptions }: DAOParams<T>) {
    this.dataLoaders = new Map<string, DataLoader<T['filter'][keyof T['filter']], PartialDeep<T['model']>[]>>()
    this.idField = idField
    this.idGenerator = idGenerator
    this.daoContext = daoContext
    this.pageSize = pageSize
    /*this.resolvers = {}*/
    this.relations = relations
    /*this.relations.forEach((relation) => this.addResolver(relation))*/
    this.idGeneration = idGeneration
    const generator = this.idGenerator || this.daoContext.idGenerators[idScalar]
    if (this.idGeneration === 'generator' && !generator) {
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
          if (args.operation === 'insert' && this.idGeneration === 'generator' && generator && !Object.keys(args.params.record).includes(this.idField)) {
            return {
              continue: true,
              operation: args.operation,
              params: { ...args.params, record: { ...args.params.record, [context.idField]: generator() } },
            }
          }
        },
      },
      ...middlewares,
    ]
    this.metadata = metadata
    this.driverContext = driverOptions
    this.schema = schema
    this.apiV1 = new DAOWrapperAPIv1<T>(this, idField)
  }

  async findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
    const records = beforeResults.continue ? await this._find(beforeResults.params) : beforeResults.records
    const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations)
    const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors }, beforeResults.middlewareIndex)
    return afterResults.records as ModelProjection<T['model'], T['projection'], P>[]
  }

  async findOne<P extends AnyProjection<T['projection']>>(params: FindOneParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P> | null> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
    const record = beforeResults.continue ? await this._findOne(beforeResults.params) : beforeResults.records.length > 0 ? beforeResults.records[0] : null
    const resolvedRecors = record ? await this.resolveRelations([record], beforeResults.params.projection, beforeResults.params.relations) : []
    const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors }, beforeResults.middlewareIndex)
    return afterResults.records.length > 0 ? afterResults.records[0] : null
  }

  async findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P> = {}): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
    const { totalCount, records } = beforeResults.continue ? await this._findPage(beforeResults.params) : { records: beforeResults.records, totalCount: beforeResults.totalCount ?? 0 }
    const resolvedRecors = await this.resolveRelations(records, beforeResults.params.projection, beforeResults.params.relations)
    const afterResults = await this.executeAfterMiddlewares({ operation: 'find', params: beforeResults.params, records: resolvedRecors, totalCount }, beforeResults.middlewareIndex)
    return {
      totalCount: afterResults.totalCount ?? 0,
      records: afterResults.records as ModelProjection<T['model'], T['projection'], P>[],
    }
  }

  async exists(params: FilterParams<T>): Promise<boolean> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
    return this._exists(beforeResults.params)
  }

  async count(params: FilterParams<T> = {}): Promise<number> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'find', params })
    return this._count(beforeResults.params)
  }

  async checkReferences(records: PartialDeep<T['model']> | PartialDeep<T['model']>[]): Promise<ReferenceChecksResponse<T['model']>> {
    /*const errors = []
    if (records) {
      const inputRecords = records instanceof Array ? records : [records]
      for (const relation of this.relations) {
        if (relation.reference === DAORelationReference.INNER) {
          const relationProjection = {}
          setTraversing(relationProjection, relation.refTo, true)
          const resolver: DAOResolver = this.resolvers[relation.field]!

          const relationFieldPathSplitted = relation.field.split('.')
          relationFieldPathSplitted.pop()
          const parentPath = relationFieldPathSplitted.join('.')
          const parents = getTraversing(inputRecords, parentPath)
          const associatedRecords = await resolver.load(parents, relationProjection, undefined)

          for (const inputRecord of inputRecords) {
            const notFoundRefsFrom = getTraversing(inputRecord, relation.refFrom).filter((refFrom) => {
              return !associatedRecords.find(
                (associatedRecord) => associatedRecord && getTraversing(associatedRecord, relation.refTo).length > 0 && refFrom === getTraversing(associatedRecord, relation.refTo)[0],
              )
            })
            if (notFoundRefsFrom.length > 0) {
              errors.push({ relation, record: inputRecord, failedReferences: notFoundRefsFrom })
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      return errors
    } else {
      return true
    }*/
    return true
  }

  public async loadAll<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
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
          const dbProjections = deepCopy(params.projection) as P
          setTraversing(dbProjections, filterKey as string, true)
          const records = await this.findAll({ ...params, projection: dbProjections, filter: buildFilterF(filterKey, keys) })
          const orderedResults = []
          for (const key of keys) {
            orderedResults.push(records.filter((loadedResult) => hasKeyF(loadedResult, key)) || null)
          }
          return orderedResults
        },
        {
          maxBatchSize: this.pageSize,
        },
      )
      this.dataLoaders.set(hash, newDataLoader)
    }
    const dataLoader = this.dataLoaders.get(hash)!
    const loadedResults = await dataLoader.loadMany(filterValues)
    const results = []
    for (const loadedResult of loadedResults) {
      if (loadedResult instanceof Error) {
        throw loadedResult
      } else if (loadedResult !== null) {
        results.push(...loadedResult)
      }
    }
    return results as ModelProjection<T['model'], T['projection'], P>[]
  }

  // -----------------------------------------------------------------------
  // ---------------------------- ASSOCIATIONS -----------------------------
  // -----------------------------------------------------------------------

  private addNeededProjectionForRelations<P extends AnyProjection<T['projection']>>(projection?: P): P | undefined {
    if (projection === true || !projection) {
      return projection
    }
    const dbProjections = deepCopy(projection)
    this.relations.forEach((relation) => {
      if (relation.reference === DAORelationReference.INNER) {
        addRelationRefToProjection(relation.field, relation.refFrom, dbProjections)
      }
    })
    this.relations.forEach((relation) => {
      if (relation.reference === DAORelationReference.FOREIGN) {
        setTraversing(dbProjections, relation.refTo, true)
      }
    })
    this.relations.forEach((relation) => {
      if (relation.reference === DAORelationReference.RELATION) {
        setTraversing(dbProjections, relation.refThis.refTo, true)
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
      const relationFilter = relationsFilter.length > 0 ? relationsFilter[0] : undefined
      if (relationProjection) {
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
              {
                filter: relationFilter?.filter,
                projection: relationProjection,
                limit: relationFilter?.limit,
                start: relationFilter?.start,
                sorts: relationFilter?.sorts,
                relations: relationFilter?.relations,
              },
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
            const results = await this.daoContext.dao(relation.dao).loadAllOrFindAll(
              {
                filter: relationFilter?.filter,
                projection: relationProjection,
                limit: relationFilter?.limit,
                start: relationFilter?.start,
                sorts: relationFilter?.sorts,
                relations: relationFilter?.relations,
              },
              relation.refTo,
              getTraversing(record, relation.refFrom),
            )
            if (relation.type === DAORelationType.ONE_TO_MANY) {
              setTraversing(record, relation.field, results)
            } else {
              setTraversing(record, relation.field, results.length > 0 ? results[0] : null)
            }
          }
        } else if (relation.reference === DAORelationReference.FOREIGN) {
          for (const record of records) {
            const results = await this.daoContext.dao(relation.dao).loadAllOrFindAll(
              {
                filter: relationFilter?.filter,
                projection: relationProjection,
                limit: relationFilter?.limit,
                start: relationFilter?.start,
                sorts: relationFilter?.sorts,
                relations: relationFilter?.relations,
              },
              relation.refFrom,
              getTraversing(record, relation.refTo),
            )
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

  public async loadAllOrFindAll<P extends AnyProjection<T['projection']>, K extends keyof T['filter']>(
    params: FindParams<T, P>,
    filterKey: K,
    filterValues: T['filter'][K][],
  ): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    if (params.start != null || params.limit != null || params.filter != null) {
      return this.findAll({ ...params, filter: { $and: [{ [filterKey]: { $in: filterValues } }, params.filter ?? {}] } })
    }
    return await this.loadAll(params, filterKey, filterValues)
  }

  async insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'insert', params })
    const record = beforeResults.continue ? await this._insertOne(beforeResults.params) : beforeResults.record
    const afterResults = await this.executeAfterMiddlewares({ operation: 'insert', params: beforeResults.params, record }, beforeResults.middlewareIndex)
    return afterResults.record
  }

  async updateOne(params: UpdateParams<T>): Promise<void> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params })
    if (beforeResults.continue) {
      await this._updateOne(beforeResults.params)
    }
    await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex)
  }

  async updateAll(params: UpdateParams<T>): Promise<void> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'update', params })
    if (beforeResults.continue) {
      await this._updateMany(beforeResults.params)
    }
    await this.executeAfterMiddlewares({ operation: 'update', params: beforeResults.params }, beforeResults.middlewareIndex)
  }

  async replaceOne(params: ReplaceParams<T>): Promise<void> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'replace', params })
    if (beforeResults.continue) {
      await this._replaceOne(beforeResults.params)
    }
    await this.executeAfterMiddlewares({ operation: 'replace', params: beforeResults.params }, beforeResults.middlewareIndex)
  }

  async deleteOne(params: DeleteParams<T>): Promise<void> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params })
    if (beforeResults.continue) {
      await this._deleteOne(beforeResults.params)
    }
    await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex)
  }

  async deleteAll(params: DeleteParams<T>): Promise<void> {
    const beforeResults = await this.executeBeforeMiddlewares({ operation: 'delete', params })
    if (beforeResults.continue) {
      await this._deleteMany(beforeResults.params)
    }
    await this.executeAfterMiddlewares({ operation: 'delete', params: beforeResults.params }, beforeResults.middlewareIndex)
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

  // -----------------------------------------------------------------------
  // ------------------------------ ABSTRACTS ------------------------------
  // -----------------------------------------------------------------------
  protected abstract _find<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]>
  protected abstract _findOne<P extends AnyProjection<T['projection']>>(params: FindOneParams<T, P>): Promise<PartialDeep<T['model']> | null>
  protected abstract _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }>
  protected abstract _exists(params: FilterParams<T>): Promise<boolean>
  protected abstract _count(params: FilterParams<T>): Promise<number>
  protected abstract _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>>
  protected abstract _updateOne(params: UpdateParams<T>): Promise<void>
  protected abstract _updateMany(params: UpdateParams<T>): Promise<void>
  protected abstract _replaceOne(params: ReplaceParams<T>): Promise<void>
  protected abstract _deleteOne(params: DeleteParams<T>): Promise<void>
  protected abstract _deleteMany(params: DeleteParams<T>): Promise<void>
}
