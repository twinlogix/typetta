import BigNumber from "bignumber.js";
import { MongoDBDAOGenerics, KnexJsDAOGenerics, Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
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

export type AddressInsert = {
  id?: string,
};

type AddressDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressProjection, AddressSort, AddressInsert, AddressUpdate, AddressExcludedFields, MetadataType, types.Scalars>;
export type AddressDAOParams<MetadataType> = Omit<KnexJsDAOParams<AddressDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class AddressDAO<MetadataType> extends AbstractKnexJsDAO<AddressDAOGenerics<MetadataType>> {
  
  public constructor(params: AddressDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: addressSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
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

export type CityInsert = {
  addressId: string,
  id?: string,
  name: string,
};

type CityDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityProjection, CitySort, CityInsert, CityUpdate, CityExcludedFields, MetadataType, types.Scalars>;
export type CityDAOParams<MetadataType> = Omit<KnexJsDAOParams<CityDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CityDAO<MetadataType> extends AbstractKnexJsDAO<CityDAOGenerics<MetadataType>> {
  
  public constructor(params: CityDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: citySchema, 
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

export type DeviceInsert = {
  id?: string,
  name: string,
  userId?: string,
};

type DeviceDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceProjection, DeviceSort, DeviceInsert, DeviceUpdate, DeviceExcludedFields, MetadataType, types.Scalars>;
export type DeviceDAOParams<MetadataType> = Omit<KnexJsDAOParams<DeviceDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DeviceDAO<MetadataType> extends AbstractKnexJsDAO<DeviceDAOGenerics<MetadataType>> {
  
  public constructor(params: DeviceDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: deviceSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_ONE, reference: DAOAssociationReference.INNER, field: 'user', refFrom: 'userId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
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

export type OrganizationInsert = {
  address?: types.Address,
  id?: string,
  name: string,
  vatNumber?: string,
};

type OrganizationDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationInsert, OrganizationUpdate, OrganizationExcludedFields, MetadataType, types.Scalars>;
export type OrganizationDAOParams<MetadataType> = Omit<KnexJsDAOParams<OrganizationDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class OrganizationDAO<MetadataType> extends AbstractKnexJsDAO<OrganizationDAOGenerics<MetadataType>> {
  
  public constructor(params: OrganizationDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: organizationSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
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

export type UserInsert = {
  amount?: BigNumber,
  amounts?: BigNumber[],
  credentials?: types.UsernamePasswordCredentials,
  firstName?: string,
  id?: string,
  lastName?: string,
  live: boolean,
  localization?: Coordinates,
  title?: LocalizedString,
};

type UserDAOGenerics<MetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserProjection, UserSort, UserInsert, UserUpdate, UserExcludedFields, MetadataType, types.Scalars>;
export type UserDAOParams<MetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class UserDAO<MetadataType> extends AbstractKnexJsDAO<UserDAOGenerics<MetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      associations: overrideAssociations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType> = {
  metadata?: MetadataType
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    city?: Pick<Partial<CityDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    device?: Pick<Partial<DeviceDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<MetadataType> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _address: AddressDAO<MetadataType> | undefined;
  private _city: CityDAO<MetadataType> | undefined;
  private _device: DeviceDAO<MetadataType> | undefined;
  private _organization: OrganizationDAO<MetadataType> | undefined;
  private _user: UserDAO<MetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType>['overrides'];
  private knex: Record<'default', Knex>;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, knex: this.knex['default'], tableName: 'addresses' });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, knex: this.knex['default'], tableName: 'citys' });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, knex: this.knex['default'], tableName: 'devices' });
    }
    return this._device;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, knex: this.knex['default'], tableName: 'organizations' });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex['default'], tableName: 'users' });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.knex = params.knex;
  }

}