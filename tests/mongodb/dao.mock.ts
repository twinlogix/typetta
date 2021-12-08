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

type AddressDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, OptionType, types.Scalars>;
export type AddressDAOParams<OptionType extends { mongoDB: Db }> = Omit<AddressDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<AddressDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class AddressDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.Address, 'id', string, true, AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, OptionType, types.Scalars> {
  
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

type CityDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.City, 'id', string, true, CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, OptionType, types.Scalars>;
export type CityDAOParams<OptionType extends { mongoDB: Db }> = Omit<CityDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<CityDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class CityDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.City, 'id', string, true, CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, OptionType, types.Scalars> {
  
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

type DeviceDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceUpdate, DeviceExcludedFields, DeviceSort, OptionType, types.Scalars>;
export type DeviceDAOParams<OptionType extends { mongoDB: Db }> = Omit<DeviceDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<DeviceDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class DeviceDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.Device, 'id', string, true, DeviceFilter, DeviceProjection, DeviceSort, DeviceUpdate, DeviceExcludedFields, OptionType, types.Scalars> {
  
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
//------------------------------------- DOG --------------------------------------
//--------------------------------------------------------------------------------

export type DogExcludedFields = 'owner'

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

type DogDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.Dog, 'id', string, true, DogFilter, DogProjection, DogUpdate, DogExcludedFields, DogSort, OptionType, types.Scalars>;
export type DogDAOParams<OptionType extends { mongoDB: Db }> = Omit<DogDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<DogDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class DogDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.Dog, 'id', string, true, DogFilter, DogProjection, DogSort, DogUpdate, DogExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: DogDAOParams<OptionType>){
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

type OrganizationDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, OptionType, types.Scalars>;
export type OrganizationDAOParams<OptionType extends { mongoDB: Db }> = Omit<OrganizationDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<OrganizationDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class OrganizationDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.Organization, 'id', string, true, OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, OptionType, types.Scalars> {
  
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

export type UserExcludedFields = 'dogs' | 'friends'

export const userSchema : Schema<types.Scalars>= {
  'amount': {
    scalar: 'Decimal'
  },
  'amounts': {
    scalar: 'Decimal', 
    array: true, 
    alias: 'amounts'
  },
  'firstName': {
    scalar: 'String', 
    alias: 'name'
  },
  'friendsId': {
    scalar: 'ID', 
    array: true, 
    alias: 'fIds'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: 'ID'
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
        required: true, 
        alias: 'pwd'
      },
      'username': {
        scalar: 'String', 
        required: true, 
        alias: 'user'
      }
    }, 
    alias: 'cred'
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

type UserDAOAllParams<OptionType extends { mongoDB: Db }> = MongoDBDAOParams<types.User, 'id', string, true, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, OptionType, types.Scalars>;
export type UserDAOParams<OptionType extends { mongoDB: Db }> = Omit<UserDAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<UserDAOAllParams<OptionType>, 'idField' | 'schema'>>;

export class UserDAO<OptionType extends { mongoDB: Db }> extends AbstractMongoDBDAO<types.User, 'id', string, true, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: UserDAOParams<OptionType>){
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

export type DAOContextParams<OptionType> = {
  overrides?: { 
    address?: Partial<AddressDAOParams<OptionType & { mongoDB: Db }>>,
    city?: Partial<CityDAOParams<OptionType & { mongoDB: Db }>>,
    device?: Partial<DeviceDAOParams<OptionType & { mongoDB: Db }>>,
    dog?: Partial<DogDAOParams<OptionType & { mongoDB: Db }>>,
    organization?: Partial<OrganizationDAOParams<OptionType & { mongoDB: Db }>>,
    user?: Partial<UserDAOParams<OptionType & { mongoDB: Db }>>
  },
  mongoDB: Db,
  adapters?: { knexjs?: KnexJSDataTypeAdapterMap<types.Scalars>; mongodb?: MongoDBDataTypeAdapterMap<types.Scalars> }
};

export class DAOContext<OptionType = never> extends AbstractDAOContext {

  private _address: AddressDAO<OptionType & { mongoDB: Db }> | undefined;
  private _city: CityDAO<OptionType & { mongoDB: Db }> | undefined;
  private _device: DeviceDAO<OptionType & { mongoDB: Db }> | undefined;
  private _dog: DogDAO<OptionType & { mongoDB: Db }> | undefined;
  private _organization: OrganizationDAO<OptionType & { mongoDB: Db }> | undefined;
  private _user: UserDAO<OptionType & { mongoDB: Db }> | undefined;
  
  private overrides: DAOContextParams<OptionType>['overrides'];
  private mongoDB: Db | undefined;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, ...this.overrides?.address, collection: this.mongoDB!.collection('addresses') });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, ...this.overrides?.city, collection: this.mongoDB!.collection('citys') });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, ...this.overrides?.device, collection: this.mongoDB!.collection('devices') });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, ...this.overrides?.dog, collection: this.mongoDB!.collection('dogs') });
    }
    return this._dog;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, ...this.overrides?.organization, collection: this.mongoDB!.collection('organizations') });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, ...this.overrides?.user, collection: this.mongoDB!.collection('users') });
    }
    return this._user;
  }
  
  constructor(options?: DAOContextParams<OptionType>) {
    super(options?.adapters)
    this.overrides = options?.overrides
    this.mongoDB = options?.mongoDB
  }

}