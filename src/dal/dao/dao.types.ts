/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AbstractScalars,
  AbstractSyntaxTree,
  DefaultModelScalars,
  EqualityOperators,
  Expand,
  Filter,
  LogicalOperators,
  Project,
  QuantityOperators,
  SortDirection,
  SortElement,
  TypeTraversal,
} from '../..'
import { OmitNever, IfAny } from '../../utils/utils.types'
import { AbstractEntityManager } from '../entity-manager'
import { LogFunction } from './log/log.types'
import { DAOMiddleware } from './middlewares/middlewares.types'
import { AnyProjection } from './projections/projections.types'
import { Schema } from './schemas/schemas.types'
import { GraphQLResolveInfo } from 'graphql'
import { Knex } from 'knex'
import { ClientSession } from 'mongodb'

export type OperationParams<T extends DAOGenerics> = {
  metadata?: T['operationMetadata']
  options?: T['driverFilterOptions']
}

export type RelationsFindParams<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = Partial<
  OmitNever<{
    [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K] extends { astName: infer ASTName; type: infer Type }
      ? ASTName extends string
        ? Type extends 'relation'
          ? {
              filter?: Filter<ASTName, AST, Scalars> | AST[Entity]['driverSpecification']['rawFilter']
              sorts?: SortElement<ASTName, AST>[] | AST[Entity]['driverSpecification']['rawSorts']
              skip?: number
              limit?: number | 'unlimited'
              relations?: RelationsFindParams<ASTName, AST, Scalars>
            }
          : never
        : never
      : never
  }>
>

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
  limit?: number | 'unlimited'
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
  limit?: number | 'unlimited'
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
    : ({ [K in keyof A['by']]: K extends string ? TypeTraversal<T['insert'], K> : K extends keyof T['insert'] ? T['insert'][K] : never } & {
        [K in keyof A['aggregations']]: A['aggregations'][K]['operation'] extends 'count' ? number : number | null
      })[]
>

export type DAOParams<T extends DAOGenerics> = {
  idGenerator?: () => OmitNever<{ [K in T['idFields']]: K extends keyof T['insert'] ? T['insert'][K] : never }>
  entityManager: AbstractEntityManager<string, string, T['scalars'], T['metadata']>
  schema: Schema<T['scalars']>
  metadata?: T['metadata']
  driverContext: T['driverContext']
  pageSize?: number
  middlewares?: DAOMiddleware<T>[]
  logger?: LogFunction<T['entity']>
  awaitLog?: boolean
  name: T['entity']
  datasource: string | null
}

export type DriverType = 'mongo' | 'knex' | 'memory'

export type MiddlewareContext<T extends DAOGenerics> = {
  daoName: T['entity']
  daoDriver: DriverType
  schema: Schema<T['scalars']>
  idField: T['idFields']
  driver: T['driverContext']
  metadata?: T['metadata']
  specificOperation: 'findAll' | 'findOne' | 'insertOne' | 'updateOne' | 'updateAll' | 'replaceOne' | 'replaceAll' | 'deleteOne' | 'deleteAll' | 'aggregate' | 'count' | 'exists' | 'findPage'
  logger?: LogFunction<T['entity']>
  dao: DAO<T>
  entityManager: T['entityManager']
}

export type IdGenerationStrategy = 'user' | 'db' | 'generator'
export type DefaultGenerationStrategy = 'middleware' | 'generator'

export interface DAO<T extends DAOGenerics> {
  findAll<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params?: FindParams<T, P>): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[]>
  findOne<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(params?: FindOneParams<T, P>): Promise<Project<T['entity'], T['ast'], T['scalars'], P, T['types']> | null>
  findPage<P extends AnyProjection<T['projection']> | GraphQLResolveInfo>(
    params?: FindParams<T, P>,
  ): Promise<{ totalCount: number; records: Project<T['entity'], T['ast'], T['scalars'], P, T['types']>[] }>
  exists(params: FilterParams<T>): Promise<boolean>
  count(params?: FilterParams<T>): Promise<number>
  aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>>
  insertOne(params: InsertParams<T>): Promise<T['insert']>
  updateOne(params: UpdateParams<T>): Promise<void>
  updateAll(params: UpdateParams<T>): Promise<void>
  replaceOne(params: ReplaceParams<T>): Promise<void>
  deleteOne(params: DeleteParams<T>): Promise<void>
  deleteAll(params: DeleteParams<T>): Promise<void>
}

export type CachedTypes<IdFields = any, Model = any, Insert = any, PlainModel = any, Projection = any, Update = any, Filter = any, SortElement = any, RelationsFindParams = any> = {
  idFields: IdFields
  model: Model
  insert: Insert
  plainModel: PlainModel
  projection: Projection
  update: Update
  filter: Filter
  sortElement: SortElement
  relationsFindParams: RelationsFindParams
}
export type DAOGenerics<
  Entity extends string = any,
  AST extends AbstractSyntaxTree = any,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = any,
  Types extends CachedTypes = any,
  MetadataType = any,
  OperationMetadataType = any,
  DriverContextType = any,
  DriverFilterOptions = any,
  DriverFindOptions = any,
  DriverInsertOptions = any,
  DriverUpdateOptions = any,
  DriverReplaceOptions = any,
  DriverDeleteOptions = any,
  EntityManager extends AbstractEntityManager<string, string, Scalars, MetadataType> = AbstractEntityManager<string, string, Scalars, MetadataType>,
> = {
  ast: AST
  entity: Entity
  idFields: IfAny<AST, any, Types['idFields']>
  types: Types
  model: Types['model']
  plainModel: IfAny<AST, any, Types['plainModel']>
  pureFilter: IfAny<AST, any, Types['filter']>
  filter: IfAny<AST, any, (Types['filter'] | AST[Entity]['driverSpecification']['rawFilter']) & LogicalOperators<Types['filter'] | AST[Entity]['driverSpecification']['rawFilter']>>
  rawFilter: IfAny<AST, any, AST[Entity]['driverSpecification']['rawFilter']>
  projection: IfAny<AST, any, Types['projection']>
  pureSort: IfAny<AST, any, Types['sortElement']>
  rawSort: IfAny<AST, any, AST[Entity]['driverSpecification']['rawSorts']>
  sort: IfAny<AST, any, Types['sortElement'][] | AST[Entity]['driverSpecification']['rawSorts']>
  insert: IfAny<AST, any, Types['insert']>
  pureUpdate: IfAny<AST, any, Types['update']>
  rawUpdate: IfAny<AST, any, AST[Entity]['driverSpecification']['rawUpdate']>
  update: IfAny<AST, any, Types['update'] | AST[Entity]['driverSpecification']['rawUpdate']>
  relations: IfAny<AST, any, Types['relationsFindParams']>
  //exludedFields: ExcludedFields
  //relationFields: RelationsFields
  //embeddedFields: EmbeddedFields
  metadata: MetadataType
  operationMetadata: OperationMetadataType
  driverContext: DriverContextType
  scalars: Scalars
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
