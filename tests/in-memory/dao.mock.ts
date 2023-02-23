import * as T from '../../src'
import * as types from './models.mock'

export type ScalarsSpecification = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Coordinates: { type: types.Scalars['Coordinates']; isTextual: false; isQuantitative: false }
  Decimal: { type: types.Scalars['Decimal']; isTextual: false; isQuantitative: false }
  JSON: { type: types.Scalars['JSON']; isTextual: false; isQuantitative: false }
  Live: { type: types.Scalars['Live']; isTextual: false; isQuantitative: false }
  LocalizedString: { type: types.Scalars['LocalizedString']; isTextual: false; isQuantitative: false }
  Password: { type: types.Scalars['Password']; isTextual: false; isQuantitative: false }
  State: { type: types.State; isTextual: false; isQuantitative: false }
}

export type AST = {
  Address: {
    fields: {
      cities: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'City'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Audit: {
    fields: {
      changes: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      entityId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Auditable: {
    fields: {
      createdBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      createdOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      deletedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      modifiedBy: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      modifiedOn: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      state: { type: 'scalar'; isList: false; astName: 'State'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      versions: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'Audit'
        isRequired: true
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Bill: {
    fields: {
      description: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      productions: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'Production'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  City: {
    fields: {
      addressId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      computedAddressName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
      computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  DefaultFieldsEntity: {
    fields: {
      creationDate: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      live: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      opt1: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
      opt2: { type: 'scalar'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Device: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Dog: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      owner: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      ownerId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Hotel: {
    fields: {
      audit: { type: 'embedded'; isList: false; astName: 'Auditable'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  MockedEntity: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Organization: {
    fields: {
      address: { type: 'embedded'; isList: false; astName: 'Address'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      vatNumber: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Post: {
    fields: {
      author: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      authorId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      body: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      clicks: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      metadata: { type: 'embedded'; isList: false; astName: 'PostMetadata'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tags: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      title: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  PostMetadata: {
    fields: {
      region: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      visible: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  PostType: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Production: {
    fields: {
      bills: { type: 'embedded'; isList: true; astName: 'ProductionBill'; isRequired: true; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      total: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  ProductionBill: {
    fields: {
      bill: { type: 'relation'; relation: 'inner'; isList: false; astName: 'Bill'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      billId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      quota: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  User: {
    fields: {
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
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  UsernamePasswordCredentials: {
    fields: {
      password: { type: 'scalar'; isList: false; astName: 'Password'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
}

export const schemas = {
  Address: addressSchema,
  Audit: auditSchema,
  Auditable: auditableSchema,
  Bill: billSchema,
  City: citySchema,
  DefaultFieldsEntity: defaultFieldsEntitySchema,
  Device: deviceSchema,
  Dog: dogSchema,
  Hotel: hotelSchema,
  MockedEntity: mockedEntitySchema,
  Organization: organizationSchema,
  Post: postSchema,
  PostMetadata: postMetadataSchema,
  PostType: postTypeSchema,
  Production: productionSchema,
  ProductionBill: productionBillSchema,
  User: userSchema,
  UsernamePasswordCredentials: usernamePasswordCredentialsSchema,
} as const

export function addressSchema(): T.Schema<ScalarsSpecification> {
  return {
    cities: {
      type: 'relation',
      astName: 'City',
      relation: 'foreign',
      schema: () => citySchema(),
      refFrom: 'addressId',
      refTo: 'id',
      dao: 'city',
      isListElementRequired: true,
      isList: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
  }
}

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Address',
  AST,
  ScalarsSpecification,
  AddressCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type AddressIdFields = T.IdFields<'Address', AST>
export interface AddressModel extends types.Address {}
export interface AddressInsert extends T.Insert<'Address', AST, ScalarsSpecification> {}
export interface AddressPlainModel extends T.GenerateModel<'Address', AST, ScalarsSpecification, 'relation'> {}
export interface AddressProjection extends T.Projection<'Address', AST> {}
export interface AddressUpdate extends T.Update<'Address', AST, ScalarsSpecification> {}
export interface AddressFilter extends T.Filter<'Address', AST, ScalarsSpecification> {}
export interface AddressSortElement extends T.SortElement<'Address', AST> {}
export interface AddressRelationsFindParams extends T.RelationsFindParams<'Address', AST, ScalarsSpecification> {}
export type AddressParams<P extends AddressProjection> = T.Params<'Address', AST, ScalarsSpecification, P>
export type AddressProject<P extends AddressProjection> = T.Project<'Address', AST, ScalarsSpecification, P>
export type AddressCachedTypes = T.CachedTypes<
  AddressIdFields,
  AddressModel,
  AddressInsert,
  AddressPlainModel,
  AddressProjection,
  AddressUpdate,
  AddressFilter,
  AddressSortElement,
  AddressRelationsFindParams
>

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Address', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Address', AST>, P2 extends T.Projection<'Address', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Address', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Address', AST>, P1, P2>
  }
  public constructor(params: AddressDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: addressSchema(),
    })
  }
}

export class InMemoryAddressDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Address', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Address', AST>, P2 extends T.Projection<'Address', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Address', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Address', AST>, P1, P2>
  }
  public constructor(params: InMemoryAddressDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: addressSchema(),
    })
  }
}
export function auditSchema(): T.Schema<ScalarsSpecification> {
  return {
    changes: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    entityId: {
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
  }
}

type AuditDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Audit',
  AST,
  ScalarsSpecification,
  AuditCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type AuditIdFields = T.IdFields<'Audit', AST>
export interface AuditModel extends types.Audit {}
export interface AuditInsert extends T.Insert<'Audit', AST, ScalarsSpecification> {}
export interface AuditPlainModel extends T.GenerateModel<'Audit', AST, ScalarsSpecification, 'relation'> {}
export interface AuditProjection extends T.Projection<'Audit', AST> {}
export interface AuditUpdate extends T.Update<'Audit', AST, ScalarsSpecification> {}
export interface AuditFilter extends T.Filter<'Audit', AST, ScalarsSpecification> {}
export interface AuditSortElement extends T.SortElement<'Audit', AST> {}
export interface AuditRelationsFindParams extends T.RelationsFindParams<'Audit', AST, ScalarsSpecification> {}
export type AuditParams<P extends AuditProjection> = T.Params<'Audit', AST, ScalarsSpecification, P>
export type AuditProject<P extends AuditProjection> = T.Project<'Audit', AST, ScalarsSpecification, P>
export type AuditCachedTypes = T.CachedTypes<AuditIdFields, AuditModel, AuditInsert, AuditPlainModel, AuditProjection, AuditUpdate, AuditFilter, AuditSortElement, AuditRelationsFindParams>

export class AuditDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Audit', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Audit', AST>, P2 extends T.Projection<'Audit', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Audit', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Audit', AST>, P1, P2>
  }
  public constructor(params: AuditDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: auditSchema(),
    })
  }
}

export class InMemoryAuditDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Audit', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Audit', AST>, P2 extends T.Projection<'Audit', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Audit', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Audit', AST>, P1, P2>
  }
  public constructor(params: InMemoryAuditDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: auditSchema(),
    })
  }
}
export function auditableSchema(): T.Schema<ScalarsSpecification> {
  return {
    createdBy: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    createdOn: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      directives: {},
    },
    deletedOn: {
      type: 'scalar',
      scalar: 'Int',
      directives: {},
    },
    modifiedBy: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    modifiedOn: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      directives: {},
    },
    state: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
      directives: {},
    },
    versions: {
      type: 'relation',
      astName: 'Audit',
      relation: 'foreign',
      schema: () => auditSchema(),
      refFrom: 'entityId',
      refTo: '../id',
      dao: 'audit',
      required: true,
      isList: true,
      directives: {},
    },
  }
}

export interface AuditableModel extends types.Auditable {}
export interface AuditablePlainModel extends T.GenerateModel<'Auditable', AST, ScalarsSpecification, 'relation'> {}
export function billSchema(): T.Schema<ScalarsSpecification> {
  return {
    description: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      directives: {},
    },
    productions: {
      type: 'relation',
      astName: 'Production',
      relation: 'foreign',
      schema: () => productionSchema(),
      refFrom: 'bills.billId',
      refTo: 'id',
      dao: 'production',
      isListElementRequired: true,
      required: true,
      isList: true,
      directives: {},
    },
  }
}

type BillDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Bill',
  AST,
  ScalarsSpecification,
  BillCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type BillDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<BillDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryBillDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<BillDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type BillIdFields = T.IdFields<'Bill', AST>
export interface BillModel extends types.Bill {}
export interface BillInsert extends T.Insert<'Bill', AST, ScalarsSpecification> {}
export interface BillPlainModel extends T.GenerateModel<'Bill', AST, ScalarsSpecification, 'relation'> {}
export interface BillProjection extends T.Projection<'Bill', AST> {}
export interface BillUpdate extends T.Update<'Bill', AST, ScalarsSpecification> {}
export interface BillFilter extends T.Filter<'Bill', AST, ScalarsSpecification> {}
export interface BillSortElement extends T.SortElement<'Bill', AST> {}
export interface BillRelationsFindParams extends T.RelationsFindParams<'Bill', AST, ScalarsSpecification> {}
export type BillParams<P extends BillProjection> = T.Params<'Bill', AST, ScalarsSpecification, P>
export type BillProject<P extends BillProjection> = T.Project<'Bill', AST, ScalarsSpecification, P>
export type BillCachedTypes = T.CachedTypes<BillIdFields, BillModel, BillInsert, BillPlainModel, BillProjection, BillUpdate, BillFilter, BillSortElement, BillRelationsFindParams>

export class BillDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BillDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Bill', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Bill', AST>, P2 extends T.Projection<'Bill', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Bill', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Bill', AST>, P1, P2>
  }
  public constructor(params: BillDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: billSchema(),
    })
  }
}

export class InMemoryBillDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BillDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Bill', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Bill', AST>, P2 extends T.Projection<'Bill', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Bill', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Bill', AST>, P1, P2>
  }
  public constructor(params: InMemoryBillDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: billSchema(),
    })
  }
}
export function citySchema(): T.Schema<ScalarsSpecification> {
  return {
    addressId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
    computedAddressName: {
      type: 'scalar',
      scalar: 'String',
      excluded: true,
      directives: {},
    },
    computedName: {
      type: 'scalar',
      scalar: 'String',
      excluded: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
  }
}

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'City',
  AST,
  ScalarsSpecification,
  CityCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryCityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type CityIdFields = T.IdFields<'City', AST>
export interface CityModel extends types.City {}
export interface CityInsert extends T.Insert<'City', AST, ScalarsSpecification> {}
export interface CityPlainModel extends T.GenerateModel<'City', AST, ScalarsSpecification, 'relation'> {}
export interface CityProjection extends T.Projection<'City', AST> {}
export interface CityUpdate extends T.Update<'City', AST, ScalarsSpecification> {}
export interface CityFilter extends T.Filter<'City', AST, ScalarsSpecification> {}
export interface CitySortElement extends T.SortElement<'City', AST> {}
export interface CityRelationsFindParams extends T.RelationsFindParams<'City', AST, ScalarsSpecification> {}
export type CityParams<P extends CityProjection> = T.Params<'City', AST, ScalarsSpecification, P>
export type CityProject<P extends CityProjection> = T.Project<'City', AST, ScalarsSpecification, P>
export type CityCachedTypes = T.CachedTypes<CityIdFields, CityModel, CityInsert, CityPlainModel, CityProjection, CityUpdate, CityFilter, CitySortElement, CityRelationsFindParams>

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'City', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'City', AST>, P2 extends T.Projection<'City', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'City', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'City', AST>, P1, P2>
  }
  public constructor(params: CityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: citySchema(),
    })
  }
}

export class InMemoryCityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'City', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'City', AST>, P2 extends T.Projection<'City', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'City', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'City', AST>, P1, P2>
  }
  public constructor(params: InMemoryCityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: citySchema(),
    })
  }
}
export function defaultFieldsEntitySchema(): T.Schema<ScalarsSpecification> {
  return {
    creationDate: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      generationStrategy: 'middleware',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
      directives: {},
    },
    live: {
      type: 'scalar',
      scalar: 'Live',
      required: true,
      generationStrategy: 'generator',
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    opt1: {
      type: 'scalar',
      scalar: 'Live',
      generationStrategy: 'middleware',
      directives: {},
    },
    opt2: {
      type: 'scalar',
      scalar: 'Live',
      generationStrategy: 'generator',
      directives: {},
    },
  }
}

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'DefaultFieldsEntity',
  AST,
  ScalarsSpecification,
  DefaultFieldsEntityCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type DefaultFieldsEntityIdFields = T.IdFields<'DefaultFieldsEntity', AST>
export interface DefaultFieldsEntityModel extends types.DefaultFieldsEntity {}
export interface DefaultFieldsEntityInsert extends T.Insert<'DefaultFieldsEntity', AST, ScalarsSpecification> {}
export interface DefaultFieldsEntityPlainModel extends T.GenerateModel<'DefaultFieldsEntity', AST, ScalarsSpecification, 'relation'> {}
export interface DefaultFieldsEntityProjection extends T.Projection<'DefaultFieldsEntity', AST> {}
export interface DefaultFieldsEntityUpdate extends T.Update<'DefaultFieldsEntity', AST, ScalarsSpecification> {}
export interface DefaultFieldsEntityFilter extends T.Filter<'DefaultFieldsEntity', AST, ScalarsSpecification> {}
export interface DefaultFieldsEntitySortElement extends T.SortElement<'DefaultFieldsEntity', AST> {}
export interface DefaultFieldsEntityRelationsFindParams extends T.RelationsFindParams<'DefaultFieldsEntity', AST, ScalarsSpecification> {}
export type DefaultFieldsEntityParams<P extends DefaultFieldsEntityProjection> = T.Params<'DefaultFieldsEntity', AST, ScalarsSpecification, P>
export type DefaultFieldsEntityProject<P extends DefaultFieldsEntityProjection> = T.Project<'DefaultFieldsEntity', AST, ScalarsSpecification, P>
export type DefaultFieldsEntityCachedTypes = T.CachedTypes<
  DefaultFieldsEntityIdFields,
  DefaultFieldsEntityModel,
  DefaultFieldsEntityInsert,
  DefaultFieldsEntityPlainModel,
  DefaultFieldsEntityProjection,
  DefaultFieldsEntityUpdate,
  DefaultFieldsEntityFilter,
  DefaultFieldsEntitySortElement,
  DefaultFieldsEntityRelationsFindParams
>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'DefaultFieldsEntity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'DefaultFieldsEntity', AST>, P2 extends T.Projection<'DefaultFieldsEntity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'DefaultFieldsEntity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'DefaultFieldsEntity', AST>, P1, P2>
  }
  public constructor(params: DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: defaultFieldsEntitySchema(),
    })
  }
}

