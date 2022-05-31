import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

export type HotelAST = {
  description: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'String'; isRequired: false; isListElementRequired: false }
  id: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  name: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'String'; isRequired: true; isListElementRequired: false }
  tenantId: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: true; isListElementRequired: false }
  totalCustomers: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: true; isListElementRequired: false }
}

export type HotelExcludedFields = never

export type HotelEmbeddedFields = never
export type HotelRelationFields = never
export type HotelRetrieveAll = Omit<types.Hotel, HotelRelationFields | HotelEmbeddedFields> & {}

export function hotelSchema(): T.Schema<types.Scalars> {
  return {
    description: {
      type: 'scalar',
      scalar: 'String',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
    totalCustomers: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type HotelFilterFields = {
  description?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  tenantId?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  totalCustomers?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type HotelFilter = HotelFilterFields & T.LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = () => M.Filter<M.Document>

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  description?: boolean
  id?: boolean
  name?: boolean
  tenantId?: boolean
  totalCustomers?: boolean
}
export type HotelParam<P extends HotelProjection> = T.ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys = 'description' | 'id' | 'name' | 'tenantId' | 'totalCustomers'
export type HotelSort = Partial<Record<HotelSortKeys, T.SortDirection>>
export type HotelRawSort = () => M.Sort

export type HotelUpdate = {
  description?: types.Scalars['String'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  tenantId?: types.Scalars['Int'] | null
  totalCustomers?: types.Scalars['Int'] | null
}
export type HotelRawUpdate = () => M.UpdateFilter<M.Document>

export type HotelInsert = {
  description?: null | types.Scalars['String']
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  tenantId: types.Scalars['Int']
  totalCustomers: types.Scalars['Int']
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Hotel,
  'id',
  'ID',
  HotelFilter,
  HotelRawFilter,
  HotelRelations,
  HotelProjection,
  HotelSort,
  HotelRawSort,
  HotelInsert,
  HotelUpdate,
  HotelRawUpdate,
  HotelExcludedFields,
  HotelRelationFields,
  HotelEmbeddedFields,
  HotelRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'hotel',
  EntityManager<MetadataType, OperationMetadataType>
>
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryHotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class HotelDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends HotelProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends HotelProjection, P2 extends HotelProjection>(p1: P1, p2: P2): T.SelectProjection<HotelProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<HotelProjection, P1, P2>
  }

  public constructor(params: HotelDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: hotelSchema(),
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

  public constructor(params: InMemoryHotelDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: hotelSchema(),
    })
  }
}

export type ReservationAST = {
  hotelId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  id: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  room: { kind: 'relation'; relationType: 'inner'; relation: 'Room'; isList: false; graphQL: 'Room'; isRequired: false; isListElementRequired: false }
  roomId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  tenantId: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: true; isListElementRequired: false }
  userId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
}

export type ReservationExcludedFields = never

export type ReservationEmbeddedFields = never
export type ReservationRelationFields = 'room'
export type ReservationRetrieveAll = Omit<types.Reservation, ReservationRelationFields | ReservationEmbeddedFields> & {}

export function reservationSchema(): T.Schema<types.Scalars> {
  return {
    hotelId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
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
      scalar: 'Int',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type ReservationFilterFields = {
  hotelId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  roomId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  tenantId?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type ReservationFilter = ReservationFilterFields & T.LogicalOperators<ReservationFilterFields | ReservationRawFilter>
export type ReservationRawFilter = () => M.Filter<M.Document>

export type ReservationRelations = Record<never, string>

export type ReservationProjection = {
  hotelId?: boolean
  id?: boolean
  room?: RoomProjection | boolean
  roomId?: boolean
  tenantId?: boolean
  userId?: boolean
}
export type ReservationParam<P extends ReservationProjection> = T.ParamProjection<types.Reservation, ReservationProjection, P>

export type ReservationSortKeys = 'hotelId' | 'id' | 'roomId' | 'tenantId' | 'userId'
export type ReservationSort = Partial<Record<ReservationSortKeys, T.SortDirection>>
export type ReservationRawSort = () => M.Sort

export type ReservationUpdate = {
  hotelId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  roomId?: types.Scalars['ID'] | null
  tenantId?: types.Scalars['Int'] | null
  userId?: types.Scalars['ID'] | null
}
export type ReservationRawUpdate = () => M.UpdateFilter<M.Document>

export type ReservationInsert = {
  hotelId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  roomId: types.Scalars['ID']
  tenantId: types.Scalars['Int']
  userId: types.Scalars['ID']
}

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Reservation,
  'id',
  'ID',
  ReservationFilter,
  ReservationRawFilter,
  ReservationRelations,
  ReservationProjection,
  ReservationSort,
  ReservationRawSort,
  ReservationInsert,
  ReservationUpdate,
  ReservationRawUpdate,
  ReservationExcludedFields,
  ReservationRelationFields,
  ReservationEmbeddedFields,
  ReservationRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'reservation',
  EntityManager<MetadataType, OperationMetadataType>
>
export type ReservationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryReservationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ReservationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class ReservationDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ReservationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ReservationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ReservationProjection, P2 extends ReservationProjection>(p1: P1, p2: P2): T.SelectProjection<ReservationProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ReservationProjection, P1, P2>
  }

  public constructor(params: ReservationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: reservationSchema(),
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

  public constructor(params: InMemoryReservationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: reservationSchema(),
    })
  }
}

export type RoleAST = {
  code: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'RoleCode'; isRequired: true; isListElementRequired: false }
  permissions: { kind: 'scalar'; scalar: 'string'; isList: true; graphQL: 'Permission'; isRequired: true; isListElementRequired: false }
}

