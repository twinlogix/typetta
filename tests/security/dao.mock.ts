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
  Permission: { type: types.Permission; isTextual: false; isQuantitative: false }
  RoleCode: { type: types.RoleCode; isTextual: false; isQuantitative: false }
  Username: { type: types.Scalars['Username']; isTextual: false; isQuantitative: false }
}

export type AST = {
  Hotel: {
    fields: {
      description: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      totalCustomers: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Reservation: {
    fields: {
      hotelId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      room: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Room'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      roomId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Role: {
    fields: {
      code: { type: 'scalar'; isList: false; astName: 'RoleCode'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      permissions: { type: 'scalar'; isList: true; astName: 'Permission'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Room: {
    fields: {
      description: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      from: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      hotel: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Hotel'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      hotelId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      tenantId: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      to: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  User: {
    fields: {
      email: { type: 'scalar'; isList: false; astName: 'Email'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
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
      roles: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'UserRole'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      totalPayments: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UserRole: {
    fields: {
      hotelId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      refUserId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      role: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Role'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      roleCode: { type: 'scalar'; isList: false; astName: 'RoleCode'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tenantId: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
}

export function hotelSchema(): T.Schema<Scalars> {
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

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'Hotel', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryHotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

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

type ReservationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Reservation',
  AST,
  Scalars,
  MetadataType,
  OperationMetadataType,
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
export function roleSchema(): T.Schema<Scalars> {
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

type RoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'Role', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type RoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<RoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<RoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class RoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<RoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Role', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Role', AST>, P2 extends T.Projection<'Role', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Role', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Role', AST>, P1, P2>
  }
  public constructor(params: RoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roleSchema(),
    })
  }
}

export class InMemoryRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<RoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Role', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Role', AST>, P2 extends T.Projection<'Role', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Role', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Role', AST>, P1, P2>
  }
  public constructor(params: InMemoryRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: roleSchema(),
    })
  }
}
export function roomSchema(): T.Schema<Scalars> {
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

type RoomDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'Room', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type RoomDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryRoomDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<RoomDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

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
export function userSchema(): T.Schema<Scalars> {
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

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'User', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

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
export function userRoleSchema(): T.Schema<Scalars> {
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

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'UserRole', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
  }
  public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export class InMemoryUserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
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
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'mongo'>
  log?: T.LogInput<'Hotel' | 'Reservation' | 'Role' | 'Room' | 'User' | 'UserRole'>
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
  private _role: RoleDAO<MetadataType, OperationMetadataType> | undefined
  private _room: RoomDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'Hotel' | 'Reservation' | 'Role' | 'Room' | 'User' | 'UserRole'>

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
              name: 'Role',
              logger: this.logger,
            }) as unknown as RoleDAO<MetadataType, OperationMetadataType>)
          : new RoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.role,
              collection: db.collection('roles'),
              middlewares: [...(this.overrides?.role?.middlewares || []), ...(selectMiddleware('role', this.middlewares) as T.DAOMiddleware<RoleDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Role',
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
              name: 'UserRole',
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
              name: 'UserRole',
              logger: this.logger,
            })
    }
    return this._userRole
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Email', 'Password', 'Permission', 'RoleCode', 'Username', 'ID', 'String', 'Boolean', 'Int', 'Float'])
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