export class InMemoryDefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'DefaultFieldsEntity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'DefaultFieldsEntity', AST>, P2 extends T.Projection<'DefaultFieldsEntity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'DefaultFieldsEntity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'DefaultFieldsEntity', AST>, P1, P2>
  }
  public constructor(params: InMemoryDefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: defaultFieldsEntitySchema(),
    })
  }
}
export function deviceSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    user: {
      type: 'relation',
      astName: 'User',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      directives: {},
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      directives: {},
    },
  }
}

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Device',
  AST,
  ScalarsSpecification,
  DeviceCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDeviceDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type DeviceIdFields = T.IdFields<'Device', AST>
export interface DeviceModel extends types.Device {}
export interface DeviceInsert extends T.Insert<'Device', AST, ScalarsSpecification> {}
export interface DevicePlainModel extends T.GenerateModel<'Device', AST, ScalarsSpecification, 'relation'> {}
export interface DeviceProjection extends T.Projection<'Device', AST> {}
export interface DeviceUpdate extends T.Update<'Device', AST, ScalarsSpecification> {}
export interface DeviceFilter extends T.Filter<'Device', AST, ScalarsSpecification> {}
export interface DeviceSortElement extends T.SortElement<'Device', AST> {}
export interface DeviceRelationsFindParams extends T.RelationsFindParams<'Device', AST, ScalarsSpecification> {}
export type DeviceParams<P extends DeviceProjection> = T.Params<'Device', AST, ScalarsSpecification, P>
export type DeviceProject<P extends DeviceProjection> = T.Project<'Device', AST, ScalarsSpecification, P>
export type DeviceCachedTypes = T.CachedTypes<DeviceIdFields, DeviceModel, DeviceInsert, DevicePlainModel, DeviceProjection, DeviceUpdate, DeviceFilter, DeviceSortElement, DeviceRelationsFindParams>

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Device', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Device', AST>, P2 extends T.Projection<'Device', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Device', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Device', AST>, P1, P2>
  }
  public constructor(params: DeviceDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: deviceSchema(),
    })
  }
}

