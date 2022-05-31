import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

export type AST = {
  Address: {
    cities: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'City'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
  }
  Audit: {
    changes: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    entityId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'db' }
  }
  Auditable: {
    createdBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    createdOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    deletedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    modifiedBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    modifiedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    state: { type: 'scalar'; isList: false; astName: 'State'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    versions: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Audit'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  City: {
    addressId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    computedAddressName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isID: false; generationStrategy: 'undefined' }
    computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  DefaultFieldsEntity: {
    creationDate: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'middleware' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'user' }
    live: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    opt1: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'middleware' }
    opt2: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'generator' }
  }
  Device: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  Dog: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    owner: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    ownerId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser: {
    e: { type: 'embedded'; isList: true; astName: 'EmbeddedUser2'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser2: {
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser3: {
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser4: {
    e: { type: 'embedded'; isList: false; astName: 'EmbeddedUser5'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser5: { userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' } }
  Hotel: {
    audit: { type: 'embedded'; isList: false; astName: 'Auditable'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'middleware' }
    embeddedUser3: { type: 'embedded'; isList: false; astName: 'EmbeddedUser3'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    embeddedUser4: { type: 'embedded'; isList: false; astName: 'EmbeddedUser4'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    embeddedUsers: { type: 'embedded'; isList: true; astName: 'EmbeddedUser'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    embeddedUsers3: { type: 'embedded'; isList: true; astName: 'EmbeddedUser3'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    embeddedUsers4: { type: 'embedded'; isList: true; astName: 'EmbeddedUser4'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'db' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    users: { type: 'embedded'; isList: false; astName: 'UserCollection'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  MockedEntity: {
    id: { type: 'scalar'; isList: false; astName: 'MongoID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'db' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  Organization: {
    address: { type: 'embedded'; isList: false; astName: 'Address'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    vatNumber: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  Post: {
    author: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    authorId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    body: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    clicks: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    metadata: { type: 'embedded'; isList: false; astName: 'PostMetadata'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    title: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  PostMetadata: {
    region: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    visible: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  User: {
    amount: { type: 'scalar'; isList: false; astName: 'Decimal'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    amounts: { type: 'scalar'; isList: true; astName: 'Decimal'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    credentials: {
      type: 'embedded'
      isList: true
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isID: false
      generationStrategy: 'undefined'
    }
    dogs: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Dog'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    embeddedPost: { type: 'embedded'; isList: false; astName: 'Post'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    friends: { type: 'relation'; relation: 'inner'; isList: true; astName: 'User'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    friendsId: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: false; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: true; generationStrategy: 'generator' }
    int: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    lastName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    live: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    localization: { type: 'scalar'; isList: false; astName: 'Coordinates'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    title: { type: 'scalar'; isList: false; astName: 'LocalizedString'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    usernamePasswordCredentials: {
      type: 'embedded'
      isList: false
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isID: false
      generationStrategy: 'undefined'
    }
  }
  UserCollection: {
    users: { type: 'relation'; relation: 'inner'; isList: true; astName: 'User'; isRequired: true; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    usersId: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: true; isListElementRequired: true; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
  UsernamePasswordCredentials: {
    password: { type: 'scalar'; isList: false; astName: 'Password'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
    username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isID: false; generationStrategy: 'undefined' }
  }
}

export type AddressExcludedFields = never
export type AddressRelationFields = 'cities'

export function addressSchema(): T.Schema<types.Scalars> {
  return {
    cities: {
      type: 'relation',
      relation: 'foreign',
      schema: () => citySchema(),
      refFrom: 'addressId',
      refTo: 'id',
      dao: 'city',
      isListElementRequired: true,
      isList: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
  }
}

type AddressFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type AddressFilter = AddressFilterFields & T.LogicalOperators<AddressFilterFields | AddressRawFilter>
export type AddressRawFilter = () => M.Filter<M.Document>

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
  cities?: CityProjection | boolean
  id?: boolean
}
export type AddressParam<P extends AddressProjection> = T.ParamProjection<types.Address, AddressProjection, P>

export type AddressSortKeys = 'id'
export type AddressSort = Partial<Record<AddressSortKeys, T.SortDirection>>
export type AddressRawSort = () => M.Sort

export type AddressUpdate = {
  id?: types.Scalars['ID'] | null
}
export type AddressRawUpdate = () => M.UpdateFilter<M.Document>

export type AddressInsert = {
  id?: null | types.Scalars['ID']
}

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Address,
  'id',
  'ID',
  AddressFilter,
  AddressRawFilter,
  AddressRelations,
  AddressProjection,
  AddressSort,
  AddressRawSort,
  AddressInsert,
  AddressUpdate,
  AddressRawUpdate,
  AddressExcludedFields,
  AddressRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'address',
  EntityManager<MetadataType, OperationMetadataType>
>
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryAddressDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AddressProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AddressProjection, P2 extends AddressProjection>(p1: P1, p2: P2): T.SelectProjection<AddressProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AddressProjection, P1, P2>
  }

  public constructor(params: AddressDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: addressSchema(),
    })
  }
}

export class InMemoryAddressDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AddressProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AddressProjection, P2 extends AddressProjection>(p1: P1, p2: P2): T.SelectProjection<AddressProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AddressProjection, P1, P2>
  }

  public constructor(params: InMemoryAddressDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: addressSchema(),
    })
  }
}

export type AuditExcludedFields = never
export type AuditRelationFields = never

export function auditSchema(): T.Schema<types.Scalars> {
  return {
    changes: {
      type: 'scalar',
      scalar: 'String',
    },
    entityId: {
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
  }
}

type AuditFilterFields = {
  changes?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  entityId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type AuditFilter = AuditFilterFields & T.LogicalOperators<AuditFilterFields | AuditRawFilter>
export type AuditRawFilter = () => M.Filter<M.Document>

export type AuditRelations = Record<never, string>

export type AuditProjection = {
  changes?: boolean
  entityId?: boolean
  id?: boolean
}
export type AuditParam<P extends AuditProjection> = T.ParamProjection<types.Audit, AuditProjection, P>

export type AuditSortKeys = 'changes' | 'entityId' | 'id'
export type AuditSort = Partial<Record<AuditSortKeys, T.SortDirection>>
export type AuditRawSort = () => M.Sort

export type AuditUpdate = {
  changes?: types.Scalars['String'] | null
  entityId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
}
export type AuditRawUpdate = () => M.UpdateFilter<M.Document>

export type AuditInsert = {
  changes?: null | types.Scalars['String']
  entityId: types.Scalars['ID']
}

type AuditDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Audit,
  'id',
  'ID',
  AuditFilter,
  AuditRawFilter,
  AuditRelations,
  AuditProjection,
  AuditSort,
  AuditRawSort,
  AuditInsert,
  AuditUpdate,
  AuditRawUpdate,
  AuditExcludedFields,
  AuditRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'audit',
  EntityManager<MetadataType, OperationMetadataType>
>
export type AuditDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<AuditDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryAuditDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuditDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AuditDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuditProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuditProjection, P2 extends AuditProjection>(p1: P1, p2: P2): T.SelectProjection<AuditProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuditProjection, P1, P2>
  }

  public constructor(params: AuditDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: auditSchema(),
    })
  }
}

export class InMemoryAuditDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuditProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuditProjection, P2 extends AuditProjection>(p1: P1, p2: P2): T.SelectProjection<AuditProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuditProjection, P1, P2>
  }

  public constructor(params: InMemoryAuditDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: auditSchema(),
    })
  }
}

export function auditableSchema(): T.Schema<types.Scalars> {
  return {
    createdBy: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    createdOn: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
    deletedOn: {
      type: 'scalar',
      scalar: 'Int',
    },
    modifiedBy: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    modifiedOn: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
    state: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
    },
    versions: {
      type: 'relation',
      relation: 'foreign',
      schema: () => auditSchema(),
      refFrom: 'entityId',
      refTo: '../id',
      dao: 'audit',
      required: true,
      isList: true,
    },
  }
}

export type AuditableProjection = {
  createdBy?: boolean
  createdOn?: boolean
  deletedOn?: boolean
  modifiedBy?: boolean
  modifiedOn?: boolean
  state?: boolean
  versions?: AuditProjection | boolean
}
export type AuditableParam<P extends AuditableProjection> = T.ParamProjection<types.Auditable, AuditableProjection, P>

export type AuditableInsert = {
  createdBy: types.Scalars['String']
  createdOn: types.Scalars['Int']
  deletedOn?: null | types.Scalars['Int']
  modifiedBy: types.Scalars['String']
  modifiedOn: types.Scalars['Int']
  state: types.State
}

export type CityExcludedFields = 'computedAddressName' | 'computedName'
export type CityRelationFields = never

export function citySchema(): T.Schema<types.Scalars> {
  return {
    addressId: {
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
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
  }
}

type CityFilterFields = {
  addressId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type CityFilter = CityFilterFields & T.LogicalOperators<CityFilterFields | CityRawFilter>
export type CityRawFilter = () => M.Filter<M.Document>

export type CityRelations = Record<never, string>

export type CityProjection = {
  addressId?: boolean
  computedAddressName?: boolean
  computedName?: boolean
  id?: boolean
  name?: boolean
}
export type CityParam<P extends CityProjection> = T.ParamProjection<types.City, CityProjection, P>

export type CitySortKeys = 'addressId' | 'id' | 'name'
export type CitySort = Partial<Record<CitySortKeys, T.SortDirection>>
export type CityRawSort = () => M.Sort

export type CityUpdate = {
  addressId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
}
export type CityRawUpdate = () => M.UpdateFilter<M.Document>

export type CityInsert = {
  addressId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
}

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.City,
  'id',
  'ID',
  CityFilter,
  CityRawFilter,
  CityRelations,
  CityProjection,
  CitySort,
  CityRawSort,
  CityInsert,
  CityUpdate,
  CityRawUpdate,
  CityExcludedFields,
  CityRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'city',
  EntityManager<MetadataType, OperationMetadataType>
>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryCityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends CityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends CityProjection, P2 extends CityProjection>(p1: P1, p2: P2): T.SelectProjection<CityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<CityProjection, P1, P2>
  }

  public constructor(params: CityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: citySchema(),
    })
  }
}

export class InMemoryCityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends CityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends CityProjection, P2 extends CityProjection>(p1: P1, p2: P2): T.SelectProjection<CityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<CityProjection, P1, P2>
  }

  public constructor(params: InMemoryCityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: citySchema(),
    })
  }
}

export type DefaultFieldsEntityExcludedFields = never
export type DefaultFieldsEntityRelationFields = never

export function defaultFieldsEntitySchema(): T.Schema<types.Scalars> {
  return {
    creationDate: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      generationStrategy: 'middleware',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
    },
    live: {
      type: 'scalar',
      scalar: 'Live',
      required: true,
      generationStrategy: 'generator',
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    opt1: {
      type: 'scalar',
      scalar: 'Live',
      generationStrategy: 'middleware',
    },
    opt2: {
      type: 'scalar',
      scalar: 'Live',
      generationStrategy: 'generator',
    },
  }
}

type DefaultFieldsEntityFilterFields = {
  creationDate?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  live?: types.Scalars['Live'] | null | T.EqualityOperators<types.Scalars['Live']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  opt1?: types.Scalars['Live'] | null | T.EqualityOperators<types.Scalars['Live']> | T.ElementOperators
  opt2?: types.Scalars['Live'] | null | T.EqualityOperators<types.Scalars['Live']> | T.ElementOperators
}
export type DefaultFieldsEntityFilter = DefaultFieldsEntityFilterFields & T.LogicalOperators<DefaultFieldsEntityFilterFields | DefaultFieldsEntityRawFilter>
export type DefaultFieldsEntityRawFilter = () => M.Filter<M.Document>

export type DefaultFieldsEntityRelations = Record<never, string>

export type DefaultFieldsEntityProjection = {
  creationDate?: boolean
  id?: boolean
  live?: boolean
  name?: boolean
  opt1?: boolean
  opt2?: boolean
}
export type DefaultFieldsEntityParam<P extends DefaultFieldsEntityProjection> = T.ParamProjection<types.DefaultFieldsEntity, DefaultFieldsEntityProjection, P>

export type DefaultFieldsEntitySortKeys = 'creationDate' | 'id' | 'live' | 'name' | 'opt1' | 'opt2'
export type DefaultFieldsEntitySort = Partial<Record<DefaultFieldsEntitySortKeys, T.SortDirection>>
export type DefaultFieldsEntityRawSort = () => M.Sort

export type DefaultFieldsEntityUpdate = {
  creationDate?: types.Scalars['Int'] | null
  id?: types.Scalars['ID'] | null
  live?: types.Scalars['Live'] | null
  name?: types.Scalars['String'] | null
  opt1?: types.Scalars['Live'] | null
  opt2?: types.Scalars['Live'] | null
}
export type DefaultFieldsEntityRawUpdate = () => M.UpdateFilter<M.Document>

export type DefaultFieldsEntityInsert = {
  creationDate?: null | types.Scalars['Int']
  id: types.Scalars['ID']
  live?: null | types.Scalars['Live']
  name: types.Scalars['String']
  opt1?: null | types.Scalars['Live']
  opt2?: null | types.Scalars['Live']
}

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.DefaultFieldsEntity,
  'id',
  'ID',
  DefaultFieldsEntityFilter,
  DefaultFieldsEntityRawFilter,
  DefaultFieldsEntityRelations,
  DefaultFieldsEntityProjection,
  DefaultFieldsEntitySort,
  DefaultFieldsEntityRawSort,
  DefaultFieldsEntityInsert,
  DefaultFieldsEntityUpdate,
  DefaultFieldsEntityRawUpdate,
  DefaultFieldsEntityExcludedFields,
  DefaultFieldsEntityRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'defaultFieldsEntity',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryDefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DefaultFieldsEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DefaultFieldsEntityProjection, P2 extends DefaultFieldsEntityProjection>(p1: P1, p2: P2): T.SelectProjection<DefaultFieldsEntityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DefaultFieldsEntityProjection, P1, P2>
  }

  public constructor(params: DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: defaultFieldsEntitySchema(),
    })
  }
}