export type RoleExcludedFields = never

export type RoleEmbeddedFields = never
export type RoleRelationFields = never
export type RoleRetrieveAll = Omit<types.Role, RoleRelationFields | RoleEmbeddedFields> & {}

export function roleSchema(): T.Schema<types.Scalars> {
  return {
    code: {
      type: 'scalar',
      scalar: 'String',
      isId: true,
      generationStrategy: 'user',
      required: true,
      isEnum: true,
    },
    permissions: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isList: true,
      isEnum: true,
    },
  }
}

type RoleFilterFields = {
  code?: types.RoleCode | null | T.EqualityOperators<types.RoleCode> | T.ElementOperators | T.StringOperators
  permissions?: types.Permission[] | null | T.EqualityOperators<types.Permission[]> | T.ElementOperators | T.StringOperators
}
export type RoleFilter = RoleFilterFields & T.LogicalOperators<RoleFilterFields | RoleRawFilter>
export type RoleRawFilter = () => M.Filter<M.Document>

export type RoleRelations = Record<never, string>

export type RoleProjection = {
  code?: boolean
  permissions?: boolean
}
export type RoleParam<P extends RoleProjection> = T.ParamProjection<types.Role, RoleProjection, P>

export type RoleSortKeys = 'code' | 'permissions'
export type RoleSort = Partial<Record<RoleSortKeys, T.SortDirection>>
export type RoleRawSort = () => M.Sort

export type RoleUpdate = {
  code?: types.RoleCode | null
  permissions?: (null | types.Permission)[] | null
}
export type RoleRawUpdate = () => M.UpdateFilter<M.Document>

export type RoleInsert = {
  code: types.RoleCode
  permissions: (null | types.Permission)[]
}

type RoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Role,
  'code',
  'String',
  RoleFilter,
  RoleRawFilter,
  RoleRelations,
  RoleProjection,
  RoleSort,
  RoleRawSort,
  RoleInsert,
  RoleUpdate,
  RoleRawUpdate,
  RoleExcludedFields,
  RoleRelationFields,
  RoleEmbeddedFields,
  RoleRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'role',
  EntityManager<MetadataType, OperationMetadataType>
>
export type RoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<RoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<RoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class RoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<RoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends RoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends RoleProjection, P2 extends RoleProjection>(p1: P1, p2: P2): T.SelectProjection<RoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<RoleProjection, P1, P2>
  }

  public constructor(params: RoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roleSchema(),
    })
  }
}

export class InMemoryRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<RoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends RoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends RoleProjection, P2 extends RoleProjection>(p1: P1, p2: P2): T.SelectProjection<RoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<RoleProjection, P1, P2>
  }

  public constructor(params: InMemoryRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roleSchema(),
    })
  }
}

export type RoomAST = {
  description: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'String'; isRequired: true; isListElementRequired: false }
  from: { kind: 'scalar'; scalar: 'any'; isList: false; graphQL: 'Date'; isRequired: true; isListElementRequired: false }
  hotel: { kind: 'relation'; relationType: 'inner'; relation: 'Hotel'; isList: false; graphQL: 'Hotel'; isRequired: true; isListElementRequired: false }
  hotelId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  id: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  tenantId: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: true; isListElementRequired: false }
  to: { kind: 'scalar'; scalar: 'any'; isList: false; graphQL: 'Date'; isRequired: true; isListElementRequired: false }
}