export class InMemoryDeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Device', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Device', AST>, P2 extends T.Projection<'Device', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Device', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Device', AST>, P1, P2>
  }
  public constructor(params: InMemoryDeviceDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: deviceSchema(),
    })
  }
}
export function dogSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    owner: {
      type: 'relation',
      astName: 'User',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'ownerId',
      refTo: 'id',
      dao: 'user',
      directives: {},
    },
    ownerId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
  }
}

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Dog',
  AST,
  ScalarsSpecification,
  DogCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDogDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type DogIdFields = T.IdFields<'Dog', AST>
export interface DogModel extends types.Dog {}
export interface DogInsert extends T.Insert<'Dog', AST, ScalarsSpecification> {}
export interface DogPlainModel extends T.GenerateModel<'Dog', AST, ScalarsSpecification, 'relation'> {}
export interface DogProjection extends T.Projection<'Dog', AST> {}
export interface DogUpdate extends T.Update<'Dog', AST, ScalarsSpecification> {}
export interface DogFilter extends T.Filter<'Dog', AST, ScalarsSpecification> {}
export interface DogSortElement extends T.SortElement<'Dog', AST> {}
export interface DogRelationsFindParams extends T.RelationsFindParams<'Dog', AST, ScalarsSpecification> {}
export type DogParams<P extends DogProjection> = T.Params<'Dog', AST, ScalarsSpecification, P>
export type DogProject<P extends DogProjection> = T.Project<'Dog', AST, ScalarsSpecification, P>
export type DogCachedTypes = T.CachedTypes<DogIdFields, DogModel, DogInsert, DogPlainModel, DogProjection, DogUpdate, DogFilter, DogSortElement, DogRelationsFindParams>

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Dog', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Dog', AST>, P2 extends T.Projection<'Dog', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Dog', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Dog', AST>, P1, P2>
  }
  public constructor(params: DogDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dogSchema(),
    })
  }
}