export class InMemoryDefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DefaultFieldsEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DefaultFieldsEntityProjection, P2 extends DefaultFieldsEntityProjection>(p1: P1, p2: P2): T.SelectProjection<DefaultFieldsEntityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DefaultFieldsEntityProjection, P1, P2>
  }

  public constructor(params: InMemoryDefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: defaultFieldsEntitySchema(),
    })
  }
}

export type DeviceExcludedFields = never
export type DeviceRelationFields = 'user'

export function deviceSchema(): T.Schema<types.Scalars> {
  return {
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
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
    },
  }
}

type DeviceFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type DeviceFilter = DeviceFilterFields & T.LogicalOperators<DeviceFilterFields | DeviceRawFilter>
export type DeviceRawFilter = () => M.Filter<M.Document>

export type DeviceRelations = Record<never, string>

export type DeviceProjection = {
  id?: boolean
  name?: boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type DeviceParam<P extends DeviceProjection> = T.ParamProjection<types.Device, DeviceProjection, P>

export type DeviceSortKeys = 'id' | 'name' | 'userId'
export type DeviceSort = Partial<Record<DeviceSortKeys, T.SortDirection>>
export type DeviceRawSort = () => M.Sort

export type DeviceUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
}
export type DeviceRawUpdate = () => M.UpdateFilter<M.Document>

