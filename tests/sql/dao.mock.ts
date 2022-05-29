import * as T from '../../src'
import * as types from './models.mock'
import { Knex } from 'knex'

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
export type AddressRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type AddressRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressUpdate = {
  id?: types.Scalars['ID'] | null
}
export type AddressRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressInsert = {
  id?: null | types.Scalars['ID']
}

type AddressDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryAddressDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AddressDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
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

export function anotherSchema(): T.Schema<types.Scalars> {
  return {
    test: {
      type: 'scalar',
      scalar: 'String',
      alias: 't',
    },
  }
}

export type AnotherProjection = {
  test?: boolean
}
export type AnotherParam<P extends AnotherProjection> = T.ParamProjection<types.Another, AnotherProjection, P>

export type AnotherInsert = {
  test?: null | types.Scalars['String']
}

export type AuthorExcludedFields = never
export type AuthorRelationFields = 'books'

export function authorSchema(): T.Schema<types.Scalars> {
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

type AuthorFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type AuthorFilter = AuthorFilterFields & T.LogicalOperators<AuthorFilterFields | AuthorRawFilter>
export type AuthorRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorRelations = {
  books?: {
    filter?: BookFilter
    sorts?: BookSort[] | BookRawSort
    skip?: number
    limit?: number
    relations?: BookRelations
  }
}

export type AuthorProjection = {
  books?: BookProjection | boolean
  id?: boolean
}
export type AuthorParam<P extends AuthorProjection> = T.ParamProjection<types.Author, AuthorProjection, P>

export type AuthorSortKeys = 'id'
export type AuthorSort = Partial<Record<AuthorSortKeys, T.SortDirection>>
export type AuthorRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorUpdate = {
  id?: types.Scalars['ID'] | null
}
export type AuthorRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorInsert = {
  id?: null | types.Scalars['ID']
}

type AuthorDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.Author,
  'id',
  'ID',
  AuthorFilter,
  AuthorRawFilter,
  AuthorRelations,
  AuthorProjection,
  AuthorSort,
  AuthorRawSort,
  AuthorInsert,
  AuthorUpdate,
  AuthorRawUpdate,
  AuthorExcludedFields,
  AuthorRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'author',
  EntityManager<MetadataType, OperationMetadataType>
>
export type AuthorDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<AuthorDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryAuthorDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<AuthorDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class AuthorDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AuthorDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuthorProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorProjection, P2 extends AuthorProjection>(p1: P1, p2: P2): T.SelectProjection<AuthorProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuthorProjection, P1, P2>
  }

  public constructor(params: AuthorDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorSchema(),
    })
  }
}

export class InMemoryAuthorDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuthorDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuthorProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorProjection, P2 extends AuthorProjection>(p1: P1, p2: P2): T.SelectProjection<AuthorProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuthorProjection, P1, P2>
  }

  public constructor(params: InMemoryAuthorDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorSchema(),
    })
  }
}

export type AuthorBookExcludedFields = never
export type AuthorBookRelationFields = never

export function authorBookSchema(): T.Schema<types.Scalars> {
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

type AuthorBookFilterFields = {
  authorId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  bookId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type AuthorBookFilter = AuthorBookFilterFields & T.LogicalOperators<AuthorBookFilterFields | AuthorBookRawFilter>
export type AuthorBookRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookRelations = Record<never, string>

export type AuthorBookProjection = {
  authorId?: boolean
  bookId?: boolean
  id?: boolean
}
export type AuthorBookParam<P extends AuthorBookProjection> = T.ParamProjection<types.AuthorBook, AuthorBookProjection, P>

export type AuthorBookSortKeys = 'authorId' | 'bookId' | 'id'
export type AuthorBookSort = Partial<Record<AuthorBookSortKeys, T.SortDirection>>
export type AuthorBookRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookUpdate = {
  authorId?: types.Scalars['ID'] | null
  bookId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
}
export type AuthorBookRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookInsert = {
  authorId: types.Scalars['ID']
  bookId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
}

type AuthorBookDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.AuthorBook,
  'id',
  'ID',
  AuthorBookFilter,
  AuthorBookRawFilter,
  AuthorBookRelations,
  AuthorBookProjection,
  AuthorBookSort,
  AuthorBookRawSort,
  AuthorBookInsert,
  AuthorBookUpdate,
  AuthorBookRawUpdate,
  AuthorBookExcludedFields,
  AuthorBookRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'authorBook',
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

export class AuthorBookDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuthorBookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorBookProjection, P2 extends AuthorBookProjection>(p1: P1, p2: P2): T.SelectProjection<AuthorBookProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuthorBookProjection, P1, P2>
  }

  public constructor(params: AuthorBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorBookSchema(),
    })
  }
}