export class InMemoryDogDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Dog', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Dog', AST>, P2 extends T.Projection<'Dog', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Dog', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Dog', AST>, P1, P2>
  }
  public constructor(params: InMemoryDogDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: dogSchema(),
    })
  }
}
export function hotelSchema(): T.Schema<ScalarsSpecification> {
  return {
    audit: {
      type: 'embedded',
      astName: 'Auditable',
      schema: () => auditableSchema(),
      required: true,
      generationStrategy: 'middleware',
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
  }
}

type HotelDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Hotel',
  AST,
  ScalarsSpecification,
  HotelCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export class HotelDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function mockedEntitySchema(): T.Schema<ScalarsSpecification> {
  return {
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
    user: {
      type: 'relation',
      astName: 'User',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
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

type MockedEntityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'MockedEntity',
  AST,
  ScalarsSpecification,
  MockedEntityCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type MockedEntityIdFields = T.IdFields<'MockedEntity', AST>
export interface MockedEntityModel extends types.MockedEntity {}
export interface MockedEntityInsert extends T.Insert<'MockedEntity', AST, ScalarsSpecification> {}
export interface MockedEntityPlainModel extends T.GenerateModel<'MockedEntity', AST, ScalarsSpecification, 'relation'> {}
export interface MockedEntityProjection extends T.Projection<'MockedEntity', AST> {}
export interface MockedEntityUpdate extends T.Update<'MockedEntity', AST, ScalarsSpecification> {}
export interface MockedEntityFilter extends T.Filter<'MockedEntity', AST, ScalarsSpecification> {}
export interface MockedEntitySortElement extends T.SortElement<'MockedEntity', AST> {}
export interface MockedEntityRelationsFindParams extends T.RelationsFindParams<'MockedEntity', AST, ScalarsSpecification> {}
export type MockedEntityParams<P extends MockedEntityProjection> = T.Params<'MockedEntity', AST, ScalarsSpecification, P>
export type MockedEntityProject<P extends MockedEntityProjection> = T.Project<'MockedEntity', AST, ScalarsSpecification, P>
export type MockedEntityCachedTypes = T.CachedTypes<
  MockedEntityIdFields,
  MockedEntityModel,
  MockedEntityInsert,
  MockedEntityPlainModel,
  MockedEntityProjection,
  MockedEntityUpdate,
  MockedEntityFilter,
  MockedEntitySortElement,
  MockedEntityRelationsFindParams
>

export class MockedEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'MockedEntity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'MockedEntity', AST>, P2 extends T.Projection<'MockedEntity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'MockedEntity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'MockedEntity', AST>, P1, P2>
  }
  public constructor(params: MockedEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: mockedEntitySchema(),
    })
  }
}

