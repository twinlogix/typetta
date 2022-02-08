import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger, ParamProjection } from '../../src';
import * as types from './models.mock';
import { KnexJsDAOGenerics, KnexJsDAOParams, AbstractKnexJsDAO } from '../../src';
import { Knex } from 'knex';
import { MongoDBDAOGenerics, MongoDBDAOParams, AbstractMongoDBDAO, inMemoryMongoDb } from '../../src';
import { Collection, Db, Filter, Sort, UpdateFilter, Document } from 'mongodb';

//--------------------------------------------------------------------------------
//-------------------------------------- A ---------------------------------------
//--------------------------------------------------------------------------------

export type AExcludedFields = never
export type ARelationFields = never

export const aSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'MongoID', 
    required: true, 
    alias: '_id'
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type AFilterFields = {
  'id'?: types.Scalars['MongoID'] | null | EqualityOperators<types.Scalars['MongoID']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type AFilter = AFilterFields & LogicalOperators<AFilterFields | ARawFilter>
export type ARawFilter = () => Filter<Document>

export type ARelations = Record<never, string>

export type AProjection = {
  id?: boolean,
  value?: boolean,
}
export type AParams<P extends AProjection> = ParamProjection<types.A, AProjection, P>

export type ASortKeys = 'id' | 'value';
export type ASort = OneKey<ASortKeys, SortDirection>;
export type ARawSort = () => Sort

export type AUpdate = {
  'id'?: types.Scalars['MongoID'],
  'value'?: types.Scalars['Int']
};
export type ARawUpdate = () => UpdateFilter<Document>

export type AInsert = {
  value: types.Scalars['Int'],
};

type ADAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.A, 'id', 'MongoID', 'db', AFilter, ARawFilter, ARelations, AProjection, ASort, ARawSort, AInsert, AUpdate, ARawUpdate, AExcludedFields, ARelationFields, MetadataType, OperationMetadataType, types.Scalars, 'a'>;
export type ADAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class ADAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: ADAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: aSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'MongoID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//-------------------------------------- B ---------------------------------------
//--------------------------------------------------------------------------------

export type BExcludedFields = never
export type BRelationFields = never

export const bSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type BFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type BFilter = BFilterFields & LogicalOperators<BFilterFields | BRawFilter>
export type BRawFilter = () => Filter<Document>

export type BRelations = Record<never, string>

export type BProjection = {
  id?: boolean,
  value?: boolean,
}
export type BParams<P extends BProjection> = ParamProjection<types.B, BProjection, P>

export type BSortKeys = 'id' | 'value';
export type BSort = OneKey<BSortKeys, SortDirection>;
export type BRawSort = () => Sort

export type BUpdate = {
  'id'?: types.Scalars['ID'],
  'value'?: types.Scalars['Int']
};
export type BRawUpdate = () => UpdateFilter<Document>

export type BInsert = {
  id?: types.Scalars['ID'],
  value: types.Scalars['Int'],
};

type BDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.B, 'id', 'ID', 'generator', BFilter, BRawFilter, BRelations, BProjection, BSort, BRawSort, BInsert, BUpdate, BRawUpdate, BExcludedFields, BRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'b'>;
export type BDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class BDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: BDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: bSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//-------------------------------------- C ---------------------------------------
//--------------------------------------------------------------------------------

export type CExcludedFields = never
export type CRelationFields = never

export const cSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type CFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type CFilter = CFilterFields & LogicalOperators<CFilterFields | CRawFilter>
export type CRawFilter = () => Filter<Document>

export type CRelations = Record<never, string>

export type CProjection = {
  id?: boolean,
  value?: boolean,
}
export type CParams<P extends CProjection> = ParamProjection<types.C, CProjection, P>

export type CSortKeys = 'id' | 'value';
export type CSort = OneKey<CSortKeys, SortDirection>;
export type CRawSort = () => Sort

export type CUpdate = {
  'id'?: types.Scalars['ID'],
  'value'?: types.Scalars['Int']
};
export type CRawUpdate = () => UpdateFilter<Document>

export type CInsert = {
  id: types.Scalars['ID'],
  value: types.Scalars['Int'],
};

type CDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.C, 'id', 'ID', 'user', CFilter, CRawFilter, CRelations, CProjection, CSort, CRawSort, CInsert, CUpdate, CRawUpdate, CExcludedFields, CRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'c'>;
export type CDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class CDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: CDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: cSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//-------------------------------------- D ---------------------------------------
//--------------------------------------------------------------------------------

export type DExcludedFields = never
export type DRelationFields = never

export const dSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'IntAutoInc', 
    required: true
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type DFilterFields = {
  'id'?: types.Scalars['IntAutoInc'] | null | EqualityOperators<types.Scalars['IntAutoInc']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type DFilter = DFilterFields & LogicalOperators<DFilterFields | DRawFilter>
export type DRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DRelations = Record<never, string>

export type DProjection = {
  id?: boolean,
  value?: boolean,
}
export type DParams<P extends DProjection> = ParamProjection<types.D, DProjection, P>

export type DSortKeys = 'id' | 'value';
export type DSort = OneKey<DSortKeys, SortDirection>;
export type DRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DUpdate = {
  'id'?: types.Scalars['IntAutoInc'],
  'value'?: types.Scalars['Int']
};
export type DRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DInsert = {
  value: types.Scalars['Int'],
};

type DDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.D, 'id', 'IntAutoInc', 'db', DFilter, DRawFilter, DRelations, DProjection, DSort, DRawSort, DInsert, DUpdate, DRawUpdate, DExcludedFields, DRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'd'>;
export type DDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: DDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: dSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'IntAutoInc' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//-------------------------------------- E ---------------------------------------
//--------------------------------------------------------------------------------

export type EExcludedFields = never
export type ERelationFields = never

export const eSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type EFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type EFilter = EFilterFields & LogicalOperators<EFilterFields | ERawFilter>
export type ERawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type ERelations = Record<never, string>

export type EProjection = {
  id?: boolean,
  value?: boolean,
}
export type EParams<P extends EProjection> = ParamProjection<types.E, EProjection, P>

export type ESortKeys = 'id' | 'value';
export type ESort = OneKey<ESortKeys, SortDirection>;
export type ERawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type EUpdate = {
  'id'?: types.Scalars['ID'],
  'value'?: types.Scalars['Int']
};
export type ERawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type EInsert = {
  id?: types.Scalars['ID'],
  value: types.Scalars['Int'],
};

type EDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.E, 'id', 'ID', 'generator', EFilter, ERawFilter, ERelations, EProjection, ESort, ERawSort, EInsert, EUpdate, ERawUpdate, EExcludedFields, ERelationFields, MetadataType, OperationMetadataType, types.Scalars, 'e'>;
export type EDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class EDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: EDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: eSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//-------------------------------------- F ---------------------------------------
//--------------------------------------------------------------------------------

export type FExcludedFields = never
export type FRelationFields = never

export const fSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'value': {
    scalar: 'Int', 
    required: true
  }
};

type FFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'value'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type FFilter = FFilterFields & LogicalOperators<FFilterFields | FRawFilter>
export type FRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FRelations = Record<never, string>

export type FProjection = {
  id?: boolean,
  value?: boolean,
}
export type FParams<P extends FProjection> = ParamProjection<types.F, FProjection, P>

export type FSortKeys = 'id' | 'value';
export type FSort = OneKey<FSortKeys, SortDirection>;
export type FRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FUpdate = {
  'id'?: types.Scalars['ID'],
  'value'?: types.Scalars['Int']
};
export type FRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FInsert = {
  id: types.Scalars['ID'],
  value: types.Scalars['Int'],
};

type FDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.F, 'id', 'ID', 'user', FFilter, FRawFilter, FRelations, FProjection, FSort, FRawSort, FInsert, FUpdate, FRawUpdate, FExcludedFields, FRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'f'>;
export type FDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class FDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: FDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: fSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  middlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    a?: Pick<Partial<ADAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    b?: Pick<Partial<BDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    c?: Pick<Partial<CDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    d?: Pick<Partial<DDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    e?: Pick<Partial<EDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    f?: Pick<Partial<FDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  },
  mongo: Record<'a' | 'default', Db>,
  knex: Record<'default', Knex>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'both'>,
  log?: LogInput<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>
};

