import * as T from '../../src'
import * as types from './models.mock'
import { Knex } from 'knex'
import * as M from 'mongodb'

export type AExcludedFields = never
export type ARelationFields = never

export function aSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'MongoID',
      isId: true,
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

type AFilterFields = {
  id?: types.Scalars['MongoID'] | null | T.EqualityOperators<types.Scalars['MongoID']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type AFilter = AFilterFields & T.LogicalOperators<AFilterFields | ARawFilter>
export type ARawFilter = () => M.Filter<M.Document>

export type ARelations = Record<never, string>

export type AProjection = {
  id?: boolean
  value?: boolean
}
export type AParam<P extends AProjection> = T.ParamProjection<types.A, AProjection, P>

export type ASortKeys = 'id' | 'value'
export type ASort = Partial<Record<ASortKeys, T.SortDirection>>
export type ARawSort = () => M.Sort

export type AUpdate = {
  id?: types.Scalars['MongoID']
  value?: types.Scalars['Int']
}
export type ARawUpdate = () => M.UpdateFilter<M.Document>

export type AInsert = {
  value: types.Scalars['Int']
}

type ADAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.A,
  'id',
  'MongoID',
  AFilter,
  ARawFilter,
  ARelations,
  AProjection,
  ASort,
  ARawSort,
  AInsert,
  AUpdate,
  ARawUpdate,
  AExcludedFields,
  ARelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'a',
  EntityManager<MetadataType, OperationMetadataType>
>
export type ADAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryADAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class ADAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AProjection, P2 extends AProjection>(p1: P1, p2: P2): T.SelectProjection<AProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AProjection, P1, P2>
  }

  public constructor(params: ADAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: aSchema(),
      idGeneration: 'db',
      idScalar: 'MongoID',
    })
  }
}

export class InMemoryADAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AProjection, P2 extends AProjection>(p1: P1, p2: P2): T.SelectProjection<AProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AProjection, P1, P2>
  }

  public constructor(params: InMemoryADAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: aSchema(),
      idGeneration: 'db',
      idScalar: 'MongoID',
    })
  }
}

export type BExcludedFields = never
export type BRelationFields = never

export function bSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type BFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type BFilter = BFilterFields & T.LogicalOperators<BFilterFields | BRawFilter>
export type BRawFilter = () => M.Filter<M.Document>

export type BRelations = Record<never, string>

export type BProjection = {
  id?: boolean
  value?: boolean
}
export type BParam<P extends BProjection> = T.ParamProjection<types.B, BProjection, P>

export type BSortKeys = 'id' | 'value'
export type BSort = Partial<Record<BSortKeys, T.SortDirection>>
export type BRawSort = () => M.Sort

export type BUpdate = {
  id?: types.Scalars['ID']
  value?: types.Scalars['Int']
}
export type BRawUpdate = () => M.UpdateFilter<M.Document>

export type BInsert = {
  id?: null | types.Scalars['ID']
  value: types.Scalars['Int']
}

type BDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.B,
  'id',
  'ID',
  BFilter,
  BRawFilter,
  BRelations,
  BProjection,
  BSort,
  BRawSort,
  BInsert,
  BUpdate,
  BRawUpdate,
  BExcludedFields,
  BRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'b',
  EntityManager<MetadataType, OperationMetadataType>
>
export type BDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryBDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class BDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends BProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends BProjection, P2 extends BProjection>(p1: P1, p2: P2): T.SelectProjection<BProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<BProjection, P1, P2>
  }

  public constructor(params: BDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: bSchema(),
      idGeneration: 'generator',
      idScalar: 'ID',
    })
  }
}

export class InMemoryBDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends BProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends BProjection, P2 extends BProjection>(p1: P1, p2: P2): T.SelectProjection<BProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<BProjection, P1, P2>
  }

  public constructor(params: InMemoryBDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: bSchema(),
      idGeneration: 'generator',
      idScalar: 'ID',
    })
  }
}

export type CExcludedFields = never
export type CRelationFields = never

export function cSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type CFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type CFilter = CFilterFields & T.LogicalOperators<CFilterFields | CRawFilter>
export type CRawFilter = () => M.Filter<M.Document>

export type CRelations = Record<never, string>