export class InMemoryMockedEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'MockedEntity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'MockedEntity', AST>, P2 extends T.Projection<'MockedEntity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'MockedEntity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'MockedEntity', AST>, P1, P2>
  }
  public constructor(params: InMemoryMockedEntityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: mockedEntitySchema(),
    })
  }
}
export function organizationSchema(): T.Schema<ScalarsSpecification> {
  return {
    address: {
      type: 'embedded',
      astName: 'Address',
      schema: () => addressSchema(),
      directives: {},
    },
    computedName: {
      type: 'scalar',
      scalar: 'String',
      excluded: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    vatNumber: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
  }
}

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Organization',
  AST,
  ScalarsSpecification,
  OrganizationCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type OrganizationIdFields = T.IdFields<'Organization', AST>
export interface OrganizationModel extends types.Organization {}
export interface OrganizationInsert extends T.Insert<'Organization', AST, ScalarsSpecification> {}
export interface OrganizationPlainModel extends T.GenerateModel<'Organization', AST, ScalarsSpecification, 'relation'> {}
export interface OrganizationProjection extends T.Projection<'Organization', AST> {}
export interface OrganizationUpdate extends T.Update<'Organization', AST, ScalarsSpecification> {}
export interface OrganizationFilter extends T.Filter<'Organization', AST, ScalarsSpecification> {}
export interface OrganizationSortElement extends T.SortElement<'Organization', AST> {}
export interface OrganizationRelationsFindParams extends T.RelationsFindParams<'Organization', AST, ScalarsSpecification> {}
export type OrganizationParams<P extends OrganizationProjection> = T.Params<'Organization', AST, ScalarsSpecification, P>
export type OrganizationProject<P extends OrganizationProjection> = T.Project<'Organization', AST, ScalarsSpecification, P>
export type OrganizationCachedTypes = T.CachedTypes<
  OrganizationIdFields,
  OrganizationModel,
  OrganizationInsert,
  OrganizationPlainModel,
  OrganizationProjection,
  OrganizationUpdate,
  OrganizationFilter,
  OrganizationSortElement,
  OrganizationRelationsFindParams
>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Organization', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Organization', AST>, P2 extends T.Projection<'Organization', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'Organization', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Organization', AST>, P1, P2>
  }
  public constructor(params: OrganizationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: organizationSchema(),
    })
  }
}