export class InMemoryAuthorBookDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends AuthorBookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorBookProjection, P2 extends AuthorBookProjection>(p1: P1, p2: P2): T.SelectProjection<AuthorBookProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<AuthorBookProjection, P1, P2>
  }

  public constructor(params: InMemoryAuthorBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: authorBookSchema(),
    })
  }
}

export type BookExcludedFields = never
export type BookRelationFields = 'authors'

export function bookSchema(): T.Schema<types.Scalars> {
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

type BookFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type BookFilter = BookFilterFields & T.LogicalOperators<BookFilterFields | BookRawFilter>
export type BookRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type BookRelations = {
  authors?: {
    filter?: AuthorFilter
    sorts?: AuthorSort[] | AuthorRawSort
    skip?: number
    limit?: number
    relations?: AuthorRelations
  }
}

export type BookProjection = {
  authors?: AuthorProjection | boolean
  id?: boolean
}
export type BookParam<P extends BookProjection> = T.ParamProjection<types.Book, BookProjection, P>

export type BookSortKeys = 'id'
export type BookSort = Partial<Record<BookSortKeys, T.SortDirection>>
export type BookRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type BookUpdate = {
  id?: types.Scalars['ID'] | null
}
export type BookRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type BookInsert = {
  id?: null | types.Scalars['ID']
}

type BookDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.Book,
  'id',
  'ID',
  BookFilter,
  BookRawFilter,
  BookRelations,
  BookProjection,
  BookSort,
  BookRawSort,
  BookInsert,
  BookUpdate,
  BookRawUpdate,
  BookExcludedFields,
  BookRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'book',
  EntityManager<MetadataType, OperationMetadataType>
>
export type BookDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<BookDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryBookDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<BookDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class BookDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<BookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends BookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends BookProjection, P2 extends BookProjection>(p1: P1, p2: P2): T.SelectProjection<BookProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<BookProjection, P1, P2>
  }

  public constructor(params: BookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bookSchema(),
    })
  }
}

export class InMemoryBookDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<BookDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends BookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends BookProjection, P2 extends BookProjection>(p1: P1, p2: P2): T.SelectProjection<BookProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<BookProjection, P1, P2>
  }

  public constructor(params: InMemoryBookDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: bookSchema(),
    })
  }
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
export type CityRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type CityRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityUpdate = {
  addressId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
}
export type CityRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityInsert = {
  addressId: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
}

type CityDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryCityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class CityDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
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
export type DefaultFieldsEntityRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type DefaultFieldsEntityRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DefaultFieldsEntityUpdate = {
  creationDate?: types.Scalars['Int'] | null
  id?: types.Scalars['ID'] | null
  live?: types.Scalars['Live'] | null
  name?: types.Scalars['String'] | null
  opt1?: types.Scalars['Live'] | null
  opt2?: types.Scalars['Live'] | null
}
export type DefaultFieldsEntityRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DefaultFieldsEntityInsert = {
  creationDate?: null | types.Scalars['Int']
  id: types.Scalars['ID']
  live?: null | types.Scalars['Live']
  name: types.Scalars['String']
  opt1?: null | types.Scalars['Live']
  opt2?: null | types.Scalars['Live']
}

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
  T.KnexJsDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryDefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
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
export type DeviceRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type DeviceRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
}
export type DeviceRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  userId?: null | types.Scalars['ID']
}

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDeviceDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DeviceDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
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
export type DogRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type DogRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogUpdate = {
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  ownerId?: types.Scalars['ID'] | null
}
export type DogRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogInsert = {
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  ownerId: types.Scalars['ID']
}

type DogDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryDogDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class DogDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type FriendsExcludedFields = never
export type FriendsRelationFields = never

export function friendsSchema(): T.Schema<types.Scalars> {
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

type FriendsFilterFields = {
  from?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  to?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type FriendsFilter = FriendsFilterFields & T.LogicalOperators<FriendsFilterFields | FriendsRawFilter>
export type FriendsRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsRelations = Record<never, string>

export type FriendsProjection = {
  from?: boolean
  id?: boolean
  to?: boolean
}
export type FriendsParam<P extends FriendsProjection> = T.ParamProjection<types.Friends, FriendsProjection, P>

export type FriendsSortKeys = 'from' | 'id' | 'to'
export type FriendsSort = Partial<Record<FriendsSortKeys, T.SortDirection>>
export type FriendsRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsUpdate = {
  from?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  to?: types.Scalars['ID'] | null
}
export type FriendsRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsInsert = {
  from: types.Scalars['ID']
  id?: null | types.Scalars['ID']
  to: types.Scalars['ID']
}

type FriendsDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
  types.Friends,
  'id',
  'ID',
  FriendsFilter,
  FriendsRawFilter,
  FriendsRelations,
  FriendsProjection,
  FriendsSort,
  FriendsRawSort,
  FriendsInsert,
  FriendsUpdate,
  FriendsRawUpdate,
  FriendsExcludedFields,
  FriendsRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'friends',
  EntityManager<MetadataType, OperationMetadataType>
>
export type FriendsDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryFriendsDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class FriendsDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends FriendsProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends FriendsProjection, P2 extends FriendsProjection>(p1: P1, p2: P2): T.SelectProjection<FriendsProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<FriendsProjection, P1, P2>
  }

  public constructor(params: FriendsDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: friendsSchema(),
    })
  }
}

