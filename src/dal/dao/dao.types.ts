import { DefaultModelScalars } from '../..'
import { AbstractDAOContext } from '../daoContext/daoContext'
import { DAOAssociation } from './associations/associations.types'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection, ModelProjection } from './projections/projections.types'
import { Schema } from './schemas/schemas.types'
import { PartialDeep } from 'type-fest'

export type RequestArgs<Filter, Sort> = {
  start?: number
  limit?: number
  filter?: Filter
  sorts?: Sort[]
}

export type ReferenceChecksResponse<T> =
  | true
  | {
      association: DAOAssociation
      record: PartialDeep<T>
      failedReferences: any[]
    }[]

export type DAOResolver = {
  load: (parents: any[], projections: any) => Promise<any[]>
  match: (source: any, value: any) => boolean
}

export type FilterParams<T extends DAOGenerics> = {
  filter?: T['filterType']
  options?: T['optionsType']
}

export type FindOneParams<T extends DAOGenerics, P = T['projectionType']> = FilterParams<T> & {
  projection?: P
}
export type FindParams<T extends DAOGenerics, P = T['projectionType']> = FindOneParams<T, P> & {
  start?: number
  limit?: number
  sorts?: T['sortType'][]
}

export type InsertParams<T extends DAOGenerics> = {
  record: T['insertType']
  options?: T['optionsType']
}

export type UpdateParams<T extends DAOGenerics> = {
  filter: T['filterType']
  changes: T['updateType']
  options?: T['optionsType'] & T['driverOptionType']
}

export type ReplaceParams<T extends DAOGenerics> = {
  filter: T['filterType']
  replace: T['insertType']
  options?: T['optionsType'] & T['driverOptionType']
}

export type DeleteParams<T extends DAOGenerics> = {
  filter: T['filterType']
  options?: T['optionsType'] & T['driverOptionType']
}

export type DAOParams<T extends DAOGenerics> = {
  idField: T['idKey']
  idScalar: T['idScalar']
  idGeneration: T['idGeneration']
  idGenerator?: () => T['idScalar'][T['idScalar']]
  daoContext: AbstractDAOContext<T['scalarsType'], T['optionsType']>
  schema: Schema<T['scalarsType']>
  options?: T['optionsType']
  driverOptions: T['driverOptionType']
  pageSize?: number
  associations?: DAOAssociation[]
  middlewares?: DAOMiddleware<T>[]
}

export type MiddlewareContext<T extends DAOGenerics> = { schema: Schema<T['scalarsType']>; idField: T['idKey']; driver: T['driverOptionType'] } // TODO: add DAOContext? How?

export type IdGenerationStrategy = 'user' | 'db' | 'generator'

export interface DAO<T extends DAOGenerics> {
  findAll<P extends AnyProjection<T['projectionType']>>(params?: FindParams<T>): Promise<ModelProjection<T['modelType'], T['projectionType'], P>[]>
  findOne<P extends AnyProjection<T['projectionType']>>(params?: FindOneParams<T>): Promise<ModelProjection<T['modelType'], T['projectionType'], P> | null>
  findPage<P extends AnyProjection<T['projectionType']>>(params?: FindParams<T>): Promise<{ totalCount: number; records: ModelProjection<T['modelType'], T['projectionType'], P>[] }>
  exists(params: FilterParams<T>): Promise<boolean>
  count(params?: FilterParams<T>): Promise<number>
  checkReferences(records: PartialDeep<T['modelType']> | PartialDeep<T['modelType']>[], options?: T['optionsType']): Promise<ReferenceChecksResponse<T['modelType']>>
  insertOne(params: InsertParams<T>): Promise<Omit<T['modelType'], T['exludedFields']>>
  updateOne(params: UpdateParams<T>): Promise<void>
  updateAll(params: UpdateParams<T>): Promise<void>
  replaceOne(params: ReplaceParams<T>): Promise<void>
  deleteOne(params: DeleteParams<T>): Promise<void>
  deleteAll(params: DeleteParams<T>): Promise<void>
}

export type DAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof Omit<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  FilterType = any,
  ProjectionType extends object = any,
  SortType = any,
  InsertType extends object = any,
  UpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  OptionsType extends object = any,
  DriverOptionType = any,
  ScalarsType extends DefaultModelScalars = any,
> = {
  modelType: ModelType
  idKey: IDKey
  idScalar: IDScalar
  idGeneration: IdGeneration
  filterType: FilterType
  projectionType: ProjectionType
  sortType: SortType
  insertType: InsertType
  updateType: UpdateType
  exludedFields: ExcludedFields
  optionsType: OptionsType
  driverOptionType: DriverOptionType
  scalarsType: ScalarsType
}

export type ReplaceKey<O extends object, K extends keyof O, T> = Omit<O, K> & Record<K, T>
