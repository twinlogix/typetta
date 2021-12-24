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

type ADAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.A, 'id', 'MongoID', 'db', AFilter, AProjection, ASort, AInsert, AUpdate, AExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type ADAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<ADAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class ADAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<ADAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: ADAOParams<MetadataType, OperationMetadataType>){
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

type BDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.B, 'id', 'ID', 'generator', BFilter, BProjection, BSort, BInsert, BUpdate, BExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type BDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<BDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class BDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<BDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: BDAOParams<MetadataType, OperationMetadataType>){
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

type CDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.C, 'id', 'ID', 'user', CFilter, CProjection, CSort, CInsert, CUpdate, CExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type CDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<CDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<CDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: CDAOParams<MetadataType, OperationMetadataType>){
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

type DDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.D, 'id', 'IntAutoInc', 'db', DFilter, DProjection, DSort, DInsert, DUpdate, DExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: DDAOParams<MetadataType, OperationMetadataType>){
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

type EDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.E, 'id', 'ID', 'generator', EFilter, EProjection, ESort, EInsert, EUpdate, EExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type EDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<EDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class EDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<EDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: EDAOParams<MetadataType, OperationMetadataType>){
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

type FDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.F, 'id', 'ID', 'user', FFilter, FProjection, FSort, FInsert, FUpdate, FExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type FDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<FDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class FDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<FDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: FDAOParams<MetadataType, OperationMetadataType>){
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

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  overrides?: { 
    a?: Pick<Partial<ADAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    b?: Pick<Partial<BDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    c?: Pick<Partial<CDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    d?: Pick<Partial<DDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    e?: Pick<Partial<EDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    f?: Pick<Partial<FDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  mongo: Record<'a' | 'default', Db>,
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _a: ADAO<MetadataType, OperationMetadataType> | undefined;
  private _b: BDAO<MetadataType, OperationMetadataType> | undefined;
  private _c: CDAO<MetadataType, OperationMetadataType> | undefined;
  private _d: DDAO<MetadataType, OperationMetadataType> | undefined;
  private _e: EDAO<MetadataType, OperationMetadataType> | undefined;
  private _f: FDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
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
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.knex = params.knex;
  }

}