export type CProjection = {
  id?: boolean
  value?: boolean
}
export type CParam<P extends CProjection> = T.ParamProjection<types.C, CProjection, P>

export type CSortKeys = 'id' | 'value'
export type CSort = Partial<Record<CSortKeys, T.SortDirection>>
export type CRawSort = () => M.Sort

export type CUpdate = {
  id?: types.Scalars['ID']
  value?: types.Scalars['Int']
}
export type CRawUpdate = () => M.UpdateFilter<M.Document>

export type CInsert = {
  id: types.Scalars['ID']
  value: types.Scalars['Int']
}

type CDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.C,
  'id',
  'ID',
  CFilter,
  CRawFilter,
  CRelations,
  CProjection,
  CSort,
  CRawSort,
  CInsert,
  CUpdate,
  CRawUpdate,
  CExcludedFields,
  CRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'c',
  EntityManager<MetadataType, OperationMetadataType>
>
export type CDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryCDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class CDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends CProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends CProjection, P2 extends CProjection>(p1: P1, p2: P2): T.SelectProjection<CProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<CProjection, P1, P2>
  }

  public constructor(params: CDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: cSchema(),
      idGeneration: 'user',
      idScalar: 'ID',
    })
  }
}

export class InMemoryCDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends CProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends CProjection, P2 extends CProjection>(p1: P1, p2: P2): T.SelectProjection<CProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<CProjection, P1, P2>
  }

  public constructor(params: InMemoryCDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: cSchema(),
      idGeneration: 'user',
      idScalar: 'ID',
    })
  }
}

export type DExcludedFields = never
export type DRelationFields = never

export function dSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'IntAutoInc',
      isId: true,
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type DFilterFields = {
  id?: types.Scalars['IntAutoInc'] | null | T.EqualityOperators<types.Scalars['IntAutoInc']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type DFilter = DFilterFields & T.LogicalOperators<DFilterFields | DRawFilter>
export type DRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DRelations = Record<never, string>

export type DProjection = {
  id?: boolean
  value?: boolean
}
export type DParam<P extends DProjection> = T.ParamProjection<types.D, DProjection, P>

export type DSortKeys = 'id' | 'value'
export type DSort = Partial<Record<DSortKeys, T.SortDirection>>
export type DRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DUpdate = {
  id?: types.Scalars['IntAutoInc']
  value?: types.Scalars['Int']
}
export type DRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DInsert = {
  value: types.Scalars['Int']
}

type DDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.D,
  'id',
  'IntAutoInc',
  DFilter,
  DRawFilter,
  DRelations,
  DProjection,
  DSort,
  DRawSort,
  DInsert,
  DUpdate,
  DRawUpdate,
  DExcludedFields,
  DRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'd',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryDDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DProjection, P2 extends DProjection>(p1: P1, p2: P2): T.SelectProjection<DProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DProjection, P1, P2>
  }

  public constructor(params: DDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: dSchema(),
      idGeneration: 'db',
      idScalar: 'IntAutoInc',
    })
  }
}

export class InMemoryDDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DProjection, P2 extends DProjection>(p1: P1, p2: P2): T.SelectProjection<DProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DProjection, P1, P2>
  }

  public constructor(params: InMemoryDDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: dSchema(),
      idGeneration: 'db',
      idScalar: 'IntAutoInc',
    })
  }
}

export type EExcludedFields = never
export type ERelationFields = never

export function eSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type EFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type EFilter = EFilterFields & T.LogicalOperators<EFilterFields | ERawFilter>
export type ERawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type ERelations = Record<never, string>

export type EProjection = {
  id?: boolean
  value?: boolean
}
export type EParam<P extends EProjection> = T.ParamProjection<types.E, EProjection, P>

export type ESortKeys = 'id' | 'value'
export type ESort = Partial<Record<ESortKeys, T.SortDirection>>
export type ERawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type EUpdate = {
  id?: types.Scalars['ID']
  value?: types.Scalars['Int']
}
export type ERawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type EInsert = {
  id?: null | types.Scalars['ID']
  value: types.Scalars['Int']
}

type EDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.E,
  'id',
  'ID',
  EFilter,
  ERawFilter,
  ERelations,
  EProjection,
  ESort,
  ERawSort,
  EInsert,
  EUpdate,
  ERawUpdate,
  EExcludedFields,
  ERelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'e',
  EntityManager<MetadataType, OperationMetadataType>
