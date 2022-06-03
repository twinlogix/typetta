import * as T from '../../src'
import * as types from './models.mock'
import { Knex } from 'knex'
import * as M from 'mongodb'

export type Scalars = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Decimal: { type: types.Scalars['Decimal']; isTextual: false; isQuantitative: false }
  IntAutoInc: { type: types.Scalars['IntAutoInc']; isTextual: false; isQuantitative: false }
  JSON: { type: types.Scalars['JSON']; isTextual: false; isQuantitative: false }
  MongoID: { type: types.Scalars['MongoID']; isTextual: false; isQuantitative: false }
}

export type AST = {
  A: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'MongoID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  B: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  C: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  D: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'IntAutoInc'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  E: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  F: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
}

export function aSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'MongoID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type ADAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'A', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ADAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryADAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type AInsert = T.Insert<'A', AST, Scalars>
export type AInsertResult = T.GenerateModel<'A', AST, Scalars, 'relation'>
export type AProjection = T.Projection<'A', AST>
export type AParams<P extends AProjection> = T.Params<'A', AST, Scalars, P>
export type AUpdate = T.Update<'A', AST, Scalars>
export type AFilter = T.Filter<'A', AST, Scalars>
export type ASortElement = T.SortElement<'A', AST>

export class ADAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'A', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'A', AST>, P2 extends T.Projection<'A', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'A', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'A', AST>, P1, P2>
  }
  public constructor(params: ADAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: aSchema(),
    })
  }
}

export class InMemoryADAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'A', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'A', AST>, P2 extends T.Projection<'A', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'A', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'A', AST>, P1, P2>
  }
  public constructor(params: InMemoryADAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: aSchema(),
    })
  }
}
export function bSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type BDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'B', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type BDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryBDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export type BInsert = T.Insert<'B', AST, Scalars>
export type BInsertResult = T.GenerateModel<'B', AST, Scalars, 'relation'>
export type BProjection = T.Projection<'B', AST>
export type BParams<P extends BProjection> = T.Params<'B', AST, Scalars, P>
export type BUpdate = T.Update<'B', AST, Scalars>
export type BFilter = T.Filter<'B', AST, Scalars>
export type BSortElement = T.SortElement<'B', AST>

export class BDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'B', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'B', AST>, P2 extends T.Projection<'B', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'B', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'B', AST>, P1, P2>
  }
  public constructor(params: BDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bSchema(),
    })
  }
}

export class InMemoryBDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'B', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'B', AST>, P2 extends T.Projection<'B', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'B', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'B', AST>, P1, P2>
  }
  public constructor(params: InMemoryBDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bSchema(),
    })
  }
}
export function cSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type CDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'C', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type CDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryCDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type CInsert = T.Insert<'C', AST, Scalars>
export type CInsertResult = T.GenerateModel<'C', AST, Scalars, 'relation'>
export type CProjection = T.Projection<'C', AST>
export type CParams<P extends CProjection> = T.Params<'C', AST, Scalars, P>
export type CUpdate = T.Update<'C', AST, Scalars>
export type CFilter = T.Filter<'C', AST, Scalars>
export type CSortElement = T.SortElement<'C', AST>

export class CDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'C', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'C', AST>, P2 extends T.Projection<'C', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'C', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'C', AST>, P1, P2>
  }
  public constructor(params: CDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: cSchema(),
    })
  }
}

export class InMemoryCDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'C', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'C', AST>, P2 extends T.Projection<'C', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'C', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'C', AST>, P1, P2>
  }
  public constructor(params: InMemoryCDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: cSchema(),
    })
  }
}
export function dSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'IntAutoInc',
      isId: true,
      generationStrategy: 'db',
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type DDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<'D', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type DDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryDDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type DInsert = T.Insert<'D', AST, Scalars>
export type DInsertResult = T.GenerateModel<'D', AST, Scalars, 'relation'>
export type DProjection = T.Projection<'D', AST>
export type DParams<P extends DProjection> = T.Params<'D', AST, Scalars, P>
export type DUpdate = T.Update<'D', AST, Scalars>
export type DFilter = T.Filter<'D', AST, Scalars>
export type DSortElement = T.SortElement<'D', AST>

export class DDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'D', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'D', AST>, P2 extends T.Projection<'D', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'D', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'D', AST>, P1, P2>
  }
  public constructor(params: DDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dSchema(),
    })
  }
}

export class InMemoryDDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'D', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'D', AST>, P2 extends T.Projection<'D', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'D', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'D', AST>, P1, P2>
  }
  public constructor(params: InMemoryDDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dSchema(),
    })
  }
}
export function eSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type EDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<'E', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type EDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryEDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export type EInsert = T.Insert<'E', AST, Scalars>
export type EInsertResult = T.GenerateModel<'E', AST, Scalars, 'relation'>
export type EProjection = T.Projection<'E', AST>
export type EParams<P extends EProjection> = T.Params<'E', AST, Scalars, P>
export type EUpdate = T.Update<'E', AST, Scalars>
export type EFilter = T.Filter<'E', AST, Scalars>
export type ESortElement = T.SortElement<'E', AST>

