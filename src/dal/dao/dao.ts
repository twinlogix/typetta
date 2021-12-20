import { deepCopy, deepMerge, getTraversing, reversed, setTraversing } from '../../utils/utils'
import { AbstractDAOContext } from '../daoContext/daoContext'
import { DAOWrapperAPIv1 } from '../legacy/daoWrapperAPIv1'
import { addAssociationRefToProjection } from './associations/associations'
import { DAOAssociation, DAOAssociationReference, DAOAssociationType } from './associations/associations.types'
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
import { generateId } from './middlewares/generateId.middleware'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection, GenericProjection, ModelProjection } from './projections/projections.types'
import { getProjection } from './projections/projections.utils'
import { Schema } from './schemas/schemas.types'
import DataLoader from 'dataloader'
import _ from 'lodash'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'

export abstract class AbstractDAO<T extends DAOGenerics> implements DAO<T> {
  protected idField: T['idKey']
  protected idGeneration: T['idGeneration']
  protected daoContext: AbstractDAOContext<T['scalars'], T['options']>
  protected associations: DAOAssociation[]
  protected middlewares: DAOMiddleware<T>[]
  protected pageSize: number
  protected resolvers: { [key: string]: DAOResolver | undefined }
  protected dataLoaders: Map<string, DataLoader<T['model'][T['idKey']], T['model'][] | null>>
  protected options?: T['options']
  protected driverContext: T['driverContext']
  protected schema: Schema<T['scalars']>
  protected idGenerator?: () => T['scalars'][T['idScalar']]
  public apiV1: DAOWrapperAPIv1<T>

  protected constructor({ idField, idScalar, idGeneration, idGenerator, daoContext, pageSize = 50, associations = [], middlewares = [], schema, options, driverContext: driverOptions }: DAOParams<T>) {
    this.dataLoaders = new Map<string, DataLoader<T['model'][T['idKey']], T['model'][]>>()
    this.idField = idField
    this.idGenerator = idGenerator
    this.daoContext = daoContext
    this.pageSize = pageSize
    this.resolvers = {}
    this.associations = associations
    this.associations.forEach((association) => this.addResolver(association))
    this.idGeneration = idGeneration
    if (this.idGeneration === 'generator') {
      const generator = this.idGenerator || this.daoContext.idGenerators[idScalar]
      if (!generator) {
        throw new Error(`ID generator for scalar ${idScalar} is missing. Define one in DAOContext or in DAOParams.`)
      }
      this.middlewares = [generateId({ generator })]
    } else {
      this.middlewares = []
    }
    this.middlewares = [
      {
        beforeFind: async (params) => ({ ...params, options: params.options && this.options ? deepMerge(this.options, params.options) : params.options ? params.options : this.options }),
        beforeUpdate: async (params) => ({ ...params, options: params.options && this.options ? deepMerge(this.options, params.options) : params.options ? params.options : this.options }),
        beforeInsert: async (params) => ({ ...params, options: params.options && this.options ? deepMerge(this.options, params.options) : params.options ? params.options : this.options }),
        beforeReplace: async (params) => ({ ...params, options: params.options && this.options ? deepMerge(this.options, params.options) : params.options ? params.options : this.options }),
        beforeDelete: async (params) => ({ ...params, options: params.options && this.options ? deepMerge(this.options, params.options) : params.options ? params.options : this.options }),
      },
      {
        beforeFind: async (params) => ({ ...params, projection: this.elabAssociationProjection(params.projection) }),
      },
      ...(this.idGeneration === 'generator' ? this.middlewares : []),
      ...middlewares,
    ]
    this.options = options
    this.driverContext = driverOptions
    this.schema = schema
    this.apiV1 = new DAOWrapperAPIv1<T>(this, idField)
  }

  protected async beforeFind(
    params: FindParams<T, AnyProjection<T['projection']>>,
  ): Promise<FindParams<T, AnyProjection<T['projection']>>> {
    const contextOptions = this.createContextOptions()
    for (const middleware of this.middlewares) {
      if (middleware.beforeFind) {
        params = await middleware.beforeFind(params, contextOptions)
      }
    }
    return params
  }

  protected async afterFind(params: FindParams<T, AnyProjection<T['projection']>>, records: PartialDeep<T['model']>[]): Promise<PartialDeep<T['model']>[]> {
    const contextOptions = this.createContextOptions()
    for (const middleware of reversed(this.middlewares)) {
      if (middleware.afterFind) {
        records = await middleware.afterFind(params, records, contextOptions)
      }
    }
    return records
  }

