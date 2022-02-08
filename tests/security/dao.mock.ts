import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger, ParamProjection } from '../../src';
import * as types from './models.mock';
import { MongoDBDAOGenerics, MongoDBDAOParams, AbstractMongoDBDAO, inMemoryMongoDb } from '../../src';
import { Collection, Db, Filter, Sort, UpdateFilter, Document } from 'mongodb';

//--------------------------------------------------------------------------------
//------------------------------------ HOTEL -------------------------------------
//--------------------------------------------------------------------------------

export type HotelExcludedFields = never
export type HotelRelationFields = never

export const hotelSchema: Schema<types.Scalars> = {
  'description': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  },
  'tenantId': {
    scalar: 'Int', 
    required: true
  },
  'totalCustomers': {
    scalar: 'Int', 
    required: true
  }
};

type HotelFilterFields = {
  'description'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'tenantId'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'totalCustomers'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type HotelFilter = HotelFilterFields & LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = () => Filter<Document>

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  description?: boolean,
  id?: boolean,
  name?: boolean,
  tenantId?: boolean,
  totalCustomers?: boolean,
}
export type HotelParam<P extends HotelProjection> = ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys = 'description' | 'id' | 'name' | 'tenantId' | 'totalCustomers';
export type HotelSort = OneKey<HotelSortKeys, SortDirection>;
export type HotelRawSort = () => Sort

export type HotelUpdate = {
  'description'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'tenantId'?: types.Scalars['Int'],
  'totalCustomers'?: types.Scalars['Int']
};
export type HotelRawUpdate = () => UpdateFilter<Document>

export type HotelInsert = {
  description?: types.Scalars['String'],
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  tenantId: types.Scalars['Int'],
  totalCustomers: types.Scalars['Int'],
};

type HotelDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Hotel, 'id', 'ID', 'generator', HotelFilter, HotelRawFilter, HotelRelations, HotelProjection, HotelSort, HotelRawSort, HotelInsert, HotelUpdate, HotelRawUpdate, HotelExcludedFields, HotelRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'hotel'>;
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class HotelDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: HotelDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: hotelSchema, 
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
//--------------------------------- RESERVATION ----------------------------------
//--------------------------------------------------------------------------------

export type ReservationExcludedFields = never
export type ReservationRelationFields = 'room'

