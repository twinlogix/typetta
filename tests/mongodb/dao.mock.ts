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

export type AddressExcludedFields = never

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

type AddressDAOAllParams = MongoDBDAOParams<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type AddressDAOParams = Omit<AddressDAOAllParams, 'idField' | 'schema'> & Partial<Pick<AddressDAOAllParams, 'idField' | 'schema'>>;

export class AddressDAO extends AbstractMongoDBDAO<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
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

type CityDAOAllParams = MongoDBDAOParams<types.City, 'id', string, true, CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type CityDAOParams = Omit<CityDAOAllParams, 'idField' | 'schema'> & Partial<Pick<CityDAOAllParams, 'idField' | 'schema'>>;

export class CityDAO extends AbstractMongoDBDAO<types.City, 'id', string, true, CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: CityDAOParams){
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

export type DeviceExcludedFields = never

export const deviceSchema : Schema<types.Scalars>= {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true, 
    alias: 'pippo'
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

type DeviceDAOAllParams = MongoDBDAOParams<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceUpdate, DeviceExcludedFields, DeviceSort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type DeviceDAOParams = Omit<DeviceDAOAllParams, 'idField' | 'schema'> & Partial<Pick<DeviceDAOAllParams, 'idField' | 'schema'>>;

export class DeviceDAO extends AbstractMongoDBDAO<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceSort, DeviceUpdate, DeviceExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: DeviceDAOParams){
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
//------------------------------------- DOG --------------------------------------
//--------------------------------------------------------------------------------

export type DogExcludedFields = never

export const dogSchema : Schema<types.Scalars>= {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  },
  'ownerId': {
    scalar: 'ID', 
    required: true
  }
};

type DogFilterFields = {
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'ownerId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
};
export type DogFilter = DogFilterFields & LogicalOperators<DogFilterFields>;

export type DogProjection = {
  id?: boolean,
  name?: boolean,
  owner?: UserProjection | boolean,
  ownerId?: boolean,
};

export type DogSortKeys = 
  'id'|
  'name'|
  'ownerId';
export type DogSort = OneKey<DogSortKeys, SortDirection>;

export type DogUpdate = {
  'id'?: string,
  'name'?: string,
  'ownerId'?: string
};

type DogDAOAllParams = MongoDBDAOParams<types.Dog, 'id', string, true, DogFilter, DogProjection, DogUpdate, DogExcludedFields, DogSort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type DogDAOParams = Omit<DogDAOAllParams, 'idField' | 'schema'> & Partial<Pick<DogDAOAllParams, 'idField' | 'schema'>>;

export class DogDAO extends AbstractMongoDBDAO<types.Dog, 'id', string, true, DogFilter, DogProjection, DogSort, DogUpdate, DogExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: DogDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: dogSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_ONE, reference: DAOAssociationReference.INNER, field: 'owner', refFrom: 'ownerId', refTo: 'id', dao: 'user' }
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

type OrganizationDAOAllParams = MongoDBDAOParams<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type OrganizationDAOParams = Omit<OrganizationDAOAllParams, 'idField' | 'schema'> & Partial<Pick<OrganizationDAOAllParams, 'idField' | 'schema'>>;

export class OrganizationDAO extends AbstractMongoDBDAO<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
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
    scalar: 'Decimal'
  },
  'amounts': {
    scalar: 'Decimal', 
    array: true
  },
  'firstName': {
    scalar: 'String'
  },
  'friendsId': {
    scalar: 'ID', 
    array: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'lastName': {
    scalar: 'String'
  },
  'live': {
    scalar: 'Boolean', 
    required: true
  },
  'localization': {
    scalar: 'Coordinates'
  },
  'title': {
    scalar: 'LocalizedString'
  },
  'usernamePasswordCredentials': {
    embedded: {
      'password': {
        scalar: 'Password', 
        required: true
      },
      'username': {
        scalar: 'String', 
        required: true
      }
    }
  }
};