export type RoomExcludedFields = never

export type RoomEmbeddedFields = never
export type RoomRelationFields = 'hotel'
export type RoomRetrieveAll = Omit<types.Room, RoomRelationFields | RoomEmbeddedFields> & {}

export function roomSchema(): T.Schema<types.Scalars> {
  return {
    description: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    from: {
      type: 'scalar',
      scalar: 'Date',
      required: true,
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
      generationStrategy: 'generator',
      required: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
    to: {
      type: 'scalar',
      scalar: 'Date',
      required: true,
    },
  }
}

type RoomFilterFields = {
  description?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  from?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  hotelId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  tenantId?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  to?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
}
export type RoomFilter = RoomFilterFields & T.LogicalOperators<RoomFilterFields | RoomRawFilter>
export type RoomRawFilter = () => M.Filter<M.Document>

export type RoomRelations = Record<never, string>

export type RoomProjection = {
  description?: boolean
  from?: boolean
  hotel?: HotelProjection | boolean
  hotelId?: boolean
  id?: boolean
  tenantId?: boolean
  to?: boolean
}
export type RoomParam<P extends RoomProjection> = T.ParamProjection<types.Room, RoomProjection, P>

export type RoomSortKeys = 'description' | 'from' | 'hotelId' | 'id' | 'tenantId' | 'to'
export type RoomSort = Partial<Record<RoomSortKeys, T.SortDirection>>
export type RoomRawSort = () => M.Sort

export type RoomUpdate = {
  description?: types.Scalars['String'] | null
  from?: types.Scalars['Date'] | null
  hotelId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  tenantId?: types.Scalars['Int'] | null
  to?: types.Scalars['Date'] | null
}
export type RoomRawUpdate = () => M.UpdateFilter<M.Document>

export type RoomInsert = {
  description: types.Scalars['String']
  from: types.Scalars['Date']
  hotelId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  tenantId: types.Scalars['Int']
  to: types.Scalars['Date']
}

type RoomDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Room,
  'id',
  'ID',
  RoomFilter,
  RoomRawFilter,
  RoomRelations,
  RoomProjection,
  RoomSort,
  RoomRawSort,
  RoomInsert,
  RoomUpdate,
  RoomRawUpdate,
  RoomExcludedFields,
  RoomRelationFields,
  RoomEmbeddedFields,
  RoomRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'room',
  EntityManager<MetadataType, OperationMetadataType>
>
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryRoomDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class RoomDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<RoomDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends RoomProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends RoomProjection, P2 extends RoomProjection>(p1: P1, p2: P2): T.SelectProjection<RoomProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<RoomProjection, P1, P2>
  }

  public constructor(params: RoomDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roomSchema(),
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

  public constructor(params: InMemoryRoomDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roomSchema(),
    })
  }
}

export type UserAST = {
  email: { kind: 'scalar'; scalar: 'any'; isList: false; graphQL: 'Email'; isRequired: true; isListElementRequired: false }
  firstName: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'String'; isRequired: false; isListElementRequired: false }
  id: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  lastName: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'String'; isRequired: false; isListElementRequired: false }
  reservations: { kind: 'relation'; relationType: 'foreign'; relation: 'Reservation'; isList: true; graphQL: 'Reservation'; isRequired: true; isListElementRequired: false }
  roles: { kind: 'relation'; relationType: 'foreign'; relation: 'UserRole'; isList: true; graphQL: 'UserRole'; isRequired: true; isListElementRequired: true }
  totalPayments: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: false; isListElementRequired: false }
}

export type UserExcludedFields = never

export type UserEmbeddedFields = never
export type UserRelationFields = 'reservations' | 'roles'
export type UserRetrieveAll = Omit<types.User, UserRelationFields | UserEmbeddedFields> & {}

