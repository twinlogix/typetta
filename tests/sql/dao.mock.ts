import { DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, DAORelationType, DAORelationReference, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter } from '../../src';
import * as types from './models.mock';
import { KnexJsDAOGenerics, KnexJsDAOParams, AbstractKnexJsDAO } from '../../src';
import { Knex } from 'knex';

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
export type AddressRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressRelations = {
  cities?: {
    filter?: CityFilter
    sorts?: CitySort[] | CityRawSort
    skip?: number
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
export type AddressRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressUpdate = {
  'id'?: string
};
export type AddressRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressInsert = {
  id?: string,
};

type AddressDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressRawFilter, AddressRelations, AddressProjection, AddressSort, AddressRawSort, AddressInsert, AddressUpdate, AddressRawUpdate, AddressExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
export type CityRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type CityRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityUpdate = {
  'addressId'?: string,
  'id'?: string,
  'name'?: string
};
export type CityRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityInsert = {
  addressId: string,
  id?: string,
  name: string,
};

type CityDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityRawFilter, CityRelations, CityProjection, CitySort, CityRawSort, CityInsert, CityUpdate, CityRawUpdate, CityExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
export type DeviceRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type DeviceRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceUpdate = {
  'id'?: string,
  'name'?: string,
  'userId'?: string | null
};
export type DeviceRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceInsert = {
  id?: string,
  name: string,
  userId?: string,
};

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceRawFilter, DeviceRelations, DeviceProjection, DeviceSort, DeviceRawSort, DeviceInsert, DeviceUpdate, DeviceRawUpdate, DeviceExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
export type DogRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type DogRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogUpdate = {
  'id'?: string,
  'name'?: string,
  'ownerId'?: string
};
export type DogRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogInsert = {
  id?: string,
  name: string,
  ownerId: string,
};

type DogDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Dog, 'id', 'ID', 'generator', DogFilter, DogRawFilter, DogRelations, DogProjection, DogSort, DogRawSort, DogInsert, DogUpdate, DogRawUpdate, DogExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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

export const friendsSchema: Schema<types.Scalars> = {
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
export type FriendsRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type FriendsRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsUpdate = {
  'from'?: string,
  'id'?: string,
  'to'?: string
};
export type FriendsRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsInsert = {
  from: string,
  id?: string,
  to: string,
};

type FriendsDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Friends, 'id', 'ID', 'generator', FriendsFilter, FriendsRawFilter, FriendsRelations, FriendsProjection, FriendsSort, FriendsRawSort, FriendsInsert, FriendsUpdate, FriendsRawUpdate, FriendsExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type FriendsDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
export type OrganizationRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type OrganizationRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationUpdate = {
  'address'?: types.Address | null,
  'address.id'?: string,
  'id'?: string,
  'name'?: string,
  'vatNumber'?: string | null
};
export type OrganizationRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationInsert = {
  address?: types.Address,
  id?: string,
  name: string,
  vatNumber?: string,
};

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationRawFilter, OrganizationRelations, OrganizationProjection, OrganizationSort, OrganizationRawSort, OrganizationInsert, OrganizationUpdate, OrganizationRawUpdate, OrganizationExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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

export const userSchema: Schema<types.Scalars> = {
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
  'amount'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'amounts'?: any[] | null | EqualityOperators<any[]> | ElementOperators | StringOperators,
  'bestFriendId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'credentials.another.test'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'credentials.password'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'credentials.username'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'live'?: boolean | null | EqualityOperators<boolean> | ElementOperators | StringOperators,
  'localization'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'title'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;
export type UserRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserRelations = {
  dogs?: {
    filter?: DogFilter
    sorts?: DogSort[] | DogRawSort
    skip?: number
    limit?: number
    relations?: DogRelations
  }
  friends?: {
    filter?: UserFilter
    sorts?: UserSort[] | UserRawSort
    skip?: number
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
export type UserRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserUpdate = {
  'amount'?: any | null,
  'amounts'?: Array<any> | null,
  'bestFriendId'?: string | null,
  'credentials'?: types.UsernamePasswordCredentials | null,
  'credentials.another'?: types.Another | null,
  'credentials.another.test'?: string | null,
  'credentials.password'?: any,
  'credentials.username'?: string,
  'firstName'?: string | null,
  'id'?: string,
  'lastName'?: string | null,
  'live'?: boolean,
  'localization'?: any | null,
  'title'?: any | null
};
export type UserRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserInsert = {
  amount?: any,
  amounts?: any[],
  bestFriendId?: string,
  credentials?: types.UsernamePasswordCredentials,
  firstName?: string,
  id?: string,
  lastName?: string,
  live: boolean,
  localization?: any,
  title?: any,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
  middlewares?: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
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
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>
};

type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType> | CityDAOGenerics<MetadataType, OperationMetadataType> | DeviceDAOGenerics<MetadataType, OperationMetadataType> | DogDAOGenerics<MetadataType, OperationMetadataType> | FriendsDAOGenerics<MetadataType, OperationMetadataType> | OrganizationDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType>>

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
  
  private middlewares: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  
  get address() {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, knex: this.knex.default, tableName: 'addresses', middlewares: [...(this.overrides?.address?.middlewares || []), ...this.middlewares as DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._address;
  }
  get city() {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, knex: this.knex.default, tableName: 'citys', middlewares: [...(this.overrides?.city?.middlewares || []), ...this.middlewares as DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._city;
  }
  get device() {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, knex: this.knex.default, tableName: 'devices', middlewares: [...(this.overrides?.device?.middlewares || []), ...this.middlewares as DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._device;
  }
  get dog() {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.dog, knex: this.knex.default, tableName: 'dogs', middlewares: [...(this.overrides?.dog?.middlewares || []), ...this.middlewares as DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._dog;
  }
  get friends() {
    if(!this._friends) {
      this._friends = new FriendsDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.friends, knex: this.knex.default, tableName: 'friendss', middlewares: [...(this.overrides?.friends?.middlewares || []), ...this.middlewares as DAOMiddleware<FriendsDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._friends;
  }
  get organization() {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, knex: this.knex.default, tableName: 'organizations', middlewares: [...(this.overrides?.organization?.middlewares || []), ...this.middlewares as DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._organization;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users', middlewares: [...(this.overrides?.user?.middlewares || []), ...this.middlewares as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'LocalizedString', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.knex = params.knex;
    this.middlewares = params.middlewares || []
  }
  
  public async execQuery<T>(run: (dbs: { knex: Record<'default', Knex> }, entities: { address: Knex.QueryBuilder<any, unknown[]>; city: Knex.QueryBuilder<any, unknown[]>; device: Knex.QueryBuilder<any, unknown[]>; dog: Knex.QueryBuilder<any, unknown[]>; friends: Knex.QueryBuilder<any, unknown[]>; organization: Knex.QueryBuilder<any, unknown[]>; user: Knex.QueryBuilder<any, unknown[]> }) => Promise<T>): Promise<T> {
    return run({ knex: this.knex }, { address: this.knex.default.table('addresses'), city: this.knex.default.table('citys'), device: this.knex.default.table('devices'), dog: this.knex.default.table('dogs'), friends: this.knex.default.table('friendss'), organization: this.knex.default.table('organizations'), user: this.knex.default.table('users') })
  }

}