type UserFilterFields = {
  'amount'?: BigNumber | null | EqualityOperators<BigNumber> | ElementOperators,
  'amounts'?: BigNumber[] | null | EqualityOperators<BigNumber[]> | ElementOperators | ArrayOperators<BigNumber[]>,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'friendsId'?: string[] | null | EqualityOperators<string[]> | ElementOperators | StringOperators | ArrayOperators<string[]>,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'live'?: boolean | null | EqualityOperators<boolean> | ElementOperators,
  'localization'?: Coordinates | null | EqualityOperators<Coordinates> | ElementOperators | GeospathialOperators,
  'title'?: LocalizedString | null | EqualityOperators<LocalizedString> | ElementOperators,
  'usernamePasswordCredentials.password'?: any | null | EqualityOperators<any> | ElementOperators,
  'usernamePasswordCredentials.username'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;

export type UserProjection = {
  amount?: boolean,
  amounts?: boolean,
  dogs?: DogProjection | boolean,
  firstName?: boolean,
  friends?: UserProjection | boolean,
  friendsId?: boolean,
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
  'friendsId'|
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
  'friendsId'?: Array<string> | null,
  'id'?: string,
  'lastName'?: string | null,
  'live'?: boolean,
  'localization'?: Coordinates | null,
  'title'?: LocalizedString | null,
  'usernamePasswordCredentials'?: types.UsernamePasswordCredentials | null,
  'usernamePasswordCredentials.password'?: any,
  'usernamePasswordCredentials.username'?: string
};

type UserDAOAllParams = MongoDBDAOParams<types.User, 'id', string, true, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, { mongoDB?: any } & { test: string }, types.Scalars>;
export type UserDAOParams = Omit<UserDAOAllParams, 'idField' | 'schema'> & Partial<Pick<UserDAOAllParams, 'idField' | 'schema'>>;

export class UserDAO extends AbstractMongoDBDAO<types.User, 'id', string, true, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, { mongoDB?: any } & { test: string }, types.Scalars> {
  
  public constructor(params: UserDAOParams){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'dogs', refFrom: 'ownerId', refTo: 'id', dao: 'dog' },
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.INNER, field: 'friends', refFrom: 'friendsId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGenerator: () => uuidv4() 
    });
  }
  
}

export type DAOContextParams = {
  daoOverrides?: { 
    address?: Partial<AddressDAOParams>,
    city?: Partial<CityDAOParams>,
    device?: Partial<DeviceDAOParams>,
    dog?: Partial<DogDAOParams>,
    organization?: Partial<OrganizationDAOParams>,
    user?: Partial<UserDAOParams>
  },
  mongoDB: Db,
  adapters?: { knexjs?: KnexJSDataTypeAdapterMap<types.Scalars>; mongodb?: MongoDBDataTypeAdapterMap<types.Scalars> }
};

export class DAOContext extends AbstractDAOContext {

  private _address: AddressDAO | undefined;
  private _city: CityDAO | undefined;
  private _device: DeviceDAO | undefined;
  private _dog: DogDAO | undefined;
  private _organization: OrganizationDAO | undefined;
  private _user: UserDAO | undefined;
  
  private daoOverrides: DAOContextParams['daoOverrides'];
  private mongoDB: Db | undefined;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, ...this.daoOverrides?.address, collection: this.mongoDB!.collection('addresses') });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, ...this.daoOverrides?.city, collection: this.mongoDB!.collection('citys') });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, ...this.daoOverrides?.device, collection: this.mongoDB!.collection('devices') });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, ...this.daoOverrides?.dog, collection: this.mongoDB!.collection('dogs') });
    }
    return this._dog;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, ...this.daoOverrides?.organization, collection: this.mongoDB!.collection('organizations') });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, ...this.daoOverrides?.user, collection: this.mongoDB!.collection('users') });
    }
    return this._user;
  }
  
  constructor(options?: DAOContextParams) {
    super(options?.adapters)
    this.daoOverrides = options?.daoOverrides
    this.mongoDB = options?.mongoDB
  }

}