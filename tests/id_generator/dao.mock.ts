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

type ADAOGenerics<OptionType extends object> = MongoDBDAOGenerics<types.A, 'id', 'MongoID', 'db', AFilter, AProjection, ASort, AInsert, AUpdate, AExcludedFields, OptionType, types.Scalars>;
export type ADAOParams<OptionType extends object> = Omit<MongoDBDAOParams<ADAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class ADAO<OptionType extends object> extends AbstractMongoDBDAO<ADAOGenerics<OptionType>> {
  
  public constructor(params: ADAOParams<OptionType>){
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

type BDAOGenerics<OptionType extends object> = MongoDBDAOGenerics<types.B, 'id', 'ID', 'generator', BFilter, BProjection, BSort, BInsert, BUpdate, BExcludedFields, OptionType, types.Scalars>;
export type BDAOParams<OptionType extends object> = Omit<MongoDBDAOParams<BDAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class BDAO<OptionType extends object> extends AbstractMongoDBDAO<BDAOGenerics<OptionType>> {
  
  public constructor(params: BDAOParams<OptionType>){
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

type CDAOGenerics<OptionType extends object> = MongoDBDAOGenerics<types.C, 'id', 'ID', 'user', CFilter, CProjection, CSort, CInsert, CUpdate, CExcludedFields, OptionType, types.Scalars>;
export type CDAOParams<OptionType extends object> = Omit<MongoDBDAOParams<CDAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CDAO<OptionType extends object> extends AbstractMongoDBDAO<CDAOGenerics<OptionType>> {
  
  public constructor(params: CDAOParams<OptionType>){
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

type DDAOGenerics<OptionType extends object> = KnexJsDAOGenerics<types.D, 'id', 'IntAutoInc', 'db', DFilter, DProjection, DSort, DInsert, DUpdate, DExcludedFields, OptionType, types.Scalars>;
export type DDAOParams<OptionType extends object> = Omit<KnexJsDAOParams<DDAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DDAO<OptionType extends object> extends AbstractKnexJsDAO<DDAOGenerics<OptionType>> {
  
  public constructor(params: DDAOParams<OptionType>){
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

type EDAOGenerics<OptionType extends object> = KnexJsDAOGenerics<types.E, 'id', 'ID', 'generator', EFilter, EProjection, ESort, EInsert, EUpdate, EExcludedFields, OptionType, types.Scalars>;
export type EDAOParams<OptionType extends object> = Omit<KnexJsDAOParams<EDAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class EDAO<OptionType extends object> extends AbstractKnexJsDAO<EDAOGenerics<OptionType>> {
  
  public constructor(params: EDAOParams<OptionType>){
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

type FDAOGenerics<OptionType extends object> = KnexJsDAOGenerics<types.F, 'id', 'ID', 'user', FFilter, FProjection, FSort, FInsert, FUpdate, FExcludedFields, OptionType, types.Scalars>;
export type FDAOParams<OptionType extends object> = Omit<KnexJsDAOParams<FDAOGenerics<OptionType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class FDAO<OptionType extends object> extends AbstractKnexJsDAO<FDAOGenerics<OptionType>> {
  
  public constructor(params: FDAOParams<OptionType>){
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

export type DAOContextParams<OptionsType extends object> = {
  options?: OptionsType
  overrides?: { 
    a?: Pick<Partial<ADAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    b?: Pick<Partial<BDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    c?: Pick<Partial<CDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    d?: Pick<Partial<DDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    e?: Pick<Partial<EDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    f?: Pick<Partial<FDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>
  },
  mongoDB: Record<'a' | 'default', Db>,
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<OptionType extends object> extends AbstractDAOContext<types.Scalars, OptionType>  {

  private _a: ADAO<OptionType> | undefined;
  private _b: BDAO<OptionType> | undefined;
  private _c: CDAO<OptionType> | undefined;
  private _d: DDAO<OptionType> | undefined;
  private _e: EDAO<OptionType> | undefined;
  private _f: FDAO<OptionType> | undefined;
  
  private overrides: DAOContextParams<OptionType>['overrides'];
  private mongoDB: Record<'a' | 'default', Db>;
  private knex: Record<'default', Knex>;
  
  get a() {
    if(!this._a) {
      this._a = new ADAO({ daoContext: this, options: this.options, ...this.overrides?.a, collection: this.mongoDB['a'].collection('as') });
    }
    return this._a;
  }
  get b() {
    if(!this._b) {
      this._b = new BDAO({ daoContext: this, options: this.options, ...this.overrides?.b, collection: this.mongoDB['default'].collection('bs') });
    }
    return this._b;
  }
  get c() {
    if(!this._c) {
      this._c = new CDAO({ daoContext: this, options: this.options, ...this.overrides?.c, collection: this.mongoDB['default'].collection('cs') });
    }
    return this._c;
  }
  get d() {
    if(!this._d) {
      this._d = new DDAO({ daoContext: this, options: this.options, ...this.overrides?.d, knex: this.knex['default'], tableName: 'ds' });
    }
    return this._d;
  }
  get e() {
    if(!this._e) {
      this._e = new EDAO({ daoContext: this, options: this.options, ...this.overrides?.e, knex: this.knex['default'], tableName: 'es' });
    }
    return this._e;
  }
  get f() {
    if(!this._f) {
      this._f = new FDAO({ daoContext: this, options: this.options, ...this.overrides?.f, knex: this.knex['default'], tableName: 'fs' });
    }
    return this._f;
  }
  
  constructor(params: DAOContextParams<OptionType>) {
    super(params)
    this.overrides = params.overrides
    this.mongoDB = params.mongoDB
    this.knex = params.knex;
  }

}