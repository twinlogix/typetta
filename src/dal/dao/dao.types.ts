/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultModelScalars, EqualityOperators, Expand, QuantityOperators, SortDirection, TypeTraversal } from '../..'
import { OmitIfKnown } from '../../utils/utils.types'
import { AbstractEntityManager } from '../entity-manager'
import { LogFunction } from './log/log.types'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection, ModelProjection } from './projections/projections.types'
import { Schema } from './schemas/schemas.types'
import { GraphQLResolveInfo } from 'graphql'
import { Knex } from 'knex'
import { ClientSession } from 'mongodb'

export type OperationParams<T extends DAOGenerics> = {
  metadata?: T['operationMetadata']
  options?: T['driverFilterOptions']
}

export type FilterParams<T extends DAOGenerics> = {
  filter?: T['filter']
  relations?: T['relations']
} & OperationParams<T>

export type FindOneParams<T extends DAOGenerics, P = T['projection']> = Omit<FilterParams<T>, 'options'> & {
  projection?: P
  options?: T['driverFindOptions']
  skip?: number
  sorts?: T['sort']
  operationId?: string
  relationParents?: { field: string; schema: Schema<T['scalars']> }[]
  maxDepth?: number
}

export type FindParams<T extends DAOGenerics, P = T['projection']> = FindOneParams<T, P> & {
  limit?: number
}

export type InsertParams<T extends DAOGenerics> = {
  record: T['insert']
} & OperationParams<T>

export type UpdateParams<T extends DAOGenerics> = {
  filter: T['filter']
  changes: T['update']
} & OperationParams<T>

export type ReplaceParams<T extends DAOGenerics> = {
  filter: T['filter']
  replace: T['insert']
} & OperationParams<T>

export type DeleteParams<T extends DAOGenerics> = {
  filter: T['filter']
} & OperationParams<T>

export type AggregationFields<T extends DAOGenerics> = {
  [key: string]: { field: keyof T['pureSort']; operation: 'sum' | 'avg' | 'min' | 'max' } | { field?: keyof T['pureSort']; operation: 'count' }
}

export type AggregateParams<T extends DAOGenerics> = {
  by?: { [K in keyof T['pureSort']]: true }
  filter?: T['filter']
  aggregations: AggregationFields<T>
  skip?: number
  limit?: number
} & OperationParams<T>

export type AggregatePostProcessing<T extends DAOGenerics, A extends AggregateParams<T>> = {
  having?: { [K in keyof A['aggregations']]?: EqualityOperators<number> | QuantityOperators<number> | number }
  sorts?: Partial<Record<keyof A['aggregations'] | keyof A['by'], SortDirection>>[]
}

export type AggregateResults<T extends DAOGenerics, A extends AggregateParams<T>> = Expand<
  keyof A['by'] extends never
    ? {
        [K in keyof A['aggregations']]: A['aggregations'][K]['operation'] extends 'count' ? number : number | null
      }
    : ({ [K in keyof A['by']]: K extends string ? TypeTraversal<T['model'], K> : K extends keyof T['model'] ? T['model'][K] : never } & {
        [K in keyof A['aggregations']]: A['aggregations'][K]['operation'] extends 'count' ? number : number | null
      })[]
>

export type DAOParams<T extends DAOGenerics> = {
  idGenerator?: () => T['idScalar'][T['idScalar']]
  entityManager: AbstractEntityManager<string, string, T['scalars'], T['metadata']>
  schema: Schema<T['scalars']>
  metadata?: T['metadata']
  driverContext: T['driverContext']
  pageSize?: number
  middlewares?: DAOMiddleware<T>[]
  logger?: LogFunction<T['name']>
  name: T['name']
  datasource: string | null
}

export type DriverType = 'mongo' | 'knex' | 'memory'

