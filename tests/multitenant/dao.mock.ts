import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

//--------------------------------------------------------------------------------
//------------------------------------ HOTEL -------------------------------------
//--------------------------------------------------------------------------------

export type HotelExcludedFields = never
export type HotelRelationFields = never

export function hotelSchema(): T.Schema<types.Scalars> {
  return {
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
      required: true, 
      defaultGenerationStrategy: 'middleware'
    }
  }
}

type HotelFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators,
  'description'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators,
  'id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'name'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | T.EqualityOperators<types.Scalars['TenantId']> | T.ElementOperators
}
export type HotelFilter = HotelFilterFields & T.LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = () => M.Filter<M.Document>

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  deletionDate?: boolean
  description?: boolean
  id?: boolean
  name?: boolean
  tenantId?: boolean
}
export type HotelParam<P extends HotelProjection> = T.ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys = 'deletionDate' | 'description' | 'id' | 'name' | 'tenantId'
export type HotelSort = Partial<Record<HotelSortKeys, T.SortDirection>>
export type HotelRawSort = () => M.Sort

export type HotelUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'description'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'tenantId'?: types.Scalars['TenantId']
}
export type HotelRawUpdate = () => M.UpdateFilter<M.Document>

export type HotelInsert = {
  deletionDate?: null | types.Scalars['Date'],
  description?: null | types.Scalars['String'],
  name: types.Scalars['String'],
  tenantId?: null | types.Scalars['TenantId'],
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<types.Hotel, 'id', 'ID', HotelFilter, HotelRawFilter, HotelRelations, HotelProjection, HotelSort, HotelRawSort, HotelInsert, HotelUpdate, HotelRawUpdate, HotelExcludedFields, HotelRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'hotel', DAOContext<MetadataType, OperationMetadataType>>
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryHotelDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class HotelDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends HotelProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends HotelProjection, P2 extends HotelProjection>(p1: P1, p2: P2): T.SelectProjection<HotelProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<HotelProjection, P1, P2>
  }
  
  public constructor(params: HotelDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: hotelSchema(), 
      relations: T.overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }

export class InMemoryHotelDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends HotelProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends HotelProjection, P2 extends HotelProjection>(p1: P1, p2: P2): T.SelectProjection<HotelProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<HotelProjection, P1, P2>
  }
  
  public constructor(params: InMemoryHotelDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: hotelSchema(), 
      relations: T.overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }



//--------------------------------------------------------------------------------
//--------------------------------- RESERVATION ----------------------------------
//--------------------------------------------------------------------------------

export type ReservationExcludedFields = never
export type ReservationRelationFields = 'room'

export function reservationSchema(): T.Schema<types.Scalars> {
  return {
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
      scalar: 'TenantId', 
      required: true, 
      defaultGenerationStrategy: 'middleware'
    },
    'userId': {
      scalar: 'ID', 
      required: true
    }
  }
}

type ReservationFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators,
  'id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'roomId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | T.EqualityOperators<types.Scalars['TenantId']> | T.ElementOperators,
  'userId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type ReservationFilter = ReservationFilterFields & T.LogicalOperators<ReservationFilterFields | ReservationRawFilter>
export type ReservationRawFilter = () => M.Filter<M.Document>

export type ReservationRelations = Record<never, string>

export type ReservationProjection = {
  deletionDate?: boolean
  id?: boolean
  room?: RoomProjection | boolean
  roomId?: boolean
  tenantId?: boolean
  userId?: boolean
}
export type ReservationParam<P extends ReservationProjection> = T.ParamProjection<types.Reservation, ReservationProjection, P>

export type ReservationSortKeys = 'deletionDate' | 'id' | 'roomId' | 'tenantId' | 'userId'
export type ReservationSort = Partial<Record<ReservationSortKeys, T.SortDirection>>
export type ReservationRawSort = () => M.Sort