export type DeviceInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  userId?: null | types.Scalars['ID']
}

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Device,
  'id',
  'ID',
  DeviceFilter,
  DeviceRawFilter,
  DeviceRelations,
  DeviceProjection,
  DeviceSort,
  DeviceRawSort,
  DeviceInsert,
  DeviceUpdate,
  DeviceRawUpdate,
  DeviceExcludedFields,
  DeviceRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'device',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDeviceDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DeviceProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DeviceProjection, P2 extends DeviceProjection>(p1: P1, p2: P2): T.SelectProjection<DeviceProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DeviceProjection, P1, P2>
  }

  public constructor(params: DeviceDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: deviceSchema(),
    })
  }
}

export class InMemoryDeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DeviceProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DeviceProjection, P2 extends DeviceProjection>(p1: P1, p2: P2): T.SelectProjection<DeviceProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DeviceProjection, P1, P2>
  }

  public constructor(params: InMemoryDeviceDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: deviceSchema(),
    })
  }
}

export type DogExcludedFields = never
export type DogRelationFields = 'owner'

export function dogSchema(): T.Schema<types.Scalars> {
  return {
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
    owner: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'ownerId',
      refTo: 'id',
      dao: 'user',
    },
    ownerId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type DogFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  ownerId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type DogFilter = DogFilterFields & T.LogicalOperators<DogFilterFields | DogRawFilter>
export type DogRawFilter = () => M.Filter<M.Document>

export type DogRelations = Record<never, string>

export type DogProjection = {
  id?: boolean
  name?: boolean
  owner?: UserProjection | boolean
  ownerId?: boolean
}
export type DogParam<P extends DogProjection> = T.ParamProjection<types.Dog, DogProjection, P>

export type DogSortKeys = 'id' | 'name' | 'ownerId'
export type DogSort = Partial<Record<DogSortKeys, T.SortDirection>>
export type DogRawSort = () => M.Sort

export type DogUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  ownerId?: types.Scalars['ID'] | null
}
export type DogRawUpdate = () => M.UpdateFilter<M.Document>

export type DogInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  ownerId: types.Scalars['ID']
}

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Dog,
  'id',
  'ID',
  DogFilter,
  DogRawFilter,
  DogRelations,
  DogProjection,
  DogSort,
  DogRawSort,
  DogInsert,
  DogUpdate,
  DogRawUpdate,
  DogExcludedFields,
  DogRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'dog',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDogDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DogProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DogProjection, P2 extends DogProjection>(p1: P1, p2: P2): T.SelectProjection<DogProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DogProjection, P1, P2>
  }

  public constructor(params: DogDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dogSchema(),
    })
  }
}

export class InMemoryDogDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends DogProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DogProjection, P2 extends DogProjection>(p1: P1, p2: P2): T.SelectProjection<DogProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<DogProjection, P1, P2>
  }

  public constructor(params: InMemoryDogDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dogSchema(),
    })
  }
}

