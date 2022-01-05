import BigNumber from "bignumber.js";
import { MongoDBDAOGenerics, KnexJsDAOGenerics, Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAORelationType, DAORelationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideRelations } from '@twinlogix/typetta';
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

export type AddressRelations = {
  cities?: {
    filter?: CityFilter
    sorts?: CitySort[]
    start?: number
    limit?: number
    relations?: CityRelations
  }
}

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

type AddressDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressRelations, AddressProjection, AddressSort, AddressInsert, AddressUpdate, AddressExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class AddressDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: AddressDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: addressSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }
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

export type CityRelations = {

}

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

type CityDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityRelations, CityProjection, CitySort, CityInsert, CityUpdate, CityExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CityDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: CityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: citySchema, 
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

export type DeviceRelations = {

}

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

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceRelations, DeviceProjection, DeviceSort, DeviceInsert, DeviceUpdate, DeviceExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DeviceDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: DeviceDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: deviceSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'user', refFrom: 'userId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
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

export type DogRelations = {

}

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

export type DogInsert = {
  id?: string,
  name: string,
  ownerId: string,
};

type DogDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Dog, 'id', 'ID', 'generator', DogFilter, DogRelations, DogProjection, DogSort, DogInsert, DogUpdate, DogExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DogDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: DogDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: dogSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'owner', refFrom: 'ownerId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------------- FRIENDS ------------------------------------
//--------------------------------------------------------------------------------

export type FriendsExcludedFields = never

export const friendsSchema : Schema<types.Scalars>= {
  'from': {
    scalar: 'ID', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'to': {
    scalar: 'ID', 
    required: true
  }
};

type FriendsFilterFields = {
  'from'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'to'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
};
export type FriendsFilter = FriendsFilterFields & LogicalOperators<FriendsFilterFields>;

export type FriendsRelations = {

}

export type FriendsProjection = {
  from?: boolean,
  id?: boolean,
  to?: boolean,
};

export type FriendsSortKeys = 
  'from'|
  'id'|
  'to';
export type FriendsSort = OneKey<FriendsSortKeys, SortDirection>;

export type FriendsUpdate = {
  'from'?: string,
  'id'?: string,
  'to'?: string
};

export type FriendsInsert = {
  from: string,
  id?: string,
  to: string,
};

type FriendsDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Friends, 'id', 'ID', 'generator', FriendsFilter, FriendsRelations, FriendsProjection, FriendsSort, FriendsInsert, FriendsUpdate, FriendsExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type FriendsDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class FriendsDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: FriendsDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: friendsSchema, 
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

export type OrganizationRelations = {

}

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

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationRelations, OrganizationProjection, OrganizationSort, OrganizationInsert, OrganizationUpdate, OrganizationExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: OrganizationDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: organizationSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' }
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

export type UserExcludedFields = 'bestFriend' | 'dogs'

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
  'bestFriendId': {
    scalar: 'ID'
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
  'bestFriendId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
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

export type UserRelations = {
  dogs?: {
    filter?: DogFilter
    sorts?: DogSort[]
    start?: number
    limit?: number
    relations?: DogRelations
  }
  friends?: {
    filter?: UserFilter
    sorts?: UserSort[]
    start?: number
    limit?: number
    relations?: UserRelations
  }
}

export type UserProjection = {
  amount?: boolean,
  amounts?: boolean,
  bestFriend?: UserProjection | boolean,
  bestFriendId?: boolean,
  credentials?: {
    another?: {
      test?: boolean,
    } | boolean,
    password?: boolean,
    username?: boolean,
  } | boolean,
  dogs?: DogProjection | boolean,
  firstName?: boolean,
  friends?: UserProjection | boolean,
  id?: boolean,
  lastName?: boolean,
  live?: boolean,
  localization?: boolean,
  title?: boolean,
};

export type UserSortKeys = 
  'amount'|
  'amounts'|
  'bestFriendId'|
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
  'bestFriendId'?: string | null,
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
  bestFriendId?: string,
  credentials?: types.UsernamePasswordCredentials,
  firstName?: string,
  id?: string,
  lastName?: string,
  live: boolean,
  localization?: Coordinates,
  title?: LocalizedString,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRelations, UserProjection, UserSort, UserInsert, UserUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'bestFriend', refFrom: 'bestFriendId', refTo: 'id', dao: 'user' },
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'dogs', refFrom: 'ownerId', refTo: 'id', dao: 'dog' },
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.RELATION, field: 'friends', relationDao: 'friends', entityDao: 'user', refThis: { refFrom: 'from', refTo: 'id' }, refOther: { refFrom: 'to', refTo: 'id' } }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    friends?: Pick<Partial<FriendsDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined;
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined;
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined;
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined;
  private _friends: FriendsDAO<MetadataType, OperationMetadataType> | undefined;
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private knex: Record<'default', Knex>;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, knex: this.knex.default, tableName: 'addresses' });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, knex: this.knex.default, tableName: 'citys' });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, knex: this.knex.default, tableName: 'devices' });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.dog, knex: this.knex.default, tableName: 'dogs' });
    }
    return this._dog;
  }
  get friends() {
    if(!this._friends) {
      this._friends = new FriendsDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.friends, knex: this.knex.default, tableName: 'friendss' });
    }
    return this._friends;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, knex: this.knex.default, tableName: 'organizations' });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users' });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.knex = params.knex;
  }

}