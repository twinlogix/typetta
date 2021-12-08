import BigNumber from "bignumber.js";
import {Coordinates} from "@twinlogix/tl-commons";
import {LocalizedString} from "@twinlogix/tl-commons";
import { KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Db } from 'mongodb';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid'

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export type AddressExcludedFields = 'cities'

export const addressSchema : Schema<types.Scalars>= {
  'id': {
    scalar: 'ID', 
    required: true
  }
};

type AddressFilterFields = {
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
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

type AddressDAOAllParams<OptionType extends { knex : Knex }> = KnexJsDAOParams<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, OptionType, types.Scalars>;
export type AddressDAOParams<OptionType extends { knex : Knex }> = Omit<AddressDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<AddressDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class AddressDAO<OptionType extends { knex : Knex }> extends AbstractKnexJsDAO<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: AddressDAOParams<OptionType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: addressSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }
        ]
      ), 
      idGenerator: () => uuidv4() 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- CITY -------------------------------------
//--------------------------------------------------------------------------------

export type CityExcludedFields = 'computedAddressName' | 'computedName'

export const citySchema : Schema<types.Scalars>= {
  'addressId': {
    scalar: 'String', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  }
};

type CityFilterFields = {
  'addressId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
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

type CityDAOAllParams<OptionType extends { knex : Knex }> = KnexJsDAOParams<types.City, 'id', string, true, CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, OptionType, types.Scalars>;
export type CityDAOParams<OptionType extends { knex : Knex }> = Omit<CityDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<CityDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class CityDAO<OptionType extends { knex : Knex }> extends AbstractKnexJsDAO<types.City, 'id', string, true, CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: CityDAOParams<OptionType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: citySchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
      idGenerator: () => uuidv4() 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------ DEVICE ------------------------------------
//--------------------------------------------------------------------------------

export type DeviceExcludedFields = 'user'

export const deviceSchema : Schema<types.Scalars>= {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  },
  'userId': {
    scalar: 'ID'
  }
};

type DeviceFilterFields = {
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'userId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
};
export type DeviceFilter = DeviceFilterFields & LogicalOperators<DeviceFilterFields>;

export type DeviceProjection = {
  id?: boolean,
  name?: boolean,
  user?: UserProjection | boolean,
  userId?: boolean,
};

export type DeviceSortKeys = 
  'id'|
  'name'|
  'userId';
export type DeviceSort = OneKey<DeviceSortKeys, SortDirection>;

export type DeviceUpdate = {
  'id'?: string,
  'name'?: string,
  'userId'?: string | null
};

type DeviceDAOAllParams<OptionType extends { knex : Knex }> = KnexJsDAOParams<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceUpdate, DeviceExcludedFields, DeviceSort, OptionType, types.Scalars>;
export type DeviceDAOParams<OptionType extends { knex : Knex }> = Omit<DeviceDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<DeviceDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class DeviceDAO<OptionType extends { knex : Knex }> extends AbstractKnexJsDAO<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceSort, DeviceUpdate, DeviceExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: DeviceDAOParams<OptionType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: deviceSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_ONE, reference: DAOAssociationReference.INNER, field: 'user', refFrom: 'userId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGenerator: () => uuidv4() 
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
      'id': {
        scalar: 'ID', 
        required: true
      }
    }
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  },
  'vatNumber': {
    scalar: 'String'
  }
};

type OrganizationFilterFields = {
  'address.id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'vatNumber'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
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

type OrganizationDAOAllParams<OptionType extends { knex : Knex }> = KnexJsDAOParams<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, OptionType, types.Scalars>;
export type OrganizationDAOParams<OptionType extends { knex : Knex }> = Omit<OrganizationDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<OrganizationDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class OrganizationDAO<OptionType extends { knex : Knex }> extends AbstractKnexJsDAO<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: OrganizationDAOParams<OptionType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: organizationSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' }
        ]
      ), 
      idGenerator: () => uuidv4() 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never

export const userSchema : Schema<types.Scalars>= {
  'amount': {
    scalar: 'Decimal', 
    alias: 'value'
  },
  'amounts': {
    scalar: 'Decimal', 
    array: true, 
    alias: 'values'
  },
  'credentials': {
    embedded: {
      'another': {
        embedded: {
          'test': {
            scalar: 'String', 
            alias: 't'
          }
        }, 
        alias: 'a'
      },
      'password': {
        scalar: 'Password', 
        required: true, 
        alias: 'pass'
      },
      'username': {
        scalar: 'String', 
        required: true, 
        alias: 'user'
      }
    }, 
    alias: 'cred'
  },
  'firstName': {
    scalar: 'String', 
    alias: 'name'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: 'ID'
  },
  'lastName': {
    scalar: 'String', 
    alias: 'surname'
  },
  'live': {
    scalar: 'Boolean', 
    required: true, 
    alias: 'active'
  },
  'localization': {
    scalar: 'Coordinates', 
    alias: 'l'
  },
  'title': {
    scalar: 'LocalizedString', 
    alias: 't'
  }
};

