import { AbstractDAOContext } from '../daoContext/daoContext'
import { DAOWrapperAPIv1 } from '../legacy/daoWrapperAPIv1'
import { DAOAssociation, DAOAssociationReference, DAOAssociationType } from './associations/associations.types'
import { DAO, DAOParams, DAOResolver, DeleteParams, FilterParams, FindOneParams, FindParams, InsertParams, ReferenceChecksResponse, ReplaceParams, UpdateParams } from './dao.types'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection, GenericProjection, ModelProjection, Projection } from './projections/projections.types'
import { getProjection } from './projections/projections.utils'
import { Schema } from './schemas/schemas.types'
import { deepMerge, getTraversing, setTraversing } from '@twinlogix/tl-commons'
import DataLoader from 'dataloader'
import _ from 'lodash'
import objectHash from 'object-hash'
import { PartialDeep } from 'type-fest'

export abstract class AbstractDAO<
  ModelType,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDAutogenerated extends boolean,
  FilterType,
  ProjectionType extends Projection<ModelType>,
  SortType,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  OptionsType extends object,
  ScalarsType extends object,
> implements DAO<ModelType, IDKey, IDAutogenerated, FilterType, ProjectionType, SortType, UpdateType, ExcludedFields, OptionsType>
{
  protected idField: IDKey
  protected daoContext: AbstractDAOContext
  protected associations: DAOAssociation[]
  protected middlewares: DAOMiddleware<ModelType, IDKey, IDAutogenerated, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType>[]
  protected pageSize: number
  protected resolvers: { [key: string]: DAOResolver | undefined }
  protected dataLoaders: Map<string, DataLoader<ModelType[IDKey], ModelType[] | null>>
  protected defaultOptions: OptionsType | undefined
  protected schema: Schema<ScalarsType>
  public apiV1: DAOWrapperAPIv1<ModelType, IDKey, IDAutogenerated, FilterType, ProjectionType, SortType, UpdateType, ExcludedFields, OptionsType, ScalarsType>

  protected constructor({
    idField,
    daoContext,
    pageSize = 50,
    associations = [],
    middlewares = [],
    schema,
    defaultOptions,
  }: DAOParams<ModelType, IDKey, boolean, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType, ScalarsType>) {
    this.dataLoaders = new Map<string, DataLoader<ModelType[IDKey], ModelType[]>>()
    this.idField = idField
    this.daoContext = daoContext
    this.pageSize = pageSize
    this.resolvers = {}
    this.associations = associations
    this.associations.forEach((association) => this.addResolver(association))
    this.middlewares = [
      {
        beforeFind: async (params) => this.addDefaultOptions(params),
        beforeInsert: async (params) => this.addDefaultOptions(params),
        beforeUpdate: async (params) => this.addDefaultOptions(params),
        beforeReplace: async (params) => this.addDefaultOptions(params),
        beforeDelete: async (params) => this.addDefaultOptions(params),
      },
      ...middlewares,
    ]
    this.defaultOptions = defaultOptions
    this.schema = schema
    this.apiV1 = new DAOWrapperAPIv1<ModelType, IDKey, IDAutogenerated, FilterType, ProjectionType, SortType, UpdateType, ExcludedFields, OptionsType, ScalarsType>(this, idField)
  }

  protected async beforeFind<P extends AnyProjection<ModelType, ProjectionType>>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<FindParams<FilterType, P, SortType, OptionsType>> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeFind) {
        params = await middleware.beforeFind(params)
      }
    }
    return params
  }

  protected async afterFind<P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
    result: PartialDeep<ModelType>,
  ): Promise<PartialDeep<ModelType>> {
    for (const middleware of this.middlewares) {
      if (middleware.afterFind) {
        result = await middleware.afterFind(params, result)
      }
    }
    return result
  }

  private async elabRecords<P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
    records: PartialDeep<ModelType>[],
  ): Promise<ModelProjection<ModelType, P>[]> {
    const results = []
    for (let i = 0; i < records.length; i++) {
      results.push(await this.afterFind(params, records[i]))
    }
    return results as ModelProjection<ModelType, P>[]
  }

  async findAll<P extends AnyProjection<ModelType, ProjectionType> = true>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<ModelProjection<ModelType, P>[]> {
    const newParams = await this.beforeFind(params)
    const records = await this._find(newParams)
    const resolvedRecors = await this.resolveAssociations(records, params.projection)
    return this.elabRecords(params, resolvedRecors)
  }

  async findOne<P extends AnyProjection<ModelType, ProjectionType> = true>(params: FindOneParams<FilterType, P, OptionsType>): Promise<ModelProjection<ModelType, P> | null> {
    const newParams = await this.beforeFind({ ...params })
    const record = await this._findOne(newParams)
    if (record) {
      const resolvedRecors = await this.resolveAssociations([record], params.projection)
      return (await this.elabRecords({ ...params }, resolvedRecors))[0]
    }
    return null
  }

  async findPage<P extends AnyProjection<ModelType, ProjectionType> = true>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
  ): Promise<{ totalCount: number; records: ModelProjection<ModelType, P>[] }> {
    const newParams = await this.beforeFind(params)
    const { totalCount, records } = await this._findPage(newParams)
    return {
      totalCount,
      records: await this.elabRecords(params, records as PartialDeep<ModelType>[]),
    }
  }

  async exists(params: FilterParams<FilterType, OptionsType>): Promise<boolean> {
    const newParams = await this.beforeFind({ ...params })
    return this._exists(newParams)
  }

  async count(params: FilterParams<FilterType, OptionsType>): Promise<number> {
    const newParams = await this.beforeFind({ ...params })
    return this._count(newParams)
  }

  async checkReferences(records: PartialDeep<ModelType> | PartialDeep<ModelType>[], options?: OptionsType): Promise<ReferenceChecksResponse<ModelType>> {
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
    keys: IDKey[],
    buildFilter: (keys: IDKey[]) => FilterType,
    hasKey: (record: ModelType, key: IDKey) => boolean,
    projection: ProjectionType,
    loaderIdetifier: string = '',
  ): Promise<(ModelType | null | Error)[]> {
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
    buildFilter: (keys: any[]) => FilterType,
    hasKey: (record: ModelType, key: any) => boolean,
    projection: ProjectionType,
    loaderIdetifier: string,
  ): DataLoader<any, ModelType[] | null> {
    const hash = loaderIdetifier + '-' + objectHash(projection || null, { respectType: false, unorderedArrays: true })
    const dataLoader = this.dataLoaders.get(hash)
    if (dataLoader) {
      return dataLoader
    } else {
      const newDataLoader = new DataLoader<any, ModelType[] | null>(
        async (keys) => {
          const filter = buildFilter(keys as ModelType[IDKey][])
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

  protected async resolveAssociations(dbObjects: any[], projections?: AnyProjection<ModelType, ProjectionType>): Promise<PartialDeep<ModelType>[]> {
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

  protected addResolver(association: DAOAssociation) {
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
                  ((keys: any[]): FilterType => {
                    // @ts-ignore
                    return { [refTo]: { $in: keys } }
                  }),
                association.hasKey ||
                  ((record: ModelType, key: any): boolean => {
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
                  ((keys: any[]): FilterType => {
                    // @ts-ignore
                    return { [refTo]: { $in: keys } }
                  }),
                association.hasKey ||
                  ((record: ModelType, key: any): boolean => {
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
                ((keys: any[]): FilterType => {
                  // @ts-ignore
                  return { [refFrom]: { $in: keys } }
                }),
              association.hasKey ||
                ((record: ModelType, key: any): boolean => {
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

  private async beforeInsert(
    params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>,
  ): Promise<InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeInsert) {
        params = await middleware.beforeInsert(params)
      }
    }
    return params
  }

  private async afterInsert(params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>, result: Omit<ModelType, ExcludedFields>): Promise<Omit<ModelType, ExcludedFields>> {
    for (const middleware of this.middlewares) {
      if (middleware.afterInsert) {
        result = await middleware.afterInsert(params, result)
      }
    }
    return result
  }

  async insertOne(params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>): Promise<Omit<ModelType, ExcludedFields>> {
    const newParams = await this.beforeInsert(params)
    const result = await this._insertOne(newParams)
    return await this.afterInsert(newParams, result)
  }

  private async beforeUpdate(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<UpdateParams<FilterType, UpdateType, OptionsType>> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeUpdate) {
        params = await middleware.beforeUpdate(params)
      }
    }
    return params
  }

  private async afterUpdate(params: UpdateParams<FilterType, UpdateType, OptionsType>) {
    for (const middleware of this.middlewares) {
      if (middleware.afterUpdate) {
        await middleware.afterUpdate(params)
      }
    }
  }

  async updateOne(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const newParams = await this.beforeUpdate(params)
    await this._updateOne(newParams)
    await this.afterUpdate(newParams)
  }

  async updateAll(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void> {
    const newParams = await this.beforeUpdate(params)
    await this._updateMany(newParams)
    await this.afterUpdate(newParams)
  }

  private async beforeReplace(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeReplace) {
        params = await middleware.beforeReplace(params)
      }
    }
    return params
  }

  private async afterReplace(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.afterReplace) {
        await middleware.afterReplace(params)
      }
    }
  }

  async replaceOne(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<void> {
    const newParams = await this.beforeReplace(params)
    await this._replaceOne(newParams)
    await this.afterReplace(newParams)
  }

  private async beforeDelete(params: DeleteParams<FilterType, OptionsType>): Promise<DeleteParams<FilterType, OptionsType>> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeDelete) {
        params = await middleware.beforeDelete(params)
      }
    }
    return params
  }

  private async afterDelete(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.afterDelete) {
        await middleware.afterDelete(params)
      }
    }
  }

  async deleteOne(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const newParams = await this.beforeDelete(params)
    await this._deleteOne(newParams)
    await this.afterDelete(newParams)
  }

  async deleteAll(params: DeleteParams<FilterType, OptionsType>): Promise<void> {
    const newParams = await this.beforeDelete(params)
    await this._deleteMany(newParams)
    await this.afterDelete(newParams)
  }

  private addDefaultOptions<T extends { options?: OptionsType }>(params: T): T {
    if (!this.defaultOptions) {
      return params
    }
    if (!params.options) {
      return { ...params, options: this.defaultOptions }
    }
    const options = deepMerge(params.options, this.defaultOptions)
    return { ...params, options: options as OptionsType }
  }

  // -----------------------------------------------------------------------
  // ------------------------------ ABSTRACTS ------------------------------
  // -----------------------------------------------------------------------
  protected abstract _find<P extends AnyProjection<ModelType, ProjectionType>>(params: FindParams<FilterType, P, SortType, OptionsType>): Promise<PartialDeep<ModelType>[]>
  protected abstract _findOne<P extends AnyProjection<ModelType, ProjectionType>>(params: FindOneParams<FilterType, P, OptionsType>): Promise<PartialDeep<ModelType> | null>
  protected abstract _findPage<P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
  ): Promise<{ totalCount: number; records: PartialDeep<ModelType>[] }>
  protected abstract _exists(params: FilterParams<FilterType, OptionsType>): Promise<boolean>
  protected abstract _count(params: FilterParams<FilterType, OptionsType>): Promise<number>
  protected abstract _insertOne(params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>): Promise<Omit<ModelType, ExcludedFields>>
  protected abstract _updateOne(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void>
  protected abstract _updateMany(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void>
  protected abstract _replaceOne(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<void>
  protected abstract _deleteOne(params: DeleteParams<FilterType, OptionsType>): Promise<void>
  protected abstract _deleteMany(params: DeleteParams<FilterType, OptionsType>): Promise<void>
}