export function embeddedUserSchema(): T.Schema<types.Scalars> {
  return {
    e: {
      type: 'embedded',
      schema: () => embeddedUser2Schema(),
      isListElementRequired: true,
      isList: true,
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

export type EmbeddedUserProjection = {
  e?:
    | {
        user?: UserProjection | boolean
        userId?: boolean
      }
    | boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type EmbeddedUserParam<P extends EmbeddedUserProjection> = T.ParamProjection<types.EmbeddedUser, EmbeddedUserProjection, P>

export type EmbeddedUserInsert = {
  e?: null | EmbeddedUser2Insert[]
  userId: types.Scalars['ID']
}

export function embeddedUser2Schema(): T.Schema<types.Scalars> {
  return {
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

export type EmbeddedUser2Projection = {
  user?: UserProjection | boolean
  userId?: boolean
}
export type EmbeddedUser2Param<P extends EmbeddedUser2Projection> = T.ParamProjection<types.EmbeddedUser2, EmbeddedUser2Projection, P>

export type EmbeddedUser2Insert = {
  userId: types.Scalars['ID']
}

export function embeddedUser3Schema(): T.Schema<types.Scalars> {
  return {
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: '../userId',
      refTo: 'id',
      dao: 'user',
    },
    value: {
      type: 'scalar',
      scalar: 'Int',
    },
  }
}

export type EmbeddedUser3Projection = {
  user?: UserProjection | boolean
  value?: boolean
}
export type EmbeddedUser3Param<P extends EmbeddedUser3Projection> = T.ParamProjection<types.EmbeddedUser3, EmbeddedUser3Projection, P>

export type EmbeddedUser3Insert = {
  value?: null | types.Scalars['Int']
}

export function embeddedUser4Schema(): T.Schema<types.Scalars> {
  return {
    e: {
      type: 'embedded',
      schema: () => embeddedUser5Schema(),
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'e.userId',
      refTo: 'id',
      dao: 'user',
    },
  }
}

export type EmbeddedUser4Projection = {
  e?:
    | {
        userId?: boolean
      }
    | boolean
  user?: UserProjection | boolean
}
export type EmbeddedUser4Param<P extends EmbeddedUser4Projection> = T.ParamProjection<types.EmbeddedUser4, EmbeddedUser4Projection, P>

export type EmbeddedUser4Insert = {
  e?: null | EmbeddedUser5Insert
}

export function embeddedUser5Schema(): T.Schema<types.Scalars> {
  return {
    userId: {
      type: 'scalar',
      scalar: 'ID',
    },
  }
}

export type EmbeddedUser5Projection = {
  userId?: boolean
}
export type EmbeddedUser5Param<P extends EmbeddedUser5Projection> = T.ParamProjection<types.EmbeddedUser5, EmbeddedUser5Projection, P>

export type EmbeddedUser5Insert = {
  userId?: null | types.Scalars['ID']
}

export type HotelExcludedFields = never
export type HotelRelationFields = never

export function hotelSchema(): T.Schema<types.Scalars> {
  return {
    audit: {
      type: 'embedded',
      schema: () => auditableSchema(),
      required: true,
      generationStrategy: 'middleware',
    },
    embeddedUser3: {
      type: 'embedded',
      schema: () => embeddedUser3Schema(),
    },
    embeddedUser4: {
      type: 'embedded',
      schema: () => embeddedUser4Schema(),
    },
    embeddedUsers: {
      type: 'embedded',
      schema: () => embeddedUserSchema(),
      isListElementRequired: true,
      isList: true,
    },
    embeddedUsers3: {
      type: 'embedded',
      schema: () => embeddedUser3Schema(),
      isListElementRequired: true,
      isList: true,
    },
    embeddedUsers4: {
      type: 'embedded',
      schema: () => embeddedUser4Schema(),
      isListElementRequired: true,
      isList: true,
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
    userId: {
      type: 'scalar',
      scalar: 'ID',
    },
    users: {
      type: 'embedded',
      schema: () => userCollectionSchema(),
    },
  }
}

type HotelFilterFields = {
  'audit.createdBy'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'audit.createdOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.deletedOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.modifiedBy'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'audit.modifiedOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.state'?: types.State | null | T.EqualityOperators<types.State> | T.ElementOperators | T.StringOperators
  'embeddedUser3.value'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'embeddedUser4.e.userId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'embeddedUsers.e.userId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'embeddedUsers.userId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'embeddedUsers3.value'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'embeddedUsers4.e.userId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'users.usersId'?: types.Scalars['ID'][] | null | T.EqualityOperators<types.Scalars['ID'][]> | T.ElementOperators
}
export type HotelFilter = HotelFilterFields & T.LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = () => M.Filter<M.Document>

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  audit?:
    | {
        createdBy?: boolean
        createdOn?: boolean
        deletedOn?: boolean
        modifiedBy?: boolean
        modifiedOn?: boolean
        state?: boolean
        versions?: AuditProjection | boolean
      }
    | boolean
  embeddedUser3?:
    | {
        user?: UserProjection | boolean
        value?: boolean
      }
    | boolean
  embeddedUser4?:
    | {
        e?:
          | {
              userId?: boolean
            }
          | boolean
        user?: UserProjection | boolean
      }
    | boolean
  embeddedUsers?:
    | {
        e?:
          | {
              user?: UserProjection | boolean
              userId?: boolean
            }
          | boolean
        user?: UserProjection | boolean
        userId?: boolean
      }
    | boolean
  embeddedUsers3?:
    | {
        user?: UserProjection | boolean
        value?: boolean
      }
    | boolean
  embeddedUsers4?:
    | {
        e?:
          | {
              userId?: boolean
            }
          | boolean
        user?: UserProjection | boolean
      }
    | boolean
  id?: boolean
  name?: boolean
  userId?: boolean
  users?:
    | {
        users?: UserProjection | boolean
        usersId?: boolean
      }
    | boolean
}
export type HotelParam<P extends HotelProjection> = T.ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys =
  | 'audit.createdBy'
  | 'audit.createdOn'
  | 'audit.deletedOn'
  | 'audit.modifiedBy'
  | 'audit.modifiedOn'
  | 'audit.state'
  | 'embeddedUser3.value'
  | 'embeddedUser4.e.userId'
  | 'embeddedUsers.e.userId'
  | 'embeddedUsers.userId'
  | 'embeddedUsers3.value'
  | 'embeddedUsers4.e.userId'
  | 'id'
  | 'name'
  | 'userId'
  | 'users.usersId'
export type HotelSort = Partial<Record<HotelSortKeys, T.SortDirection>>
export type HotelRawSort = () => M.Sort

export type HotelUpdate = {
  audit?: AuditableInsert | null
  'audit.createdBy'?: types.Scalars['String'] | null
  'audit.createdOn'?: types.Scalars['Int'] | null
  'audit.deletedOn'?: types.Scalars['Int'] | null
  'audit.modifiedBy'?: types.Scalars['String'] | null
  'audit.modifiedOn'?: types.Scalars['Int'] | null
  'audit.state'?: types.State | null
  embeddedUser3?: EmbeddedUser3Insert | null
  'embeddedUser3.value'?: types.Scalars['Int'] | null
  embeddedUser4?: EmbeddedUser4Insert | null
  'embeddedUser4.e'?: EmbeddedUser5Insert | null
  'embeddedUser4.e.userId'?: types.Scalars['ID'] | null
  embeddedUsers?: EmbeddedUserInsert[] | null
  embeddedUsers3?: EmbeddedUser3Insert[] | null
  embeddedUsers4?: EmbeddedUser4Insert[] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
  users?: UserCollectionInsert | null
  'users.usersId'?: types.Scalars['ID'][] | null
}
export type HotelRawUpdate = () => M.UpdateFilter<M.Document>

export type HotelInsert = {
  audit?: null | AuditableInsert
  embeddedUser3?: null | EmbeddedUser3Insert
  embeddedUser4?: null | EmbeddedUser4Insert
  embeddedUsers?: null | EmbeddedUserInsert[]
  embeddedUsers3?: null | EmbeddedUser3Insert[]
  embeddedUsers4?: null | EmbeddedUser4Insert[]
  name: types.Scalars['String']
  userId?: null | types.Scalars['ID']
  users?: null | UserCollectionInsert
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
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'hotel',
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

export type MockedEntityExcludedFields = never
export type MockedEntityRelationFields = 'user'

export function mockedEntitySchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'MongoID',
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
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type MockedEntityFilterFields = {
  id?: types.Scalars['MongoID'] | null | T.EqualityOperators<types.Scalars['MongoID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type MockedEntityFilter = MockedEntityFilterFields & T.LogicalOperators<MockedEntityFilterFields | MockedEntityRawFilter>
export type MockedEntityRawFilter = never

export type MockedEntityRelations = Record<never, string>

export type MockedEntityProjection = {
  id?: boolean
  name?: boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type MockedEntityParam<P extends MockedEntityProjection> = T.ParamProjection<types.MockedEntity, MockedEntityProjection, P>

export type MockedEntitySortKeys = 'id' | 'name' | 'userId'
export type MockedEntitySort = Partial<Record<MockedEntitySortKeys, T.SortDirection>>
export type MockedEntityRawSort = never

export type MockedEntityUpdate = {
  id?: types.Scalars['MongoID'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
}
export type MockedEntityRawUpdate = never

export type MockedEntityInsert = {
  name: types.Scalars['String']
  userId: types.Scalars['ID']
}

type MockedEntityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  types.MockedEntity,
  'id',
  'MongoID',
  MockedEntityFilter,
  MockedEntityRawFilter,
  MockedEntityRelations,
  MockedEntityProjection,
  MockedEntitySort,
  MockedEntityRawSort,
  MockedEntityInsert,
  MockedEntityUpdate,
  MockedEntityRawUpdate,
  MockedEntityExcludedFields,
  MockedEntityRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'mockedEntity',
  EntityManager<MetadataType, OperationMetadataType>
>
export type MockedEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryMockedEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class MockedEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends MockedEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends MockedEntityProjection, P2 extends MockedEntityProjection>(p1: P1, p2: P2): T.SelectProjection<MockedEntityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<MockedEntityProjection, P1, P2>
  }

  public constructor(params: MockedEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: mockedEntitySchema(),
    })
  }
}

export class InMemoryMockedEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends MockedEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends MockedEntityProjection, P2 extends MockedEntityProjection>(p1: P1, p2: P2): T.SelectProjection<MockedEntityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<MockedEntityProjection, P1, P2>
  }

  public constructor(params: InMemoryMockedEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: mockedEntitySchema(),
    })
  }
}

export type OrganizationExcludedFields = 'computedName'
export type OrganizationRelationFields = never

export function organizationSchema(): T.Schema<types.Scalars> {
  return {
    address: {
      type: 'embedded',
      schema: () => addressSchema(),
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
    vatNumber: {
      type: 'scalar',
      scalar: 'String',
    },
  }
}

type OrganizationFilterFields = {
  'address.id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  vatNumber?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type OrganizationFilter = OrganizationFilterFields & T.LogicalOperators<OrganizationFilterFields | OrganizationRawFilter>
export type OrganizationRawFilter = () => M.Filter<M.Document>

export type OrganizationRelations = Record<never, string>

export type OrganizationProjection = {
  address?:
    | {
        cities?: CityProjection | boolean
        id?: boolean
      }
    | boolean
  computedName?: boolean
  id?: boolean
  name?: boolean
  vatNumber?: boolean
}
export type OrganizationParam<P extends OrganizationProjection> = T.ParamProjection<types.Organization, OrganizationProjection, P>

export type OrganizationSortKeys = 'address.id' | 'id' | 'name' | 'vatNumber'
export type OrganizationSort = Partial<Record<OrganizationSortKeys, T.SortDirection>>
export type OrganizationRawSort = () => M.Sort

export type OrganizationUpdate = {
  address?: AddressInsert | null
  'address.id'?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  vatNumber?: types.Scalars['String'] | null
}
export type OrganizationRawUpdate = () => M.UpdateFilter<M.Document>

export type OrganizationInsert = {
  address?: null | AddressInsert
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  vatNumber?: null | types.Scalars['String']
}

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Organization,
  'id',
  'ID',
  OrganizationFilter,
  OrganizationRawFilter,
  OrganizationRelations,
  OrganizationProjection,
  OrganizationSort,
  OrganizationRawSort,
  OrganizationInsert,
  OrganizationUpdate,
  OrganizationRawUpdate,
  OrganizationExcludedFields,
  OrganizationRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'organization',
  EntityManager<MetadataType, OperationMetadataType>
>
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryOrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends OrganizationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends OrganizationProjection, P2 extends OrganizationProjection>(p1: P1, p2: P2): T.SelectProjection<OrganizationProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<OrganizationProjection, P1, P2>
  }

  public constructor(params: OrganizationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: organizationSchema(),
    })
  }
}

