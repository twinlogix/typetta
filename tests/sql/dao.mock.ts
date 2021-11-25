import BigNumber from "bignumber.js";
import {Coordinates} from "@twinlogix/tl-commons";
import {LocalizedString} from "@twinlogix/tl-commons";
import { DriverDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Db } from 'mongodb';
import { Knex } from 'knex';

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export type AddressExcludedFields = never

export const addressSchema : Schema<types.Scalars>= {
  'id': { scalar: 'ID', required: true}
};

type AddressFilterFields = {
  'id'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators
};
export type AddressFilter = AddressFilterFields & LogicalOperators<AddressFilterFields>;

export type AddressProjection = {
  cities?: CityProjection | boolean,
  id?: boolean,
};

export type AddressSortKeys = 
  'id';
export type AddressSort = OneKey<AddressSortKeys, SortDirection>;

export type AddressUpdate = {
  'id'?: string
};

type AddressDAOAllParams = KnexJsDAOParams<types.Address, 'id', true, AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, { SQL?: any } & { test: string }, types.Scalars>;
export type AddressDAOParams = Omit<AddressDAOAllParams, 'idField' | 'schema'> & Partial<Pick<AddressDAOAllParams, 'idField' | 'schema'>>;

export class AddressDAO extends AbstractKnexJsDAO<types.Address, 'id', true, AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, { SQL?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: AddressDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: addressSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }
        ]
      ), 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- CITY -------------------------------------
//--------------------------------------------------------------------------------

export type CityExcludedFields = 'computedAddressName' | 'computedName'

export const citySchema : Schema<types.Scalars>= {
  'addressId': { scalar: 'String', required: true},
  'id': { scalar: 'ID', required: true},
  'name': { scalar: 'String', required: true}
};

type CityFilterFields = {
  'addressId'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators
};
export type CityFilter = CityFilterFields & LogicalOperators<CityFilterFields>;

export type CityProjection = {
  addressId?: boolean,
  computedAddressName?: boolean,
  computedName?: boolean,
  id?: boolean,
  name?: boolean,
};

export type CitySortKeys = 
  'addressId'|
  'id'|
  'name';
export type CitySort = OneKey<CitySortKeys, SortDirection>;

export type CityUpdate = {
  'addressId'?: string,
  'id'?: string,
  'name'?: string
};

type CityDAOAllParams = KnexJsDAOParams<types.City, 'id', true, CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, { SQL?: any } & { test: string }, types.Scalars>;
export type CityDAOParams = Omit<CityDAOAllParams, 'idField' | 'schema'> & Partial<Pick<CityDAOAllParams, 'idField' | 'schema'>>;

export class CityDAO extends AbstractKnexJsDAO<types.City, 'id', true, CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, { SQL?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: CityDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: citySchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
    });
  }
  
}



//--------------------------------------------------------------------------------
//--------------------------------- ORGANIZATION ---------------------------------
//--------------------------------------------------------------------------------

export type OrganizationExcludedFields = 'computedName'

export const organizationSchema : Schema<types.Scalars>= {
  'address': {
    embedded: {
      'id': { scalar: 'ID', required: true}
    }
  },
  'id': { scalar: 'ID', required: true},
  'name': { scalar: 'String', required: true},
  'vatNumber': { scalar: 'String'}
};

type OrganizationFilterFields = {
  'address.id'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'vatNumber'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators
};
export type OrganizationFilter = OrganizationFilterFields & LogicalOperators<OrganizationFilterFields>;

export type OrganizationProjection = {
  address?: {
    cities?: CityProjection | boolean,
    id?: boolean,
  } | boolean,
  computedName?: boolean,
  id?: boolean,
  name?: boolean,
  vatNumber?: boolean,
};

export type OrganizationSortKeys = 
  'address.id'|
  'id'|
  'name'|
  'vatNumber';
export type OrganizationSort = OneKey<OrganizationSortKeys, SortDirection>;

export type OrganizationUpdate = {
  'address'?: types.Address | null,
  'address.id'?: string,
  'id'?: string,
  'name'?: string,
  'vatNumber'?: string | null
};

type OrganizationDAOAllParams = KnexJsDAOParams<types.Organization, 'id', true, OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, { SQL?: any } & { test: string }, types.Scalars>;
export type OrganizationDAOParams = Omit<OrganizationDAOAllParams, 'idField' | 'schema'> & Partial<Pick<OrganizationDAOAllParams, 'idField' | 'schema'>>;