  async findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    const newParams = await this.beforeFind(params)
    const records = await this._find(newParams)
    const resolvedRecors = await this.resolveAssociations(records, newParams.projection)
    return (await this.afterFind(newParams, resolvedRecors)) as ModelProjection<T['model'], T['projection'], P>[]
  }

  async findOne<P extends AnyProjection<T['projection']>>(params: FindOneParams<T, P> = {}): Promise<ModelProjection<T['model'], T['projection'], P> | null> {
    const newParams = await this.beforeFind(params)
    const record = await this._findOne(newParams)
    if (record) {
      const resolvedRecors = await this.resolveAssociations([record], newParams.projection)
      return ((await this.afterFind(newParams, resolvedRecors)) as ModelProjection<T['model'], T['projection'], P>[])[0]
    }
    return null
  }

  async findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P> = {}): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }> {
    const newParams = await this.beforeFind(params)
    const { totalCount, records } = await this._findPage(newParams)
    const resolvedRecors = await this.resolveAssociations(records, newParams.projection)
    return {
      totalCount,
      records: (await this.afterFind(newParams, resolvedRecors)) as ModelProjection<T['model'], T['projection'], P>[],
    }
  }

  async exists(params: FilterParams<T>): Promise<boolean> {
    const newParams = await this.beforeFind(params)
    return this._exists(newParams)
  }

  async count(params: FilterParams<T> = {}): Promise<number> {
    const newParams = await this.beforeFind(params)
    return this._count(newParams)
  }

  async checkReferences(records: PartialDeep<T['model']> | PartialDeep<T['model']>[]): Promise<ReferenceChecksResponse<T['model']>> {
    const errors = []
    if (records) {
      const inputRecords = records instanceof Array ? records : [records]
      for (const association of this.associations) {
        if (association.reference === DAOAssociationReference.INNER) {
          const associationProjection = {}
          setTraversing(associationProjection, association.refTo, true)
          const resolver: DAOResolver = this.resolvers[association.field]!

          const associationFieldPathSplitted = association.field.split('.')
          associationFieldPathSplitted.pop()
          const parentPath = associationFieldPathSplitted.join('.')
          const parents = getTraversing(inputRecords, parentPath)
          const associatedRecords = await resolver.load(parents, associationProjection)

          for (const inputRecord of inputRecords) {
            const notFoundRefsFrom = getTraversing(inputRecord, association.refFrom).filter((refFrom) => {
              return !associatedRecords.find(
                (associatedRecord) => associatedRecord && getTraversing(associatedRecord, association.refTo).length > 0 && refFrom === getTraversing(associatedRecord, association.refTo)[0],
              )
            })
            if (notFoundRefsFrom.length > 0) {
              errors.push({ association, record: inputRecord, failedReferences: notFoundRefsFrom })
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      return errors
    } else {
      return true
    }
  }

  // -----------------------------------------------------------------------
  // ---------------------------- ASSOCIATIONS -----------------------------
  // -----------------------------------------------------------------------
  private async load(
    keys: T['idKey'][],
    buildFilter: (keys: T['idKey'][]) => T['filter'],
    hasKey: (record: T['model'], key: T['idKey']) => boolean,
    projection: T['projection'],
    loaderIdetifier: string = '',
  ): Promise<(T['model'] | null | Error)[]> {
    const dataLoader = this.getDataLoader(buildFilter, hasKey, projection, loaderIdetifier)
    const loadedResults = await dataLoader.loadMany(keys)
    const results = []
    for (const loadedResult of loadedResults) {
      if (loadedResult instanceof Error) {
        throw loadedResult
      } else if (loadedResult !== null) {
        results.push(...loadedResult)
      }
    }
    return results
  }

  private getDataLoader(
    buildFilter: (keys: any[]) => T['filter'],
    hasKey: (record: T['model'], key: any) => boolean,
    projection: T['projection'],
    loaderIdetifier: string,
  ): DataLoader<any, T['model'][] | null> {
    const hash = loaderIdetifier + '-' + objectHash(projection || null, { respectType: false, unorderedArrays: true })
    const dataLoader = this.dataLoaders.get(hash)
    if (dataLoader) {
      return dataLoader
    } else {
      const newDataLoader = new DataLoader<any, T['model'][] | null>(
        async (keys) => {
          const filter = buildFilter(keys as T['model'][T['idKey']][])
          const loadedResults: any[] = await this.findAll({ filter, projection })
          const orderedResults = []
          for (const key of keys) {
            orderedResults.push(loadedResults.filter((loadedResult) => hasKey(loadedResult, key)) || null)
          }
          return orderedResults
        },
        {
          maxBatchSize: this.pageSize,
        },
      )
      this.dataLoaders.set(hash, newDataLoader)
      return newDataLoader
    }
  }

  private elabAssociationProjection<P extends AnyProjection<T['projection']>>(projection?: P): P | undefined {
    if (projection === true || !projection) {
      return projection
    }
    const dbProjections = deepCopy(projection) // IMPROVE: make addAssociationRefToProjection functional and stop using side effects
    this.associations
      .filter((association) => association.reference === DAOAssociationReference.INNER)
      .forEach((association) => addAssociationRefToProjection(association.field, association.refFrom, dbProjections))
    this.associations.filter((association) => association.reference === DAOAssociationReference.FOREIGN).forEach((association) => setTraversing(dbProjections, association.refTo, true))
    return dbProjections
  }

  private async resolveAssociations(dbObjects: any[], projections?: AnyProjection<T['projection']>): Promise<PartialDeep<T['model']>[]> {
    for (const association of this.associations) {
      if (projections) {
        const associationProjection = getProjection(projections as GenericProjection, association.field)
        if (associationProjection && projections !== true) {
          if (associationProjection !== true) {
            if (association.reference === DAOAssociationReference.INNER) {
              setTraversing(associationProjection, association.refTo, true)
            } else if (association.reference === DAOAssociationReference.FOREIGN) {
              setTraversing(associationProjection, association.refFrom, true)
            }
          }
          const resolver: DAOResolver = this.resolvers[association.field]!

          const associationFieldPathSplitted = association.field.split('.')
          const associationField = associationFieldPathSplitted.pop()
          if (associationField) {
            const parentPath = associationFieldPathSplitted.join('.')
            const parents = getTraversing(
              dbObjects.filter((dbObject) => dbObject != null),
              parentPath,
            )
            const associatedRecords = await resolver.load(parents, associationProjection)
            parents.forEach((parent) => {
              if (association.type === DAOAssociationType.ONE_TO_ONE) {
                parent[associationField] =
                  associatedRecords.find((value) => {
                    return resolver.match(parent, value)
                  }) || null
              } else if (association.type === DAOAssociationType.ONE_TO_MANY) {
                parent[associationField] =
                  associatedRecords.filter((value) => {
                    return resolver.match(parent, value)
                  }) || null
              }
            })
          }
        }
      }
    }
    return dbObjects
  }

  private addResolver(association: DAOAssociation) {
    let resolver

    if (association.reference === DAOAssociationReference.INNER) {
      const refFrom = association.refFrom.split('.').pop()
      const refTo = association.refTo
      const linkedDAO = association.dao
      if (refFrom) {
        if (association.type === DAOAssociationType.ONE_TO_ONE) {
          resolver = {
            load: async (parents: any[], projections: any) => {
              const ids = parents.map((parent) => parent[refFrom]).filter((value, index, self) => value !== null && value !== undefined && self.indexOf(value) === index)

              return this.daoContext.dao(linkedDAO).load(
                ids,
                association.buildFilter ||
                  ((keys: any[]): T['filter'] => {
                    // @ts-ignore
                    return { [refTo]: { $in: keys } }
                  }),
                association.hasKey ||
                  ((record: T['model'], key: any): boolean => {
                    return (record as any)[refTo] === key
                  }),
                projections,
                refTo,
              )
            },
            match: (source: any, value: any): boolean => {
              return source[refFrom] === value[refTo]
            },
          }
        } else if (association.type === DAOAssociationType.ONE_TO_MANY) {
          resolver = {
            load: async (parents: any[], projections: any) => {
              const ids = parents
                .map((parent) => parent[refFrom])
                .filter((value) => value !== null && value !== undefined)
                .reduce((a, c) => [...a, ...c], [])
                .filter((value: any[], index: number, self: any) => self.indexOf(value) === index)

              return this.daoContext.dao(linkedDAO).load(
                ids,
                association.buildFilter ||
                  ((keys: any[]): T['filter'] => {
                    // @ts-ignore
                    return { [refTo]: { $in: keys } }
                  }),
                association.hasKey ||
                  ((record: T['model'], key: any): boolean => {
                    return (record as any)[refTo] === key
                  }),
                projections,
                refTo,
              )
            },
            match: (source: any, value: any): boolean => {
              return source[refFrom] && source[refFrom].includes(value[refTo])
            },
          }
        }
      }
    } else if (association.reference === DAOAssociationReference.FOREIGN) {
      const refFrom = association.refFrom
      const refTo = association.refTo.split('.').pop()
      const linkedDAO = association.dao
      if (refTo) {
        resolver = {
          load: async (parents: any[], projections: any) => {
            const ids = parents.map((parent) => parent[refTo]).filter((value, index, self) => value !== null && value !== undefined && self.indexOf(value) === index)

            return this.daoContext.dao(linkedDAO).load(
              ids,
              association.buildFilter ||
                ((keys: any[]): T['filter'] => {
                  // @ts-ignore
                  return { [refFrom]: { $in: keys } }
                }),
              association.hasKey ||
                ((record: T['model'], key: any): boolean => {
                  return (record as any)[refFrom] === key
                }),
              projections,
              refFrom,
            )
          },
          match: (source: any, value: any): boolean => {
            const tmp = getTraversing(value, refFrom)
            return tmp.includes(source[refTo])
          },
        }
      }
    }
    this.resolvers[association.field] = resolver
  }

  private async beforeInsert(params: InsertParams<T>): Promise<InsertParams<T>> {
    const contextOptions = this.createContextOptions()
    for (const middleware of this.middlewares) {
      if (middleware.beforeInsert) {
        params = await middleware.beforeInsert(params, contextOptions)
      }
    }
    return params
  }

  private async afterInsert(params: InsertParams<T>, result: T['insert']): Promise<T['insert']> {
    const contextOptions = this.createContextOptions()
    for (const middleware of reversed(this.middlewares)) {
      if (middleware.afterInsert) {
        result = await middleware.afterInsert(params, result, contextOptions)
      }
    }
    return result
  }

  async insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>> {
    const newParams = await this.beforeInsert(params)
    const result = await this._insertOne(newParams)
    return await this.afterInsert(newParams, result)
  }

  private async beforeUpdate(params: UpdateParams<T>): Promise<UpdateParams<T>> {
    const contextOptions = this.createContextOptions()
    for (const middleware of this.middlewares) {
      if (middleware.beforeUpdate) {
        params = await middleware.beforeUpdate(params, contextOptions)
      }
    }
    return params
  }

  private async afterUpdate(params: UpdateParams<T>) {
    const contextOptions = this.createContextOptions()
    for (const middleware of reversed(this.middlewares)) {
      if (middleware.afterUpdate) {
        await middleware.afterUpdate(params, contextOptions)
      }
    }
  }

  async updateOne(params: UpdateParams<T>): Promise<void> {
    const newParams = await this.beforeUpdate(params)
    await this._updateOne(newParams)
    await this.afterUpdate(newParams)
  }

  async updateAll(params: UpdateParams<T>): Promise<void> {
    const newParams = await this.beforeUpdate(params)
    await this._updateMany(newParams)
    await this.afterUpdate(newParams)
  }

  private async beforeReplace(params: ReplaceParams<T>): Promise<ReplaceParams<T>> {
    const contextOptions = this.createContextOptions()
    for (const middleware of this.middlewares) {
      if (middleware.beforeReplace) {
        params = await middleware.beforeReplace(params, contextOptions)
      }
    }
    return params
  }

  private async afterReplace(params: ReplaceParams<T>): Promise<void> {
    const contextOptions = this.createContextOptions()
    for (const middleware of reversed(this.middlewares)) {
      if (middleware.afterReplace) {
        await middleware.afterReplace(params, contextOptions)
      }
    }
  }

  async replaceOne(params: ReplaceParams<T>): Promise<void> {
    const newParams = await this.beforeReplace(params)
    await this._replaceOne(newParams)
    await this.afterReplace(newParams)
  }

  private async beforeDelete(params: DeleteParams<T>): Promise<DeleteParams<T>> {
    const contextOptions = this.createContextOptions()
    for (const middleware of this.middlewares) {
      if (middleware.beforeDelete) {
        params = await middleware.beforeDelete(params, contextOptions)
      }
    }
    return params
  }

  private async afterDelete(params: DeleteParams<T>): Promise<void> {
    const contextOptions = this.createContextOptions()
    for (const middleware of reversed(this.middlewares)) {
      if (middleware.afterDelete) {
        await middleware.afterDelete(params, contextOptions)
      }
    }
  }

  async deleteOne(params: DeleteParams<T>): Promise<void> {
    const newParams = await this.beforeDelete(params)
    await this._deleteOne(newParams)
    await this.afterDelete(newParams)
  }

  async deleteAll(params: DeleteParams<T>): Promise<void> {
    const newParams = await this.beforeDelete(params)
    await this._deleteMany(newParams)
    await this.afterDelete(newParams)
  }

  private createContextOptions(): MiddlewareContext<T> {
    return { schema: this.schema, idField: this.idField, driver: this.driverContext }
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
