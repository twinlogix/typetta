import { DefaultModelScalars, EqualityOperators, Expand, LogicalOperators, OneKey, QuantityOperators, SortDirection, TypeTraversal } from '../..'
import { AbstractDAOContext } from '../daoContext/daoContext'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection, ModelProjection } from './projections/projections.types'
import { DAORelation } from './relations/relations.types'
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
      relation: DAORelation
      record: PartialDeep<T>
      failedReferences: any[]
    }[]

export type DAOResolver = {
  load: (parents: any[], projections: any, relations: any) => Promise<any[]>
  match: (source: any, value: any) => boolean
}

export type FilterParams<T extends DAOGenerics> = {
  filter?: T['filter']
  relations?: T['relations']
  metadata?: T['operationMetadata']
  options?: T['driverFilterOptions']
}

export type FindOneParams<T extends DAOGenerics, P = T['projection']> = Omit<FilterParams<T>, 'options'> & {
  projection?: P
  options?: T['driverFindOptions']
}
export type FindParams<T extends DAOGenerics, P = T['projection']> = FindOneParams<T, P> & {
  start?: number
  limit?: number
  sorts?: T['sort'][]
}

export type InsertParams<T extends DAOGenerics> = {
  record: T['insert']
  metadata?: T['operationMetadata']
  options?: T['driverInsertOptions']
}

export type UpdateParams<T extends DAOGenerics> = {
  filter: T['filter']
  changes: T['update']
  metadata?: T['operationMetadata']
  options?: T['driverUpdateOptions']
}

export type ReplaceParams<T extends DAOGenerics> = {
  filter: T['filter']
  replace: T['insert']
  metadata?: T['operationMetadata']
  options?: T['driverReplaceOptions']
}

export type DeleteParams<T extends DAOGenerics> = {
  filter: T['filter']
  metadata?: T['operationMetadata']
  options?: T['driverDeleteOptions']
}

export type AggregateOperation = 'sum' | 'count' | 'avg' | 'min' | 'max'

export type AggregationFields<T extends DAOGenerics> = {
  [key: string]: { field: keyof Omit<T['filter'], keyof LogicalOperators<any>>; operator: AggregateOperation }
}

export type AggregateParams<T extends DAOGenerics> = {
  by?: { [K in keyof Omit<T['filter'], keyof LogicalOperators<any>>]: true }
  filter?: T['filter']
  aggregations: AggregationFields<T>
  start?: number
  limit?: number
  metadata?: T['operationMetadata']
  options?: T['driverFilterOptions']
}

export type AggregatePostProcessing<T extends DAOGenerics, A extends AggregateParams<T>> = {
  having?: { [K in keyof A['aggregations']]?: EqualityOperators<number> | QuantityOperators<number> | number }
  sorts?: OneKey<keyof A['aggregations'] | keyof A['by'], SortDirection>[]
}

export type AggregateResults<T extends DAOGenerics, A extends AggregateParams<T>> = Expand<
  { [K in keyof A['by']]: K extends string ? TypeTraversal<T['model'], K> : K extends keyof T['model'] ? T['model'][K] : never } & Record<keyof A['aggregations'], number>
>

export type DAOParams<T extends DAOGenerics> = {
  idField: T['idKey']
  idScalar: T['idScalar']
  idGeneration: T['idGeneration']
  idGenerator?: () => T['idScalar'][T['idScalar']]
  daoContext: AbstractDAOContext<T['scalars'], T['metadata']>
  schema: Schema<T['scalars']>
  metadata?: T['metadata']
  driverContext: T['driverContext']
  pageSize?: number
  relations?: DAORelation[]
  middlewares?: DAOMiddleware<T>[]
}

export type MiddlewareContext<T extends DAOGenerics> = {
  schema: Schema<T['scalars']>
  idField: T['idKey']
  driver: T['driverContext']
  metadata?: T['metadata']
}

export type IdGenerationStrategy = 'user' | 'db' | 'generator'

export interface DAO<T extends DAOGenerics> {
  findAll<P extends AnyProjection<T['projection']>>(params?: FindParams<T>): Promise<ModelProjection<T['model'], T['projection'], P>[]>
  findOne<P extends AnyProjection<T['projection']>>(params?: FindOneParams<T>): Promise<ModelProjection<T['model'], T['projection'], P> | null>
  findPage<P extends AnyProjection<T['projection']>>(params?: FindParams<T>): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }>
  exists(params: FilterParams<T>): Promise<boolean>
  count(params?: FilterParams<T>): Promise<number>
  aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>[]>
  insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>>
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
  RelationsType = any,
  ProjectionType extends object = any,
  SortType = any,
  InsertType extends object = any,
  UpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  MetadataType = any,
  OperationMetadataType = any,
  DriverContext = any,
  ScalarsType extends DefaultModelScalars = any,
  DriverFilterOptions = any,
  DriverFindOptions = any,
  DriverInsertOptions = any,
  DriverUpdateOptions = any,
  DriverReplaceOptions = any,
  DriverDeleteOptions = any,
> = {
  model: ModelType
  idKey: IDKey
  idScalar: IDScalar
  idGeneration: IdGeneration
  filter: FilterType
  relations: RelationsType
  projection: ProjectionType
  sort: SortType
  insert: InsertType
  update: UpdateType
  exludedFields: ExcludedFields
  metadata: MetadataType
  operationMetadata: OperationMetadataType
  driverContext: DriverContext
  scalars: ScalarsType

  driverFilterOptions: DriverFilterOptions
  driverFindOptions: DriverFindOptions
  driverInsertOptions: DriverInsertOptions
  driverUpdateOptions: DriverUpdateOptions
  driverReplaceOptions: DriverReplaceOptions
  driverDeleteOptions: DriverDeleteOptions
}
