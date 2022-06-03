import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

export type Scalars = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Date: { type: types.Scalars['Date']; isTextual: false; isQuantitative: false }
  Email: { type: types.Scalars['Email']; isTextual: false; isQuantitative: false }
  Password: { type: types.Scalars['Password']; isTextual: false; isQuantitative: false }
  TenantId: { type: types.Scalars['TenantId']; isTextual: false; isQuantitative: false }
  Username: { type: types.Scalars['Username']; isTextual: false; isQuantitative: false }
}

export type AST = {
  Hotel: {
    fields: {
      deletionDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      description: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'TenantId'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Reservation: {
    fields: {
      deletionDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      room: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Room'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      roomId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'TenantId'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Room: {
    fields: {
      deletionDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      hotel: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Hotel'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      hotelId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      size: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'TenantId'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Tenant: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      info: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  User: {
    fields: {
      credentials: {
        type: 'embedded'
        isList: false
        astName: 'UsernamePasswordCredentials'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      deletionDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      email: { type: 'scalar'; isList: false; astName: 'Email'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      lastName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      reservations: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'Reservation'
        isRequired: true
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      tenantId: { type: 'scalar'; isList: false; astName: 'TenantId'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UsernamePasswordCredentials: {
    fields: {
      password: { type: 'scalar'; isList: false; astName: 'Password'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      username: { type: 'scalar'; isList: false; astName: 'Username'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
}

export function hotelSchema(): T.Schema<Scalars> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
    },
    description: {
      type: 'scalar',
      scalar: 'String',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
    },
  }
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Hotel',
  AST,
  Scalars,
  HotelCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryHotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type HotelIdFields = T.IdFields<'Hotel', AST>
export type HotelInsert = T.Insert<'Hotel', AST, Scalars>
export type HotelInsertResult = T.GenerateModel<'Hotel', AST, Scalars, 'relation'>
export type HotelProjection = T.Projection<'Hotel', AST>
export type HotelUpdate = T.Update<'Hotel', AST, Scalars>
export type HotelFilter = T.Filter<'Hotel', AST, Scalars>
export type HotelSortElement = T.SortElement<'Hotel', AST>
export type HotelRelationsFindParams = T.RelationsFindParams<'Hotel', AST, Scalars>
export type HotelParams<P extends HotelProjection> = T.Params<'Hotel', AST, Scalars, P>
export type HotelCachedTypes = T.CachedTypes<HotelIdFields, HotelInsert, HotelInsertResult, HotelProjection, HotelUpdate, HotelFilter, HotelSortElement, HotelRelationsFindParams>

export class HotelDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Hotel', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Hotel', AST>, P2 extends T.Projection<'Hotel', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Hotel', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Hotel', AST>, P1, P2>
  }
  public constructor(params: HotelDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: hotelSchema(),
    })
  }
}

export class InMemoryHotelDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Hotel', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Hotel', AST>, P2 extends T.Projection<'Hotel', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Hotel', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Hotel', AST>, P1, P2>
  }
  public constructor(params: InMemoryHotelDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: hotelSchema(),
    })
  }
}
export function reservationSchema(): T.Schema<Scalars> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    room: {
      type: 'relation',
      relation: 'inner',
      schema: () => roomSchema(),
      refFrom: 'roomId',
      refTo: 'id',
      dao: 'room',
    },
    roomId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Reservation',
  AST,
  Scalars,
  ReservationCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ReservationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryReservationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ReservationIdFields = T.IdFields<'Reservation', AST>
export type ReservationInsert = T.Insert<'Reservation', AST, Scalars>
export type ReservationInsertResult = T.GenerateModel<'Reservation', AST, Scalars, 'relation'>
export type ReservationProjection = T.Projection<'Reservation', AST>
export type ReservationUpdate = T.Update<'Reservation', AST, Scalars>
export type ReservationFilter = T.Filter<'Reservation', AST, Scalars>
export type ReservationSortElement = T.SortElement<'Reservation', AST>
export type ReservationRelationsFindParams = T.RelationsFindParams<'Reservation', AST, Scalars>
export type ReservationParams<P extends ReservationProjection> = T.Params<'Reservation', AST, Scalars, P>
export type ReservationCachedTypes = T.CachedTypes<
  ReservationIdFields,
  ReservationInsert,
  ReservationInsertResult,
  ReservationProjection,
  ReservationUpdate,
  ReservationFilter,
  ReservationSortElement,
  ReservationRelationsFindParams
>

export class ReservationDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Reservation', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Reservation', AST>, P2 extends T.Projection<'Reservation', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'Reservation', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Reservation', AST>, P1, P2>
  }
  public constructor(params: ReservationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: reservationSchema(),
    })
  }
}

export class InMemoryReservationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Reservation', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Reservation', AST>, P2 extends T.Projection<'Reservation', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'Reservation', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Reservation', AST>, P1, P2>
  }
  public constructor(params: InMemoryReservationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: reservationSchema(),
    })
  }
}
export function roomSchema(): T.Schema<Scalars> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
    },
    hotel: {
      type: 'relation',
      relation: 'inner',
      schema: () => hotelSchema(),
      refFrom: 'hotelId',
      refTo: 'id',
      dao: 'hotel',
      required: true,
    },
    hotelId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    size: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
    },
  }
}

type RoomDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Room',
  AST,
  Scalars,
  RoomCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryRoomDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type RoomIdFields = T.IdFields<'Room', AST>
export type RoomInsert = T.Insert<'Room', AST, Scalars>
export type RoomInsertResult = T.GenerateModel<'Room', AST, Scalars, 'relation'>
export type RoomProjection = T.Projection<'Room', AST>
export type RoomUpdate = T.Update<'Room', AST, Scalars>
export type RoomFilter = T.Filter<'Room', AST, Scalars>
export type RoomSortElement = T.SortElement<'Room', AST>
export type RoomRelationsFindParams = T.RelationsFindParams<'Room', AST, Scalars>
export type RoomParams<P extends RoomProjection> = T.Params<'Room', AST, Scalars, P>
export type RoomCachedTypes = T.CachedTypes<RoomIdFields, RoomInsert, RoomInsertResult, RoomProjection, RoomUpdate, RoomFilter, RoomSortElement, RoomRelationsFindParams>

export class RoomDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Room', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Room', AST>, P2 extends T.Projection<'Room', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Room', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Room', AST>, P1, P2>
  }
  public constructor(params: RoomDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roomSchema(),
    })
  }
}

export class InMemoryRoomDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Room', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Room', AST>, P2 extends T.Projection<'Room', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Room', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Room', AST>, P1, P2>
  }
  public constructor(params: InMemoryRoomDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roomSchema(),
    })
  }
}
export function tenantSchema(): T.Schema<Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'Int',
      isId: true,
      generationStrategy: 'user',
      required: true,
    },
    info: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
  }
}

type TenantDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Tenant',
  AST,
  Scalars,
  TenantCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type TenantDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<TenantDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryTenantDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<TenantDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type TenantIdFields = T.IdFields<'Tenant', AST>
export type TenantInsert = T.Insert<'Tenant', AST, Scalars>
export type TenantInsertResult = T.GenerateModel<'Tenant', AST, Scalars, 'relation'>
export type TenantProjection = T.Projection<'Tenant', AST>
export type TenantUpdate = T.Update<'Tenant', AST, Scalars>
export type TenantFilter = T.Filter<'Tenant', AST, Scalars>
export type TenantSortElement = T.SortElement<'Tenant', AST>
export type TenantRelationsFindParams = T.RelationsFindParams<'Tenant', AST, Scalars>
export type TenantParams<P extends TenantProjection> = T.Params<'Tenant', AST, Scalars, P>
export type TenantCachedTypes = T.CachedTypes<TenantIdFields, TenantInsert, TenantInsertResult, TenantProjection, TenantUpdate, TenantFilter, TenantSortElement, TenantRelationsFindParams>

export class TenantDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<TenantDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Tenant', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Tenant', AST>, P2 extends T.Projection<'Tenant', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Tenant', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Tenant', AST>, P1, P2>
  }
  public constructor(params: TenantDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: tenantSchema(),
    })
  }
}

export class InMemoryTenantDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<TenantDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Tenant', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Tenant', AST>, P2 extends T.Projection<'Tenant', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Tenant', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Tenant', AST>, P1, P2>
  }
  public constructor(params: InMemoryTenantDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: tenantSchema(),
    })
  }
}
export function userSchema(): T.Schema<Scalars> {
  return {
    credentials: {
      type: 'embedded',
      schema: () => usernamePasswordCredentialsSchema(),
      alias: 'cred',
    },
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
    },
    email: {
      type: 'scalar',
      scalar: 'Email',
      required: true,
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    lastName: {
      type: 'scalar',
      scalar: 'String',
    },
    reservations: {
      type: 'relation',
      relation: 'foreign',
      schema: () => reservationSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'reservation',
      required: true,
      isList: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
    },
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'User',
  AST,
  Scalars,
  UserCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserIdFields = T.IdFields<'User', AST>
export type UserInsert = T.Insert<'User', AST, Scalars>
export type UserInsertResult = T.GenerateModel<'User', AST, Scalars, 'relation'>
export type UserProjection = T.Projection<'User', AST>
export type UserUpdate = T.Update<'User', AST, Scalars>
export type UserFilter = T.Filter<'User', AST, Scalars>
export type UserSortElement = T.SortElement<'User', AST>
export type UserRelationsFindParams = T.RelationsFindParams<'User', AST, Scalars>
export type UserParams<P extends UserProjection> = T.Params<'User', AST, Scalars, P>
export type UserCachedTypes = T.CachedTypes<UserIdFields, UserInsert, UserInsertResult, UserProjection, UserUpdate, UserFilter, UserSortElement, UserRelationsFindParams>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
  }
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
  }
  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}
