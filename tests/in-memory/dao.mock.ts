import * as T from '../../src'
import * as types from './models.mock'

export type AST = {
  Address: {
    cities: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'City'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
  }
  Audit: {
    changes: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    entityId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
  }
  Auditable: {
    createdBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    createdOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    deletedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    modifiedBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    modifiedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    state: { type: 'scalar'; isList: false; astName: 'State'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    versions: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Audit'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  City: {
    addressId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    computedAddressName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
    computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  DefaultFieldsEntity: {
    creationDate: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
    live: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    opt1: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    opt2: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
  }
  Device: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Dog: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    owner: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    ownerId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Hotel: {
    audit: { type: 'embedded'; isList: false; astName: 'Auditable'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  MockedEntity: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Organization: {
    address: { type: 'embedded'; isList: false; astName: 'Address'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    vatNumber: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Post: {
    author: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    authorId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    body: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    clicks: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    metadata: { type: 'embedded'; isList: false; astName: 'PostMetadata'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    title: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  PostMetadata: {
    region: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    visible: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  PostType: {
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
    name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  User: {
    amount: { type: 'scalar'; isList: false; astName: 'Decimal'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    amounts: { type: 'scalar'; isList: true; astName: 'Decimal'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    credentials: {
      type: 'embedded'
      isList: true
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    dogs: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Dog'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    embeddedPost: { type: 'embedded'; isList: false; astName: 'Post'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    friends: { type: 'relation'; relation: 'inner'; isList: true; astName: 'User'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    friendsId: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    lastName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    live: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    localization: { type: 'scalar'; isList: false; astName: 'Coordinates'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    title: { type: 'scalar'; isList: false; astName: 'LocalizedString'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    usernamePasswordCredentials: {
      type: 'embedded'
      isList: false
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
  }
  UsernamePasswordCredentials: {
    password: { type: 'scalar'; isList: false; astName: 'Password'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
}

export type AddressExcludedFields = never

export type AddressEmbeddedFields = never
export type AddressRelationFields = 'cities'
export type AddressRetrieveAll = Omit<types.Address, AddressRelationFields | AddressEmbeddedFields> & {}

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
export type AddressRawFilter = never

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
export type AddressRawSort = never

export type AddressUpdate = {
  id?: types.Scalars['ID'] | null
}
export type AddressRawUpdate = never

export type AddressInsert = {
  id?: null | types.Scalars['ID']
}

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  AddressEmbeddedFields,
  AddressRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'address',
  EntityManager<MetadataType, OperationMetadataType>
>
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryAddressDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type AuditEmbeddedFields = never
export type AuditRelationFields = never
export type AuditRetrieveAll = Omit<types.Audit, AuditRelationFields | AuditEmbeddedFields> & {}

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
export type AuditRawFilter = never

export type AuditRelations = Record<never, string>

export type AuditProjection = {
  changes?: boolean
  entityId?: boolean
  id?: boolean
}
export type AuditParam<P extends AuditProjection> = T.ParamProjection<types.Audit, AuditProjection, P>

export type AuditSortKeys = 'changes' | 'entityId' | 'id'
export type AuditSort = Partial<Record<AuditSortKeys, T.SortDirection>>
export type AuditRawSort = never

export type AuditUpdate = {
  changes?: types.Scalars['String'] | null
  entityId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
}
export type AuditRawUpdate = never

export type AuditInsert = {
  changes?: null | types.Scalars['String']
  entityId: types.Scalars['ID']
}

type AuditDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  AuditEmbeddedFields,
  AuditRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'audit',
  EntityManager<MetadataType, OperationMetadataType>
>
export type AuditDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuditDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryAuditDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuditDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AuditDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type AuditableEmbeddedFields = never
export type AuditableRelationFields = 'versions'
export type AuditableRetrieveAll = Omit<types.Auditable, AuditableRelationFields | AuditableEmbeddedFields> & {}

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

export type CityEmbeddedFields = never
export type CityRelationFields = never
export type CityRetrieveAll = Omit<types.City, CityRelationFields | CityEmbeddedFields> & {}

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
export type CityRawFilter = never

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
export type CityRawSort = never

export type CityUpdate = {
  addressId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
}
export type CityRawUpdate = never

export type CityInsert = {
  addressId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
}

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  CityEmbeddedFields,
  CityRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'city',
  EntityManager<MetadataType, OperationMetadataType>
>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryCityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type DefaultFieldsEntityEmbeddedFields = never
export type DefaultFieldsEntityRelationFields = never
export type DefaultFieldsEntityRetrieveAll = Omit<types.DefaultFieldsEntity, DefaultFieldsEntityRelationFields | DefaultFieldsEntityEmbeddedFields> & {}

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
export type DefaultFieldsEntityRawFilter = never

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
export type DefaultFieldsEntityRawSort = never

export type DefaultFieldsEntityUpdate = {
  creationDate?: types.Scalars['Int'] | null
  id?: types.Scalars['ID'] | null
  live?: types.Scalars['Live'] | null
  name?: types.Scalars['String'] | null
  opt1?: types.Scalars['Live'] | null
  opt2?: types.Scalars['Live'] | null
}
export type DefaultFieldsEntityRawUpdate = never

export type DefaultFieldsEntityInsert = {
  creationDate?: null | types.Scalars['Int']
  id: types.Scalars['ID']
  live?: null | types.Scalars['Live']
  name: types.Scalars['String']
  opt1?: null | types.Scalars['Live']
  opt2?: null | types.Scalars['Live']
}

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  DefaultFieldsEntityEmbeddedFields,
  DefaultFieldsEntityRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'defaultFieldsEntity',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryDefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type DeviceEmbeddedFields = never
export type DeviceRelationFields = 'user'
export type DeviceRetrieveAll = Omit<types.Device, DeviceRelationFields | DeviceEmbeddedFields> & {}

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
export type DeviceRawFilter = never

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
export type DeviceRawSort = never

export type DeviceUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
}
export type DeviceRawUpdate = never

export type DeviceInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  userId?: null | types.Scalars['ID']
}

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  DeviceEmbeddedFields,
  DeviceRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'device',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDeviceDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type DogEmbeddedFields = never
export type DogRelationFields = 'owner'
export type DogRetrieveAll = Omit<types.Dog, DogRelationFields | DogEmbeddedFields> & {}

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
export type DogRawFilter = never

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
export type DogRawSort = never

export type DogUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  ownerId?: types.Scalars['ID'] | null
}
export type DogRawUpdate = never

export type DogInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  ownerId: types.Scalars['ID']
}

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  DogEmbeddedFields,
  DogRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'dog',
  EntityManager<MetadataType, OperationMetadataType>
>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDogDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type HotelExcludedFields = never

export type HotelEmbeddedFields = 'audit'
export type HotelRelationFields = never
export type HotelRetrieveAll = Omit<types.Hotel, HotelRelationFields | HotelEmbeddedFields> & {
  audit: AuditableRetrieveAll
}

export function hotelSchema(): T.Schema<types.Scalars> {
  return {
    audit: {
      type: 'embedded',
      schema: () => auditableSchema(),
      required: true,
      generationStrategy: 'middleware',
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
  }
}

type HotelFilterFields = {
  'audit.createdBy'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'audit.createdOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.deletedOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.modifiedBy'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'audit.modifiedOn'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  'audit.state'?: types.State | null | T.EqualityOperators<types.State> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type HotelFilter = HotelFilterFields & T.LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = never

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  audit?: AuditableProjection | boolean
  id?: boolean
  name?: boolean
}
export type HotelParam<P extends HotelProjection> = T.ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys = 'audit.createdBy' | 'audit.createdOn' | 'audit.deletedOn' | 'audit.modifiedBy' | 'audit.modifiedOn' | 'audit.state' | 'id' | 'name'
export type HotelSort = Partial<Record<HotelSortKeys, T.SortDirection>>
export type HotelRawSort = never

export type HotelUpdate = {
  audit?: AuditableInsert | null
  'audit.createdBy'?: types.Scalars['String'] | null
  'audit.createdOn'?: types.Scalars['Int'] | null
  'audit.deletedOn'?: types.Scalars['Int'] | null
  'audit.modifiedBy'?: types.Scalars['String'] | null
  'audit.modifiedOn'?: types.Scalars['Int'] | null
  'audit.state'?: types.State | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
}
export type HotelRawUpdate = never

export type HotelInsert = {
  audit?: null | AuditableInsert
  name: types.Scalars['String']
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryHotelDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class HotelDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type MockedEntityEmbeddedFields = never
export type MockedEntityRelationFields = 'user'
export type MockedEntityRetrieveAll = Omit<types.MockedEntity, MockedEntityRelationFields | MockedEntityEmbeddedFields> & {}

export function mockedEntitySchema(): T.Schema<types.Scalars> {
  return {
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
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
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
  id?: types.Scalars['ID'] | null
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
  'ID',
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
  MockedEntityEmbeddedFields,
  MockedEntityRetrieveAll,
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

export type OrganizationEmbeddedFields = 'address'
export type OrganizationRelationFields = never
export type OrganizationRetrieveAll = Omit<types.Organization, OrganizationRelationFields | OrganizationEmbeddedFields> & {
  address?: types.Maybe<AddressRetrieveAll>
}

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
export type OrganizationRawFilter = never

export type OrganizationRelations = Record<never, string>

export type OrganizationProjection = {
  address?: AddressProjection | boolean
  computedName?: boolean
  id?: boolean
  name?: boolean
  vatNumber?: boolean
}
export type OrganizationParam<P extends OrganizationProjection> = T.ParamProjection<types.Organization, OrganizationProjection, P>

export type OrganizationSortKeys = 'address.id' | 'id' | 'name' | 'vatNumber'
export type OrganizationSort = Partial<Record<OrganizationSortKeys, T.SortDirection>>
export type OrganizationRawSort = never

export type OrganizationUpdate = {
  address?: AddressInsert | null
  'address.id'?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  vatNumber?: types.Scalars['String'] | null
}
export type OrganizationRawUpdate = never

export type OrganizationInsert = {
  address?: null | AddressInsert
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  vatNumber?: null | types.Scalars['String']
}

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  OrganizationEmbeddedFields,
  OrganizationRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'organization',
  EntityManager<MetadataType, OperationMetadataType>
>
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryOrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type PostEmbeddedFields = 'metadata'
export type PostRelationFields = 'author'
export type PostRetrieveAll = Omit<types.Post, PostRelationFields | PostEmbeddedFields> & {
  metadata?: types.Maybe<PostMetadataRetrieveAll>
}

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
export type PostRawFilter = never

export type PostRelations = Record<never, string>

export type PostProjection = {
  author?: UserProjection | boolean
  authorId?: boolean
  body?: boolean
  clicks?: boolean
  id?: boolean
  metadata?: PostMetadataProjection | boolean
  title?: boolean
  views?: boolean
}
export type PostParam<P extends PostProjection> = T.ParamProjection<types.Post, PostProjection, P>

export type PostSortKeys = 'authorId' | 'body' | 'clicks' | 'id' | 'metadata.region' | 'metadata.visible' | 'title' | 'views'
export type PostSort = Partial<Record<PostSortKeys, T.SortDirection>>
export type PostRawSort = never

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
export type PostRawUpdate = never

export type PostInsert = {
  authorId: types.Scalars['ID']
  body?: null | types.Scalars['String']
  clicks?: null | types.Scalars['Int']
  id?: null | types.Scalars['ID']
  metadata?: null | PostMetadataInsert
  title: types.Scalars['String']
  views: types.Scalars['Int']
}

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
  PostEmbeddedFields,
  PostRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'post',
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type PostMetadataEmbeddedFields = never
export type PostMetadataRelationFields = never
export type PostMetadataRetrieveAll = Omit<types.PostMetadata, PostMetadataRelationFields | PostMetadataEmbeddedFields> & {}

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

export type PostTypeExcludedFields = never

export type PostTypeEmbeddedFields = never
export type PostTypeRelationFields = never
export type PostTypeRetrieveAll = Omit<types.PostType, PostTypeRelationFields | PostTypeEmbeddedFields> & {}

export function postTypeSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
  }
}

type PostTypeFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type PostTypeFilter = PostTypeFilterFields & T.LogicalOperators<PostTypeFilterFields | PostTypeRawFilter>
export type PostTypeRawFilter = never

export type PostTypeRelations = Record<never, string>

export type PostTypeProjection = {
  id?: boolean
  name?: boolean
}
export type PostTypeParam<P extends PostTypeProjection> = T.ParamProjection<types.PostType, PostTypeProjection, P>

export type PostTypeSortKeys = 'id' | 'name'
export type PostTypeSort = Partial<Record<PostTypeSortKeys, T.SortDirection>>
export type PostTypeRawSort = never

export type PostTypeUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
}
export type PostTypeRawUpdate = never

export type PostTypeInsert = {
  id: types.Scalars['ID']
  name: types.Scalars['String']
}

type PostTypeDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  types.PostType,
  'id',
  'ID',
  PostTypeFilter,
  PostTypeRawFilter,
  PostTypeRelations,
  PostTypeProjection,
  PostTypeSort,
  PostTypeRawSort,
  PostTypeInsert,
  PostTypeUpdate,
  PostTypeRawUpdate,
  PostTypeExcludedFields,
  PostTypeRelationFields,
  PostTypeEmbeddedFields,
  PostTypeRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'postType',
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostTypeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostTypeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryPostTypeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostTypeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class PostTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostTypeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostTypeProjection, P2 extends PostTypeProjection>(p1: P1, p2: P2): T.SelectProjection<PostTypeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostTypeProjection, P1, P2>
  }

  public constructor(params: PostTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postTypeSchema(),
    })
  }
}

export class InMemoryPostTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostTypeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostTypeProjection, P2 extends PostTypeProjection>(p1: P1, p2: P2): T.SelectProjection<PostTypeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostTypeProjection, P1, P2>
  }

  public constructor(params: InMemoryPostTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postTypeSchema(),
    })
  }
}

export type UserExcludedFields = never

export type UserEmbeddedFields = 'credentials' | 'embeddedPost' | 'usernamePasswordCredentials'
export type UserRelationFields = 'dogs' | 'friends'
export type UserRetrieveAll = Omit<types.User, UserRelationFields | UserEmbeddedFields> & {
  credentials?: types.Maybe<types.Maybe<UsernamePasswordCredentialsRetrieveAll>[]>
  embeddedPost?: types.Maybe<PostRetrieveAll>
  usernamePasswordCredentials?: types.Maybe<UsernamePasswordCredentialsRetrieveAll>
}

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
  lastName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  live?: types.Scalars['Boolean'] | null | T.EqualityOperators<types.Scalars['Boolean']> | T.ElementOperators
  localization?: types.Scalars['Coordinates'] | null | T.EqualityOperators<types.Scalars['Coordinates']> | T.ElementOperators
  title?: types.Scalars['LocalizedString'] | null | T.EqualityOperators<types.Scalars['LocalizedString']> | T.ElementOperators
  'usernamePasswordCredentials.password'?: types.Scalars['Password'] | null | T.EqualityOperators<types.Scalars['Password']> | T.ElementOperators
  'usernamePasswordCredentials.username'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = never

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
  credentials?: UsernamePasswordCredentialsProjection | boolean
  dogs?: DogProjection | boolean
  embeddedPost?: PostProjection | boolean
  firstName?: boolean
  friends?: UserProjection | boolean
  friendsId?: boolean
  id?: boolean
  lastName?: boolean
  live?: boolean
  localization?: boolean
  title?: boolean
  usernamePasswordCredentials?: UsernamePasswordCredentialsProjection | boolean
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
  | 'lastName'
  | 'live'
  | 'localization'
  | 'title'
  | 'usernamePasswordCredentials.password'
  | 'usernamePasswordCredentials.username'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = never

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
  lastName?: types.Scalars['String'] | null
  live?: types.Scalars['Boolean'] | null
  localization?: types.Scalars['Coordinates'] | null
  title?: types.Scalars['LocalizedString'] | null
  usernamePasswordCredentials?: UsernamePasswordCredentialsInsert | null
  'usernamePasswordCredentials.password'?: types.Scalars['Password'] | null
  'usernamePasswordCredentials.username'?: types.Scalars['String'] | null
}
export type UserRawUpdate = never

export type UserInsert = {
  amount?: null | types.Scalars['Decimal']
  amounts?: null | types.Scalars['Decimal'][]
  credentials?: null | (null | UsernamePasswordCredentialsInsert)[]
  embeddedPost?: null | PostInsert
  firstName?: null | types.Scalars['String']
  friendsId?: null | types.Scalars['ID'][]
  id?: null | types.Scalars['ID']
  lastName?: null | types.Scalars['String']
  live: types.Scalars['Boolean']
  localization?: null | types.Scalars['Coordinates']
  title?: null | types.Scalars['LocalizedString']
  usernamePasswordCredentials?: null | UsernamePasswordCredentialsInsert
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
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
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type UsernamePasswordCredentialsEmbeddedFields = never
export type UsernamePasswordCredentialsRelationFields = never
export type UsernamePasswordCredentialsRetrieveAll = Omit<types.UsernamePasswordCredentials, UsernamePasswordCredentialsRelationFields | UsernamePasswordCredentialsEmbeddedFields> & {}

export function usernamePasswordCredentialsSchema(): T.Schema<types.Scalars> {
  return {
    password: {
      type: 'scalar',
      scalar: 'Password',
      required: true,
      alias: 'pwd',
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
    postType?: Pick<Partial<PostTypeDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  }
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>
  log?: T.LogInput<'address' | 'audit' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'postType' | 'user'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, never, types.Scalars, MetadataType> {
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
  private _postType: PostTypeDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'address' | 'audit' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'postType' | 'user'>

  get address(): AddressDAO<MetadataType, OperationMetadataType> {
    if (!this._address) {
      this._address = new AddressDAO({
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
      })
    }
    return this._address
  }
  get audit(): AuditDAO<MetadataType, OperationMetadataType> {
    if (!this._audit) {
      this._audit = new AuditDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.audit,
        middlewares: [...(this.overrides?.audit?.middlewares || []), ...(selectMiddleware('audit', this.middlewares) as T.DAOMiddleware<AuditDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'audit',
        logger: this.logger,
      })
    }
    return this._audit
  }
  get city(): CityDAO<MetadataType, OperationMetadataType> {
    if (!this._city) {
      this._city = new CityDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.city,
        middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'city',
        logger: this.logger,
      })
    }
    return this._city
  }
  get defaultFieldsEntity(): DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> {
    if (!this._defaultFieldsEntity) {
      this._defaultFieldsEntity = new DefaultFieldsEntityDAO({
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
      })
    }
    return this._defaultFieldsEntity
  }
  get device(): DeviceDAO<MetadataType, OperationMetadataType> {
    if (!this._device) {
      this._device = new DeviceDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.device,
        middlewares: [...(this.overrides?.device?.middlewares || []), ...(selectMiddleware('device', this.middlewares) as T.DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'device',
        logger: this.logger,
      })
    }
    return this._device
  }
  get dog(): DogDAO<MetadataType, OperationMetadataType> {
    if (!this._dog) {
      this._dog = new DogDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.dog,
        middlewares: [...(this.overrides?.dog?.middlewares || []), ...(selectMiddleware('dog', this.middlewares) as T.DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'dog',
        logger: this.logger,
      })
    }
    return this._dog
  }
  get hotel(): HotelDAO<MetadataType, OperationMetadataType> {
    if (!this._hotel) {
      this._hotel = new HotelDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.hotel,
        middlewares: [...(this.overrides?.hotel?.middlewares || []), ...(selectMiddleware('hotel', this.middlewares) as T.DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[])],
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
      this._organization = new OrganizationDAO({
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
      })
    }
    return this._organization
  }
  get post(): PostDAO<MetadataType, OperationMetadataType> {
    if (!this._post) {
      this._post = new PostDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.post,
        middlewares: [...(this.overrides?.post?.middlewares || []), ...(selectMiddleware('post', this.middlewares) as T.DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'post',
        logger: this.logger,
      })
    }
    return this._post
  }
  get postType(): PostTypeDAO<MetadataType, OperationMetadataType> {
    if (!this._postType) {
      this._postType = new PostTypeDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.postType,
        middlewares: [
          ...(this.overrides?.postType?.middlewares || []),
          ...(selectMiddleware('postType', this.middlewares) as T.DAOMiddleware<PostTypeDAOGenerics<MetadataType, OperationMetadataType>>[]),
        ],
        name: 'postType',
        logger: this.logger,
      })
    }
    return this._postType
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      this._user = new UserDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.user,
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
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float'])
        : undefined,
    })
    this.overrides = params.overrides
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

  public async execQuery<T>(run: (dbs: {}, entities: {}) => Promise<T>): Promise<T> {
    return run({}, {})
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
  postType: PostTypeDAOGenerics<MetadataType, OperationMetadataType>
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
