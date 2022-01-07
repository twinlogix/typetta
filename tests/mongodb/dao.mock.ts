import BigNumber from "bignumber.js";
import { DAOMiddleware, MongoDBDAOGenerics, KnexJsDAOGenerics, Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAORelationType, DAORelationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideRelations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Collection, Db } from 'mongodb';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid'

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export type AddressExcludedFields = 'cities'

export const addressSchema: Schema<types.Scalars> = {
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

type AddressDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressRelations, AddressProjection, AddressSort, AddressInsert, AddressUpdate, AddressExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class AddressDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  
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

export const citySchema: Schema<types.Scalars> = {
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

type CityDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityRelations, CityProjection, CitySort, CityInsert, CityUpdate, CityExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class CityDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  
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

export const deviceSchema: Schema<types.Scalars> = {
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

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceRelations, DeviceProjection, DeviceSort, DeviceInsert, DeviceUpdate, DeviceExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DeviceDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  
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

export const dogSchema: Schema<types.Scalars> = {
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

type DogDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Dog, 'id', 'ID', 'generator', DogFilter, DogRelations, DogProjection, DogSort, DogInsert, DogUpdate, DogExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class DogDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  
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
//--------------------------------- ORGANIZATION ---------------------------------
//--------------------------------------------------------------------------------

export type OrganizationExcludedFields = 'computedName'

export const organizationSchema: Schema<types.Scalars> = {
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

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationRelations, OrganizationProjection, OrganizationSort, OrganizationInsert, OrganizationUpdate, OrganizationExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  
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
//------------------------------------- POST -------------------------------------
//--------------------------------------------------------------------------------

export type PostExcludedFields = 'author'

export const postSchema: Schema<types.Scalars> = {
  'authorId': {
    scalar: 'ID', 
    required: true, 
    alias: 'aId'
  },
  'body': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'metadata': {
    embedded: {
      'region': {
        scalar: 'String', 
        required: true
      },
      'visible': {
        scalar: 'Boolean', 
        required: true
      }
    }
  },
  'title': {
    scalar: 'String', 
    required: true
  },
  'views': {
    scalar: 'Int', 
    required: true
  }
};

type PostFilterFields = {
  'authorId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'body'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'metadata.region'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'metadata.visible'?: boolean | null | EqualityOperators<boolean> | ElementOperators,
  'title'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'views'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type PostFilter = PostFilterFields & LogicalOperators<PostFilterFields>;

export type PostRelations = {

}

export type PostProjection = {
  author?: UserProjection | boolean,
  authorId?: boolean,
  body?: boolean,
  id?: boolean,
  metadata?: {
    region?: boolean,
    visible?: boolean,
  } | boolean,
  title?: boolean,
  views?: boolean,
};

export type PostSortKeys = 
  'authorId'|
  'body'|
  'id'|
  'metadata.region'|
  'metadata.visible'|
  'title'|
  'views';
export type PostSort = OneKey<PostSortKeys, SortDirection>;

export type PostUpdate = {
  'authorId'?: string,
  'body'?: string | null,
  'id'?: string,
  'metadata'?: types.PostMetadata | null,
  'metadata.region'?: string,
  'metadata.visible'?: boolean,
  'title'?: string,
  'views'?: number
};

export type PostInsert = {
  authorId: string,
  body?: string,
  id?: string,
  metadata?: types.PostMetadata,
  title: string,
  views: number,
};

type PostDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Post, 'id', 'ID', 'generator', PostFilter, PostRelations, PostProjection, PostSort, PostInsert, PostUpdate, PostExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class PostDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: postSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'author', refFrom: 'authorId', refTo: 'id', dao: 'user' }
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

export const userSchema: Schema<types.Scalars> = {
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

export type UserInsert = {
  amount?: BigNumber,
  amounts?: BigNumber[],
  firstName?: string,
  friendsId?: string[],
  id?: string,
  lastName?: string,
  live: boolean,
  localization?: Coordinates,
  title?: LocalizedString,
  usernamePasswordCredentials?: types.UsernamePasswordCredentials,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRelations, UserProjection, UserSort, UserInsert, UserUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'dogs', refFrom: 'ownerId', refTo: 'id', dao: 'dog' },
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.INNER, field: 'friends', refFrom: 'friendsId', refTo: 'id', dao: 'user' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  middlewares?: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  mongo: Record<'default', Db>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType> | CityDAOGenerics<MetadataType, OperationMetadataType> | DeviceDAOGenerics<MetadataType, OperationMetadataType> | DogDAOGenerics<MetadataType, OperationMetadataType> | OrganizationDAOGenerics<MetadataType, OperationMetadataType> | PostDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined;
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined;
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined;
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined;
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined;
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private mongo: Record<'default', Db>;
  
  private middlewares: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, collection: this.mongo.default.collection('addresses'), middlewares: [...(this.overrides?.address?.middlewares || []), ...this.middlewares as DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, collection: this.mongo.default.collection('citys'), middlewares: [...(this.overrides?.city?.middlewares || []), ...this.middlewares as DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, collection: this.mongo.default.collection('devices'), middlewares: [...(this.overrides?.device?.middlewares || []), ...this.middlewares as DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.dog, collection: this.mongo.default.collection('dogs'), middlewares: [...(this.overrides?.dog?.middlewares || []), ...this.middlewares as DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._dog;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, collection: this.mongo.default.collection('organizations'), middlewares: [...(this.overrides?.organization?.middlewares || []), ...this.middlewares as DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._organization;
  }
  get post() {
    if(!this._post) {
      this._post = new PostDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.post, collection: this.mongo.default.collection('posts'), middlewares: [...(this.overrides?.post?.middlewares || []), ...this.middlewares as DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._post;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, collection: this.mongo.default.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...this.middlewares as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.middlewares = params.middlewares || []
  }
  
  public async execQuery<T>(run: (dbs: { mongo: Record<'default', Db> }, entities: { address: Collection<Document>; city: Collection<Document>; device: Collection<Document>; dog: Collection<Document>; organization: Collection<Document>; post: Collection<Document>; user: Collection<Document> }) => Promise<T>): Promise<T> {
    return run({ mongo: this.mongo }, { address: this.mongo.default.collection('addresses'), city: this.mongo.default.collection('citys'), device: this.mongo.default.collection('devices'), dog: this.mongo.default.collection('dogs'), organization: this.mongo.default.collection('organizations'), post: this.mongo.default.collection('posts'), user: this.mongo.default.collection('users') })
  }

}