export class InMemoryOrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends OrganizationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends OrganizationProjection, P2 extends OrganizationProjection>(p1: P1, p2: P2): T.SelectProjection<OrganizationProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<OrganizationProjection, P1, P2>
  }

  public constructor(params: InMemoryOrganizationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: organizationSchema(),
    })
  }
}

export type PostExcludedFields = never
export type PostRelationFields = 'author'

export function postSchema(): T.Schema<types.Scalars> {
  return {
    author: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'authorId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    authorId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      alias: 'aId',
    },
    body: {
      type: 'scalar',
      scalar: 'String',
    },
    clicks: {
      type: 'scalar',
      scalar: 'Int',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    metadata: {
      type: 'embedded',
      schema: () => postMetadataSchema(),
    },
    title: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    views: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
    },
  }
}

type PostFilterFields = {
  authorId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  body?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  clicks?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'metadata.region'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'metadata.visible'?: types.Scalars['Boolean'] | null | T.EqualityOperators<types.Scalars['Boolean']> | T.ElementOperators
  title?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  views?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
}
export type PostFilter = PostFilterFields & T.LogicalOperators<PostFilterFields | PostRawFilter>
export type PostRawFilter = () => M.Filter<M.Document>

export type PostRelations = Record<never, string>

export type PostProjection = {
  author?: UserProjection | boolean
  authorId?: boolean
  body?: boolean
  clicks?: boolean
  id?: boolean
  metadata?:
    | {
        region?: boolean
        visible?: boolean
      }
    | boolean
  title?: boolean
  views?: boolean
}
export type PostParam<P extends PostProjection> = T.ParamProjection<types.Post, PostProjection, P>

