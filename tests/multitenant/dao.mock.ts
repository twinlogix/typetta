import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

export type ScalarsSpecification = {
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
      type: 'mongodb'
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
      type: 'mongodb'
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
      type: 'mongodb'
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
      type: 'mongodb'
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
      type: 'mongodb'
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
      type: 'memory'
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
}

export const schemas = {
  Hotel: hotelSchema,
  Reservation: reservationSchema,
  Room: roomSchema,
  Tenant: tenantSchema,
  User: userSchema,
  UsernamePasswordCredentials: usernamePasswordCredentialsSchema,
} as const

export function hotelSchema(): T.Schema<ScalarsSpecification> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
      directives: {},
    },
    description: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
      directives: {},
    },
  }
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Hotel',
  AST,
  ScalarsSpecification,
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
export interface HotelModel extends types.Hotel {}
export interface HotelInsert extends T.Insert<'Hotel', AST, ScalarsSpecification> {}
export interface HotelPlainModel extends T.GenerateModel<'Hotel', AST, ScalarsSpecification, 'relation'> {}
export interface HotelProjection extends T.Projection<'Hotel', AST> {}
export interface HotelUpdate extends T.Update<'Hotel', AST, ScalarsSpecification> {}
export interface HotelFilter extends T.Filter<'Hotel', AST, ScalarsSpecification> {}
export interface HotelSortElement extends T.SortElement<'Hotel', AST> {}
export interface HotelRelationsFindParams extends T.RelationsFindParams<'Hotel', AST, ScalarsSpecification> {}
export type HotelParams<P extends HotelProjection> = T.Params<'Hotel', AST, ScalarsSpecification, P>
export type HotelProject<P extends HotelProjection> = T.Project<'Hotel', AST, ScalarsSpecification, P>
export type HotelCachedTypes = T.CachedTypes<HotelIdFields, HotelModel, HotelInsert, HotelPlainModel, HotelProjection, HotelUpdate, HotelFilter, HotelSortElement, HotelRelationsFindParams>

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
export function reservationSchema(): T.Schema<ScalarsSpecification> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
      directives: {},
    },
    room: {
      type: 'relation',
      astName: 'Room',
      relation: 'inner',
      schema: () => roomSchema(),
      refFrom: 'roomId',
      refTo: 'id',
      dao: 'room',
      directives: {},
    },
    roomId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
      directives: {},
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
  }
}

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Reservation',
  AST,
  ScalarsSpecification,
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
export interface ReservationModel extends types.Reservation {}
export interface ReservationInsert extends T.Insert<'Reservation', AST, ScalarsSpecification> {}
export interface ReservationPlainModel extends T.GenerateModel<'Reservation', AST, ScalarsSpecification, 'relation'> {}
export interface ReservationProjection extends T.Projection<'Reservation', AST> {}
export interface ReservationUpdate extends T.Update<'Reservation', AST, ScalarsSpecification> {}
export interface ReservationFilter extends T.Filter<'Reservation', AST, ScalarsSpecification> {}
export interface ReservationSortElement extends T.SortElement<'Reservation', AST> {}
export interface ReservationRelationsFindParams extends T.RelationsFindParams<'Reservation', AST, ScalarsSpecification> {}
export type ReservationParams<P extends ReservationProjection> = T.Params<'Reservation', AST, ScalarsSpecification, P>
export type ReservationProject<P extends ReservationProjection> = T.Project<'Reservation', AST, ScalarsSpecification, P>
export type ReservationCachedTypes = T.CachedTypes<
  ReservationIdFields,
  ReservationModel,
  ReservationInsert,
  ReservationPlainModel,
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
export function roomSchema(): T.Schema<ScalarsSpecification> {
  return {
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
      directives: {},
    },
    hotel: {
      type: 'relation',
      astName: 'Hotel',
      relation: 'inner',
      schema: () => hotelSchema(),
      refFrom: 'hotelId',
      refTo: 'id',
      dao: 'hotel',
      required: true,
      directives: {},
    },
    hotelId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
      directives: {},
    },
    size: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
      directives: {},
    },
  }
}

type RoomDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Room',
  AST,
  ScalarsSpecification,
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
export interface RoomModel extends types.Room {}
export interface RoomInsert extends T.Insert<'Room', AST, ScalarsSpecification> {}
export interface RoomPlainModel extends T.GenerateModel<'Room', AST, ScalarsSpecification, 'relation'> {}
export interface RoomProjection extends T.Projection<'Room', AST> {}
export interface RoomUpdate extends T.Update<'Room', AST, ScalarsSpecification> {}
export interface RoomFilter extends T.Filter<'Room', AST, ScalarsSpecification> {}
export interface RoomSortElement extends T.SortElement<'Room', AST> {}
export interface RoomRelationsFindParams extends T.RelationsFindParams<'Room', AST, ScalarsSpecification> {}
export type RoomParams<P extends RoomProjection> = T.Params<'Room', AST, ScalarsSpecification, P>
export type RoomProject<P extends RoomProjection> = T.Project<'Room', AST, ScalarsSpecification, P>
export type RoomCachedTypes = T.CachedTypes<RoomIdFields, RoomModel, RoomInsert, RoomPlainModel, RoomProjection, RoomUpdate, RoomFilter, RoomSortElement, RoomRelationsFindParams>

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
export function tenantSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'Int',
      isId: true,
      generationStrategy: 'user',
      required: true,
      directives: {},
    },
    info: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
  }
}

type TenantDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Tenant',
  AST,
  ScalarsSpecification,
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
export interface TenantModel extends types.Tenant {}
export interface TenantInsert extends T.Insert<'Tenant', AST, ScalarsSpecification> {}
export interface TenantPlainModel extends T.GenerateModel<'Tenant', AST, ScalarsSpecification, 'relation'> {}
export interface TenantProjection extends T.Projection<'Tenant', AST> {}
export interface TenantUpdate extends T.Update<'Tenant', AST, ScalarsSpecification> {}
export interface TenantFilter extends T.Filter<'Tenant', AST, ScalarsSpecification> {}
export interface TenantSortElement extends T.SortElement<'Tenant', AST> {}
export interface TenantRelationsFindParams extends T.RelationsFindParams<'Tenant', AST, ScalarsSpecification> {}
export type TenantParams<P extends TenantProjection> = T.Params<'Tenant', AST, ScalarsSpecification, P>
export type TenantProject<P extends TenantProjection> = T.Project<'Tenant', AST, ScalarsSpecification, P>
export type TenantCachedTypes = T.CachedTypes<TenantIdFields, TenantModel, TenantInsert, TenantPlainModel, TenantProjection, TenantUpdate, TenantFilter, TenantSortElement, TenantRelationsFindParams>

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
export function userSchema(): T.Schema<ScalarsSpecification> {
  return {
    credentials: {
      type: 'embedded',
      astName: 'UsernamePasswordCredentials',
      schema: () => usernamePasswordCredentialsSchema(),
      alias: 'cred',
      directives: {},
    },
    deletionDate: {
      type: 'scalar',
      scalar: 'Date',
      directives: {},
    },
    email: {
      type: 'scalar',
      scalar: 'Email',
      required: true,
      directives: {},
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
      directives: {},
    },
    lastName: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    reservations: {
      type: 'relation',
      astName: 'Reservation',
      relation: 'foreign',
      schema: () => reservationSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'reservation',
      required: true,
      isList: true,
      directives: {},
    },
    tenantId: {
      type: 'scalar',
      scalar: 'TenantId',
      required: true,
      generationStrategy: 'middleware',
      directives: {},
    },
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'User',
  AST,
  ScalarsSpecification,
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
export interface UserModel extends types.User {}
export interface UserInsert extends T.Insert<'User', AST, ScalarsSpecification> {}
export interface UserPlainModel extends T.GenerateModel<'User', AST, ScalarsSpecification, 'relation'> {}
export interface UserProjection extends T.Projection<'User', AST> {}
export interface UserUpdate extends T.Update<'User', AST, ScalarsSpecification> {}
export interface UserFilter extends T.Filter<'User', AST, ScalarsSpecification> {}
export interface UserSortElement extends T.SortElement<'User', AST> {}
export interface UserRelationsFindParams extends T.RelationsFindParams<'User', AST, ScalarsSpecification> {}
export type UserParams<P extends UserProjection> = T.Params<'User', AST, ScalarsSpecification, P>
export type UserProject<P extends UserProjection> = T.Project<'User', AST, ScalarsSpecification, P>
export type UserCachedTypes = T.CachedTypes<UserIdFields, UserModel, UserInsert, UserPlainModel, UserProjection, UserUpdate, UserFilter, UserSortElement, UserRelationsFindParams>

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
export function usernamePasswordCredentialsSchema(): T.Schema<ScalarsSpecification> {
  return {
    password: {
      type: 'scalar',
      scalar: 'Password',
      required: true,
      directives: {},
    },
    username: {
      type: 'scalar',
      scalar: 'Username',
      required: true,
      directives: {},
    },
  }
}

export interface UsernamePasswordCredentialsModel extends types.UsernamePasswordCredentials {}
export interface UsernamePasswordCredentialsPlainModel extends T.GenerateModel<'UsernamePasswordCredentials', AST, ScalarsSpecification, 'relation'> {}

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
  cache?: {
    engine: T.TypettaCache
    entities: { hotel?: true | { ms: number }; reservation?: true | { ms: number }; room?: true | { ms: number }; tenant?: true | { ms: number }; user?: true | { ms: number } }
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification>
  log?: T.LogInput<'Hotel' | 'Reservation' | 'Room' | 'Tenant' | 'User'>
  awaitLog?: boolean
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, ScalarsSpecification, MetadataType> {
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
              awaitLog: this.params.awaitLog,
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
    this.middlewares = params.middlewares ?? []
    this.logger = T.logInputToLogger(params.log)
    if (params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others
        ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map((k) => [k, true])) as any, securityMiddlewares.others as any)]
        : []
      this.middlewares = [
        ...this.middlewares,
        ...defaultMiddleware,
        ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({ [name]: true } as any, middleware as any)),
      ]
    }
    if (params.cache) {
      this.middlewares = [...this.middlewares, T.cache(params.cache.engine, params.cache.entities)]
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

  public planIndexes(args: { indexes: Partial<T.Indexes<AST, ScalarsSpecification>> }): Promise<T.IndexesPlanResults> {
    return super.planIndexes(args, schemas)
  }

  public applyIndexes(args: ({ plan: T.IndexesPlanResults } | { indexes: Partial<T.Indexes<AST, ScalarsSpecification>> }) & { logs?: boolean }): Promise<T.IndexesApplyResults> {
    return super.applyIndexes(args, schemas)
  }

  public clone(): this {
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

export type EntityManagerTypes<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends Record<string, unknown> = never> = {
  entityManager: EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>
  operationMetadataType: OperationMetadataType
  entityManagerParams: {
    metadata: MetadataType
    middleware: EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>
    overrides: {
      hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      tenant?: Pick<Partial<TenantDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    }
    mongodb: Record<'default', M.Db | 'mock'>

    scalars: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification>
    log: T.LogInput<'Hotel' | 'Reservation' | 'Room' | 'Tenant' | 'User'>
    security: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
  }
  security: {
    context: T.DAOSecurityContext<SecurityDomain, Permissions>
    policies: Required<T.DAOSecurityPolicies<DAOGenericsMap<MetadataType, OperationMetadataType>, Permissions, SecurityDomain>>
    permissions: Permissions
    domain: SecurityDomain
  }
  daoGenericsMap: DAOGenericsMap<MetadataType, OperationMetadataType>
  mongodbIndexes: T.MongoDBIndexes<AST, ScalarsSpecification>
}