export class InMemoryOrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Organization', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Organization', AST>, P2 extends T.Projection<'Organization', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'Organization', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Organization', AST>, P1, P2>
  }
  public constructor(params: InMemoryOrganizationDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: organizationSchema(),
    })
  }
}
export function postSchema(): T.Schema<ScalarsSpecification> {
  return {
    author: {
      type: 'relation',
      astName: 'User',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'authorId',
      refTo: 'id',
      dao: 'user',
      required: true,
      directives: {},
    },
    authorId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      alias: 'aId',
      directives: {},
    },
    body: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    clicks: {
      type: 'scalar',
      scalar: 'Int',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      directives: {},
    },
    metadata: {
      type: 'embedded',
      astName: 'PostMetadata',
      schema: () => postMetadataSchema(),
      directives: {},
    },
    tags: {
      type: 'scalar',
      scalar: 'ID',
      isListElementRequired: true,
      isList: true,
      directives: {},
    },
    title: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    views: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      directives: {},
    },
  }
}

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Post',
  AST,
  ScalarsSpecification,
  PostCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type PostIdFields = T.IdFields<'Post', AST>
export interface PostModel extends types.Post {}
export interface PostInsert extends T.Insert<'Post', AST, ScalarsSpecification> {}
export interface PostPlainModel extends T.GenerateModel<'Post', AST, ScalarsSpecification, 'relation'> {}
export interface PostProjection extends T.Projection<'Post', AST> {}
export interface PostUpdate extends T.Update<'Post', AST, ScalarsSpecification> {}
export interface PostFilter extends T.Filter<'Post', AST, ScalarsSpecification> {}
export interface PostSortElement extends T.SortElement<'Post', AST> {}
export interface PostRelationsFindParams extends T.RelationsFindParams<'Post', AST, ScalarsSpecification> {}
export type PostParams<P extends PostProjection> = T.Params<'Post', AST, ScalarsSpecification, P>
export type PostProject<P extends PostProjection> = T.Project<'Post', AST, ScalarsSpecification, P>
export type PostCachedTypes = T.CachedTypes<PostIdFields, PostModel, PostInsert, PostPlainModel, PostProjection, PostUpdate, PostFilter, PostSortElement, PostRelationsFindParams>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Post', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Post', AST>, P2 extends T.Projection<'Post', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Post', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Post', AST>, P1, P2>
  }
  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export class InMemoryPostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Post', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Post', AST>, P2 extends T.Projection<'Post', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Post', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Post', AST>, P1, P2>
  }
  public constructor(params: InMemoryPostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}
export function postMetadataSchema(): T.Schema<ScalarsSpecification> {
  return {
    region: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
    visible: {
      type: 'scalar',
      scalar: 'Boolean',
      required: true,
      directives: {},
    },
  }
}

export interface PostMetadataModel extends types.PostMetadata {}
export interface PostMetadataPlainModel extends T.GenerateModel<'PostMetadata', AST, ScalarsSpecification, 'relation'> {}
export function postTypeSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'user',
      required: true,
      directives: {},
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      directives: {},
    },
  }
}

type PostTypeDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'PostType',
  AST,
  ScalarsSpecification,
  PostTypeCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type PostTypeIdFields = T.IdFields<'PostType', AST>
export interface PostTypeModel extends types.PostType {}
export interface PostTypeInsert extends T.Insert<'PostType', AST, ScalarsSpecification> {}
export interface PostTypePlainModel extends T.GenerateModel<'PostType', AST, ScalarsSpecification, 'relation'> {}
export interface PostTypeProjection extends T.Projection<'PostType', AST> {}
export interface PostTypeUpdate extends T.Update<'PostType', AST, ScalarsSpecification> {}
export interface PostTypeFilter extends T.Filter<'PostType', AST, ScalarsSpecification> {}
export interface PostTypeSortElement extends T.SortElement<'PostType', AST> {}
export interface PostTypeRelationsFindParams extends T.RelationsFindParams<'PostType', AST, ScalarsSpecification> {}
export type PostTypeParams<P extends PostTypeProjection> = T.Params<'PostType', AST, ScalarsSpecification, P>
export type PostTypeProject<P extends PostTypeProjection> = T.Project<'PostType', AST, ScalarsSpecification, P>
export type PostTypeCachedTypes = T.CachedTypes<
  PostTypeIdFields,
  PostTypeModel,
  PostTypeInsert,
  PostTypePlainModel,
  PostTypeProjection,
  PostTypeUpdate,
  PostTypeFilter,
  PostTypeSortElement,
  PostTypeRelationsFindParams
>

export class PostTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'PostType', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'PostType', AST>, P2 extends T.Projection<'PostType', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'PostType', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'PostType', AST>, P1, P2>
  }
  public constructor(params: PostTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postTypeSchema(),
    })
  }
}

export class InMemoryPostTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'PostType', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'PostType', AST>, P2 extends T.Projection<'PostType', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'PostType', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'PostType', AST>, P1, P2>
  }
  public constructor(params: InMemoryPostTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postTypeSchema(),
    })
  }
}
export function productionSchema(): T.Schema<ScalarsSpecification> {
  return {
    bills: {
      type: 'embedded',
      astName: 'ProductionBill',
      schema: () => productionBillSchema(),
      isListElementRequired: true,
      required: true,
      isList: true,
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      directives: {},
    },
    total: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      directives: {},
    },
  }
}

type ProductionDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'Production',
  AST,
  ScalarsSpecification,
  ProductionCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ProductionDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProductionDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryProductionDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProductionDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ProductionIdFields = T.IdFields<'Production', AST>
export interface ProductionModel extends types.Production {}
export interface ProductionInsert extends T.Insert<'Production', AST, ScalarsSpecification> {}
export interface ProductionPlainModel extends T.GenerateModel<'Production', AST, ScalarsSpecification, 'relation'> {}
export interface ProductionProjection extends T.Projection<'Production', AST> {}
export interface ProductionUpdate extends T.Update<'Production', AST, ScalarsSpecification> {}
export interface ProductionFilter extends T.Filter<'Production', AST, ScalarsSpecification> {}
export interface ProductionSortElement extends T.SortElement<'Production', AST> {}
export interface ProductionRelationsFindParams extends T.RelationsFindParams<'Production', AST, ScalarsSpecification> {}
export type ProductionParams<P extends ProductionProjection> = T.Params<'Production', AST, ScalarsSpecification, P>
export type ProductionProject<P extends ProductionProjection> = T.Project<'Production', AST, ScalarsSpecification, P>
export type ProductionCachedTypes = T.CachedTypes<
  ProductionIdFields,
  ProductionModel,
  ProductionInsert,
  ProductionPlainModel,
  ProductionProjection,
  ProductionUpdate,
  ProductionFilter,
  ProductionSortElement,
  ProductionRelationsFindParams
>

export class ProductionDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProductionDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Production', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Production', AST>, P2 extends T.Projection<'Production', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Production', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Production', AST>, P1, P2>
  }
  public constructor(params: ProductionDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: productionSchema(),
    })
  }
}

export class InMemoryProductionDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProductionDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Production', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Production', AST>, P2 extends T.Projection<'Production', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Production', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Production', AST>, P1, P2>
  }
  public constructor(params: InMemoryProductionDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: productionSchema(),
    })
  }
}
export function productionBillSchema(): T.Schema<ScalarsSpecification> {
  return {
    bill: {
      type: 'relation',
      astName: 'Bill',
      relation: 'inner',
      schema: () => billSchema(),
      refFrom: 'billId',
      refTo: 'id',
      dao: 'bill',
      required: true,
      directives: {},
    },
    billId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      directives: {},
    },
    quota: {
      type: 'scalar',
      scalar: 'Int',
      required: true,
      directives: {},
    },
  }
}