export const reservationSchema: Schema<types.Scalars> = {
  'hotelId': {
    scalar: 'ID', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'roomId': {
    scalar: 'ID', 
    required: true
  },
  'tenantId': {
    scalar: 'Int', 
    required: true
  },
  'userId': {
    scalar: 'ID', 
    required: true
  }
};

type ReservationFilterFields = {
  'hotelId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'roomId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'tenantId'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type ReservationFilter = ReservationFilterFields & LogicalOperators<ReservationFilterFields | ReservationRawFilter>
export type ReservationRawFilter = () => Filter<Document>

export type ReservationRelations = Record<never, string>

export type ReservationProjection = {
  hotelId?: boolean,
  id?: boolean,
  room?: RoomProjection | boolean,
  roomId?: boolean,
  tenantId?: boolean,
  userId?: boolean,
}
export type ReservationParam<P extends ReservationProjection> = ParamProjection<types.Reservation, ReservationProjection, P>

export type ReservationSortKeys = 'hotelId' | 'id' | 'roomId' | 'tenantId' | 'userId';
export type ReservationSort = OneKey<ReservationSortKeys, SortDirection>;
export type ReservationRawSort = () => Sort

export type ReservationUpdate = {
  'hotelId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'roomId'?: types.Scalars['ID'],
  'tenantId'?: types.Scalars['Int'],
  'userId'?: types.Scalars['ID']
};
export type ReservationRawUpdate = () => UpdateFilter<Document>

export type ReservationInsert = {
  hotelId: types.Scalars['ID'],
  id?: types.Scalars['ID'],
  roomId: types.Scalars['ID'],
  tenantId: types.Scalars['Int'],
  userId: types.Scalars['ID'],
};

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Reservation, 'id', 'ID', 'generator', ReservationFilter, ReservationRawFilter, ReservationRelations, ReservationProjection, ReservationSort, ReservationRawSort, ReservationInsert, ReservationUpdate, ReservationRawUpdate, ReservationExcludedFields, ReservationRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'reservation'>;
export type ReservationDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class ReservationDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: ReservationDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: reservationSchema, 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'room', refFrom: 'roomId', refTo: 'id', dao: 'room', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- ROLE -------------------------------------
//--------------------------------------------------------------------------------

export type RoleExcludedFields = never
export type RoleRelationFields = never

export const roleSchema: Schema<types.Scalars> = {
  'code': {
    scalar: 'String', 
    required: true
  },
  'permissions': {
    scalar: 'String', 
    required: true, 
    array: true
  }
};

type RoleFilterFields = {
  'code'?: types.RoleCode | null | EqualityOperators<types.RoleCode> | ElementOperators | StringOperators,
  'permissions'?: types.Permission[] | null | EqualityOperators<types.Permission[]> | ElementOperators | StringOperators
};
export type RoleFilter = RoleFilterFields & LogicalOperators<RoleFilterFields | RoleRawFilter>
export type RoleRawFilter = () => Filter<Document>

export type RoleRelations = Record<never, string>

export type RoleProjection = {
  code?: boolean,
  permissions?: boolean,
}
export type RoleParam<P extends RoleProjection> = ParamProjection<types.Role, RoleProjection, P>

export type RoleSortKeys = 'code' | 'permissions';
export type RoleSort = OneKey<RoleSortKeys, SortDirection>;
export type RoleRawSort = () => Sort

export type RoleUpdate = {
  'code'?: types.RoleCode,
  'permissions'?: types.Permission[]
};
export type RoleRawUpdate = () => UpdateFilter<Document>

export type RoleInsert = {
  code: types.RoleCode,
  permissions: types.Permission[],
};

type RoleDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Role, 'code', 'String', 'user', RoleFilter, RoleRawFilter, RoleRelations, RoleProjection, RoleSort, RoleRawSort, RoleInsert, RoleUpdate, RoleRawUpdate, RoleExcludedFields, RoleRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'role'>;
export type RoleDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<RoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class RoleDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<RoleDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: RoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'code', 
      schema: roleSchema, 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'String' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- ROOM -------------------------------------
//--------------------------------------------------------------------------------

export type RoomExcludedFields = never
export type RoomRelationFields = 'hotel'

export const roomSchema: Schema<types.Scalars> = {
  'description': {
    scalar: 'String', 
    required: true
  },
  'from': {
    scalar: 'Date', 
    required: true
  },
  'hotelId': {
    scalar: 'ID', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'tenantId': {
    scalar: 'Int', 
    required: true
  },
  'to': {
    scalar: 'Date', 
    required: true
  }
};

type RoomFilterFields = {
  'description'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'from'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators,
  'hotelId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'tenantId'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'to'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators
};
export type RoomFilter = RoomFilterFields & LogicalOperators<RoomFilterFields | RoomRawFilter>
export type RoomRawFilter = () => Filter<Document>

export type RoomRelations = Record<never, string>

export type RoomProjection = {
  description?: boolean,
  from?: boolean,
  hotel?: HotelProjection | boolean,
  hotelId?: boolean,
  id?: boolean,
  tenantId?: boolean,
  to?: boolean,
}
export type RoomParam<P extends RoomProjection> = ParamProjection<types.Room, RoomProjection, P>

export type RoomSortKeys = 'description' | 'from' | 'hotelId' | 'id' | 'tenantId' | 'to';
export type RoomSort = OneKey<RoomSortKeys, SortDirection>;
export type RoomRawSort = () => Sort

export type RoomUpdate = {
  'description'?: types.Scalars['String'],
  'from'?: types.Scalars['Date'],
  'hotelId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'tenantId'?: types.Scalars['Int'],
  'to'?: types.Scalars['Date']
};
export type RoomRawUpdate = () => UpdateFilter<Document>

export type RoomInsert = {
  description: types.Scalars['String'],
  from: types.Scalars['Date'],
  hotelId: types.Scalars['ID'],
  id?: types.Scalars['ID'],
  tenantId: types.Scalars['Int'],
  to: types.Scalars['Date'],
};

type RoomDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Room, 'id', 'ID', 'generator', RoomFilter, RoomRawFilter, RoomRelations, RoomProjection, RoomSort, RoomRawSort, RoomInsert, RoomUpdate, RoomRawUpdate, RoomExcludedFields, RoomRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'room'>;
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class RoomDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: RoomDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: roomSchema, 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'hotel', refFrom: 'hotelId', refTo: 'id', dao: 'hotel', required: true }
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
export type UserRelationFields = 'reservations' | 'roles'

export const userSchema: Schema<types.Scalars> = {
  'email': {
    scalar: 'Email', 
    required: true
  },
  'firstName': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'lastName': {
    scalar: 'String'
  },
  'totalPayments': {
    scalar: 'Int'
  }
};

type UserFilterFields = {
  'email'?: types.Scalars['Email'] | null | EqualityOperators<types.Scalars['Email']> | ElementOperators,
  'firstName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'lastName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'totalPayments'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = () => Filter<Document>

export type UserRelations = {
  reservations?: {
    filter?: ReservationFilter
    sorts?: ReservationSort[] | ReservationRawSort
    skip?: number
    limit?: number
    relations?: ReservationRelations
  }
  roles?: {
    filter?: UserRoleFilter
    sorts?: UserRoleSort[] | UserRoleRawSort
    skip?: number
    limit?: number
    relations?: UserRoleRelations
  }
}

export type UserProjection = {
  email?: boolean,
  firstName?: boolean,
  id?: boolean,
  lastName?: boolean,
  reservations?: ReservationProjection | boolean,
  roles?: UserRoleProjection | boolean,
  totalPayments?: boolean,
}
export type UserParam<P extends UserProjection> = ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'email' | 'firstName' | 'id' | 'lastName' | 'totalPayments';
export type UserSort = OneKey<UserSortKeys, SortDirection>;
export type UserRawSort = () => Sort

export type UserUpdate = {
  'email'?: types.Scalars['Email'],
  'firstName'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null,
  'totalPayments'?: types.Scalars['Int'] | null
};
export type UserRawUpdate = () => UpdateFilter<Document>

export type UserInsert = {
  email: types.Scalars['Email'],
  firstName?: types.Scalars['String'],
  id?: types.Scalars['ID'],
  lastName?: types.Scalars['String'],
  totalPayments?: types.Scalars['Int'],
};

export type UserDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, UserRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'user'>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'reservations', refFrom: 'userId', refTo: 'id', dao: 'reservation', required: true },
          { type: '1-n', reference: 'foreign', field: 'roles', refFrom: 'refUserId', refTo: 'id', dao: 'userRole', required: true }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------------- USERROLE -----------------------------------
//--------------------------------------------------------------------------------

export type UserRoleExcludedFields = never
export type UserRoleRelationFields = 'role'

export const userRoleSchema: Schema<types.Scalars> = {
  'hotelId': {
    scalar: 'ID'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: '_id'
  },
  'refUserId': {
    scalar: 'ID', 
    required: true
  },
  'roleCode': {
    scalar: 'String', 
    required: true
  },
  'tenantId': {
    scalar: 'Int'
  },
  'userId': {
    scalar: 'ID'
  }
};

type UserRoleFilterFields = {
  'hotelId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'refUserId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'roleCode'?: types.RoleCode | null | EqualityOperators<types.RoleCode> | ElementOperators | StringOperators,
  'tenantId'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type UserRoleFilter = UserRoleFilterFields & LogicalOperators<UserRoleFilterFields | UserRoleRawFilter>
export type UserRoleRawFilter = () => Filter<Document>

export type UserRoleRelations = Record<never, string>

export type UserRoleProjection = {
  hotelId?: boolean,
  id?: boolean,
  refUserId?: boolean,
  role?: RoleProjection | boolean,
  roleCode?: boolean,
  tenantId?: boolean,
  userId?: boolean,
}
export type UserRoleParam<P extends UserRoleProjection> = ParamProjection<types.UserRole, UserRoleProjection, P>

export type UserRoleSortKeys = 'hotelId' | 'id' | 'refUserId' | 'roleCode' | 'tenantId' | 'userId';
export type UserRoleSort = OneKey<UserRoleSortKeys, SortDirection>;
export type UserRoleRawSort = () => Sort

export type UserRoleUpdate = {
  'hotelId'?: types.Scalars['ID'] | null,
  'id'?: types.Scalars['ID'],
  'refUserId'?: types.Scalars['ID'],
  'roleCode'?: types.RoleCode,
  'tenantId'?: types.Scalars['Int'] | null,
  'userId'?: types.Scalars['ID'] | null
};
export type UserRoleRawUpdate = () => UpdateFilter<Document>

export type UserRoleInsert = {
  hotelId?: types.Scalars['ID'],
  refUserId: types.Scalars['ID'],
  roleCode: types.RoleCode,
  tenantId?: types.Scalars['Int'],
  userId?: types.Scalars['ID'],
};

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.UserRole, 'id', 'ID', 'db', UserRoleFilter, UserRoleRawFilter, UserRoleRelations, UserRoleProjection, UserRoleSort, UserRoleRawSort, UserRoleInsert, UserRoleUpdate, UserRoleRawUpdate, UserRoleExcludedFields, UserRoleRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'userRole'>;
export type UserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserRoleDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userRoleSchema, 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'role', refFrom: 'roleCode', refTo: 'code', dao: 'role', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  middlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    role?: Pick<Partial<RoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    userRole?: Pick<Partial<UserRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  },
  mongo: Record<'default', Db>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>,
  log?: LogInput<'hotel' | 'reservation' | 'role' | 'room' | 'user' | 'userRole'>
};

type DAOContextMiddleware<MetadataType = never, OperationMetadataType = never> = DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType> | ReservationDAOGenerics<MetadataType, OperationMetadataType> | RoleDAOGenerics<MetadataType, OperationMetadataType> | RoomDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType> | UserRoleDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = never, OperationMetadataType = never> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined;
  private _reservation: ReservationDAO<MetadataType, OperationMetadataType> | undefined;
  private _role: RoleDAO<MetadataType, OperationMetadataType> | undefined;
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private mongo: Record<'default', Db>;
  
  private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: LogFunction<'hotel' | 'reservation' | 'role' | 'room' | 'user' | 'userRole'>
  
  get hotel() {
    if(!this._hotel) {
      this._hotel = new HotelDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.hotel, collection: this.mongo.default.collection('hotels'), middlewares: [...(this.overrides?.hotel?.middlewares || []), ...selectMiddleware('hotel', this.middlewares) as DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'hotel', logger: this.logger });
    }
    return this._hotel;
  }
  get reservation() {
    if(!this._reservation) {
      this._reservation = new ReservationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.reservation, collection: this.mongo.default.collection('reservations'), middlewares: [...(this.overrides?.reservation?.middlewares || []), ...selectMiddleware('reservation', this.middlewares) as DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'reservation', logger: this.logger });
    }
    return this._reservation;
  }
  get role() {
    if(!this._role) {
      this._role = new RoleDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.role, collection: this.mongo.default.collection('roles'), middlewares: [...(this.overrides?.role?.middlewares || []), ...selectMiddleware('role', this.middlewares) as DAOMiddleware<RoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'role', logger: this.logger });
    }
    return this._role;
  }
  get room() {
    if(!this._room) {
      this._room = new RoomDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.room, collection: this.mongo.default.collection('rooms'), middlewares: [...(this.overrides?.room?.middlewares || []), ...selectMiddleware('room', this.middlewares) as DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'room', logger: this.logger });
    }
    return this._room;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, collection: this.mongo.default.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger });
    }
    return this._user;
  }
  get userRole() {
    if(!this._userRole) {
      this._userRole = new UserRoleDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.userRole, collection: this.mongo.default.collection('userRoles'), middlewares: [...(this.overrides?.userRole?.middlewares || []), ...selectMiddleware('userRole', this.middlewares) as DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'userRole', logger: this.logger });
    }
    return this._userRole;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
  }
  
  public async execQuery<T>(run: (dbs: { mongo: Record<'default', Db> }, entities: { hotel: Collection<Document>; reservation: Collection<Document>; role: Collection<Document>; room: Collection<Document>; user: Collection<Document>; userRole: Collection<Document> }) => Promise<T>): Promise<T> {
    return run({ mongo: this.mongo }, { hotel: this.mongo.default.collection('hotels'), reservation: this.mongo.default.collection('reservations'), role: this.mongo.default.collection('roles'), room: this.mongo.default.collection('rooms'), user: this.mongo.default.collection('users'), userRole: this.mongo.default.collection('userRoles') })
  }
  
  

}


//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

type DAOName = keyof DAOMiddlewareMap<never, never>
type DAOMiddlewareMap<MetadataType, OperationMetadataType> = {
  hotel: HotelDAOGenerics<MetadataType, OperationMetadataType>
  reservation: ReservationDAOGenerics<MetadataType, OperationMetadataType>
  role: RoleDAOGenerics<MetadataType, OperationMetadataType>
  room: RoomDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
  userRole: UserRoleDAOGenerics<MetadataType, OperationMetadataType>
}
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): DAOContextMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as DAOContextMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
export async function mockedDAOContext<MetadataType = never, OperationMetadataType = never>(params: MockDAOContextParams<DAOContextParams<MetadataType, OperationMetadataType>>) {
  const newParams = await createMockedDAOContext<DAOContextParams<MetadataType, OperationMetadataType>>(params, ['default'], [])
  return new DAOContext(newParams)
}