export type PostSortKeys = 'authorId' | 'body' | 'clicks' | 'id' | 'metadata.region' | 'metadata.visible' | 'title' | 'views'
export type PostSort = Partial<Record<PostSortKeys, T.SortDirection>>
export type PostRawSort = () => M.Sort

export type PostUpdate = {
  authorId?: types.Scalars['ID'] | null
  body?: types.Scalars['String'] | null
  clicks?: types.Scalars['Int'] | null
  id?: types.Scalars['ID'] | null
  metadata?: PostMetadataInsert | null
  'metadata.region'?: types.Scalars['String'] | null
  'metadata.visible'?: types.Scalars['Boolean'] | null
  title?: types.Scalars['String'] | null
  views?: types.Scalars['Int'] | null
}
export type PostRawUpdate = () => M.UpdateFilter<M.Document>

export type PostInsert = {
  authorId: types.Scalars['ID']
  body?: null | types.Scalars['String']
  clicks?: null | types.Scalars['Int']
  id?: null | types.Scalars['ID']
  metadata?: null | PostMetadataInsert
  title: types.Scalars['String']
  views: types.Scalars['Int']
}

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Post,
  'id',
  'ID',
  PostFilter,
  PostRawFilter,
  PostRelations,
  PostProjection,
  PostSort,
  PostRawSort,
  PostInsert,
  PostUpdate,
  PostRawUpdate,
  PostExcludedFields,
  PostRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'post',
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostProjection, P2 extends PostProjection>(p1: P1, p2: P2): T.SelectProjection<PostProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostProjection, P1, P2>
  }

  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export class InMemoryPostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostProjection, P2 extends PostProjection>(p1: P1, p2: P2): T.SelectProjection<PostProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostProjection, P1, P2>
  }

  public constructor(params: InMemoryPostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export function postMetadataSchema(): T.Schema<types.Scalars> {
  return {
    region: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    visible: {
      type: 'scalar',
      scalar: 'Boolean',
      required: true,
    },
  }
}

export type PostMetadataProjection = {
  region?: boolean
  visible?: boolean
}
export type PostMetadataParam<P extends PostMetadataProjection> = T.ParamProjection<types.PostMetadata, PostMetadataProjection, P>

export type PostMetadataInsert = {
  region: types.Scalars['String']
  visible: types.Scalars['Boolean']
}

export type UserExcludedFields = never
export type UserRelationFields = 'dogs' | 'friends'

export function userSchema(): T.Schema<types.Scalars> {
  return {
    amount: {
      type: 'scalar',
      scalar: 'Decimal',
    },
    amounts: {
      type: 'scalar',
      scalar: 'Decimal',
      isListElementRequired: true,
      isList: true,
      alias: 'amounts',
    },
    credentials: {
      type: 'embedded',
      schema: () => usernamePasswordCredentialsSchema(),
      isList: true,
    },
    dogs: {
      type: 'relation',
      relation: 'foreign',
      schema: () => dogSchema(),
      refFrom: 'ownerId',
      refTo: 'id',
      dao: 'dog',
      isListElementRequired: true,
      isList: true,
      metadata: Object.fromEntries([['test', 'value']]),
    },
    embeddedPost: {
      type: 'embedded',
      schema: () => postSchema(),
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
      alias: 'name',
    },
    friends: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'friendsId',
      refTo: 'id',
      dao: 'user',
      isListElementRequired: true,
      isList: true,
    },
    friendsId: {
      type: 'scalar',
      scalar: 'ID',
      isListElementRequired: true,
      isList: true,
      alias: 'fIds',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      alias: 'ID',
    },
    int: {
      type: 'scalar',
      scalar: 'Int',
    },
    lastName: {
      type: 'scalar',
      scalar: 'String',
    },
    live: {
      type: 'scalar',
      scalar: 'Boolean',
      required: true,
    },
    localization: {
      type: 'scalar',
      scalar: 'Coordinates',
    },
    title: {
      type: 'scalar',
      scalar: 'LocalizedString',
    },
    usernamePasswordCredentials: {
      type: 'embedded',
      schema: () => usernamePasswordCredentialsSchema(),
      alias: 'cred',
    },
  }
}