export interface ProductionBillModel extends types.ProductionBill {}
export interface ProductionBillPlainModel extends T.GenerateModel<'ProductionBill', AST, ScalarsSpecification, 'relation'> {}
export function userSchema(): T.Schema<ScalarsSpecification> {
  return {
    amount: {
      type: 'scalar',
      scalar: 'Decimal',
      directives: {},
    },
    amounts: {
      type: 'scalar',
      scalar: 'Decimal',
      isListElementRequired: true,
      isList: true,
      alias: 'amounts',
      directives: {},
    },
    credentials: {
      type: 'embedded',
      astName: 'UsernamePasswordCredentials',
      schema: () => usernamePasswordCredentialsSchema(),
      isList: true,
      directives: {},
    },
    dogs: {
      type: 'relation',
      astName: 'Dog',
      relation: 'foreign',
      schema: () => dogSchema(),
      refFrom: 'ownerId',
      refTo: 'id',
      dao: 'dog',
      isListElementRequired: true,
      isList: true,
      directives: {},
    },
    embeddedPost: {
      type: 'embedded',
      astName: 'Post',
      schema: () => postSchema(),
      directives: {},
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
      alias: 'name',
      directives: {},
    },
    friends: {
      type: 'relation',
      astName: 'User',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'friendsId',
      refTo: 'id',
      dao: 'user',
      isListElementRequired: true,
      isList: true,
      directives: {},
    },
    friendsId: {
      type: 'scalar',
      scalar: 'ID',
      isListElementRequired: true,
      isList: true,
      alias: 'fIds',
      directives: {},
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
      alias: 'ID',
      directives: {},
    },
    lastName: {
      type: 'scalar',
      scalar: 'String',
      directives: {},
    },
    live: {
      type: 'scalar',
      scalar: 'Boolean',
      required: true,
      directives: {},
    },
    localization: {
      type: 'scalar',
      scalar: 'Coordinates',
      directives: {},
    },
    title: {
      type: 'scalar',
      scalar: 'LocalizedString',
      directives: {},
    },
    usernamePasswordCredentials: {
      type: 'embedded',
      astName: 'UsernamePasswordCredentials',
      schema: () => usernamePasswordCredentialsSchema(),
      alias: 'cred',
      directives: {},
    },
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'User',
  AST,
  ScalarsSpecification,
  UserCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
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

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
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
      alias: 'pwd',
      directives: {},
    },
    username: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      alias: 'user',
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
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    audit?: Pick<Partial<AuditDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    bill?: Pick<Partial<BillDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    mockedEntity?: Pick<Partial<MockedEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    postType?: Pick<Partial<PostTypeDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    production?: Pick<Partial<ProductionDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  }
  scalars?: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification, 'knex'>
  log?: T.LogInput<'Address' | 'Audit' | 'Bill' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Hotel' | 'MockedEntity' | 'Organization' | 'Post' | 'PostType' | 'Production' | 'User'>
  awaitLog?: boolean
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, never, ScalarsSpecification, MetadataType> {
  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined
  private _audit: AuditDAO<MetadataType, OperationMetadataType> | undefined
  private _bill: BillDAO<MetadataType, OperationMetadataType> | undefined
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined
  private _defaultFieldsEntity: DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> | undefined
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined
  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined
  private _mockedEntity: MockedEntityDAO<MetadataType, OperationMetadataType> | undefined
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined
  private _postType: PostTypeDAO<MetadataType, OperationMetadataType> | undefined
  private _production: ProductionDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<
    'Address' | 'Audit' | 'Bill' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Hotel' | 'MockedEntity' | 'Organization' | 'Post' | 'PostType' | 'Production' | 'User'
  >

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
        name: 'Address',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Audit',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
      })
    }
    return this._audit
  }
  get bill(): BillDAO<MetadataType, OperationMetadataType> {
    if (!this._bill) {
      this._bill = new BillDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.bill,
        middlewares: [...(this.overrides?.bill?.middlewares || []), ...(selectMiddleware('bill', this.middlewares) as T.DAOMiddleware<BillDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'Bill',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
      })
    }
    return this._bill
  }
  get city(): CityDAO<MetadataType, OperationMetadataType> {
    if (!this._city) {
      this._city = new CityDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.city,
        middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'City',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'DefaultFieldsEntity',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Device',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Dog',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Hotel',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'MockedEntity',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Organization',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'Post',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
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
        name: 'PostType',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
      })
    }
    return this._postType
  }
  get production(): ProductionDAO<MetadataType, OperationMetadataType> {
    if (!this._production) {
      this._production = new ProductionDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.production,
        middlewares: [
          ...(this.overrides?.production?.middlewares || []),
          ...(selectMiddleware('production', this.middlewares) as T.DAOMiddleware<ProductionDAOGenerics<MetadataType, OperationMetadataType>>[]),
        ],
        name: 'Production',
        logger: this.logger,
        awaitLog: this.params.awaitLog,
      })
    }
    return this._production
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      this._user = new UserDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.user,
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
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'Password', 'State', 'ID', 'String', 'Boolean', 'Int', 'Float'])
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

  public clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  address: AddressDAOGenerics<MetadataType, OperationMetadataType>
  audit: AuditDAOGenerics<MetadataType, OperationMetadataType>
  bill: BillDAOGenerics<MetadataType, OperationMetadataType>
  city: CityDAOGenerics<MetadataType, OperationMetadataType>
  defaultFieldsEntity: DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>
  device: DeviceDAOGenerics<MetadataType, OperationMetadataType>
  dog: DogDAOGenerics<MetadataType, OperationMetadataType>
  hotel: HotelDAOGenerics<MetadataType, OperationMetadataType>
  mockedEntity: MockedEntityDAOGenerics<MetadataType, OperationMetadataType>
  organization: OrganizationDAOGenerics<MetadataType, OperationMetadataType>
  post: PostDAOGenerics<MetadataType, OperationMetadataType>
  postType: PostTypeDAOGenerics<MetadataType, OperationMetadataType>
  production: ProductionDAOGenerics<MetadataType, OperationMetadataType>
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
      address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      audit?: Pick<Partial<AuditDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      bill?: Pick<Partial<BillDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      mockedEntity?: Pick<Partial<MockedEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
      postType?: Pick<Partial<PostTypeDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      production?: Pick<Partial<ProductionDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
      user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    }

    scalars: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification, 'knex'>
    log: T.LogInput<'Address' | 'Audit' | 'Bill' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Hotel' | 'MockedEntity' | 'Organization' | 'Post' | 'PostType' | 'Production' | 'User'>
    security: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
  }
  security: {
    context: T.DAOSecurityContext<SecurityDomain, Permissions>
    policies: Required<T.DAOSecurityPolicies<DAOGenericsMap<MetadataType, OperationMetadataType>, Permissions, SecurityDomain>>
    permissions: Permissions
    domain: SecurityDomain
  }
  daoGenericsMap: DAOGenericsMap<MetadataType, OperationMetadataType>
}