export class EDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'E', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'E', AST>, P2 extends T.Projection<'E', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'E', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'E', AST>, P1, P2>
  }
  public constructor(params: EDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eSchema(),
    })
  }
}

export class InMemoryEDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'E', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'E', AST>, P2 extends T.Projection<'E', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'E', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'E', AST>, P1, P2>
  }
  public constructor(params: InMemoryEDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eSchema(),
    })
  }
}
export function fSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type FDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<'F', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type FDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryFDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type FInsert = T.Insert<'F', AST, Scalars>
export type FInsertResult = T.GenerateModel<'F', AST, Scalars, 'relation'>
export type FProjection = T.Projection<'F', AST>
export type FParams<P extends FProjection> = T.Params<'F', AST, Scalars, P>
export type FUpdate = T.Update<'F', AST, Scalars>
export type FFilter = T.Filter<'F', AST, Scalars>
export type FSortElement = T.SortElement<'F', AST>

export class FDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'F', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'F', AST>, P2 extends T.Projection<'F', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'F', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'F', AST>, P1, P2>
  }
  public constructor(params: FDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: fSchema(),
    })
  }
}

export class InMemoryFDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'F', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'F', AST>, P2 extends T.Projection<'F', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'F', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'F', AST>, P1, P2>
  }
  public constructor(params: InMemoryFDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: fSchema(),
    })
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    a?: Pick<Partial<ADAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    b?: Pick<Partial<BDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    c?: Pick<Partial<CDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    d?: Pick<Partial<DDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    e?: Pick<Partial<EDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    f?: Pick<Partial<FDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  }
  mongodb: Record<'a' | 'default', M.Db | 'mock'>
  knex: Record<'default', Knex | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'both'>
  log?: T.LogInput<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'a' | 'default', 'default', Scalars, MetadataType> {
  private _a: ADAO<MetadataType, OperationMetadataType> | undefined
  private _b: BDAO<MetadataType, OperationMetadataType> | undefined
  private _c: CDAO<MetadataType, OperationMetadataType> | undefined
  private _d: DDAO<MetadataType, OperationMetadataType> | undefined
  private _e: EDAO<MetadataType, OperationMetadataType> | undefined
  private _f: FDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'a' | 'default', M.Db | 'mock'>
  private knex: Record<'default', Knex | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>

  get a(): ADAO<MetadataType, OperationMetadataType> {
    if (!this._a) {
      const db = this.mongodb.a
      this._a =
        db === 'mock'
          ? (new InMemoryADAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.a,
              middlewares: [...(this.overrides?.a?.middlewares || []), ...(selectMiddleware('a', this.middlewares) as T.DAOMiddleware<ADAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'A',
              logger: this.logger,
            }) as unknown as ADAO<MetadataType, OperationMetadataType>)
          : new ADAO({
              entityManager: this,
              datasource: 'a',
              metadata: this.metadata,
              ...this.overrides?.a,
              collection: db.collection('as'),
              middlewares: [...(this.overrides?.a?.middlewares || []), ...(selectMiddleware('a', this.middlewares) as T.DAOMiddleware<ADAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'A',
              logger: this.logger,
            })
    }
    return this._a
  }
  get b(): BDAO<MetadataType, OperationMetadataType> {
    if (!this._b) {
      const db = this.mongodb.default
      this._b =
        db === 'mock'
          ? (new InMemoryBDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.b,
              middlewares: [...(this.overrides?.b?.middlewares || []), ...(selectMiddleware('b', this.middlewares) as T.DAOMiddleware<BDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'B',
              logger: this.logger,
            }) as unknown as BDAO<MetadataType, OperationMetadataType>)
          : new BDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.b,
              collection: db.collection('bs'),
              middlewares: [...(this.overrides?.b?.middlewares || []), ...(selectMiddleware('b', this.middlewares) as T.DAOMiddleware<BDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'B',
              logger: this.logger,
            })
    }
    return this._b
  }
  get c(): CDAO<MetadataType, OperationMetadataType> {
    if (!this._c) {
      const db = this.mongodb.default
      this._c =
        db === 'mock'
          ? (new InMemoryCDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.c,
              middlewares: [...(this.overrides?.c?.middlewares || []), ...(selectMiddleware('c', this.middlewares) as T.DAOMiddleware<CDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'C',
              logger: this.logger,
            }) as unknown as CDAO<MetadataType, OperationMetadataType>)
          : new CDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.c,
              collection: db.collection('cs'),
              middlewares: [...(this.overrides?.c?.middlewares || []), ...(selectMiddleware('c', this.middlewares) as T.DAOMiddleware<CDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'C',
              logger: this.logger,
            })
    }
    return this._c
  }
  get d(): DDAO<MetadataType, OperationMetadataType> {
    if (!this._d) {
      const db = this.knex.default
      this._d =
        db === 'mock'
          ? (new InMemoryDDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.d,
              middlewares: [...(this.overrides?.d?.middlewares || []), ...(selectMiddleware('d', this.middlewares) as T.DAOMiddleware<DDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'D',
              logger: this.logger,
            }) as unknown as DDAO<MetadataType, OperationMetadataType>)
          : new DDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.d,
              knex: db,
              tableName: 'ds',
              middlewares: [...(this.overrides?.d?.middlewares || []), ...(selectMiddleware('d', this.middlewares) as T.DAOMiddleware<DDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'D',
              logger: this.logger,
            })
    }
    return this._d
  }
  get e(): EDAO<MetadataType, OperationMetadataType> {
    if (!this._e) {
      const db = this.knex.default
      this._e =
        db === 'mock'
          ? (new InMemoryEDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.e,
              middlewares: [...(this.overrides?.e?.middlewares || []), ...(selectMiddleware('e', this.middlewares) as T.DAOMiddleware<EDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'E',
              logger: this.logger,
            }) as unknown as EDAO<MetadataType, OperationMetadataType>)
          : new EDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.e,
              knex: db,
              tableName: 'es',
              middlewares: [...(this.overrides?.e?.middlewares || []), ...(selectMiddleware('e', this.middlewares) as T.DAOMiddleware<EDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'E',
              logger: this.logger,
            })
    }
    return this._e
  }
  get f(): FDAO<MetadataType, OperationMetadataType> {
    if (!this._f) {
      const db = this.knex.default
      this._f =
        db === 'mock'
          ? (new InMemoryFDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.f,
              middlewares: [...(this.overrides?.f?.middlewares || []), ...(selectMiddleware('f', this.middlewares) as T.DAOMiddleware<FDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'F',
              logger: this.logger,
            }) as unknown as FDAO<MetadataType, OperationMetadataType>)
          : new FDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.f,
              knex: db,
              tableName: 'fs',
              middlewares: [...(this.overrides?.f?.middlewares || []), ...(selectMiddleware('f', this.middlewares) as T.DAOMiddleware<FDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'F',
              logger: this.logger,
            })
    }
    return this._f
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Decimal', 'IntAutoInc', 'JSON', 'MongoID', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined,
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.knex = params.knex
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if (params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others
        ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map((k) => [k, true])) as any, securityMiddlewares.others as any)]
        : []
      this.middlewares = [
        ...(params.middlewares ?? []),
        ...defaultMiddleware,
        ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({ [name]: true } as any, middleware as any)),
      ]
    }
    this.params = params
  }

  public async execQuery<T>(
    run: (
      dbs: { mongodb: Record<'a' | 'default', M.Db | 'mock'>; knex: Record<'default', Knex | 'mock'> },
      entities: {
        a: M.Collection<M.Document> | null
        b: M.Collection<M.Document> | null
        c: M.Collection<M.Document> | null
        d: Knex.QueryBuilder<any, unknown[]> | null
        e: Knex.QueryBuilder<any, unknown[]> | null
        f: Knex.QueryBuilder<any, unknown[]> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { mongodb: this.mongodb, knex: this.knex },
      {
        a: this.mongodb.a === 'mock' ? null : this.mongodb.a.collection('as'),
        b: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('bs'),
        c: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('cs'),
        d: this.knex.default === 'mock' ? null : this.knex.default.table('ds'),
        e: this.knex.default === 'mock' ? null : this.knex.default.table('es'),
        f: this.knex.default === 'mock' ? null : this.knex.default.table('fs'),
      },
    )
  }

  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }

  public async createTables(args: { typeMap?: Partial<Record<keyof Scalars, { singleType: string; arrayType?: string }>>; defaultType: { singleType: string; arrayType?: string } }): Promise<void> {
    this.d.createTable(args.typeMap ?? {}, args.defaultType)
    this.e.createTable(args.typeMap ?? {}, args.defaultType)
    this.f.createTable(args.typeMap ?? {}, args.defaultType)
  }
}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  a: ADAOGenerics<MetadataType, OperationMetadataType>
  b: BDAOGenerics<MetadataType, OperationMetadataType>
  c: CDAOGenerics<MetadataType, OperationMetadataType>
  d: DDAOGenerics<MetadataType, OperationMetadataType>
  e: EDAOGenerics<MetadataType, OperationMetadataType>
  f: FDAOGenerics<MetadataType, OperationMetadataType>
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