export class InMemoryFriendsDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends FriendsProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends FriendsProjection, P2 extends FriendsProjection>(p1: P1, p2: P2): T.SelectProjection<FriendsProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<FriendsProjection, P1, P2>
  }

  public constructor(params: InMemoryFriendsDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: friendsSchema(),
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
export type OrganizationRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
export type OrganizationRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationUpdate = {
  address?: AddressInsert | null
  'address.id'?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  vatNumber?: types.Scalars['String'] | null
}
export type OrganizationRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationInsert = {
  address?: null | AddressInsert
  id?: null | types.Scalars['ID']
  name: types.Scalars['String']
  vatNumber?: null | types.Scalars['String']
}

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
  T.KnexJsDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryOrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
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

export type UserExcludedFields = never
export type UserRelationFields = 'bestFriend' | 'dogs' | 'friends'

export function userSchema(): T.Schema<types.Scalars> {
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

type UserFilterFields = {
  amount?: types.Scalars['Decimal'] | null | T.EqualityOperators<types.Scalars['Decimal']> | T.ElementOperators
  amounts?: types.Scalars['Decimal'][] | null | T.EqualityOperators<types.Scalars['Decimal'][]> | T.ElementOperators
  bestFriendId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'credentials.another.test'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  'credentials.password'?: types.Scalars['Password'] | null | T.EqualityOperators<types.Scalars['Password']> | T.ElementOperators
  'credentials.username'?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  firstName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  lastName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  live?: types.Scalars['Boolean'] | null | T.EqualityOperators<types.Scalars['Boolean']> | T.ElementOperators
  localization?: types.Scalars['Coordinates'] | null | T.EqualityOperators<types.Scalars['Coordinates']> | T.ElementOperators
  title?: types.Scalars['LocalizedString'] | null | T.EqualityOperators<types.Scalars['LocalizedString']> | T.ElementOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

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
  bestFriend?: UserProjection | boolean
  bestFriendId?: boolean
  credentials?:
    | {
        another?:
          | {
              test?: boolean
            }
          | boolean
        password?: boolean
        username?: boolean
      }
    | boolean
  dogs?: DogProjection | boolean
  firstName?: boolean
  friends?: UserProjection | boolean
  id?: boolean
  lastName?: boolean
  live?: boolean
  localization?: boolean
  title?: boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys =
  | 'amount'
  | 'amounts'
  | 'bestFriendId'
  | 'credentials.another.test'
  | 'credentials.password'
  | 'credentials.username'
  | 'firstName'
  | 'id'
  | 'lastName'
  | 'live'
  | 'localization'
  | 'title'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserUpdate = {
  amount?: types.Scalars['Decimal'] | null
  amounts?: types.Scalars['Decimal'][] | null
  bestFriendId?: types.Scalars['ID'] | null
  credentials?: UsernamePasswordCredentialsInsert | null
  'credentials.another'?: AnotherInsert | null
  'credentials.another.test'?: types.Scalars['String'] | null
  'credentials.password'?: types.Scalars['Password'] | null
  'credentials.username'?: types.Scalars['String'] | null
  firstName?: types.Scalars['String'] | null
  id?: types.Scalars['ID'] | null
  lastName?: types.Scalars['String'] | null
  live?: types.Scalars['Boolean'] | null
  localization?: types.Scalars['Coordinates'] | null
  title?: types.Scalars['LocalizedString'] | null
}
export type UserRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserInsert = {
  amount?: null | types.Scalars['Decimal']
  amounts?: null | types.Scalars['Decimal'][]
  bestFriendId?: null | types.Scalars['ID']
  credentials?: null | UsernamePasswordCredentialsInsert
  firstName?: null | types.Scalars['String']
  id?: null | types.Scalars['ID']
  lastName?: null | types.Scalars['String']
  live: types.Scalars['Boolean']
  localization?: null | types.Scalars['Coordinates']
  title?: null | types.Scalars['LocalizedString']
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.KnexJsDAOGenerics<
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
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractKnexJsDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
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

export function usernamePasswordCredentialsSchema(): T.Schema<types.Scalars> {
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

export type UsernamePasswordCredentialsProjection = {
  another?:
    | {
        test?: boolean
      }
    | boolean
  password?: boolean
  username?: boolean
}
export type UsernamePasswordCredentialsParam<P extends UsernamePasswordCredentialsProjection> = T.ParamProjection<types.UsernamePasswordCredentials, UsernamePasswordCredentialsProjection, P>

export type UsernamePasswordCredentialsInsert = {
  another?: null | AnotherInsert
  password: types.Scalars['Password']
  username: types.Scalars['String']
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
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>
  log?: T.LogInput<'address' | 'author' | 'authorBook' | 'book' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'friends' | 'organization' | 'user'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, 'default', types.Scalars, MetadataType> {
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

  private logger?: T.LogFunction<'address' | 'author' | 'authorBook' | 'book' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'friends' | 'organization' | 'user'>

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
              name: 'address',
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
              name: 'address',
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
              name: 'author',
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
              name: 'author',
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
              name: 'authorBook',
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
              name: 'authorBook',
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
              name: 'book',
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
              name: 'book',
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
              name: 'city',
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
              name: 'city',
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
              name: 'defaultFieldsEntity',
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
              name: 'defaultFieldsEntity',
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
              name: 'device',
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
              name: 'device',
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
              name: 'dog',
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
              name: 'dog',
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
              name: 'friends',
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
              name: 'friends',
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
              name: 'organization',
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
              name: 'organization',
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
              name: 'user',
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

  public async createTables(args: {
    typeMap?: Partial<Record<keyof types.Scalars, { singleType: string; arrayType?: string }>>
    defaultType: { singleType: string; arrayType?: string }
  }): Promise<void> {
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
