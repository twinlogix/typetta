/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AbstractScalars,
  AbstractSyntaxTree,
  DefaultModelScalars,
  EqualityOperators,
  Expand,
  Filter,
  GenerateModel,
  IdFields,
  Insert,
  LogicalOperators,
  Project,
  Projection,
  QuantityOperators,
  SortDirection,
  SortElement,
  TypeTraversal,
  Update,
} from '../..'
import { OmitNever } from '../../utils/utils.types'
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

export type Relations<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = Partial<
  OmitNever<{
    [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K] extends { astName: infer ASTName; type: infer Type }
      ? ASTName extends string
        ? Type extends 'relation'
          ? {
              filter?: Filter<ASTName, AST, Scalars> | AST[Entity]['driverSpecification']['rawFilter']
              sorts?: SortElement<ASTName, AST>[] | AST[Entity]['driverSpecification']['rawSorts']
              skip?: number
              limit?: number
              relations?: Relations<ASTName, AST, Scalars>
            }
          : never
        : never
      : never
  }>
>

export type FilterParams<T extends DAOGenerics> = {
  filter?: T['filter'] & LogicalOperators<T['filter']> 
  relations?: T['relations']
} & OperationParams<T>

export type FindOneParams<T extends DAOGenerics, P = T['projection']> = Omit<FilterParams<T>, 'options'> & {
  projection?: P
  info?: GraphQLResolveInfo
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
    : ({ [K in keyof A['by']]: K extends string ? TypeTraversal<T['insert'], K> : K extends keyof T['insert'] ? T['insert'][K] : never } & {
        [K in keyof A['aggregations']]: A['aggregations'][K]['operation'] extends 'count' ? number : number | null
      })[]
>

export type DAOParams<T extends DAOGenerics> = {
  idGenerator?: () => Required<{ [K in T['idFields']]: K extends keyof T['insert'] ? T['insert'][K] : never }>
  entityManager: AbstractEntityManager<string, string, T['scalars'], T['metadata']>
  schema: Schema<T['scalars']>
  metadata?: T['metadata']
  driverContext: T['driverContext']
  pageSize?: number
  middlewares?: DAOMiddleware<T>[]
  logger?: LogFunction<T['entity']>
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
  findAll<P extends AnyProjection<T['projection']>>(params?: FindParams<T, P>): Promise<Project<T['entity'], T['ast'], T['scalars'], P>[]>
  findOne<P extends AnyProjection<T['projection']>>(params?: FindOneParams<T, P>): Promise<Project<T['entity'], T['ast'], T['scalars'], P> | null>
  findPage<P extends AnyProjection<T['projection']>>(params?: FindParams<T, P>): Promise<{ totalCount: number; records: Project<T['entity'], T['ast'], T['scalars'], P>[] }>
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

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
export type DAOGenerics<
  Entity extends string = any,
  AST extends AbstractSyntaxTree = any,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = any,
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
  idFields: IfAny<AST, any, IdFields<Entity, AST>>
  model: IfAny<AST, any, GenerateModel<Entity, AST, Scalars, 'relation'>>
  pureFilter: IfAny<AST, any, Filter<Entity, AST, Scalars>>
  filter: IfAny<AST, any, Filter<Entity, AST, Scalars> | AST[Entity]['driverSpecification']['rawFilter']>
  rawFilter: IfAny<AST, any, AST[Entity]['driverSpecification']['rawFilter']>
  projection: IfAny<AST, any, Projection<Entity, AST>>
  pureSort: IfAny<AST, any, SortElement<Entity, AST>>
  rawSort: IfAny<AST, any, AST[Entity]['driverSpecification']['rawSorts']>
  sort: IfAny<AST, any, SortElement<Entity, AST>[] | AST[Entity]['driverSpecification']['rawSorts']>
  insert: IfAny<AST, any, Insert<Entity, AST, Scalars>>
  pureUpdate: IfAny<AST, any, Update<Entity, AST, Scalars>>
  rawUpdate: IfAny<AST, any, AST[Entity]['driverSpecification']['rawUpdate']>
  update: IfAny<AST, any, Update<Entity, AST, Scalars> | AST[Entity]['driverSpecification']['rawUpdate']>
  relations: IfAny<AST, any, Relations<Entity, AST, Scalars>>
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
