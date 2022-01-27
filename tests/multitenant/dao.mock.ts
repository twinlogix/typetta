import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger } from '../../src';
import * as types from './models.mock';
import { MongoDBDAOGenerics, MongoDBDAOParams, AbstractMongoDBDAO, inMemoryMongoDb } from '../../src';
import { Collection, Db, Filter, Sort, UpdateFilter, Document } from 'mongodb';

//--------------------------------------------------------------------------------
//------------------------------------ HOTEL -------------------------------------
//--------------------------------------------------------------------------------

export type HotelExcludedFields = never
export type HotelRelationFields = never

export const hotelSchema: Schema<types.Scalars> = {
  'deletionDate': {
    scalar: 'Date'
  },
  'description': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: '_id'
  },
  'name': {
    scalar: 'String', 
    required: true
  },
  'tenantId': {
    scalar: 'TenantId', 
    required: true
  }
};

type HotelFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators,
  'description'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | EqualityOperators<types.Scalars['TenantId']> | ElementOperators
};
export type HotelFilter = HotelFilterFields & LogicalOperators<HotelFilterFields>;
export type HotelRawFilter = () => Filter<Document>

export type HotelRelations = {

}

export type HotelProjection = {
  deletionDate?: boolean,
  description?: boolean,
  id?: boolean,
  name?: boolean,
  tenantId?: boolean,
};

export type HotelSortKeys = 'deletionDate' | 'description' | 'id' | 'name' | 'tenantId';
export type HotelSort = OneKey<HotelSortKeys, SortDirection>;
export type HotelRawSort = () => Sort

export type HotelUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'description'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'tenantId'?: types.Scalars['TenantId']
};
export type HotelRawUpdate = () => UpdateFilter<Document>

export type HotelInsert = {
  deletionDate?: types.Scalars['Date'],
  description?: types.Scalars['String'],
  name: types.Scalars['String'],
  tenantId: types.Scalars['TenantId'],
};

type HotelDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Hotel, 'id', 'ID', 'db', HotelFilter, HotelRawFilter, HotelRelations, HotelProjection, HotelSort, HotelRawSort, HotelInsert, HotelUpdate, HotelRawUpdate, HotelExcludedFields, HotelRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'hotel'>;
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
      idGeneration: 'db', 
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
  'deletionDate': {
    scalar: 'Date'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: '_id'
  },
  'roomId': {
    scalar: 'ID', 
    required: true
  },
  'tenantId': {
    scalar: 'TenantId'
  },
  'userId': {
    scalar: 'ID', 
    required: true
  }
};

type ReservationFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'roomId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | EqualityOperators<types.Scalars['TenantId']> | ElementOperators,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type ReservationFilter = ReservationFilterFields & LogicalOperators<ReservationFilterFields>;
export type ReservationRawFilter = () => Filter<Document>

export type ReservationRelations = {

}

export type ReservationProjection = {
  deletionDate?: boolean,
  id?: boolean,
  room?: RoomProjection | boolean,
  roomId?: boolean,
  tenantId?: boolean,
  userId?: boolean,
};

export type ReservationSortKeys = 'deletionDate' | 'id' | 'roomId' | 'tenantId' | 'userId';
export type ReservationSort = OneKey<ReservationSortKeys, SortDirection>;
export type ReservationRawSort = () => Sort

export type ReservationUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'id'?: types.Scalars['ID'],
  'roomId'?: types.Scalars['ID'],
  'tenantId'?: types.Scalars['TenantId'] | null,
  'userId'?: types.Scalars['ID']
};
export type ReservationRawUpdate = () => UpdateFilter<Document>

export type ReservationInsert = {
  deletionDate?: types.Scalars['Date'],
  roomId: types.Scalars['ID'],
  tenantId?: types.Scalars['TenantId'],
  userId: types.Scalars['ID'],
};

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Reservation, 'id', 'ID', 'db', ReservationFilter, ReservationRawFilter, ReservationRelations, ReservationProjection, ReservationSort, ReservationRawSort, ReservationInsert, ReservationUpdate, ReservationRawUpdate, ReservationExcludedFields, ReservationRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'reservation'>;
export type ReservationDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- ROOM -------------------------------------
//--------------------------------------------------------------------------------

export type RoomExcludedFields = never
export type RoomRelationFields = 'hotel'

export const roomSchema: Schema<types.Scalars> = {
  'deletionDate': {
    scalar: 'Date'
  },
  'hotelId': {
    scalar: 'ID', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: '_id'
  },
  'size': {
    scalar: 'String', 
    required: true
  },
  'tenantId': {
    scalar: 'TenantId'
  }
};

type RoomFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators,
  'hotelId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'size'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | EqualityOperators<types.Scalars['TenantId']> | ElementOperators
};
export type RoomFilter = RoomFilterFields & LogicalOperators<RoomFilterFields>;
export type RoomRawFilter = () => Filter<Document>

export type RoomRelations = {

}

export type RoomProjection = {
  deletionDate?: boolean,
  hotel?: HotelProjection | boolean,
  hotelId?: boolean,
  id?: boolean,
  size?: boolean,
  tenantId?: boolean,
};

export type RoomSortKeys = 'deletionDate' | 'hotelId' | 'id' | 'size' | 'tenantId';
export type RoomSort = OneKey<RoomSortKeys, SortDirection>;
export type RoomRawSort = () => Sort

export type RoomUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'hotelId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'size'?: types.Scalars['String'],
  'tenantId'?: types.Scalars['TenantId'] | null
};
export type RoomRawUpdate = () => UpdateFilter<Document>

export type RoomInsert = {
  deletionDate?: types.Scalars['Date'],
  hotelId: types.Scalars['ID'],
  size: types.Scalars['String'],
  tenantId?: types.Scalars['TenantId'],
};

type RoomDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Room, 'id', 'ID', 'db', RoomFilter, RoomRawFilter, RoomRelations, RoomProjection, RoomSort, RoomRawSort, RoomInsert, RoomUpdate, RoomRawUpdate, RoomExcludedFields, RoomRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'room'>;
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

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
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never
export type UserRelationFields = 'reservations'

export const userSchema: Schema<types.Scalars> = {
  'credentials': {
    embedded: {
      'password': {
        scalar: 'Password', 
        required: true
      },
      'username': {
        scalar: 'Username', 
        required: true
      }
    }, 
    alias: 'cred'
  },
  'deletionDate': {
    scalar: 'Date'
  },
  'email': {
    scalar: 'Email', 
    required: true
  },
  'firstName': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true, 
    alias: '_id'
  },
  'lastName': {
    scalar: 'String'
  },
  'tenantId': {
    scalar: 'TenantId'
  }
};

type UserFilterFields = {
  'credentials.password'?: types.Scalars['Password'] | null | EqualityOperators<types.Scalars['Password']> | ElementOperators,
  'credentials.username'?: types.Scalars['Username'] | null | EqualityOperators<types.Scalars['Username']> | ElementOperators,
  'deletionDate'?: types.Scalars['Date'] | null | EqualityOperators<types.Scalars['Date']> | ElementOperators,
  'email'?: types.Scalars['Email'] | null | EqualityOperators<types.Scalars['Email']> | ElementOperators,
  'firstName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'lastName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | EqualityOperators<types.Scalars['TenantId']> | ElementOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;
export type UserRawFilter = () => Filter<Document>

export type UserRelations = {
  reservations?: {
    filter?: ReservationFilter
    sorts?: ReservationSort[] | ReservationRawSort
    skip?: number
    limit?: number
    relations?: ReservationRelations
  }
}

export type UserProjection = {
  credentials?: {
    password?: boolean,
    username?: boolean,
  } | boolean,
  deletionDate?: boolean,
  email?: boolean,
  firstName?: boolean,
  id?: boolean,
  lastName?: boolean,
  reservations?: ReservationProjection | boolean,
  tenantId?: boolean,
};

export type UserSortKeys = 'credentials.password' | 'credentials.username' | 'deletionDate' | 'email' | 'firstName' | 'id' | 'lastName' | 'tenantId';
export type UserSort = OneKey<UserSortKeys, SortDirection>;
export type UserRawSort = () => Sort

export type UserUpdate = {
  'credentials'?: types.UsernamePasswordCredentials | null,
  'credentials.password'?: types.Scalars['Password'],
  'credentials.username'?: types.Scalars['Username'],
  'deletionDate'?: types.Scalars['Date'] | null,
  'email'?: types.Scalars['Email'],
  'firstName'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null,
  'tenantId'?: types.Scalars['TenantId'] | null
};
export type UserRawUpdate = () => UpdateFilter<Document>

export type UserInsert = {
  credentials?: types.UsernamePasswordCredentials,
  deletionDate?: types.Scalars['Date'],
  email: types.Scalars['Email'],
  firstName?: types.Scalars['String'],
  lastName?: types.Scalars['String'],
  tenantId?: types.Scalars['TenantId'],
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.User, 'id', 'ID', 'db', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, UserRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'user'>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'reservations', refFrom: 'userId', refTo: 'id', dao: 'reservation', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  middlewares?: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  overrides?: { 
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  },
  mongo: Record<'default', Db>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>,
  log?: LogInput<'hotel' | 'reservation' | 'room' | 'user'>
};

type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType> | ReservationDAOGenerics<MetadataType, OperationMetadataType> | RoomDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined;
  private _reservation: ReservationDAO<MetadataType, OperationMetadataType> | undefined;
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private mongo: Record<'default', Db>;
  
  private middlewares: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  
  private logger?: LogFunction<'hotel' | 'reservation' | 'room' | 'user'>
  
  get hotel() {
    if(!this._hotel) {
      this._hotel = new HotelDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.hotel, collection: this.mongo.default.collection('hotels'), middlewares: [...(this.overrides?.hotel?.middlewares || []), ...this.middlewares as DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'hotel', logger: this.logger });
    }
    return this._hotel;
  }
  get reservation() {
    if(!this._reservation) {
      this._reservation = new ReservationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.reservation, collection: this.mongo.default.collection('reservations'), middlewares: [...(this.overrides?.reservation?.middlewares || []), ...this.middlewares as DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'reservation', logger: this.logger });
    }
    return this._reservation;
  }
  get room() {
    if(!this._room) {
      this._room = new RoomDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.room, collection: this.mongo.default.collection('rooms'), middlewares: [...(this.overrides?.room?.middlewares || []), ...this.middlewares as DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'room', logger: this.logger });
    }
    return this._room;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, collection: this.mongo.default.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...this.middlewares as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'TenantId', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongo = params.mongo
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
  }
  
  public async execQuery<T>(run: (dbs: { mongo: Record<'default', Db> }, entities: { hotel: Collection<Document>; reservation: Collection<Document>; room: Collection<Document>; user: Collection<Document> }) => Promise<T>): Promise<T> {
    return run({ mongo: this.mongo }, { hotel: this.mongo.default.collection('hotels'), reservation: this.mongo.default.collection('reservations'), room: this.mongo.default.collection('rooms'), user: this.mongo.default.collection('users') })
  }
  
  

}

export async function mockedDAOContext<MetadataType = any, OperationMetadataType = any>(params: MockDAOContextParams<DAOContextParams<MetadataType, OperationMetadataType>>) {
  const newParams = await createMockedDAOContext<DAOContextParams<MetadataType, OperationMetadataType>>(params, ['default'], [])
  return new DAOContext(newParams)
}