type DAOContextMiddleware<MetadataType = never, OperationMetadataType = never> = DAOMiddleware<ADAOGenerics<MetadataType, OperationMetadataType> | BDAOGenerics<MetadataType, OperationMetadataType> | CDAOGenerics<MetadataType, OperationMetadataType> | DDAOGenerics<MetadataType, OperationMetadataType> | EDAOGenerics<MetadataType, OperationMetadataType> | FDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = never, OperationMetadataType = never> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _a: ADAO<MetadataType, OperationMetadataType> | undefined;
  private _b: BDAO<MetadataType, OperationMetadataType> | undefined;
  private _c: CDAO<MetadataType, OperationMetadataType> | undefined;
  private _d: DDAO<MetadataType, OperationMetadataType> | undefined;
  private _e: EDAO<MetadataType, OperationMetadataType> | undefined;
  private _f: FDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private mongo: Record<'a' | 'default', Db>;
  private knex: Record<'default', Knex>;
  
  private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: LogFunction<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>
  
  get a() {
    if(!this._a) {
      this._a = new ADAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.a, collection: this.mongo.a.collection('as'), middlewares: [...(this.overrides?.a?.middlewares || []), ...selectMiddleware('a', this.middlewares) as DAOMiddleware<ADAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'a', logger: this.logger });
    }
    return this._a;
  }
  get b() {
    if(!this._b) {
      this._b = new BDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.b, collection: this.mongo.default.collection('bs'), middlewares: [...(this.overrides?.b?.middlewares || []), ...selectMiddleware('b', this.middlewares) as DAOMiddleware<BDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'b', logger: this.logger });
    }
    return this._b;
  }
  get c() {
    if(!this._c) {
      this._c = new CDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.c, collection: this.mongo.default.collection('cs'), middlewares: [...(this.overrides?.c?.middlewares || []), ...selectMiddleware('c', this.middlewares) as DAOMiddleware<CDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'c', logger: this.logger });
    }
    return this._c;
  }
  get d() {
    if(!this._d) {
      this._d = new DDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.d, knex: this.knex.default, tableName: 'ds', middlewares: [...(this.overrides?.d?.middlewares || []), ...selectMiddleware('d', this.middlewares) as DAOMiddleware<DDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'd', logger: this.logger });
    }
    return this._d;
  }
  get e() {
    if(!this._e) {
      this._e = new EDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.e, knex: this.knex.default, tableName: 'es', middlewares: [...(this.overrides?.e?.middlewares || []), ...selectMiddleware('e', this.middlewares) as DAOMiddleware<EDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'e', logger: this.logger });
    }
    return this._e;
  }
  get f() {
    if(!this._f) {
      this._f = new FDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.f, knex: this.knex.default, tableName: 'fs', middlewares: [...(this.overrides?.f?.middlewares || []), ...selectMiddleware('f', this.middlewares) as DAOMiddleware<FDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'f', logger: this.logger });
    }
    return this._f;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Decimal', 'IntAutoInc', 'JSON', 'MongoID', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.knex = params.knex
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
  }
  
  public async execQuery<T>(run: (dbs: { mongo: Record<'a' | 'default', Db>; knex: Record<'default', Knex> }, entities: { a: Collection<Document>; b: Collection<Document>; c: Collection<Document>; d: Knex.QueryBuilder<any, unknown[]>; e: Knex.QueryBuilder<any, unknown[]>; f: Knex.QueryBuilder<any, unknown[]> }) => Promise<T>): Promise<T> {
    return run({ mongo: this.mongo, knex: this.knex }, { a: this.mongo.a.collection('as'), b: this.mongo.default.collection('bs'), c: this.mongo.default.collection('cs'), d: this.knex.default.table('ds'), e: this.knex.default.table('es'), f: this.knex.default.table('fs') })
  }
  
  public async createTables(typeMap: Partial<Record<keyof types.Scalars, { singleType: string; arrayType?: string }>>, defaultType: { singleType: string; arrayType?: string }): Promise<void> {
    this.d.createTable(typeMap, defaultType)
    this.e.createTable(typeMap, defaultType)
    this.f.createTable(typeMap, defaultType)
  }

}


//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

type DAOName = keyof DAOMiddlewareMap<never, never>
type DAOMiddlewareMap<MetadataType, OperationMetadataType> = {
  a: ADAOGenerics<MetadataType, OperationMetadataType>
  b: BDAOGenerics<MetadataType, OperationMetadataType>
  c: CDAOGenerics<MetadataType, OperationMetadataType>
  d: DDAOGenerics<MetadataType, OperationMetadataType>
  e: EDAOGenerics<MetadataType, OperationMetadataType>
  f: FDAOGenerics<MetadataType, OperationMetadataType>
}
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>,
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
  middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): DAOContextMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as DAOContextMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
export async function mockedDAOContext<MetadataType = never, OperationMetadataType = never>(params: MockDAOContextParams<DAOContextParams<MetadataType, OperationMetadataType>>) {
  const newParams = await createMockedDAOContext<DAOContextParams<MetadataType, OperationMetadataType>>(params, ['default'], [])
  return new DAOContext(newParams)
}