export type ReservationUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'id'?: types.Scalars['ID'],
  'roomId'?: types.Scalars['ID'],
  'tenantId'?: types.Scalars['TenantId'],
  'userId'?: types.Scalars['ID']
}
export type ReservationRawUpdate = () => M.UpdateFilter<M.Document>

export type ReservationInsert = {
  deletionDate?: null | types.Scalars['Date'],
  roomId: types.Scalars['ID'],
  tenantId?: null | types.Scalars['TenantId'],
  userId: types.Scalars['ID'],
}

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<types.Reservation, 'id', 'ID', ReservationFilter, ReservationRawFilter, ReservationRelations, ReservationProjection, ReservationSort, ReservationRawSort, ReservationInsert, ReservationUpdate, ReservationRawUpdate, ReservationExcludedFields, ReservationRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'reservation', DAOContext<MetadataType, OperationMetadataType>>
export type ReservationDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryReservationDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class ReservationDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends ReservationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ReservationProjection, P2 extends ReservationProjection>(p1: P1, p2: P2): T.SelectProjection<ReservationProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ReservationProjection, P1, P2>
  }
  
  public constructor(params: ReservationDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: reservationSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'room', refFrom: 'roomId', refTo: 'id', dao: 'room', required: false }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }

export class InMemoryReservationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends ReservationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ReservationProjection, P2 extends ReservationProjection>(p1: P1, p2: P2): T.SelectProjection<ReservationProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ReservationProjection, P1, P2>
  }
  
  public constructor(params: InMemoryReservationDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: reservationSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'room', refFrom: 'roomId', refTo: 'id', dao: 'room', required: false }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }



//--------------------------------------------------------------------------------
//------------------------------------- ROOM -------------------------------------
//--------------------------------------------------------------------------------

export type RoomExcludedFields = never
export type RoomRelationFields = 'hotel'

export function roomSchema(): T.Schema<types.Scalars> {
  return {
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
      scalar: 'TenantId', 
      required: true, 
      defaultGenerationStrategy: 'middleware'
    }
  }
}

type RoomFilterFields = {
  'deletionDate'?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators,
  'hotelId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'size'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | T.EqualityOperators<types.Scalars['TenantId']> | T.ElementOperators
}
export type RoomFilter = RoomFilterFields & T.LogicalOperators<RoomFilterFields | RoomRawFilter>
export type RoomRawFilter = () => M.Filter<M.Document>

export type RoomRelations = Record<never, string>

export type RoomProjection = {
  deletionDate?: boolean
  hotel?: HotelProjection | boolean
  hotelId?: boolean
  id?: boolean
  size?: boolean
  tenantId?: boolean
}
export type RoomParam<P extends RoomProjection> = T.ParamProjection<types.Room, RoomProjection, P>

export type RoomSortKeys = 'deletionDate' | 'hotelId' | 'id' | 'size' | 'tenantId'
export type RoomSort = Partial<Record<RoomSortKeys, T.SortDirection>>
export type RoomRawSort = () => M.Sort

export type RoomUpdate = {
  'deletionDate'?: types.Scalars['Date'] | null,
  'hotelId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'size'?: types.Scalars['String'],
  'tenantId'?: types.Scalars['TenantId']
}
export type RoomRawUpdate = () => M.UpdateFilter<M.Document>

export type RoomInsert = {
  deletionDate?: null | types.Scalars['Date'],
  hotelId: types.Scalars['ID'],
  size: types.Scalars['String'],
  tenantId?: null | types.Scalars['TenantId'],
}

type RoomDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<types.Room, 'id', 'ID', RoomFilter, RoomRawFilter, RoomRelations, RoomProjection, RoomSort, RoomRawSort, RoomInsert, RoomUpdate, RoomRawUpdate, RoomExcludedFields, RoomRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'room', DAOContext<MetadataType, OperationMetadataType>>
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryRoomDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class RoomDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends RoomProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends RoomProjection, P2 extends RoomProjection>(p1: P1, p2: P2): T.SelectProjection<RoomProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<RoomProjection, P1, P2>
  }
  
  public constructor(params: RoomDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: roomSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'hotel', refFrom: 'hotelId', refTo: 'id', dao: 'hotel', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }

export class InMemoryRoomDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends RoomProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends RoomProjection, P2 extends RoomProjection>(p1: P1, p2: P2): T.SelectProjection<RoomProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<RoomProjection, P1, P2>
  }
  
  public constructor(params: InMemoryRoomDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: roomSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'hotel', refFrom: 'hotelId', refTo: 'id', dao: 'hotel', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }



//--------------------------------------------------------------------------------
//------------------------------------ TENANT ------------------------------------
//--------------------------------------------------------------------------------

export type TenantExcludedFields = never
export type TenantRelationFields = never

export function tenantSchema(): T.Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'Int', 
      required: true
    },
    'info': {
      scalar: 'String', 
      required: true
    }
  }
}

type TenantFilterFields = {
  'id'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>,
  'info'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type TenantFilter = TenantFilterFields & T.LogicalOperators<TenantFilterFields | TenantRawFilter>
export type TenantRawFilter = () => M.Filter<M.Document>

export type TenantRelations = Record<never, string>

export type TenantProjection = {
  id?: boolean
  info?: boolean
}
export type TenantParam<P extends TenantProjection> = T.ParamProjection<types.Tenant, TenantProjection, P>

export type TenantSortKeys = 'id' | 'info'
export type TenantSort = Partial<Record<TenantSortKeys, T.SortDirection>>
export type TenantRawSort = () => M.Sort

export type TenantUpdate = {
  'id'?: types.Scalars['Int'],
  'info'?: types.Scalars['String']
}
export type TenantRawUpdate = () => M.UpdateFilter<M.Document>

export type TenantInsert = {
  id: types.Scalars['Int'],
  info: types.Scalars['String'],
}

type TenantDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<types.Tenant, 'id', 'Int', TenantFilter, TenantRawFilter, TenantRelations, TenantProjection, TenantSort, TenantRawSort, TenantInsert, TenantUpdate, TenantRawUpdate, TenantExcludedFields, TenantRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'tenant', DAOContext<MetadataType, OperationMetadataType>>
export type TenantDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<TenantDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryTenantDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<TenantDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class TenantDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<TenantDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends TenantProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends TenantProjection, P2 extends TenantProjection>(p1: P1, p2: P2): T.SelectProjection<TenantProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<TenantProjection, P1, P2>
  }
  
  public constructor(params: TenantDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: tenantSchema(), 
      relations: T.overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'Int' 
    })
  }
  }

export class InMemoryTenantDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<TenantDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends TenantProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends TenantProjection, P2 extends TenantProjection>(p1: P1, p2: P2): T.SelectProjection<TenantProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<TenantProjection, P1, P2>
  }
  
  public constructor(params: InMemoryTenantDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: tenantSchema(), 
      relations: T.overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'Int' 
    })
  }
  }



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never
export type UserRelationFields = 'reservations'

export function userSchema(): T.Schema<types.Scalars> {
  return {
    'credentials': { embedded: usernamePasswordCredentialsSchema(), alias: 'cred' },
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
      scalar: 'TenantId', 
      required: true, 
      defaultGenerationStrategy: 'middleware'
    }
  }
}

type UserFilterFields = {
  'credentials.password'?: types.Scalars['Password'] | null | T.EqualityOperators<types.Scalars['Password']> | T.ElementOperators,
  'credentials.username'?: types.Scalars['Username'] | null | T.EqualityOperators<types.Scalars['Username']> | T.ElementOperators,
  'deletionDate'?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators,
  'email'?: types.Scalars['Email'] | null | T.EqualityOperators<types.Scalars['Email']> | T.ElementOperators,
  'firstName'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators,
  'id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators,
  'lastName'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators,
  'tenantId'?: types.Scalars['TenantId'] | null | T.EqualityOperators<types.Scalars['TenantId']> | T.ElementOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = () => M.Filter<M.Document>

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
    password?: boolean
    username?: boolean
  } | boolean
  deletionDate?: boolean
  email?: boolean
  firstName?: boolean
  id?: boolean
  lastName?: boolean
  reservations?: ReservationProjection | boolean
  tenantId?: boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'credentials.password' | 'credentials.username' | 'deletionDate' | 'email' | 'firstName' | 'id' | 'lastName' | 'tenantId'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = () => M.Sort

