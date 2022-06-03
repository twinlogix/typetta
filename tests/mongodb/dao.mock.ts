import * as T from '../../src'
import * as types from './models.mock'
import * as M from 'mongodb'

export type Scalars = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Coordinates: { type: types.Scalars['Coordinates']; isTextual: false; isQuantitative: false }
  Decimal: { type: types.Scalars['Decimal']; isTextual: false; isQuantitative: true }
  JSON: { type: types.Scalars['JSON']; isTextual: false; isQuantitative: false }
  Live: { type: types.Scalars['Live']; isTextual: false; isQuantitative: false }
  LocalizedString: { type: types.Scalars['LocalizedString']; isTextual: false; isQuantitative: false }
  MongoID: { type: types.Scalars['MongoID']; isTextual: false; isQuantitative: false }
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Audit: {
    fields: {
      changes: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      entityId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
  City: {
    fields: {
      addressId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      computedAddressName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
      computedName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  EmbeddedUser: {
    fields: {
      e: { type: 'embedded'; isList: true; astName: 'EmbeddedUser2'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  EmbeddedUser2: {
    fields: {
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  EmbeddedUser3: {
    fields: {
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      value: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  EmbeddedUser4: {
    fields: {
      e: { type: 'embedded'; isList: false; astName: 'EmbeddedUser5'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  EmbeddedUser5: {
    fields: { userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' } }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Hotel: {
    fields: {
      audit: { type: 'embedded'; isList: false; astName: 'Auditable'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
      embeddedUser3: { type: 'embedded'; isList: false; astName: 'EmbeddedUser3'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      embeddedUser4: { type: 'embedded'; isList: false; astName: 'EmbeddedUser4'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      embeddedUsers: { type: 'embedded'; isList: true; astName: 'EmbeddedUser'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      embeddedUsers3: { type: 'embedded'; isList: true; astName: 'EmbeddedUser3'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      embeddedUsers4: { type: 'embedded'; isList: true; astName: 'EmbeddedUser4'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      users: { type: 'embedded'; isList: false; astName: 'UserCollection'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  MockedEntity: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'MongoID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
      title: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
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
      embeddedUser: { type: 'embedded'; isList: false; astName: 'EmbeddedUser2'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      friends: { type: 'relation'; relation: 'inner'; isList: true; astName: 'User'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      friendsId: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      int: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
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
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UserCollection: {
    fields: {
      users: { type: 'relation'; relation: 'inner'; isList: true; astName: 'User'; isRequired: true; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      usersId: { type: 'scalar'; isList: true; astName: 'ID'; isRequired: true; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
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
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
}

export function addressSchema(): T.Schema<Scalars> {
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

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Address',
  AST,
  Scalars,
  AddressCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type AddressIdFields = T.IdFields<'Address', AST>
export type AddressInsert = T.Insert<'Address', AST, Scalars>
export type AddressInsertResult = T.GenerateModel<'Address', AST, Scalars, 'relation'>
export type AddressProjection = T.Projection<'Address', AST>
export type AddressUpdate = T.Update<'Address', AST, Scalars>
export type AddressFilter = T.Filter<'Address', AST, Scalars>
export type AddressSortElement = T.SortElement<'Address', AST>
export type AddressRelationsFindParams = T.RelationsFindParams<'Address', AST, Scalars>
export type AddressParams<P extends AddressProjection> = T.Params<'Address', AST, Scalars, P>
export type AddressCachedTypes = T.CachedTypes<AddressIdFields, AddressInsert, AddressInsertResult, AddressProjection, AddressUpdate, AddressFilter, AddressSortElement, AddressRelationsFindParams>

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function auditSchema(): T.Schema<Scalars> {
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

type AuditDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Audit',
  AST,
  Scalars,
  AuditCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type AuditIdFields = T.IdFields<'Audit', AST>
export type AuditInsert = T.Insert<'Audit', AST, Scalars>
export type AuditInsertResult = T.GenerateModel<'Audit', AST, Scalars, 'relation'>
export type AuditProjection = T.Projection<'Audit', AST>
export type AuditUpdate = T.Update<'Audit', AST, Scalars>
export type AuditFilter = T.Filter<'Audit', AST, Scalars>
export type AuditSortElement = T.SortElement<'Audit', AST>
export type AuditRelationsFindParams = T.RelationsFindParams<'Audit', AST, Scalars>
export type AuditParams<P extends AuditProjection> = T.Params<'Audit', AST, Scalars, P>
export type AuditCachedTypes = T.CachedTypes<AuditIdFields, AuditInsert, AuditInsertResult, AuditProjection, AuditUpdate, AuditFilter, AuditSortElement, AuditRelationsFindParams>

export class AuditDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<AuditDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function auditableSchema(): T.Schema<Scalars> {
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
export function citySchema(): T.Schema<Scalars> {
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

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'City',
  AST,
  Scalars,
  CityCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryCityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type CityIdFields = T.IdFields<'City', AST>
export type CityInsert = T.Insert<'City', AST, Scalars>
export type CityInsertResult = T.GenerateModel<'City', AST, Scalars, 'relation'>
export type CityProjection = T.Projection<'City', AST>
export type CityUpdate = T.Update<'City', AST, Scalars>
export type CityFilter = T.Filter<'City', AST, Scalars>
export type CitySortElement = T.SortElement<'City', AST>
export type CityRelationsFindParams = T.RelationsFindParams<'City', AST, Scalars>
export type CityParams<P extends CityProjection> = T.Params<'City', AST, Scalars, P>
export type CityCachedTypes = T.CachedTypes<CityIdFields, CityInsert, CityInsertResult, CityProjection, CityUpdate, CityFilter, CitySortElement, CityRelationsFindParams>

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function defaultFieldsEntitySchema(): T.Schema<Scalars> {
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

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'DefaultFieldsEntity',
  AST,
  Scalars,
  DefaultFieldsEntityCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type DefaultFieldsEntityIdFields = T.IdFields<'DefaultFieldsEntity', AST>
export type DefaultFieldsEntityInsert = T.Insert<'DefaultFieldsEntity', AST, Scalars>
export type DefaultFieldsEntityInsertResult = T.GenerateModel<'DefaultFieldsEntity', AST, Scalars, 'relation'>
export type DefaultFieldsEntityProjection = T.Projection<'DefaultFieldsEntity', AST>
export type DefaultFieldsEntityUpdate = T.Update<'DefaultFieldsEntity', AST, Scalars>
export type DefaultFieldsEntityFilter = T.Filter<'DefaultFieldsEntity', AST, Scalars>
export type DefaultFieldsEntitySortElement = T.SortElement<'DefaultFieldsEntity', AST>
export type DefaultFieldsEntityRelationsFindParams = T.RelationsFindParams<'DefaultFieldsEntity', AST, Scalars>
export type DefaultFieldsEntityParams<P extends DefaultFieldsEntityProjection> = T.Params<'DefaultFieldsEntity', AST, Scalars, P>
export type DefaultFieldsEntityCachedTypes = T.CachedTypes<
  DefaultFieldsEntityIdFields,
  DefaultFieldsEntityInsert,
  DefaultFieldsEntityInsertResult,
  DefaultFieldsEntityProjection,
  DefaultFieldsEntityUpdate,
  DefaultFieldsEntityFilter,
  DefaultFieldsEntitySortElement,
  DefaultFieldsEntityRelationsFindParams
>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function deviceSchema(): T.Schema<Scalars> {
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

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Device',
  AST,
  Scalars,
  DeviceCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDeviceDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type DeviceIdFields = T.IdFields<'Device', AST>
export type DeviceInsert = T.Insert<'Device', AST, Scalars>
export type DeviceInsertResult = T.GenerateModel<'Device', AST, Scalars, 'relation'>
export type DeviceProjection = T.Projection<'Device', AST>
export type DeviceUpdate = T.Update<'Device', AST, Scalars>
export type DeviceFilter = T.Filter<'Device', AST, Scalars>
export type DeviceSortElement = T.SortElement<'Device', AST>
export type DeviceRelationsFindParams = T.RelationsFindParams<'Device', AST, Scalars>
export type DeviceParams<P extends DeviceProjection> = T.Params<'Device', AST, Scalars, P>
export type DeviceCachedTypes = T.CachedTypes<DeviceIdFields, DeviceInsert, DeviceInsertResult, DeviceProjection, DeviceUpdate, DeviceFilter, DeviceSortElement, DeviceRelationsFindParams>

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function dogSchema(): T.Schema<Scalars> {
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

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Dog',
  AST,
  Scalars,
  DogCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDogDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type DogIdFields = T.IdFields<'Dog', AST>
export type DogInsert = T.Insert<'Dog', AST, Scalars>
export type DogInsertResult = T.GenerateModel<'Dog', AST, Scalars, 'relation'>
export type DogProjection = T.Projection<'Dog', AST>
export type DogUpdate = T.Update<'Dog', AST, Scalars>
export type DogFilter = T.Filter<'Dog', AST, Scalars>
export type DogSortElement = T.SortElement<'Dog', AST>
export type DogRelationsFindParams = T.RelationsFindParams<'Dog', AST, Scalars>
export type DogParams<P extends DogProjection> = T.Params<'Dog', AST, Scalars, P>
export type DogCachedTypes = T.CachedTypes<DogIdFields, DogInsert, DogInsertResult, DogProjection, DogUpdate, DogFilter, DogSortElement, DogRelationsFindParams>

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function embeddedUserSchema(): T.Schema<Scalars> {
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
export function embeddedUser2Schema(): T.Schema<Scalars> {
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
export function embeddedUser3Schema(): T.Schema<Scalars> {
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
export function embeddedUser4Schema(): T.Schema<Scalars> {
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
export function embeddedUser5Schema(): T.Schema<Scalars> {
  return {
    userId: {
      type: 'scalar',
      scalar: 'ID',
    },
  }
}
export function hotelSchema(): T.Schema<Scalars> {
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
export function mockedEntitySchema(): T.Schema<Scalars> {
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

type MockedEntityDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  'MockedEntity',
  AST,
  Scalars,
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
export type MockedEntityInsert = T.Insert<'MockedEntity', AST, Scalars>
export type MockedEntityInsertResult = T.GenerateModel<'MockedEntity', AST, Scalars, 'relation'>
export type MockedEntityProjection = T.Projection<'MockedEntity', AST>
export type MockedEntityUpdate = T.Update<'MockedEntity', AST, Scalars>
export type MockedEntityFilter = T.Filter<'MockedEntity', AST, Scalars>
export type MockedEntitySortElement = T.SortElement<'MockedEntity', AST>
export type MockedEntityRelationsFindParams = T.RelationsFindParams<'MockedEntity', AST, Scalars>
export type MockedEntityParams<P extends MockedEntityProjection> = T.Params<'MockedEntity', AST, Scalars, P>
export type MockedEntityCachedTypes = T.CachedTypes<
  MockedEntityIdFields,
  MockedEntityInsert,
  MockedEntityInsertResult,
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
export function organizationSchema(): T.Schema<Scalars> {
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

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Organization',
  AST,
  Scalars,
  OrganizationCachedTypes,
  MetadataType,
  OperationMetadataType,
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

export type OrganizationIdFields = T.IdFields<'Organization', AST>
export type OrganizationInsert = T.Insert<'Organization', AST, Scalars>
export type OrganizationInsertResult = T.GenerateModel<'Organization', AST, Scalars, 'relation'>
export type OrganizationProjection = T.Projection<'Organization', AST>
export type OrganizationUpdate = T.Update<'Organization', AST, Scalars>
export type OrganizationFilter = T.Filter<'Organization', AST, Scalars>
export type OrganizationSortElement = T.SortElement<'Organization', AST>
export type OrganizationRelationsFindParams = T.RelationsFindParams<'Organization', AST, Scalars>
export type OrganizationParams<P extends OrganizationProjection> = T.Params<'Organization', AST, Scalars, P>
export type OrganizationCachedTypes = T.CachedTypes<
  OrganizationIdFields,
  OrganizationInsert,
  OrganizationInsertResult,
  OrganizationProjection,
  OrganizationUpdate,
  OrganizationFilter,
  OrganizationSortElement,
  OrganizationRelationsFindParams
>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function postSchema(): T.Schema<Scalars> {
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

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Post',
  AST,
  Scalars,
  PostCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type PostIdFields = T.IdFields<'Post', AST>
export type PostInsert = T.Insert<'Post', AST, Scalars>
export type PostInsertResult = T.GenerateModel<'Post', AST, Scalars, 'relation'>
export type PostProjection = T.Projection<'Post', AST>
export type PostUpdate = T.Update<'Post', AST, Scalars>
export type PostFilter = T.Filter<'Post', AST, Scalars>
export type PostSortElement = T.SortElement<'Post', AST>
export type PostRelationsFindParams = T.RelationsFindParams<'Post', AST, Scalars>
export type PostParams<P extends PostProjection> = T.Params<'Post', AST, Scalars, P>
export type PostCachedTypes = T.CachedTypes<PostIdFields, PostInsert, PostInsertResult, PostProjection, PostUpdate, PostFilter, PostSortElement, PostRelationsFindParams>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function postMetadataSchema(): T.Schema<Scalars> {
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
export function userSchema(): T.Schema<Scalars> {
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
    embeddedUser: {
      type: 'embedded',
      schema: () => embeddedUser2Schema(),
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

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'User',
  AST,
  Scalars,
  UserCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
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
export function userCollectionSchema(): T.Schema<Scalars> {
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
export function usernamePasswordCredentialsSchema(): T.Schema<Scalars> {
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
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'mongo'>
  log?: T.LogInput<'Address' | 'Audit' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Hotel' | 'MockedEntity' | 'Organization' | 'Post' | 'User'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, Scalars, MetadataType> {
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

  private logger?: T.LogFunction<'Address' | 'Audit' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Hotel' | 'MockedEntity' | 'Organization' | 'Post' | 'User'>

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
              name: 'Address',
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
              name: 'Address',
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
              name: 'Audit',
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
              name: 'Audit',
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
              name: 'City',
              logger: this.logger,
            }) as unknown as CityDAO<MetadataType, OperationMetadataType>)
          : new CityDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.city,
              collection: db.collection('citys'),
              middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'City',
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
              name: 'DefaultFieldsEntity',
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
              name: 'DefaultFieldsEntity',
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
              name: 'Device',
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
              name: 'Device',
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
              name: 'Dog',
              logger: this.logger,
            }) as unknown as DogDAO<MetadataType, OperationMetadataType>)
          : new DogDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.dog,
              collection: db.collection('dogs'),
              middlewares: [...(this.overrides?.dog?.middlewares || []), ...(selectMiddleware('dog', this.middlewares) as T.DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Dog',
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
              name: 'Organization',
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
              name: 'Organization',
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
              name: 'Post',
              logger: this.logger,
            }) as unknown as PostDAO<MetadataType, OperationMetadataType>)
          : new PostDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.post,
              collection: db.collection('posts'),
              middlewares: [...(this.overrides?.post?.middlewares || []), ...(selectMiddleware('post', this.middlewares) as T.DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Post',
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
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, [
            'Coordinates',
            'Decimal',
            'JSON',
            'Live',
            'LocalizedString',
            'MongoID',
            'Password',
            'State',
            'ID',
            'String',
            'Boolean',
            'Int',
            'Float',
          ])
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
