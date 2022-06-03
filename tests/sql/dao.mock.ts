import * as T from '../../src'
import * as types from './models.mock'
import { Knex } from 'knex'

export type Scalars = {
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
}

export type AST = {
  Address: {
    fields: {
      cities: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'City'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  Another: {
    fields: { test: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' } }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Author: {
    fields: {
      books: {
        type: 'relation'
        relation: 'relationEntity'
        isList: true
        astName: 'Book'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  AuthorBook: {
    fields: {
      authorId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      bookId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  Book: {
    fields: {
      authors: {
        type: 'relation'
        relation: 'relationEntity'
        isList: true
        astName: 'Author'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
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
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
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
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
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
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
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
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  Friends: {
    fields: {
      from: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      to: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
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
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  User: {
    fields: {
      amount: { type: 'scalar'; isList: false; astName: 'Decimal'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      amounts: { type: 'scalar'; isList: true; astName: 'Decimal'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      bestFriend: {
        type: 'relation'
        relation: 'inner'
        isList: false
        astName: 'User'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      bestFriendId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
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
      dogs: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Dog'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      embeddedDog: { type: 'embedded'; isList: false; astName: 'Dog'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      friends: {
        type: 'relation'
        relation: 'relationEntity'
        isList: true
        astName: 'User'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      lastName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      live: { type: 'scalar'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      localization: { type: 'scalar'; isList: false; astName: 'Coordinates'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      title: { type: 'scalar'; isList: false; astName: 'LocalizedString'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawUpdate: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
      rawSorts: (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>
    }
  }
  UsernamePasswordCredentials: {
    fields: {
      another: { type: 'embedded'; isList: false; astName: 'Another'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
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

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Address',
  AST,
  Scalars,
  AddressCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
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

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function anotherSchema(): T.Schema<Scalars> {
  return {
    test: {
      type: 'scalar',
      scalar: 'String',
      alias: 't',
    },
  }
}
export function authorSchema(): T.Schema<Scalars> {
  return {
    books: {
      type: 'relation',
      relation: 'relationEntity',
      schema: () => bookSchema(),
      refThis: {
        refFrom: 'authorId',
        refTo: 'id',
      },
      refOther: {
        refFrom: 'bookId',
        refTo: 'id',
        dao: 'book',
      },
      relationEntity: { schema: () => authorBookSchema(), dao: 'authorBook' },
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

type AuthorDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Author',
  AST,
  Scalars,
  AuthorCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type AuthorDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<AuthorDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryAuthorDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuthorDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type AuthorIdFields = T.IdFields<'Author', AST>
export type AuthorInsert = T.Insert<'Author', AST, Scalars>
export type AuthorInsertResult = T.GenerateModel<'Author', AST, Scalars, 'relation'>
export type AuthorProjection = T.Projection<'Author', AST>
export type AuthorUpdate = T.Update<'Author', AST, Scalars>
export type AuthorFilter = T.Filter<'Author', AST, Scalars>
export type AuthorSortElement = T.SortElement<'Author', AST>
export type AuthorRelationsFindParams = T.RelationsFindParams<'Author', AST, Scalars>
export type AuthorParams<P extends AuthorProjection> = T.Params<'Author', AST, Scalars, P>
export type AuthorCachedTypes = T.CachedTypes<AuthorIdFields, AuthorInsert, AuthorInsertResult, AuthorProjection, AuthorUpdate, AuthorFilter, AuthorSortElement, AuthorRelationsFindParams>

export class AuthorDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AuthorDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Author', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Author', AST>, P2 extends T.Projection<'Author', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Author', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Author', AST>, P1, P2>
  }
  public constructor(params: AuthorDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorSchema(),
    })
  }
}

export class InMemoryAuthorDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuthorDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Author', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Author', AST>, P2 extends T.Projection<'Author', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Author', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Author', AST>, P1, P2>
  }
  public constructor(params: InMemoryAuthorDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorSchema(),
    })
  }
}
export function authorBookSchema(): T.Schema<Scalars> {
  return {
    authorId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    bookId: {
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
  }
}

type AuthorBookDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'AuthorBook',
  AST,
  Scalars,
  AuthorBookCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type AuthorBookDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryAuthorBookDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type AuthorBookIdFields = T.IdFields<'AuthorBook', AST>
export type AuthorBookInsert = T.Insert<'AuthorBook', AST, Scalars>
export type AuthorBookInsertResult = T.GenerateModel<'AuthorBook', AST, Scalars, 'relation'>
export type AuthorBookProjection = T.Projection<'AuthorBook', AST>
export type AuthorBookUpdate = T.Update<'AuthorBook', AST, Scalars>
export type AuthorBookFilter = T.Filter<'AuthorBook', AST, Scalars>
export type AuthorBookSortElement = T.SortElement<'AuthorBook', AST>
export type AuthorBookRelationsFindParams = T.RelationsFindParams<'AuthorBook', AST, Scalars>
export type AuthorBookParams<P extends AuthorBookProjection> = T.Params<'AuthorBook', AST, Scalars, P>
export type AuthorBookCachedTypes = T.CachedTypes<
  AuthorBookIdFields,
  AuthorBookInsert,
  AuthorBookInsertResult,
  AuthorBookProjection,
  AuthorBookUpdate,
  AuthorBookFilter,
  AuthorBookSortElement,
  AuthorBookRelationsFindParams
>

export class AuthorBookDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'AuthorBook', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'AuthorBook', AST>, P2 extends T.Projection<'AuthorBook', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'AuthorBook', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'AuthorBook', AST>, P1, P2>
  }
  public constructor(params: AuthorBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorBookSchema(),
    })
  }
}

export class InMemoryAuthorBookDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'AuthorBook', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'AuthorBook', AST>, P2 extends T.Projection<'AuthorBook', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'AuthorBook', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'AuthorBook', AST>, P1, P2>
  }
  public constructor(params: InMemoryAuthorBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorBookSchema(),
    })
  }
}
export function bookSchema(): T.Schema<Scalars> {
  return {
    authors: {
      type: 'relation',
      relation: 'relationEntity',
      schema: () => authorSchema(),
      refThis: {
        refFrom: 'bookId',
        refTo: 'id',
      },
      refOther: {
        refFrom: 'authorId',
        refTo: 'id',
        dao: 'author',
      },
      relationEntity: { schema: () => authorBookSchema(), dao: 'authorBook' },
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

type BookDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Book',
  AST,
  Scalars,
  BookCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type BookDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<BookDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryBookDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<BookDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type BookIdFields = T.IdFields<'Book', AST>
export type BookInsert = T.Insert<'Book', AST, Scalars>
export type BookInsertResult = T.GenerateModel<'Book', AST, Scalars, 'relation'>
export type BookProjection = T.Projection<'Book', AST>
export type BookUpdate = T.Update<'Book', AST, Scalars>
export type BookFilter = T.Filter<'Book', AST, Scalars>
export type BookSortElement = T.SortElement<'Book', AST>
export type BookRelationsFindParams = T.RelationsFindParams<'Book', AST, Scalars>
export type BookParams<P extends BookProjection> = T.Params<'Book', AST, Scalars, P>
export type BookCachedTypes = T.CachedTypes<BookIdFields, BookInsert, BookInsertResult, BookProjection, BookUpdate, BookFilter, BookSortElement, BookRelationsFindParams>

export class BookDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<BookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Book', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Book', AST>, P2 extends T.Projection<'Book', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Book', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Book', AST>, P1, P2>
  }
  public constructor(params: BookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bookSchema(),
    })
  }
}

export class InMemoryBookDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Book', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Book', AST>, P2 extends T.Projection<'Book', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Book', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Book', AST>, P1, P2>
  }
  public constructor(params: InMemoryBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bookSchema(),
    })
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

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'City',
  AST,
  Scalars,
  CityCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
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

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
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

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'DefaultFieldsEntity',
  AST,
  Scalars,
  DefaultFieldsEntityCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
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

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
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

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Device',
  AST,
  Scalars,
  DeviceCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
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

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
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

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Dog',
  AST,
  Scalars,
  DogCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
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

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function friendsSchema(): T.Schema<Scalars> {
  return {
    from: {
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
    to: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type FriendsDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Friends',
  AST,
  Scalars,
  FriendsCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type FriendsDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryFriendsDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type FriendsIdFields = T.IdFields<'Friends', AST>
export type FriendsInsert = T.Insert<'Friends', AST, Scalars>
export type FriendsInsertResult = T.GenerateModel<'Friends', AST, Scalars, 'relation'>
export type FriendsProjection = T.Projection<'Friends', AST>
export type FriendsUpdate = T.Update<'Friends', AST, Scalars>
export type FriendsFilter = T.Filter<'Friends', AST, Scalars>
export type FriendsSortElement = T.SortElement<'Friends', AST>
export type FriendsRelationsFindParams = T.RelationsFindParams<'Friends', AST, Scalars>
export type FriendsParams<P extends FriendsProjection> = T.Params<'Friends', AST, Scalars, P>
export type FriendsCachedTypes = T.CachedTypes<FriendsIdFields, FriendsInsert, FriendsInsertResult, FriendsProjection, FriendsUpdate, FriendsFilter, FriendsSortElement, FriendsRelationsFindParams>

export class FriendsDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Friends', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Friends', AST>, P2 extends T.Projection<'Friends', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Friends', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Friends', AST>, P1, P2>
  }
  public constructor(params: FriendsDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: friendsSchema(),
    })
  }
}

export class InMemoryFriendsDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Friends', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Friends', AST>, P2 extends T.Projection<'Friends', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Friends', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Friends', AST>, P1, P2>
  }
  public constructor(params: InMemoryFriendsDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: friendsSchema(),
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

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'Organization',
  AST,
  Scalars,
  OrganizationCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.KnexJsDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
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

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
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
export function userSchema(): T.Schema<Scalars> {
  return {
    amount: {
      type: 'scalar',
      scalar: 'Decimal',
      alias: 'value',
    },
    amounts: {
      type: 'scalar',
      scalar: 'Decimal',
      isListElementRequired: true,
      isList: true,
      alias: 'values',
    },
    bestFriend: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'bestFriendId',
      refTo: 'id',
      dao: 'user',
    },
    bestFriendId: {
      type: 'scalar',
      scalar: 'ID',
    },
    credentials: {
      type: 'embedded',
      schema: () => usernamePasswordCredentialsSchema(),
      alias: 'cred',
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
    embeddedDog: {
      type: 'embedded',
      schema: () => dogSchema(),
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
      alias: 'name',
    },
    friends: {
      type: 'relation',
      relation: 'relationEntity',
      schema: () => userSchema(),
      refThis: {
        refFrom: 'from',
        refTo: 'id',
      },
      refOther: {
        refFrom: 'to',
        refTo: 'id',
        dao: 'user',
      },
      relationEntity: { schema: () => friendsSchema(), dao: 'friends' },
      isList: true,
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
      alias: 'surname',
    },
    live: {
      type: 'scalar',
      scalar: 'Boolean',
      required: true,
      alias: 'active',
    },
    localization: {
      type: 'scalar',
      scalar: 'Coordinates',
      alias: 'l',
    },
    title: {
      type: 'scalar',
      scalar: 'LocalizedString',
      alias: 't',
    },
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  'User',
  AST,
  Scalars,
  UserCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
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

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
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
    another: {
      type: 'embedded',
      schema: () => anotherSchema(),
      alias: 'a',
    },
    password: {
      type: 'scalar',
      scalar: 'Password',
      required: true,
      alias: 'pass',
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
    author?: Pick<Partial<AuthorDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    authorBook?: Pick<Partial<AuthorBookDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    book?: Pick<Partial<BookDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    friends?: Pick<Partial<FriendsDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  }
  knex: Record<'default', Knex | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'knex'>
  log?: T.LogInput<'Address' | 'Author' | 'AuthorBook' | 'Book' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Friends' | 'Organization' | 'User'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, 'default', Scalars, MetadataType> {
  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined
  private _author: AuthorDAO<MetadataType, OperationMetadataType> | undefined
  private _authorBook: AuthorBookDAO<MetadataType, OperationMetadataType> | undefined
  private _book: BookDAO<MetadataType, OperationMetadataType> | undefined
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined
  private _defaultFieldsEntity: DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> | undefined
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined
  private _friends: FriendsDAO<MetadataType, OperationMetadataType> | undefined
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private knex: Record<'default', Knex | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'Address' | 'Author' | 'AuthorBook' | 'Book' | 'City' | 'DefaultFieldsEntity' | 'Device' | 'Dog' | 'Friends' | 'Organization' | 'User'>

  get address(): AddressDAO<MetadataType, OperationMetadataType> {
    if (!this._address) {
      const db = this.knex.default
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
              knex: db,
              tableName: 'addresses',
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
  get author(): AuthorDAO<MetadataType, OperationMetadataType> {
    if (!this._author) {
      const db = this.knex.default
      this._author =
        db === 'mock'
          ? (new InMemoryAuthorDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.author,
              middlewares: [
                ...(this.overrides?.author?.middlewares || []),
                ...(selectMiddleware('author', this.middlewares) as T.DAOMiddleware<AuthorDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Author',
              logger: this.logger,
            }) as unknown as AuthorDAO<MetadataType, OperationMetadataType>)
          : new AuthorDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.author,
              knex: db,
              tableName: 'authors',
              middlewares: [
                ...(this.overrides?.author?.middlewares || []),
                ...(selectMiddleware('author', this.middlewares) as T.DAOMiddleware<AuthorDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Author',
              logger: this.logger,
            })
    }
    return this._author
  }
  get authorBook(): AuthorBookDAO<MetadataType, OperationMetadataType> {
    if (!this._authorBook) {
      const db = this.knex.default
      this._authorBook =
        db === 'mock'
          ? (new InMemoryAuthorBookDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.authorBook,
              middlewares: [
                ...(this.overrides?.authorBook?.middlewares || []),
                ...(selectMiddleware('authorBook', this.middlewares) as T.DAOMiddleware<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'AuthorBook',
              logger: this.logger,
            }) as unknown as AuthorBookDAO<MetadataType, OperationMetadataType>)
          : new AuthorBookDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.authorBook,
              knex: db,
              tableName: 'authorBooks',
              middlewares: [
                ...(this.overrides?.authorBook?.middlewares || []),
                ...(selectMiddleware('authorBook', this.middlewares) as T.DAOMiddleware<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'AuthorBook',
              logger: this.logger,
            })
    }
    return this._authorBook
  }
  get book(): BookDAO<MetadataType, OperationMetadataType> {
    if (!this._book) {
      const db = this.knex.default
      this._book =
        db === 'mock'
          ? (new InMemoryBookDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.book,
              middlewares: [...(this.overrides?.book?.middlewares || []), ...(selectMiddleware('book', this.middlewares) as T.DAOMiddleware<BookDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Book',
              logger: this.logger,
            }) as unknown as BookDAO<MetadataType, OperationMetadataType>)
          : new BookDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.book,
              knex: db,
              tableName: 'books',
              middlewares: [...(this.overrides?.book?.middlewares || []), ...(selectMiddleware('book', this.middlewares) as T.DAOMiddleware<BookDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Book',
              logger: this.logger,
            })
    }
    return this._book
  }
  get city(): CityDAO<MetadataType, OperationMetadataType> {
    if (!this._city) {
      const db = this.knex.default
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
              knex: db,
              tableName: 'citys',
              middlewares: [...(this.overrides?.city?.middlewares || []), ...(selectMiddleware('city', this.middlewares) as T.DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'City',
              logger: this.logger,
            })
    }
    return this._city
  }
  get defaultFieldsEntity(): DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> {
    if (!this._defaultFieldsEntity) {
      const db = this.knex.default
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
              knex: db,
              tableName: 'defaultFieldsEntitys',
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
      const db = this.knex.default
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
              knex: db,
              tableName: 'devices',
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
      const db = this.knex.default
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
              knex: db,
              tableName: 'dogs',
              middlewares: [...(this.overrides?.dog?.middlewares || []), ...(selectMiddleware('dog', this.middlewares) as T.DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'Dog',
              logger: this.logger,
            })
    }
    return this._dog
  }
  get friends(): FriendsDAO<MetadataType, OperationMetadataType> {
    if (!this._friends) {
      const db = this.knex.default
      this._friends =
        db === 'mock'
          ? (new InMemoryFriendsDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.friends,
              middlewares: [
                ...(this.overrides?.friends?.middlewares || []),
                ...(selectMiddleware('friends', this.middlewares) as T.DAOMiddleware<FriendsDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Friends',
              logger: this.logger,
            }) as unknown as FriendsDAO<MetadataType, OperationMetadataType>)
          : new FriendsDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.friends,
              knex: db,
              tableName: 'friendss',
              middlewares: [
                ...(this.overrides?.friends?.middlewares || []),
                ...(selectMiddleware('friends', this.middlewares) as T.DAOMiddleware<FriendsDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Friends',
              logger: this.logger,
            })
    }
    return this._friends
  }
  get organization(): OrganizationDAO<MetadataType, OperationMetadataType> {
    if (!this._organization) {
      const db = this.knex.default
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
              knex: db,
              tableName: 'organizations',
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
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      const db = this.knex.default
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
              knex: db,
              tableName: 'users',
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
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float'])
        : undefined,
    })
    this.overrides = params.overrides
    this.knex = params.knex
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
      dbs: { knex: Record<'default', Knex | 'mock'> },
      entities: {
        address: Knex.QueryBuilder<any, unknown[]> | null
        author: Knex.QueryBuilder<any, unknown[]> | null
        authorBook: Knex.QueryBuilder<any, unknown[]> | null
        book: Knex.QueryBuilder<any, unknown[]> | null
        city: Knex.QueryBuilder<any, unknown[]> | null
        defaultFieldsEntity: Knex.QueryBuilder<any, unknown[]> | null
        device: Knex.QueryBuilder<any, unknown[]> | null
        dog: Knex.QueryBuilder<any, unknown[]> | null
        friends: Knex.QueryBuilder<any, unknown[]> | null
        organization: Knex.QueryBuilder<any, unknown[]> | null
        user: Knex.QueryBuilder<any, unknown[]> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { knex: this.knex },
      {
        address: this.knex.default === 'mock' ? null : this.knex.default.table('addresses'),
        author: this.knex.default === 'mock' ? null : this.knex.default.table('authors'),
        authorBook: this.knex.default === 'mock' ? null : this.knex.default.table('authorBooks'),
        book: this.knex.default === 'mock' ? null : this.knex.default.table('books'),
        city: this.knex.default === 'mock' ? null : this.knex.default.table('citys'),
        defaultFieldsEntity: this.knex.default === 'mock' ? null : this.knex.default.table('defaultFieldsEntitys'),
        device: this.knex.default === 'mock' ? null : this.knex.default.table('devices'),
        dog: this.knex.default === 'mock' ? null : this.knex.default.table('dogs'),
        friends: this.knex.default === 'mock' ? null : this.knex.default.table('friendss'),
        organization: this.knex.default === 'mock' ? null : this.knex.default.table('organizations'),
        user: this.knex.default === 'mock' ? null : this.knex.default.table('users'),
      },
    )
  }

  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }

  public async createTables(args: { typeMap?: Partial<Record<keyof Scalars, { singleType: string; arrayType?: string }>>; defaultType: { singleType: string; arrayType?: string } }): Promise<void> {
    this.address.createTable(args.typeMap ?? {}, args.defaultType)
    this.author.createTable(args.typeMap ?? {}, args.defaultType)
    this.authorBook.createTable(args.typeMap ?? {}, args.defaultType)
    this.book.createTable(args.typeMap ?? {}, args.defaultType)
    this.city.createTable(args.typeMap ?? {}, args.defaultType)
    this.defaultFieldsEntity.createTable(args.typeMap ?? {}, args.defaultType)
    this.device.createTable(args.typeMap ?? {}, args.defaultType)
    this.dog.createTable(args.typeMap ?? {}, args.defaultType)
    this.friends.createTable(args.typeMap ?? {}, args.defaultType)
    this.organization.createTable(args.typeMap ?? {}, args.defaultType)
    this.user.createTable(args.typeMap ?? {}, args.defaultType)
  }
}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  address: AddressDAOGenerics<MetadataType, OperationMetadataType>
  author: AuthorDAOGenerics<MetadataType, OperationMetadataType>
  authorBook: AuthorBookDAOGenerics<MetadataType, OperationMetadataType>
  book: BookDAOGenerics<MetadataType, OperationMetadataType>
  city: CityDAOGenerics<MetadataType, OperationMetadataType>
  defaultFieldsEntity: DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>
  device: DeviceDAOGenerics<MetadataType, OperationMetadataType>
  dog: DogDAOGenerics<MetadataType, OperationMetadataType>
  friends: FriendsDAOGenerics<MetadataType, OperationMetadataType>
  organization: OrganizationDAOGenerics<MetadataType, OperationMetadataType>
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
