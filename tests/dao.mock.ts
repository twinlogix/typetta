import BigNumber from "bignumber.js";
import {Coordinates} from "@twinlogix/tl-commons";
import {LocalizedString} from "@twinlogix/tl-commons";
import { Schema, DAOParams, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, ComparisonOperators, ElementOperators, EvaluationOperators, GeospathialOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Connection } from 'mongodb';

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export type AddressExcludedFields = never

export const addressSchema : Schema<types.Scalars>= {
  'id': { scalar: 'ID', required: true}
};

type AddressFilterFields = {
  'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
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

export interface AddressDAOParams extends DAOParams<types.Address, 'id', true, AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, { mongoDB?: any } & { test: string }>{}

export class AddressDAO extends AbstractMongoDBDAO<types.Address, 'id', true, AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: { daoContext: AbstractDAOContext } & AddressDAOParams, connection?: Connection){
    super({   
      idField: 'id', 
      ...params, 
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
  'addressId'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'name'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
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

export interface CityDAOParams extends DAOParams<types.City, 'id', true, CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, { mongoDB?: any } & { test: string }>{}

export class CityDAO extends AbstractMongoDBDAO<types.City, 'id', true, CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: { daoContext: AbstractDAOContext } & CityDAOParams, connection?: Connection){
    super({   
      idField: 'id', 
      ...params, 
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
  'address': { embedded: {  'id': { scalar: 'ID', required: true}}},
  'id': { scalar: 'ID', required: true},
  'name': { scalar: 'String', required: true},
  'vatNumber': { scalar: 'String'}
};

type OrganizationFilterFields = {
  'address.id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'name'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'vatNumber'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
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

export interface OrganizationDAOParams extends DAOParams<types.Organization, 'id', true, OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, { mongoDB?: any } & { test: string }>{}

export class OrganizationDAO extends AbstractMongoDBDAO<types.Organization, 'id', true, OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: { daoContext: AbstractDAOContext } & OrganizationDAOParams, connection?: Connection){
    super({   
      idField: 'id', 
      ...params, 
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
  'usernamePasswordCredentials': { embedded: {  'password': { scalar: 'String', required: true}
    'username': { scalar: 'String', required: true}}}
};

type UserFilterFields = {
  'amount'?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>,
  'amounts'?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>| ArrayOperators<BigNumber>,
  'firstName'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'lastName'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'live'?: boolean | null | ComparisonOperators<boolean> | ElementOperators<boolean> | EvaluationOperators<boolean>,
  'localization'?: Coordinates | null | ComparisonOperators<Coordinates> | ElementOperators<Coordinates> | EvaluationOperators<Coordinates>,
  'title'?: LocalizedString | null | ComparisonOperators<LocalizedString> | ElementOperators<LocalizedString> | EvaluationOperators<LocalizedString>,
  'usernamePasswordCredentials.password'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
  'usernamePasswordCredentials.username'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
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

export interface UserDAOParams extends DAOParams<types.User, 'id', true, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, { mongoDB?: any } & { test: string }>{}

export class UserDAO extends AbstractMongoDBDAO<types.User, 'id', true, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: { daoContext: AbstractDAOContext } & UserDAOParams, connection?: Connection){
    super({   
      idField: 'id', 
      ...params, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
    });
  }
  
}

export interface DAOContextParams {
  daoOverrides?: { 
    address?: AddressDAOParams,
    city?: CityDAOParams,
    organization?: OrganizationDAOParams,
    user?: UserDAOParams 
  }, 
  connection?: Connection
};

export class DAOContext extends AbstractDAOContext {

  private _address: AddressDAO | undefined;
  private _city: CityDAO | undefined;
  private _organization: OrganizationDAO | undefined;
  private _user: UserDAO | undefined;
  
  private daoOverrides: DAOContextParams['daoOverrides'];
  private connection: Connection | undefined
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, ...this.daoOverrides?.address }, this.connection);
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, ...this.daoOverrides?.city }, this.connection);
    }
    return this._city;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, ...this.daoOverrides?.organization }, this.connection);
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, ...this.daoOverrides?.user }, this.connection);
    }
    return this._user;
  }
  
  constructor(options?: DAOContextParams) {
    super()
    this.daoOverrides = options?.daoOverrides
    this.connection = options?.connection
  }

}