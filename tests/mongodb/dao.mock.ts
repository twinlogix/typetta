import BigNumber from "bignumber.js";
import { Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';
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

type AddressDAOAllParams<OptionType> = MongoDBDAOParams<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressProjection, AddressUpdate, AddressExcludedFields, AddressSort, OptionType, types.Scalars>;
export type AddressDAOParams<OptionType> = Omit<AddressDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class AddressDAO<OptionType extends object> extends AbstractMongoDBDAO<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressProjection, AddressSort, AddressUpdate, AddressExcludedFields, OptionType, types.Scalars> {
  
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

type CityDAOAllParams<OptionType> = MongoDBDAOParams<types.City, 'id', 'ID', 'generator', CityFilter, CityProjection, CityUpdate, CityExcludedFields, CitySort, OptionType, types.Scalars>;
export type CityDAOParams<OptionType> = Omit<CityDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class CityDAO<OptionType extends object> extends AbstractMongoDBDAO<types.City, 'id', 'ID', 'generator', CityFilter, CityProjection, CitySort, CityUpdate, CityExcludedFields, OptionType, types.Scalars> {
  
  public constructor(params: CityDAOParams<OptionType>){
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

type DeviceDAOAllParams<OptionType> = MongoDBDAOParams<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceProjection, DeviceUpdate, DeviceExcludedFields, DeviceSort, OptionType, types.Scalars>;
export type DeviceDAOParams<OptionType> = Omit<DeviceDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class DeviceDAO<OptionType extends object> extends AbstractMongoDBDAO<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceProjection, DeviceSort, DeviceUpdate, DeviceExcludedFields, OptionType, types.Scalars> {
  
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

type DogDAOAllParams<OptionType> = MongoDBDAOParams<types.Dog, 'id', 'ID', 'generator', DogFilter, DogProjection, DogUpdate, DogExcludedFields, DogSort, OptionType, types.Scalars>;
export type DogDAOParams<OptionType> = Omit<DogDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class DogDAO<OptionType extends object> extends AbstractMongoDBDAO<types.Dog, 'id', 'ID', 'generator', DogFilter, DogProjection, DogSort, DogUpdate, DogExcludedFields, OptionType, types.Scalars> {
  
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

type OrganizationDAOAllParams<OptionType> = MongoDBDAOParams<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationProjection, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, OptionType, types.Scalars>;
export type OrganizationDAOParams<OptionType> = Omit<OrganizationDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class OrganizationDAO<OptionType extends object> extends AbstractMongoDBDAO<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationProjection, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, OptionType, types.Scalars> {
  
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
      idGeneration: 'generator', 
      idScalar: 'ID' 
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

type UserDAOAllParams<OptionType> = MongoDBDAOParams<types.User, 'id', 'ID', 'generator', UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, OptionType, types.Scalars>;
export type UserDAOParams<OptionType> = Omit<UserDAOAllParams<OptionType>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>;

export class UserDAO<OptionType extends object> extends AbstractMongoDBDAO<types.User, 'id', 'ID', 'generator', UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, OptionType, types.Scalars> {
  
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
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<OptionsType> = {
  options?: OptionsType
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    city?: Pick<Partial<CityDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    device?: Pick<Partial<DeviceDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    dog?: Pick<Partial<DogDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    organization?: Pick<Partial<OrganizationDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>,
    user?: Pick<Partial<UserDAOParams<OptionsType>>, 'idGenerator' | 'middlewares' | 'options'>
  },
  mongoDB: Record<'default', Db>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<OptionType extends object = {}> extends AbstractDAOContext<types.Scalars, OptionType>  {

  private _address: AddressDAO<OptionType> | undefined;
  private _city: CityDAO<OptionType> | undefined;
  private _device: DeviceDAO<OptionType> | undefined;
  private _dog: DogDAO<OptionType> | undefined;
  private _organization: OrganizationDAO<OptionType> | undefined;
  private _user: UserDAO<OptionType> | undefined;
  
  private overrides: DAOContextParams<OptionType>['overrides'];
  private mongoDB: Record<'default', Db>;
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, options: this.options, ...this.overrides?.address, collection: this.mongoDB['default'].collection('addresses') });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, options: this.options, ...this.overrides?.city, collection: this.mongoDB['default'].collection('citys') });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, options: this.options, ...this.overrides?.device, collection: this.mongoDB['default'].collection('devices') });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, options: this.options, ...this.overrides?.dog, collection: this.mongoDB['default'].collection('dogs') });
    }
    return this._dog;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, options: this.options, ...this.overrides?.organization, collection: this.mongoDB['default'].collection('organizations') });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, options: this.options, ...this.overrides?.user, collection: this.mongoDB['default'].collection('users') });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<OptionType>) {
    super(params)
    this.overrides = params.overrides
    this.mongoDB = params.mongoDB
  }

}