>
export type EDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryEDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class EDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EProjection, P2 extends EProjection>(p1: P1, p2: P2): T.SelectProjection<EProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EProjection, P1, P2>
  }

  public constructor(params: EDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: eSchema(),
      idGeneration: 'generator',
      idScalar: 'ID',
    })
  }
}

export class InMemoryEDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EProjection, P2 extends EProjection>(p1: P1, p2: P2): T.SelectProjection<EProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EProjection, P1, P2>
  }

  public constructor(params: InMemoryEDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: eSchema(),
      idGeneration: 'generator',
      idScalar: 'ID',
    })
  }
}

export type FExcludedFields = never
export type FRelationFields = never

export function fSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      required: true,
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type FFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  value?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type FFilter = FFilterFields & T.LogicalOperators<FFilterFields | FRawFilter>
export type FRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FRelations = Record<never, string>

export type FProjection = {
  id?: boolean
  value?: boolean
}
export type FParam<P extends FProjection> = T.ParamProjection<types.F, FProjection, P>

export type FSortKeys = 'id' | 'value'
export type FSort = Partial<Record<FSortKeys, T.SortDirection>>
export type FRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FUpdate = {
  id?: types.Scalars['ID']
  value?: types.Scalars['Int']
}
export type FRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FInsert = {
  id: types.Scalars['ID']
  value: types.Scalars['Int']
}

type FDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.F,
  'id',
  'ID',
  FFilter,
  FRawFilter,
  FRelations,
  FProjection,
  FSort,
  FRawSort,
  FInsert,
  FUpdate,
  FRawUpdate,
  FExcludedFields,
  FRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'f',
  EntityManager<MetadataType, OperationMetadataType>
>
export type FDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryFDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class FDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends FProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends FProjection, P2 extends FProjection>(p1: P1, p2: P2): T.SelectProjection<FProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<FProjection, P1, P2>
  }

  public constructor(params: FDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: fSchema(),
      idGeneration: 'user',
      idScalar: 'ID',
    })
  }
}

export class InMemoryFDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends FProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends FProjection, P2 extends FProjection>(p1: P1, p2: P2): T.SelectProjection<FProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<FProjection, P1, P2>
  }

  public constructor(params: InMemoryFDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      idField: 'id',
      schema: fSchema(),
      idGeneration: 'user',
      idScalar: 'ID',
    })
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
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
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'both'>
  log?: T.LogInput<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends object = never> extends T.AbstractEntityManager<
  'a' | 'default',
  'default',
  types.Scalars,
  MetadataType
> {
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

  private logger?: T.LogFunction<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>

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
              name: 'a',
              logger: this.logger,
            }) as unknown as ADAO<MetadataType, OperationMetadataType>)
          : new ADAO({
              entityManager: this,
              datasource: 'a',
              metadata: this.metadata,
              ...this.overrides?.a,
              collection: db.collection('as'),
              middlewares: [...(this.overrides?.a?.middlewares || []), ...(selectMiddleware('a', this.middlewares) as T.DAOMiddleware<ADAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'a',
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
              name: 'b',
              logger: this.logger,
            }) as unknown as BDAO<MetadataType, OperationMetadataType>)
          : new BDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.b,
              collection: db.collection('bs'),
              middlewares: [...(this.overrides?.b?.middlewares || []), ...(selectMiddleware('b', this.middlewares) as T.DAOMiddleware<BDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'b',
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
              name: 'c',
              logger: this.logger,
            }) as unknown as CDAO<MetadataType, OperationMetadataType>)
          : new CDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.c,
              collection: db.collection('cs'),
              middlewares: [...(this.overrides?.c?.middlewares || []), ...(selectMiddleware('c', this.middlewares) as T.DAOMiddleware<CDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'c',
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
              name: 'd',
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
              name: 'd',
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
              name: 'e',
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
              name: 'e',
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
              name: 'f',
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
              name: 'f',
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

  public async createTables(args: {
    typeMap?: Partial<Record<keyof types.Scalars, { singleType: string; arrayType?: string }>>
    defaultType: { singleType: string; arrayType?: string }
  }): Promise<void> {
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