type UserFilterFields = {
  amount?: types.Scalars['Decimal'] | null | T.EqualityOperators<types.Scalars['Decimal']> | T.ElementOperators
  amounts?: types.Scalars['Decimal'][] | null | T.EqualityOperators<types.Scalars['Decimal'][]> | T.ElementOperators
  'credentials.password'?: types.Scalars['Password'] | null | T.EqualityOperators<types.Scalars['Password']> | T.ElementOperators
  'credentials.username'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'embeddedPost.authorId'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'embeddedPost.body'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'embeddedPost.clicks'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'embeddedPost.id'?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'embeddedPost.metadata.region'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'embeddedPost.metadata.visible'?: types.Scalars['Boolean'] | null | T.EqualityOperators<types.Scalars['Boolean']> | T.ElementOperators
  'embeddedPost.title'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'embeddedPost.views'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  firstName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  friendsId?: types.Scalars['ID'][] | null | T.EqualityOperators<types.Scalars['ID'][]> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  int?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  lastName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  live?: types.Scalars['Boolean'] | null | T.EqualityOperators<types.Scalars['Boolean']> | T.ElementOperators
  localization?: types.Scalars['Coordinates'] | null | T.EqualityOperators<types.Scalars['Coordinates']> | T.ElementOperators
  title?: types.Scalars['LocalizedString'] | null | T.EqualityOperators<types.Scalars['LocalizedString']> | T.ElementOperators
  'usernamePasswordCredentials.password'?: types.Scalars['Password'] | null | T.EqualityOperators<types.Scalars['Password']> | T.ElementOperators
  'usernamePasswordCredentials.username'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = () => M.Filter<M.Document>

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
  amount?: boolean
  amounts?: boolean
  credentials?:
    | {
        password?: boolean
        user?: UserProjection | boolean
        username?: boolean
      }
    | boolean
  dogs?: DogProjection | boolean
  embeddedPost?:
    | {
        author?: UserProjection | boolean
        authorId?: boolean
        body?: boolean
        clicks?: boolean
        id?: boolean
        metadata?:
          | {
              region?: boolean
              visible?: boolean
            }
          | boolean
        title?: boolean
        views?: boolean
      }
    | boolean
  firstName?: boolean
  friends?: UserProjection | boolean
  friendsId?: boolean
  id?: boolean
  int?: boolean
  lastName?: boolean
  live?: boolean
  localization?: boolean
  title?: boolean
  usernamePasswordCredentials?:
    | {
        password?: boolean
        user?: UserProjection | boolean
        username?: boolean
      }
    | boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys =
  | 'amount'
  | 'amounts'
  | 'credentials.password'
  | 'credentials.username'
  | 'embeddedPost.authorId'
  | 'embeddedPost.body'
  | 'embeddedPost.clicks'
  | 'embeddedPost.id'
  | 'embeddedPost.metadata.region'
  | 'embeddedPost.metadata.visible'
  | 'embeddedPost.title'
  | 'embeddedPost.views'
  | 'firstName'
  | 'friendsId'
  | 'id'
  | 'int'
  | 'lastName'
  | 'live'
  | 'localization'
  | 'title'
  | 'usernamePasswordCredentials.password'
  | 'usernamePasswordCredentials.username'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = () => M.Sort

export type UserUpdate = {
  amount?: types.Scalars['Decimal'] | null
  amounts?: types.Scalars['Decimal'][] | null
  credentials?: (null | UsernamePasswordCredentialsInsert)[] | null
  embeddedPost?: PostInsert | null
  'embeddedPost.authorId'?: types.Scalars['ID'] | null
  'embeddedPost.body'?: types.Scalars['String'] | null
  'embeddedPost.clicks'?: types.Scalars['Int'] | null
  'embeddedPost.id'?: types.Scalars['ID'] | null
  'embeddedPost.metadata'?: PostMetadataInsert | null
  'embeddedPost.metadata.region'?: types.Scalars['String'] | null
  'embeddedPost.metadata.visible'?: types.Scalars['Boolean'] | null
  'embeddedPost.title'?: types.Scalars['String'] | null
  'embeddedPost.views'?: types.Scalars['Int'] | null
  firstName?: types.Scalars['String'] | null
  friendsId?: types.Scalars['ID'][] | null
  id?: types.Scalars['ID'] | null
  int?: types.Scalars['Int'] | null
  lastName?: types.Scalars['String'] | null
  live?: types.Scalars['Boolean'] | null
  localization?: types.Scalars['Coordinates'] | null
  title?: types.Scalars['LocalizedString'] | null
  usernamePasswordCredentials?: UsernamePasswordCredentialsInsert | null
  'usernamePasswordCredentials.password'?: types.Scalars['Password'] | null
  'usernamePasswordCredentials.username'?: types.Scalars['String'] | null
}
export type UserRawUpdate = () => M.UpdateFilter<M.Document>

export type UserInsert = {
  amount?: null | types.Scalars['Decimal']
  amounts?: null | types.Scalars['Decimal'][]
  credentials?: null | (null | UsernamePasswordCredentialsInsert)[]
  embeddedPost?: null | PostInsert
  firstName?: null | types.Scalars['String']
  friendsId?: null | types.Scalars['ID'][]
  id?: null | types.Scalars['ID']
  int?: null | types.Scalars['Int']
  lastName?: null | types.Scalars['String']
  live: types.Scalars['Boolean']
  localization?: null | types.Scalars['Coordinates']
  title?: null | types.Scalars['LocalizedString']
  usernamePasswordCredentials?: null | UsernamePasswordCredentialsInsert
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

export function userCollectionSchema(): T.Schema<types.Scalars> {
  return {
    users: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'usersId',
      refTo: 'id',
      dao: 'user',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    usersId: {
      type: 'scalar',
      scalar: 'ID',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
  }
}

export type UserCollectionProjection = {
  users?: UserProjection | boolean
  usersId?: boolean
}
export type UserCollectionParam<P extends UserCollectionProjection> = T.ParamProjection<types.UserCollection, UserCollectionProjection, P>

export type UserCollectionInsert = {
  usersId: types.Scalars['ID'][]
}

export function usernamePasswordCredentialsSchema(): T.Schema<types.Scalars> {
  return {
    password: {
      type: 'scalar',
      scalar: 'Password',
      required: true,
      alias: 'pwd',
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: '../id',
      refTo: 'id',
      dao: 'user',
    },
    username: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      alias: 'user',
    },
  }
}

export type UsernamePasswordCredentialsProjection = {
  password?: boolean
  user?: UserProjection | boolean
  username?: boolean
}
export type UsernamePasswordCredentialsParam<P extends UsernamePasswordCredentialsProjection> = T.ParamProjection<types.UsernamePasswordCredentials, UsernamePasswordCredentialsProjection, P>

export type UsernamePasswordCredentialsInsert = {
  password: types.Scalars['Password']
  username: types.Scalars['String']
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    audit?: Pick<Partial<AuditDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    mockedEntity?: Pick<Partial<MockedEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>
  log?: T.LogInput<'address' | 'audit' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'user'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, types.Scalars, MetadataType> {
  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined
  private _audit: AuditDAO<MetadataType, OperationMetadataType> | undefined
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined
  private _defaultFieldsEntity: DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> | undefined
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined
  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined
  private _mockedEntity: MockedEntityDAO<MetadataType, OperationMetadataType> | undefined
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'address' | 'audit' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'user'>

  get address(): AddressDAO<MetadataType, OperationMetadataType> {
    if (!this._address) {
      const db = this.mongodb.default
      this._address =
        db === 'mock'
          ? (new InMemoryAddressDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.address,
              middlewares: [
                ...(this.overrides?.address?.middlewares || []),
                ...(selectMiddleware('address', this.middlewares) as T.DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'address',
              logger: this.logger,
            }) as unknown as AddressDAO<MetadataType, OperationMetadataType>)
          : new AddressDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.address,
              collection: db.collection('addresses'),
              middlewares: [
                ...(this.overrides?.address?.middlewares || []),
                ...(selectMiddleware('address', this.middlewares) as T.DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'address',
              logger: this.logger,
            })
    }
    return this._address
  }
  get audit(): AuditDAO<MetadataType, OperationMetadataType> {
    if (!this._audit) {
      const db = this.mongodb.default
      this._audit =
        db === 'mock'
          ? (new InMemoryAuditDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.audit,
              middlewares: [
                ...(this.overrides?.audit?.middlewares || []),
                ...(selectMiddleware('audit', this.middlewares) as T.DAOMiddleware<AuditDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'audit',
              logger: this.logger,
            }) as unknown as AuditDAO<MetadataType, OperationMetadataType>)
          : new AuditDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.audit,
              collection: db.collection('audits'),
              middlewares: [
                ...(this.overrides?.audit?.middlewares || []),
                ...(selectMiddleware('audit', this.middlewares) as T.DAOMiddleware<AuditDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'audit',
              logger: this.logger,
            })
    }
    return this._audit
  }
  get city(): CityDAO<MetadataType, OperationMetadataType> {
    if (!this._city) {
      const db = this.mongodb.default
      this._city =
        db === 'mock'
          ? (new InMemoryCityDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.city,
              middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'city',
              logger: this.logger,
            }) as unknown as CityDAO<MetadataType, OperationMetadataType>)
          : new CityDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.city,
              collection: db.collection('citys'),
              middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'city',
              logger: this.logger,
            })
    }
    return this._city
  }
  get defaultFieldsEntity(): DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> {
    if (!this._defaultFieldsEntity) {
      const db = this.mongodb.default
      this._defaultFieldsEntity =
        db === 'mock'
          ? (new InMemoryDefaultFieldsEntityDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.defaultFieldsEntity,
              middlewares: [
                ...(this.overrides?.defaultFieldsEntity?.middlewares || []),
                ...(selectMiddleware('defaultFieldsEntity', this.middlewares) as T.DAOMiddleware<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'defaultFieldsEntity',
              logger: this.logger,
            }) as unknown as DefaultFieldsEntityDAO<MetadataType, OperationMetadataType>)
          : new DefaultFieldsEntityDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.defaultFieldsEntity,
              collection: db.collection('defaultFieldsEntitys'),
              middlewares: [
                ...(this.overrides?.defaultFieldsEntity?.middlewares || []),
                ...(selectMiddleware('defaultFieldsEntity', this.middlewares) as T.DAOMiddleware<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'defaultFieldsEntity',
              logger: this.logger,
            })
    }
    return this._defaultFieldsEntity
  }
  get device(): DeviceDAO<MetadataType, OperationMetadataType> {
    if (!this._device) {
      const db = this.mongodb.default
      this._device =
        db === 'mock'
          ? (new InMemoryDeviceDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.device,
              middlewares: [
                ...(this.overrides?.device?.middlewares || []),
                ...(selectMiddleware('device', this.middlewares) as T.DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'device',
              logger: this.logger,
            }) as unknown as DeviceDAO<MetadataType, OperationMetadataType>)
          : new DeviceDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.device,
              collection: db.collection('devices'),
              middlewares: [
                ...(this.overrides?.device?.middlewares || []),
                ...(selectMiddleware('device', this.middlewares) as T.DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'device',
              logger: this.logger,
            })
    }
    return this._device
  }
  get dog(): DogDAO<MetadataType, OperationMetadataType> {
    if (!this._dog) {
      const db = this.mongodb.default
      this._dog =
        db === 'mock'
          ? (new InMemoryDogDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.dog,
              middlewares: [...(this.overrides?.dog?.middlewares || []), ...(selectMiddleware('dog', this.middlewares) as T.DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'dog',
              logger: this.logger,
            }) as unknown as DogDAO<MetadataType, OperationMetadataType>)
          : new DogDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.dog,
              collection: db.collection('dogs'),
              middlewares: [...(this.overrides?.dog?.middlewares || []), ...(selectMiddleware('dog', this.middlewares) as T.DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'dog',
              logger: this.logger,
            })
    }
    return this._dog
  }
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
  get mockedEntity(): MockedEntityDAO<MetadataType, OperationMetadataType> {
    if (!this._mockedEntity) {
      this._mockedEntity = new MockedEntityDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.mockedEntity,
        middlewares: [
          ...(this.overrides?.mockedEntity?.middlewares || []),
          ...(selectMiddleware('mockedEntity', this.middlewares) as T.DAOMiddleware<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>>[]),
        ],
        name: 'mockedEntity',
        logger: this.logger,
      })
    }
    return this._mockedEntity
  }
  get organization(): OrganizationDAO<MetadataType, OperationMetadataType> {
    if (!this._organization) {
      const db = this.mongodb.default
      this._organization =
        db === 'mock'
          ? (new InMemoryOrganizationDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.organization,
              middlewares: [
                ...(this.overrides?.organization?.middlewares || []),
                ...(selectMiddleware('organization', this.middlewares) as T.DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'organization',
              logger: this.logger,
            }) as unknown as OrganizationDAO<MetadataType, OperationMetadataType>)
          : new OrganizationDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.organization,
              collection: db.collection('organizations'),
              middlewares: [
                ...(this.overrides?.organization?.middlewares || []),
                ...(selectMiddleware('organization', this.middlewares) as T.DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'organization',
              logger: this.logger,
            })
    }
    return this._organization
  }
  get post(): PostDAO<MetadataType, OperationMetadataType> {
    if (!this._post) {
      const db = this.mongodb.default
      this._post =
        db === 'mock'
          ? (new InMemoryPostDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.post,
              middlewares: [...(this.overrides?.post?.middlewares || []), ...(selectMiddleware('post', this.middlewares) as T.DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'post',
              logger: this.logger,
            }) as unknown as PostDAO<MetadataType, OperationMetadataType>)
          : new PostDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.post,
              collection: db.collection('posts'),
              middlewares: [...(this.overrides?.post?.middlewares || []), ...(selectMiddleware('post', this.middlewares) as T.DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'post',
              logger: this.logger,
            })
    }
    return this._post
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

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'MongoID', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float'])
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
        address: M.Collection<M.Document> | null
        audit: M.Collection<M.Document> | null
        city: M.Collection<M.Document> | null
        defaultFieldsEntity: M.Collection<M.Document> | null
        device: M.Collection<M.Document> | null
        dog: M.Collection<M.Document> | null
        hotel: M.Collection<M.Document> | null
        organization: M.Collection<M.Document> | null
        post: M.Collection<M.Document> | null
        user: M.Collection<M.Document> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { mongodb: this.mongodb },
      {
        address: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('addresses'),
        audit: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('audits'),
        city: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('citys'),
        defaultFieldsEntity: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('defaultFieldsEntitys'),
        device: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('devices'),
        dog: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('dogs'),
        hotel: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('hotels'),
        organization: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('organizations'),
        post: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('posts'),
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
  address: AddressDAOGenerics<MetadataType, OperationMetadataType>
  audit: AuditDAOGenerics<MetadataType, OperationMetadataType>
  city: CityDAOGenerics<MetadataType, OperationMetadataType>
  defaultFieldsEntity: DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>
  device: DeviceDAOGenerics<MetadataType, OperationMetadataType>
  dog: DogDAOGenerics<MetadataType, OperationMetadataType>
  hotel: HotelDAOGenerics<MetadataType, OperationMetadataType>
  mockedEntity: MockedEntityDAOGenerics<MetadataType, OperationMetadataType>
  organization: OrganizationDAOGenerics<MetadataType, OperationMetadataType>
  post: PostDAOGenerics<MetadataType, OperationMetadataType>
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