export function userSchema(): T.Schema<types.Scalars> {
  return {
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
      generationStrategy: 'generator',
      required: true,
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
    roles: {
      type: 'relation',
      relation: 'foreign',
      schema: () => userRoleSchema(),
      refFrom: 'refUserId',
      refTo: 'id',
      dao: 'userRole',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    totalPayments: {
      type: 'scalar',
      scalar: 'Int',
    },
  }
}

type UserFilterFields = {
  email?: types.Scalars['Email'] | null | T.EqualityOperators<types.Scalars['Email']> | T.ElementOperators
  firstName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  lastName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  totalPayments?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
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
  roles?: {
    filter?: UserRoleFilter
    sorts?: UserRoleSort[] | UserRoleRawSort
    skip?: number
    limit?: number
    relations?: UserRoleRelations
  }
}

export type UserProjection = {
  email?: boolean
  firstName?: boolean
  id?: boolean
  lastName?: boolean
  reservations?: ReservationProjection | boolean
  roles?: UserRoleProjection | boolean
  totalPayments?: boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'email' | 'firstName' | 'id' | 'lastName' | 'totalPayments'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = () => M.Sort

export type UserUpdate = {
  email?: types.Scalars['Email'] | null
  firstName?: types.Scalars['String'] | null
  id?: types.Scalars['ID'] | null
  lastName?: types.Scalars['String'] | null
  totalPayments?: types.Scalars['Int'] | null
}
export type UserRawUpdate = () => M.UpdateFilter<M.Document>

export type UserInsert = {
  email: types.Scalars['Email']
  firstName?: null | types.Scalars['String']
  id?: null | types.Scalars['ID']
  lastName?: null | types.Scalars['String']
  totalPayments?: null | types.Scalars['Int']
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.User,
  'id',
  'ID',
  UserFilter,
  UserRawFilter,
  UserRelations,
  UserProjection,
  UserSort,
  UserRawSort,
  UserInsert,
  UserUpdate,
  UserRawUpdate,
  UserExcludedFields,
  UserRelationFields,
  UserEmbeddedFields,
  UserRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'user',
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }

  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
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

  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export type UserRoleAST = {
  hotelId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: false; isListElementRequired: false }
  id: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  refUserId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: true; isListElementRequired: false }
  role: { kind: 'relation'; relationType: 'inner'; relation: 'Role'; isList: false; graphQL: 'Role'; isRequired: true; isListElementRequired: false }
  roleCode: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'RoleCode'; isRequired: true; isListElementRequired: false }
  tenantId: { kind: 'scalar'; scalar: 'number'; isList: false; graphQL: 'Int'; isRequired: false; isListElementRequired: false }
  userId: { kind: 'scalar'; scalar: 'string'; isList: false; graphQL: 'ID'; isRequired: false; isListElementRequired: false }
}

export type UserRoleExcludedFields = never

export type UserRoleEmbeddedFields = never
export type UserRoleRelationFields = 'role'
export type UserRoleRetrieveAll = Omit<types.UserRole, UserRoleRelationFields | UserRoleEmbeddedFields> & {}

export function userRoleSchema(): T.Schema<types.Scalars> {
  return {
    hotelId: {
      type: 'scalar',
      scalar: 'ID',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    refUserId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    role: {
      type: 'relation',
      relation: 'inner',
      schema: () => roleSchema(),
      refFrom: 'roleCode',
      refTo: 'code',
      dao: 'role',
      required: true,
    },
    roleCode: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
    },
    tenantId: {
      type: 'scalar',
      scalar: 'Int',
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
    },
  }
}