export type UserUpdate = {
  'credentials'?: UsernamePasswordCredentialsInsert | null,
  'credentials.password'?: types.Scalars['Password'],
  'credentials.username'?: types.Scalars['Username'],
  'deletionDate'?: types.Scalars['Date'] | null,
  'email'?: types.Scalars['Email'],
  'firstName'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null,
  'tenantId'?: types.Scalars['TenantId']
}
export type UserRawUpdate = () => M.UpdateFilter<M.Document>

export type UserInsert = {
  credentials?: null | UsernamePasswordCredentialsInsert,
  deletionDate?: null | types.Scalars['Date'],
  email: types.Scalars['Email'],
  firstName?: null | types.Scalars['String'],
  lastName?: null | types.Scalars['String'],
  tenantId?: null | types.Scalars['TenantId'],
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<types.User, 'id', 'ID', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, UserRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'user', DAOContext<MetadataType, OperationMetadataType>>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'reservations', refFrom: 'userId', refTo: 'id', dao: 'reservation', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {  
  
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }
  
  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema(), 
      relations: T.overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'reservations', refFrom: 'userId', refTo: 'id', dao: 'reservation', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    })
  }
  }



//--------------------------------------------------------------------------------
//------------------------- USERNAMEPASSWORDCREDENTIALS --------------------------
//--------------------------------------------------------------------------------

export function usernamePasswordCredentialsSchema(): T.Schema<types.Scalars> {
  return {
    'password': {
      scalar: 'Password', 
      required: true
    },
    'username': {
      scalar: 'Username', 
      required: true
    }
  }
}

export type UsernamePasswordCredentialsProjection = {
  password?: boolean
  username?: boolean
}
export type UsernamePasswordCredentialsParam<P extends UsernamePasswordCredentialsProjection> = T.ParamProjection<types.UsernamePasswordCredentials, UsernamePasswordCredentialsProjection, P>

export type UsernamePasswordCredentialsInsert = {
  password: types.Scalars['Password'],
  username: types.Scalars['Username'],
}