export class OrganizationDAO extends AbstractKnexJsDAO<types.Organization, 'id', true, OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, { SQL?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: OrganizationDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: organizationSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' }
        ]
      ), 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never

export const userSchema : Schema<types.Scalars>= {
  'amount': { scalar: 'Decimal'},
  'amounts': { scalar: 'Decimal', array: true},
  'firstName': { scalar: 'String'},
  'id': { scalar: 'ID', required: true},
  'lastName': { scalar: 'String'},
  'live': { scalar: 'Boolean', required: true},
  'localization': { scalar: 'Coordinates'},
  'title': { scalar: 'LocalizedString'},
  'usernamePasswordCredentials': {
    embedded: {
      'password': { scalar: 'String', required: true},
      'username': { scalar: 'String', required: true}
    }
  }
};

type UserFilterFields = {
  'amount'?: BigNumber | null | EqualityOperators<BigNumber> | ElementOperators,
  'amounts'?: BigNumber[] | null | EqualityOperators<BigNumber[]> | ElementOperators| ArrayOperators<BigNumber[]>,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'live'?: boolean | null | EqualityOperators<boolean> | ElementOperators,
  'localization'?: Coordinates | null | EqualityOperators<Coordinates> | ElementOperators,
  'title'?: LocalizedString | null | EqualityOperators<LocalizedString> | ElementOperators,
  'usernamePasswordCredentials.password'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators,
  'usernamePasswordCredentials.username'?: string | null | EqualityOperators<string> | ElementOperators| StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;

export type UserProjection = {
  amount?: boolean,
  amounts?: boolean,
  firstName?: boolean,
  id?: boolean,
  lastName?: boolean,
  live?: boolean,
  localization?: boolean,
  title?: boolean,
  usernamePasswordCredentials?: {
    password?: boolean,
    username?: boolean,
  } | boolean,
};

export type UserSortKeys = 
  'amount'|
  'amounts'|
  'firstName'|
  'id'|
  'lastName'|
  'live'|
  'localization'|
  'title'|
  'usernamePasswordCredentials.password'|
  'usernamePasswordCredentials.username';
export type UserSort = OneKey<UserSortKeys, SortDirection>;

export type UserUpdate = {
  'amount'?: BigNumber | null,
  'amounts'?: Array<BigNumber> | null,
  'firstName'?: string | null,
  'id'?: string,
  'lastName'?: string | null,
  'live'?: boolean,
  'localization'?: Coordinates | null,
  'title'?: LocalizedString | null,
  'usernamePasswordCredentials'?: types.UsernamePasswordCredentials | null,
  'usernamePasswordCredentials.password'?: string,
  'usernamePasswordCredentials.username'?: string
};

type UserDAOAllParams = KnexJsDAOParams<types.User, 'id', true, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, { SQL?: any } & { test: string }, types.Scalars>;
export type UserDAOParams = Omit<UserDAOAllParams, 'idField' | 'schema'> & Partial<Pick<UserDAOAllParams, 'idField' | 'schema'>>;

export class UserDAO extends AbstractKnexJsDAO<types.User, 'id', true, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, { SQL?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: UserDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
    });
  }
  
}

export type DAOContextParams = {
  daoOverrides?: { 
    address?: Partial<AddressDAOParams>,
    city?: Partial<CityDAOParams>,
    organization?: Partial<OrganizationDAOParams>,
    user?: Partial<UserDAOParams>
  },
  knex: Knex,
  adapters?: DriverDataTypeAdapterMap<types.Scalars>
};

export class DAOContext extends AbstractDAOContext {

  private _address: AddressDAO | undefined;
  private _city: CityDAO | undefined;
  private _organization: OrganizationDAO | undefined;
  private _user: UserDAO | undefined;
  
  private daoOverrides: DAOContextParams['daoOverrides'];
  private knex: Knex | undefined;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, ...this.daoOverrides?.address, knex: this.knex!, tableName: 'addresses' });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, ...this.daoOverrides?.city, knex: this.knex!, tableName: 'citys' });
    }
    return this._city;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, ...this.daoOverrides?.organization, knex: this.knex!, tableName: 'organizations' });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, ...this.daoOverrides?.user, knex: this.knex!, tableName: 'users' });
    }
    return this._user;
  }
  
  constructor(options?: DAOContextParams) {
    super(options?.adapters)
    this.daoOverrides = options?.daoOverrides
    this.knex = options?.knex;
  }

}