type UserRoleFilterFields = {
  hotelId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  refUserId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  roleCode?: types.RoleCode | null | T.EqualityOperators<types.RoleCode> | T.ElementOperators | T.StringOperators
  tenantId?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type UserRoleFilter = UserRoleFilterFields & T.LogicalOperators<UserRoleFilterFields | UserRoleRawFilter>
export type UserRoleRawFilter = () => M.Filter<M.Document>

export type UserRoleRelations = Record<never, string>

export type UserRoleProjection = {
  hotelId?: boolean
  id?: boolean
  refUserId?: boolean
  role?: RoleProjection | boolean
  roleCode?: boolean
  tenantId?: boolean
  userId?: boolean
}
export type UserRoleParam<P extends UserRoleProjection> = T.ParamProjection<types.UserRole, UserRoleProjection, P>

export type UserRoleSortKeys = 'hotelId' | 'id' | 'refUserId' | 'roleCode' | 'tenantId' | 'userId'
export type UserRoleSort = Partial<Record<UserRoleSortKeys, T.SortDirection>>
export type UserRoleRawSort = () => M.Sort

export type UserRoleUpdate = {
  hotelId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  refUserId?: types.Scalars['ID'] | null
  roleCode?: types.RoleCode | null
  tenantId?: types.Scalars['Int'] | null
  userId?: types.Scalars['ID'] | null
}
export type UserRoleRawUpdate = () => M.UpdateFilter<M.Document>

export type UserRoleInsert = {
  hotelId?: null | types.Scalars['ID']
  refUserId: types.Scalars['ID']
  roleCode: types.RoleCode
  tenantId?: null | types.Scalars['Int']
  userId?: null | types.Scalars['ID']
}

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.UserRole,
  'id',
  'ID',
  UserRoleFilter,
  UserRoleRawFilter,
  UserRoleRelations,
  UserRoleProjection,
  UserRoleSort,
  UserRoleRawSort,
  UserRoleInsert,
  UserRoleUpdate,
  UserRoleRawUpdate,
  UserRoleExcludedFields,
  UserRoleRelationFields,
  UserRoleEmbeddedFields,
  UserRoleRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'userRole',
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserRoleProjection, P2 extends UserRoleProjection>(p1: P1, p2: P2): T.SelectProjection<UserRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserRoleProjection, P1, P2>
  }

  public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export class InMemoryUserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserRoleProjection, P2 extends UserRoleProjection>(p1: P1, p2: P2): T.SelectProjection<UserRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserRoleProjection, P1, P2>
  }

  public constructor(params: InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    reservation?: Pick<Partial<ReservationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    role?: Pick<Partial<RoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    room?: Pick<Partial<RoomDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    userRole?: Pick<Partial<UserRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>
  log?: T.LogInput<'hotel' | 'reservation' | 'role' | 'room' | 'user' | 'userRole'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, types.Scalars, MetadataType> {
  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined
  private _reservation: ReservationDAO<MetadataType, OperationMetadataType> | undefined
  private _role: RoleDAO<MetadataType, OperationMetadataType> | undefined
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'hotel' | 'reservation' | 'role' | 'room' | 'user' | 'userRole'>

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
              name: 'hotel',
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
              name: 'hotel',
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
              name: 'reservation',
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
              name: 'reservation',
              logger: this.logger,
            })
    }
    return this._reservation
  }
  get role(): RoleDAO<MetadataType, OperationMetadataType> {
    if (!this._role) {
      const db = this.mongodb.default
      this._role =
        db === 'mock'
          ? (new InMemoryRoleDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.role,
              middlewares: [...(this.overrides?.role?.middlewares || []), ...(selectMiddleware('role', this.middlewares) as T.DAOMiddleware<RoleDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'role',
              logger: this.logger,
            }) as unknown as RoleDAO<MetadataType, OperationMetadataType>)
          : new RoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.role,
              collection: db.collection('roles'),
              middlewares: [...(this.overrides?.role?.middlewares || []), ...(selectMiddleware('role', this.middlewares) as T.DAOMiddleware<RoleDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'role',
              logger: this.logger,
            })
    }
    return this._role
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
              name: 'room',
              logger: this.logger,
            }) as unknown as RoomDAO<MetadataType, OperationMetadataType>)
          : new RoomDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.room,
              collection: db.collection('rooms'),
              middlewares: [...(this.overrides?.room?.middlewares || []), ...(selectMiddleware('room', this.middlewares) as T.DAOMiddleware<RoomDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'room',
              logger: this.logger,
            })
    }
    return this._room
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
              name: 'user',
              logger: this.logger,
            }) as unknown as UserDAO<MetadataType, OperationMetadataType>)
          : new UserDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.user,
              collection: db.collection('users'),
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'user',
              logger: this.logger,
            })
    }
    return this._user
  }
  get userRole(): UserRoleDAO<MetadataType, OperationMetadataType> {
    if (!this._userRole) {
      const db = this.mongodb.default
      this._userRole =
        db === 'mock'
          ? (new InMemoryUserRoleDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.userRole,
              middlewares: [
                ...(this.overrides?.userRole?.middlewares || []),
                ...(selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'userRole',
              logger: this.logger,
            }) as unknown as UserRoleDAO<MetadataType, OperationMetadataType>)
          : new UserRoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.userRole,
              collection: db.collection('userRoles'),
              middlewares: [
                ...(this.overrides?.userRole?.middlewares || []),
                ...(selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'userRole',
              logger: this.logger,
            })
    }
    return this._userRole
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined,
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
        role: M.Collection<M.Document> | null
        room: M.Collection<M.Document> | null
        user: M.Collection<M.Document> | null
        userRole: M.Collection<M.Document> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { mongodb: this.mongodb },
      {
        hotel: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('hotels'),
        reservation: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('reservations'),
        role: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('roles'),
        room: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('rooms'),
        user: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('users'),
        userRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userRoles'),
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
  role: RoleDAOGenerics<MetadataType, OperationMetadataType>
  room: RoomDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
  userRole: UserRoleDAOGenerics<MetadataType, OperationMetadataType>
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