export type DAOContextParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
  metadata?: MetadataType
  middlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    tenant?: Pick<Partial<TenantDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  },
  mongodb: Record<'default', M.Db | 'mock'>,
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>,
  log?: T.LogInput<'hotel' | 'reservation' | 'room' | 'tenant' | 'user'>,
  security?: T.DAOContextSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type DAOContextMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends object = never> extends T.AbstractDAOContext<'default', never, types.Scalars, MetadataType>  {

  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined
  private _reservation: ReservationDAO<MetadataType, OperationMetadataType> | undefined
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined
  private _tenant: TenantDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  
  private params: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>
  
  private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: T.LogFunction<'hotel' | 'reservation' | 'room' | 'tenant' | 'user'>
  
  get hotel(): HotelDAO<MetadataType, OperationMetadataType> {
    if(!this._hotel) {
      const db = this.mongodb.default
      this._hotel = db === 'mock' ? (new InMemoryHotelDAO({ daoContext: this, datasource: null, metadata: this.metadata, ...this.overrides?.hotel, middlewares: [...(this.overrides?.hotel?.middlewares || []), ...selectMiddleware('hotel', this.middlewares) as T.DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'hotel', logger: this.logger }) as unknown as HotelDAO<MetadataType, OperationMetadataType>) : new HotelDAO({ daoContext: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.hotel, collection: db.collection('hotels'), middlewares: [...(this.overrides?.hotel?.middlewares || []), ...selectMiddleware('hotel', this.middlewares) as T.DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'hotel', logger: this.logger })
    }
    return this._hotel
  }
  get reservation(): ReservationDAO<MetadataType, OperationMetadataType> {
    if(!this._reservation) {
      const db = this.mongodb.default
      this._reservation = db === 'mock' ? (new InMemoryReservationDAO({ daoContext: this, datasource: null, metadata: this.metadata, ...this.overrides?.reservation, middlewares: [...(this.overrides?.reservation?.middlewares || []), ...selectMiddleware('reservation', this.middlewares) as T.DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'reservation', logger: this.logger }) as unknown as ReservationDAO<MetadataType, OperationMetadataType>) : new ReservationDAO({ daoContext: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.reservation, collection: db.collection('reservations'), middlewares: [...(this.overrides?.reservation?.middlewares || []), ...selectMiddleware('reservation', this.middlewares) as T.DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'reservation', logger: this.logger })
    }
    return this._reservation
  }
  get room(): RoomDAO<MetadataType, OperationMetadataType> {
    if(!this._room) {
      const db = this.mongodb.default
      this._room = db === 'mock' ? (new InMemoryRoomDAO({ daoContext: this, datasource: null, metadata: this.metadata, ...this.overrides?.room, middlewares: [...(this.overrides?.room?.middlewares || []), ...selectMiddleware('room', this.middlewares) as T.DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'room', logger: this.logger }) as unknown as RoomDAO<MetadataType, OperationMetadataType>) : new RoomDAO({ daoContext: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.room, collection: db.collection('rooms'), middlewares: [...(this.overrides?.room?.middlewares || []), ...selectMiddleware('room', this.middlewares) as T.DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'room', logger: this.logger })
    }
    return this._room
  }
  get tenant(): TenantDAO<MetadataType, OperationMetadataType> {
    if(!this._tenant) {
      const db = this.mongodb.default
      this._tenant = db === 'mock' ? (new InMemoryTenantDAO({ daoContext: this, datasource: null, metadata: this.metadata, ...this.overrides?.tenant, middlewares: [...(this.overrides?.tenant?.middlewares || []), ...selectMiddleware('tenant', this.middlewares) as T.DAOMiddleware<TenantDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'tenant', logger: this.logger }) as unknown as TenantDAO<MetadataType, OperationMetadataType>) : new TenantDAO({ daoContext: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.tenant, collection: db.collection('tenants'), middlewares: [...(this.overrides?.tenant?.middlewares || []), ...selectMiddleware('tenant', this.middlewares) as T.DAOMiddleware<TenantDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'tenant', logger: this.logger })
    }
    return this._tenant
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if(!this._user) {
      const db = this.mongodb.default
      this._user = db === 'mock' ? (new InMemoryUserDAO({ daoContext: this, datasource: null, metadata: this.metadata, ...this.overrides?.user, middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger }) as unknown as UserDAO<MetadataType, OperationMetadataType>) : new UserDAO({ daoContext: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.user, collection: db.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger })
    }
    return this._user
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'TenantId', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if(params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map(k => [k, true])) as any, securityMiddlewares.others as any)] : []
      this.middlewares = [...(params.middlewares ?? []), ...defaultMiddleware, ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({[name]: true} as any, middleware as any))]
    }
    this.params = params
  }
  
  public async execQuery<T>(run: (dbs: { mongodb: Record<'default', M.Db | 'mock'> }, entities: { hotel: M.Collection<M.Document> | null, reservation: M.Collection<M.Document> | null, room: M.Collection<M.Document> | null, tenant: M.Collection<M.Document> | null, user: M.Collection<M.Document> | null }) => Promise<T>): Promise<T> {
    return run({ mongodb: this.mongodb }, { hotel: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('hotels'), reservation: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('reservations'), room: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('rooms'), tenant: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('tenants'), user: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('users') })
  }
  
  protected clone(): this {
    return new DAOContext<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
  
  

}


//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  hotel: HotelDAOGenerics<MetadataType, OperationMetadataType>
  reservation: ReservationDAOGenerics<MetadataType, OperationMetadataType>
  room: RoomDAOGenerics<MetadataType, OperationMetadataType>
  tenant: TenantDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
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