type UserFilterFields = {
  'amount'?: BigNumber | null | EqualityOperators<BigNumber> | ElementOperators,
  'amounts'?: BigNumber[] | null | EqualityOperators<BigNumber[]> | ElementOperators | ArrayOperators<BigNumber[]>,
  'credentials.another.test'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'credentials.password'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'credentials.username'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'live'?: boolean | null | EqualityOperators<boolean> | ElementOperators,
  'localization'?: Coordinates | null | EqualityOperators<Coordinates> | ElementOperators,
  'title'?: LocalizedString | null | EqualityOperators<LocalizedString> | ElementOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;

export type UserProjection = {
  amount?: boolean,
  amounts?: boolean,
  credentials?: {
    another?: {
      test?: boolean,
    } | boolean,
    password?: boolean,
    username?: boolean,
  } | boolean,
  firstName?: boolean,
  id?: boolean,
  lastName?: boolean,
  live?: boolean,
  localization?: boolean,
  title?: boolean,
};

export type UserSortKeys = 
  'amount'|
  'amounts'|
  'credentials.another.test'|
  'credentials.password'|
  'credentials.username'|
  'firstName'|
  'id'|
  'lastName'|
  'live'|
  'localization'|
  'title';
export type UserSort = OneKey<UserSortKeys, SortDirection>;

export type UserUpdate = {
  'amount'?: BigNumber | null,
  'amounts'?: Array<BigNumber> | null,
  'credentials'?: types.UsernamePasswordCredentials | null,
  'credentials.another'?: types.Another | null,
  'credentials.another.test'?: string | null,
  'credentials.password'?: string,
  'credentials.username'?: string,
  'firstName'?: string | null,
  'id'?: string,
  'lastName'?: string | null,
  'live'?: boolean,
  'localization'?: Coordinates | null,
  'title'?: LocalizedString | null
};

type UserDAOAllParams<OptionType extends { knex : Knex }> = KnexJsDAOParams<types.User, 'id', string, true, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, OptionType, types.Scalars>;
export type UserDAOParams<OptionType extends { knex : Knex }> = Omit<UserDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<UserDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class UserDAO<OptionType extends { knex : Knex }> extends AbstractKnexJsDAO<types.User, 'id', string, true, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: UserDAOParams<OptionType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
      idGenerator: () => uuidv4() 
    });
  }
  
}

export type DAOContextParams<OptionType> = {
  overrides?: { 
    address?: Partial<AddressDAOParams<OptionType & { knex : Knex }>>,
    city?: Partial<CityDAOParams<OptionType & { knex : Knex }>>,
    device?: Partial<DeviceDAOParams<OptionType & { knex : Knex }>>,
    organization?: Partial<OrganizationDAOParams<OptionType & { knex : Knex }>>,
    user?: Partial<UserDAOParams<OptionType & { knex : Knex }>>
  },
  knex: Knex,
  adapters?: { knexjs?: KnexJSDataTypeAdapterMap<types.Scalars>; mongodb?: MongoDBDataTypeAdapterMap<types.Scalars> }
};

export class DAOContext<OptionType = never> extends AbstractDAOContext {

  private _address: AddressDAO<OptionType & { knex : Knex }> | undefined;
  private _city: CityDAO<OptionType & { knex : Knex }> | undefined;
  private _device: DeviceDAO<OptionType & { knex : Knex }> | undefined;
  private _organization: OrganizationDAO<OptionType & { knex : Knex }> | undefined;
  private _user: UserDAO<OptionType & { knex : Knex }> | undefined;
  
  private overrides: DAOContextParams<OptionType>['overrides'];
  private knex: Knex | undefined;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, ...this.overrides?.address, knex: this.knex!, tableName: 'addresses' });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, ...this.overrides?.city, knex: this.knex!, tableName: 'citys' });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, ...this.overrides?.device, knex: this.knex!, tableName: 'devices' });
    }
    return this._device;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, ...this.overrides?.organization, knex: this.knex!, tableName: 'organizations' });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, ...this.overrides?.user, knex: this.knex!, tableName: 'users' });
    }
    return this._user;
  }
  
  constructor(options?: DAOContextParams<OptionType>) {
    super(options?.adapters)
    this.overrides = options?.overrides
    this.knex = options?.knex;
  }

}