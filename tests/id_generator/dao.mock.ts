import BigNumber from "bignumber.js";
import { MongoDBDAOGenerics, KnexJsDAOGenerics, Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Db } from 'mongodb';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid'

//--------------------------------------------------------------------------------
//-------------------------------------- A ---------------------------------------
//--------------------------------------------------------------------------------

export type AExcludedFields = never

export const aSchema : Schema<types.Scalars>= {
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
  'id'?: any | null | EqualityOperators<any> | ElementOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type AFilter = AFilterFields & LogicalOperators<AFilterFields>;

export type AProjection = {
  id?: boolean,
  value?: boolean,
};

export type ASortKeys = 
  'id'|
  'value';
export type ASort = OneKey<ASortKeys, SortDirection>;

export type AUpdate = {
  'id'?: any,
  'value'?: number
};

export type AInsert = {
  value: number,
};

type ADAOGenerics<MetadataType> = MongoDBDAOGenerics<types.A, 'id', 'MongoID', 'db', AFilter, AProjection, ASort, AInsert, AUpdate, AExcludedFields, MetadataType, types.Scalars>;
export type ADAOParams<MetadataType> = Omit<MongoDBDAOParams<ADAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class ADAO<MetadataType> extends AbstractMongoDBDAO<ADAOGenerics<MetadataType>> {
  
  public constructor(params: ADAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: aSchema, 
      associations: overrideAssociations(
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

export const bSchema : Schema<types.Scalars>= {
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
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type BFilter = BFilterFields & LogicalOperators<BFilterFields>;

export type BProjection = {
  id?: boolean,
  value?: boolean,
};

export type BSortKeys = 
  'id'|
  'value';
export type BSort = OneKey<BSortKeys, SortDirection>;

export type BUpdate = {
  'id'?: string,
  'value'?: number
};

export type BInsert = {
  id?: string,
  value: number,
};

type BDAOGenerics<MetadataType> = MongoDBDAOGenerics<types.B, 'id', 'ID', 'generator', BFilter, BProjection, BSort, BInsert, BUpdate, BExcludedFields, MetadataType, types.Scalars>;
export type BDAOParams<MetadataType> = Omit<MongoDBDAOParams<BDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class BDAO<MetadataType> extends AbstractMongoDBDAO<BDAOGenerics<MetadataType>> {
  
  public constructor(params: BDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: bSchema, 
      associations: overrideAssociations(
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

export const cSchema : Schema<types.Scalars>= {
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
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type CFilter = CFilterFields & LogicalOperators<CFilterFields>;

export type CProjection = {
  id?: boolean,
  value?: boolean,
};

export type CSortKeys = 
  'id'|
  'value';
export type CSort = OneKey<CSortKeys, SortDirection>;

export type CUpdate = {
  'id'?: string,
  'value'?: number
};

export type CInsert = {
  id: string,
  value: number,
};

type CDAOGenerics<MetadataType> = MongoDBDAOGenerics<types.C, 'id', 'ID', 'user', CFilter, CProjection, CSort, CInsert, CUpdate, CExcludedFields, MetadataType, types.Scalars>;
export type CDAOParams<MetadataType> = Omit<MongoDBDAOParams<CDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CDAO<MetadataType> extends AbstractMongoDBDAO<CDAOGenerics<MetadataType>> {
  
  public constructor(params: CDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: cSchema, 
      associations: overrideAssociations(
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

export const dSchema : Schema<types.Scalars>= {
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
  'id'?: any | null | EqualityOperators<any> | ElementOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type DFilter = DFilterFields & LogicalOperators<DFilterFields>;

export type DProjection = {
  id?: boolean,
  value?: boolean,
};

export type DSortKeys = 
  'id'|
  'value';
export type DSort = OneKey<DSortKeys, SortDirection>;

export type DUpdate = {
  'id'?: any,
  'value'?: number
};

export type DInsert = {
  value: number,
};

type DDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.D, 'id', 'IntAutoInc', 'db', DFilter, DProjection, DSort, DInsert, DUpdate, DExcludedFields, MetadataType, types.Scalars>;
export type DDAOParams<MetadataType> = Omit<KnexJsDAOParams<DDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DDAO<MetadataType> extends AbstractKnexJsDAO<DDAOGenerics<MetadataType>> {
  
  public constructor(params: DDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: dSchema, 
      associations: overrideAssociations(
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

export const eSchema : Schema<types.Scalars>= {
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
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type EFilter = EFilterFields & LogicalOperators<EFilterFields>;

export type EProjection = {
  id?: boolean,
  value?: boolean,
};

export type ESortKeys = 
  'id'|
  'value';
export type ESort = OneKey<ESortKeys, SortDirection>;

export type EUpdate = {
  'id'?: string,
  'value'?: number
};

export type EInsert = {
  id?: string,
  value: number,
};

type EDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.E, 'id', 'ID', 'generator', EFilter, EProjection, ESort, EInsert, EUpdate, EExcludedFields, MetadataType, types.Scalars>;
export type EDAOParams<MetadataType> = Omit<KnexJsDAOParams<EDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class EDAO<MetadataType> extends AbstractKnexJsDAO<EDAOGenerics<MetadataType>> {
  
  public constructor(params: EDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: eSchema, 
      associations: overrideAssociations(
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

export const fSchema : Schema<types.Scalars>= {
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
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'value'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type FFilter = FFilterFields & LogicalOperators<FFilterFields>;

export type FProjection = {
  id?: boolean,
  value?: boolean,
};

export type FSortKeys = 
  'id'|
  'value';
export type FSort = OneKey<FSortKeys, SortDirection>;

export type FUpdate = {
  'id'?: string,
  'value'?: number
};

export type FInsert = {
  id: string,
  value: number,
};

type FDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.F, 'id', 'ID', 'user', FFilter, FProjection, FSort, FInsert, FUpdate, FExcludedFields, MetadataType, types.Scalars>;
export type FDAOParams<MetadataType> = Omit<KnexJsDAOParams<FDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class FDAO<MetadataType> extends AbstractKnexJsDAO<FDAOGenerics<MetadataType>> {
  
  public constructor(params: FDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: fSchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType> = {
  metadata?: MetadataType
  overrides?: { 
    a?: Pick<Partial<ADAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    b?: Pick<Partial<BDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    c?: Pick<Partial<CDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    d?: Pick<Partial<DDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    e?: Pick<Partial<EDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    f?: Pick<Partial<FDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  mongo: Record<'a' | 'default', Db>,
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<MetadataType> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _a: ADAO<MetadataType> | undefined;
  private _b: BDAO<MetadataType> | undefined;
  private _c: CDAO<MetadataType> | undefined;
  private _d: DDAO<MetadataType> | undefined;
  private _e: EDAO<MetadataType> | undefined;
  private _f: FDAO<MetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType>['overrides'];
  private mongo: Record<'a' | 'default', Db>;
  private knex: Record<'default', Knex>;
  
  get a() {
    if(!this._a) {
      this._a = new ADAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.a, collection: this.mongo.a.collection('as') });
    }
    return this._a;
  }
  get b() {
    if(!this._b) {
      this._b = new BDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.b, collection: this.mongo.default.collection('bs') });
    }
    return this._b;
  }
  get c() {
    if(!this._c) {
      this._c = new CDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.c, collection: this.mongo.default.collection('cs') });
    }
    return this._c;
  }
  get d() {
    if(!this._d) {
      this._d = new DDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.d, knex: this.knex.default, tableName: 'ds' });
    }
    return this._d;
  }
  get e() {
    if(!this._e) {
      this._e = new EDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.e, knex: this.knex.default, tableName: 'es' });
    }
    return this._e;
  }
  get f() {
    if(!this._f) {
      this._f = new FDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.f, knex: this.knex.default, tableName: 'fs' });
    }
    return this._f;
  }
  
  constructor(params: DAOContextParams<MetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.knex = params.knex;
  }

}