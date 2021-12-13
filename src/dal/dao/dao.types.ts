import { DefaultModelScalars } from '../..'
import { ConditionalPartialBy } from '../../utils/utils'
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

export type FilterParams<FilterType, OptionsType> = {
  filter?: FilterType
  options?: OptionsType
}

export type FindOneParams<FilterType, ProjectionType, OptionsType> = FilterParams<FilterType, OptionsType> & {
  projection?: ProjectionType
}
export type FindParams<FilterType, ProjectionType, SortType, OptionsType> = FindOneParams<FilterType, ProjectionType, OptionsType> & {
  start?: number
  limit?: number
  sorts?: SortType[]
}

export type InsertParams<ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, ExcludedFields extends keyof ModelType, IdGeneration extends IdGenerationStrategy, OptionsType> = {
  record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IdGeneration>
  options?: OptionsType
}

export type UpdateParams<FilterType, UpdateType, OptionsType> = {
  filter: FilterType
  changes: UpdateType
  options?: OptionsType
}

export type ReplaceParams<FilterType, ModelType, ExcludedFields extends keyof ModelType, OptionsType> = {
  filter: FilterType
  replace: Omit<ModelType, ExcludedFields>
  options?: OptionsType
}

export type DeleteParams<FilterType, OptionsType> = {
  filter: FilterType
  options?: OptionsType
}

export type DAOParams<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDScalar extends keyof ScalarsType,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType extends object,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  DriverOptionsType,
  ScalarsType extends DefaultModelScalars,
> = {
  idField: IDKey
  idScalar: IDScalar
  idGeneration: IdGeneration
  idGenerator?: () => ScalarsType[IDScalar]
  daoContext: AbstractDAOContext<ScalarsType, OptionsType>
  schema: Schema<ScalarsType>
  options?: OptionsType
  driverOptions: DriverOptionsType
  pageSize?: number
  associations?: DAOAssociation[]
  middlewares?: DAOMiddleware<ModelType, IDKey, IdGeneration, FilterType, AnyProjection<ProjectionType>, UpdateType, ExcludedFields, SortType, OptionsType & DriverOptionsType, ScalarsType>[]
}

export type MiddlewareContext<ScalarsType, IDKey> = { schema: Schema<ScalarsType>; idField: IDKey } // TODO: add DAOContext? How?

export type IdGenerationStrategy = 'user' | 'db' | 'generator'

export interface DAO<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType extends object,
  SortType,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  OptionsType,
> {
  findAll<P extends AnyProjection<ProjectionType>>(params?: FindParams<FilterType, P, SortType, OptionsType>): Promise<ModelProjection<ModelType, ProjectionType, P>[]>
  findOne<P extends AnyProjection<ProjectionType>>(params?: FindOneParams<FilterType, P, OptionsType>): Promise<ModelProjection<ModelType, ProjectionType, P> | null>
  findPage<P extends AnyProjection<ProjectionType>>(
    params?: FindParams<FilterType, P, SortType, OptionsType>,
  ): Promise<{ totalCount: number; records: ModelProjection<ModelType, ProjectionType, P>[] }>
  exists(params: FilterParams<FilterType, OptionsType>): Promise<boolean>
  count(params?: FilterParams<FilterType, OptionsType>): Promise<number>
  checkReferences(records: PartialDeep<ModelType> | PartialDeep<ModelType>[], options?: OptionsType): Promise<ReferenceChecksResponse<ModelType>>
  insertOne(params: InsertParams<ModelType, IDKey, ExcludedFields, IdGeneration, OptionsType>): Promise<Omit<ModelType, ExcludedFields>>
  updateOne(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void>
  updateAll(params: UpdateParams<FilterType, UpdateType, OptionsType>): Promise<void>
  replaceOne(params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>): Promise<void>
  deleteOne(params: DeleteParams<FilterType, OptionsType>): Promise<void>
  deleteAll(params: DeleteParams<FilterType, OptionsType>): Promise<void>
}