export type MiddlewareContext<T extends DAOGenerics> = {
  daoName: T['name']
  daoDriver: DriverType
  schema: Schema<T['scalars']>
  idField: T['idKey']
  driver: T['driverContext']
  metadata?: T['metadata']
  specificOperation: 'findAll' | 'findOne' | 'insertOne' | 'updateOne' | 'updateAll' | 'replaceOne' | 'replaceAll' | 'deleteOne' | 'deleteAll' | 'aggregate' | 'count' | 'exists' | 'findPage'
  logger?: LogFunction<T['name']>
  dao: DAO<T>
  entityManager: T['entityManager']
}

export type IdGenerationStrategy = 'user' | 'db' | 'generator'
export type DefaultGenerationStrategy = 'middleware' | 'generator'

export interface DAO<T extends DAOGenerics> {
  findAll<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params?: FindParams<T, P>): Promise<ModelProjection<T, P>[]>
  findOne<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params?: FindOneParams<T, P>): Promise<ModelProjection<T, P> | null>
  findPage<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params?: FindParams<T, P>): Promise<{ totalCount: number; records: ModelProjection<T, P>[] }>
  exists(params: FilterParams<T>): Promise<boolean>
  count(params?: FilterParams<T>): Promise<number>
  aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>>
  insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>>
  updateOne(params: UpdateParams<T>): Promise<void>
  updateAll(params: UpdateParams<T>): Promise<void>
  replaceOne(params: ReplaceParams<T>): Promise<void>
  deleteOne(params: DeleteParams<T>): Promise<void>
  deleteAll(params: DeleteParams<T>): Promise<void>
}

export type DAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof OmitIfKnown<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  PureFilterType = any,
  RawFilterType = any,
  RelationsType = any,
  ProjectionType extends object = any,
  PureSortType = any,
  RawSortType = any,
  InsertType extends object = any,
  PureUpdateType = any,
  RawUpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  RelationsFields extends keyof ModelType = any,
  MetadataType = any,
  OperationMetadataType = any,
  DriverContextType = any,
  ScalarsType extends DefaultModelScalars = any,
  DriverFilterOptions = any,
  DriverFindOptions = any,
  DriverInsertOptions = any,
  DriverUpdateOptions = any,
  DriverReplaceOptions = any,
  DriverDeleteOptions = any,
  NameType extends string = any,
  EntityManager extends AbstractEntityManager<string, string, ScalarsType, MetadataType> = AbstractEntityManager<string, string, ScalarsType, MetadataType>,
> = {
  model: ModelType
  idKey: IDKey
  idScalar: IDScalar
  idType: ModelType[IDKey]
  pureFilter: PureFilterType
  rawFilter: RawFilterType
  filter: PureFilterType | RawFilterType
  relations: RelationsType
  projection: ProjectionType
  pureSort: PureSortType
  rawSort: RawSortType
  sort: PureSortType[] | RawSortType
  insert: InsertType
  pureUpdate: PureUpdateType
  rawUpdate: RawUpdateType
  update: PureUpdateType | RawUpdateType
  exludedFields: ExcludedFields
  relationFields: RelationsFields
  insertExcludedFields: ExcludedFields | RelationsFields
  metadata: MetadataType
  operationMetadata: OperationMetadataType
  driverContext: DriverContextType
  scalars: ScalarsType
  name: NameType
  entityManager: EntityManager

  driverFilterOptions: DriverFilterOptions
  driverFindOptions: DriverFindOptions
  driverInsertOptions: DriverInsertOptions
  driverUpdateOptions: DriverUpdateOptions
  driverReplaceOptions: DriverReplaceOptions
  driverDeleteOptions: DriverDeleteOptions
}

export type TransactionData<MongoDBDatasources extends string, KnexDataSources extends string> = ([MongoDBDatasources] extends [never]
  ? { mongodb?: undefined }
  : { mongodb?: Partial<Record<MongoDBDatasources, ClientSession>> }) &
  ([KnexDataSources] extends [never] ? { knex?: undefined } : { knex?: Partial<Record<KnexDataSources, Knex.Transaction>> })