export function usernamePasswordCredentialsSchema(): T.Schema<Scalars> {
  return {
    password: {
      type: 'scalar',
      scalar: 'Password',
      required: true,
    },
    username: {
      type: 'scalar',
      scalar: 'Username',
      required: true,
    },
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    tenant?: Pick<Partial<TenantDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'mongo'>
  log?: T.LogInput<'Hotel' | 'Reservation' | 'Room' | 'Tenant' | 'User'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, Scalars, MetadataType> {
  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined
  private _reservation: ReservationDAO<MetadataType, OperationMetadataType> | undefined
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined
  private _tenant: TenantDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'Hotel' | 'Reservation' | 'Room' | 'Tenant' | 'User'>

  get hotel(): HotelDAO<MetadataType, OperationMetadataType> {
    if (!this._hotel) {
      const db = this.mongodb.default
      this._hotel =
        db === 'mock'
          ? (new InMemoryHotelDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.hotel,
              middlewares: [
                ...(this.overrides?.hotel?.middlewares || []),
                ...(selectMiddleware('hotel', this.middlewares) as T.DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Hotel',
              logger: this.logger,
            }) as unknown as HotelDAO<MetadataType, OperationMetadataType>)
          : new HotelDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.hotel,
              collection: db.collection('hotels'),
              middlewares: [
                ...(this.overrides?.hotel?.middlewares || []),
                ...(selectMiddleware('hotel', this.middlewares) as T.DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Hotel',
              logger: this.logger,
            })
    }
    return this._hotel
  }
  get reservation(): ReservationDAO<MetadataType, OperationMetadataType> {
    if (!this._reservation) {
      const db = this.mongodb.default
      this._reservation =
        db === 'mock'
          ? (new InMemoryReservationDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.reservation,
              middlewares: [
                ...(this.overrides?.reservation?.middlewares || []),
                ...(selectMiddleware('reservation', this.middlewares) as T.DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Reservation',
              logger: this.logger,
            }) as unknown as ReservationDAO<MetadataType, OperationMetadataType>)
          : new ReservationDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.reservation,
              collection: db.collection('reservations'),
              middlewares: [
                ...(this.overrides?.reservation?.middlewares || []),
                ...(selectMiddleware('reservation', this.middlewares) as T.DAOMiddleware<ReservationDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Reservation',
              logger: this.logger,
            })
    }
    return this._reservation
  }
  get room(): RoomDAO<MetadataType, OperationMetadataType> {
    if (!this._room) {
      const db = this.mongodb.default
      this._room =
        db === 'mock'
          ? (new InMemoryRoomDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.room,
              middlewares: [...(this.overrides?.room?.middlewares || []), ...(selectMiddleware('room', this.middlewares) as T.DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Room',
              logger: this.logger,
            }) as unknown as RoomDAO<MetadataType, OperationMetadataType>)
          : new RoomDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.room,
              collection: db.collection('rooms'),
              middlewares: [...(this.overrides?.room?.middlewares || []), ...(selectMiddleware('room', this.middlewares) as T.DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Room',
              logger: this.logger,
            })
    }
    return this._room
  }
  get tenant(): TenantDAO<MetadataType, OperationMetadataType> {
    if (!this._tenant) {
      const db = this.mongodb.default
      this._tenant =
        db === 'mock'
          ? (new InMemoryTenantDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.tenant,
              middlewares: [
                ...(this.overrides?.tenant?.middlewares || []),
                ...(selectMiddleware('tenant', this.middlewares) as T.DAOMiddleware<TenantDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Tenant',
              logger: this.logger,
            }) as unknown as TenantDAO<MetadataType, OperationMetadataType>)
          : new TenantDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.tenant,
              collection: db.collection('tenants'),
              middlewares: [
                ...(this.overrides?.tenant?.middlewares || []),
                ...(selectMiddleware('tenant', this.middlewares) as T.DAOMiddleware<TenantDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Tenant',
              logger: this.logger,
            })
    }
    return this._tenant
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      const db = this.mongodb.default
      this._user =
        db === 'mock'
          ? (new InMemoryUserDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.user,
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'User',
              logger: this.logger,
            }) as unknown as UserDAO<MetadataType, OperationMetadataType>)
          : new UserDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.user,
              collection: db.collection('users'),
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'User',
              logger: this.logger,
            })
    }
    return this._user
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'TenantId', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float'])
        : undefined,
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if (params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others
        ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map((k) => [k, true])) as any, securityMiddlewares.others as any)]
        : []
      this.middlewares = [
        ...(params.middlewares ?? []),
        ...defaultMiddleware,
        ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({ [name]: true } as any, middleware as any)),
      ]
    }
    this.params = params
  }

  public async execQuery<T>(
    run: (
      dbs: { mongodb: Record<'default', M.Db | 'mock'> },
      entities: {
        hotel: M.Collection<M.Document> | null
        reservation: M.Collection<M.Document> | null
        room: M.Collection<M.Document> | null
        tenant: M.Collection<M.Document> | null
        user: M.Collection<M.Document> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { mongodb: this.mongodb },
      {
        hotel: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('hotels'),
        reservation: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('reservations'),
        room: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('rooms'),
        tenant: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('tenants'),
        user: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('users'),
      },
    )
  }

  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
}

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
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
