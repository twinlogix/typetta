import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger, ParamProjection, DAOGenerics, CRUDPermission, DAOContextSecurtyPolicy, createSecurityPolicyMiddlewares, SelectProjection, mergeProjections, AbstractInMemoryDAO, InMemoryDAOGenerics, InMemoryDAOParams } from '../../src'
import * as types from './models.mock'
import { KnexJsDAOGenerics, KnexJsDAOParams, AbstractKnexJsDAO } from '../../src'
import { Knex } from 'knex'

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export type AddressExcludedFields = never
export type AddressRelationFields = 'cities'

export function addressSchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true
    }
  }
}

type AddressFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type AddressFilter = AddressFilterFields & LogicalOperators<AddressFilterFields | AddressRawFilter>
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
  cities?: CityProjection | boolean,
  id?: boolean,
}
export type AddressParam<P extends AddressProjection> = ParamProjection<types.Address, AddressProjection, P>

export type AddressSortKeys = 'id'
export type AddressSort = OneKey<AddressSortKeys, SortDirection>
export type AddressRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressUpdate = {
  'id'?: types.Scalars['ID']
}
export type AddressRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AddressInsert = {
  id?: types.Scalars['ID'],
}

type AddressDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressRawFilter, AddressRelations, AddressProjection, AddressSort, AddressRawSort, AddressInsert, AddressUpdate, AddressRawUpdate, AddressExcludedFields, AddressRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'address', DAOContext<MetadataType, OperationMetadataType>>
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class AddressDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends AddressProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AddressProjection, P2 extends AddressProjection>(p1: P1, p2: P2): SelectProjection<AddressProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<AddressProjection, P1, P2>
  }
  
  public constructor(params: AddressDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: addressSchema(), 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------------- ANOTHER ------------------------------------
//--------------------------------------------------------------------------------

export function anotherSchema(): Schema<types.Scalars> {
  return {
    'test': {
      scalar: 'String', 
      alias: 't'
    }
  }
}

export type AnotherProjection = {
  test?: boolean,
}
export type AnotherParam<P extends AnotherProjection> = ParamProjection<types.Another, AnotherProjection, P>



//--------------------------------------------------------------------------------
//------------------------------------ AUTHOR ------------------------------------
//--------------------------------------------------------------------------------

export type AuthorExcludedFields = never
export type AuthorRelationFields = 'books'

export function authorSchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true
    }
  }
}

type AuthorFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type AuthorFilter = AuthorFilterFields & LogicalOperators<AuthorFilterFields | AuthorRawFilter>
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
  books?: BookProjection | boolean,
  id?: boolean,
}
export type AuthorParam<P extends AuthorProjection> = ParamProjection<types.Author, AuthorProjection, P>

export type AuthorSortKeys = 'id'
export type AuthorSort = OneKey<AuthorSortKeys, SortDirection>
export type AuthorRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorUpdate = {
  'id'?: types.Scalars['ID']
}
export type AuthorRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorInsert = {
  id?: types.Scalars['ID'],
}

type AuthorDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Author, 'id', 'ID', 'generator', AuthorFilter, AuthorRawFilter, AuthorRelations, AuthorProjection, AuthorSort, AuthorRawSort, AuthorInsert, AuthorUpdate, AuthorRawUpdate, AuthorExcludedFields, AuthorRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'author', DAOContext<MetadataType, OperationMetadataType>>
export type AuthorDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<AuthorDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class AuthorDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<AuthorDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends AuthorProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorProjection, P2 extends AuthorProjection>(p1: P1, p2: P2): SelectProjection<AuthorProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<AuthorProjection, P1, P2>
  }
  
  public constructor(params: AuthorDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: authorSchema(), 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'relation', field: 'books', relationDao: 'authorBook', entityDao: 'book', refThis: { refFrom: 'authorId', refTo: 'id' }, refOther: { refFrom: 'bookId', refTo: 'id' }, required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//---------------------------------- AUTHORBOOK ----------------------------------
//--------------------------------------------------------------------------------

export type AuthorBookExcludedFields = never
export type AuthorBookRelationFields = never

export function authorBookSchema(): Schema<types.Scalars> {
  return {
    'authorId': {
      scalar: 'ID', 
      required: true
    },
    'bookId': {
      scalar: 'ID', 
      required: true
    },
    'id': {
      scalar: 'ID', 
      required: true
    }
  }
}

type AuthorBookFilterFields = {
  'authorId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'bookId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type AuthorBookFilter = AuthorBookFilterFields & LogicalOperators<AuthorBookFilterFields | AuthorBookRawFilter>
export type AuthorBookRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookRelations = Record<never, string>

export type AuthorBookProjection = {
  authorId?: boolean,
  bookId?: boolean,
  id?: boolean,
}
export type AuthorBookParam<P extends AuthorBookProjection> = ParamProjection<types.AuthorBook, AuthorBookProjection, P>

export type AuthorBookSortKeys = 'authorId' | 'bookId' | 'id'
export type AuthorBookSort = OneKey<AuthorBookSortKeys, SortDirection>
export type AuthorBookRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookUpdate = {
  'authorId'?: types.Scalars['ID'],
  'bookId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID']
}
export type AuthorBookRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type AuthorBookInsert = {
  authorId: types.Scalars['ID'],
  bookId: types.Scalars['ID'],
  id?: types.Scalars['ID'],
}

type AuthorBookDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.AuthorBook, 'id', 'ID', 'generator', AuthorBookFilter, AuthorBookRawFilter, AuthorBookRelations, AuthorBookProjection, AuthorBookSort, AuthorBookRawSort, AuthorBookInsert, AuthorBookUpdate, AuthorBookRawUpdate, AuthorBookExcludedFields, AuthorBookRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'authorBook', DAOContext<MetadataType, OperationMetadataType>>
export type AuthorBookDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class AuthorBookDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends AuthorBookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends AuthorBookProjection, P2 extends AuthorBookProjection>(p1: P1, p2: P2): SelectProjection<AuthorBookProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<AuthorBookProjection, P1, P2>
  }
  
  public constructor(params: AuthorBookDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: authorBookSchema(), 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- BOOK -------------------------------------
//--------------------------------------------------------------------------------

export type BookExcludedFields = never
export type BookRelationFields = 'authors'

export function bookSchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true
    }
  }
}

type BookFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type BookFilter = BookFilterFields & LogicalOperators<BookFilterFields | BookRawFilter>
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
  authors?: AuthorProjection | boolean,
  id?: boolean,
}
export type BookParam<P extends BookProjection> = ParamProjection<types.Book, BookProjection, P>

export type BookSortKeys = 'id'
export type BookSort = OneKey<BookSortKeys, SortDirection>
export type BookRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type BookUpdate = {
  'id'?: types.Scalars['ID']
}
export type BookRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type BookInsert = {
  id?: types.Scalars['ID'],
}

type BookDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Book, 'id', 'ID', 'generator', BookFilter, BookRawFilter, BookRelations, BookProjection, BookSort, BookRawSort, BookInsert, BookUpdate, BookRawUpdate, BookExcludedFields, BookRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'book', DAOContext<MetadataType, OperationMetadataType>>
export type BookDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<BookDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class BookDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<BookDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends BookProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends BookProjection, P2 extends BookProjection>(p1: P1, p2: P2): SelectProjection<BookProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<BookProjection, P1, P2>
  }
  
  public constructor(params: BookDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: bookSchema(), 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'relation', field: 'authors', relationDao: 'authorBook', entityDao: 'author', refThis: { refFrom: 'bookId', refTo: 'id' }, refOther: { refFrom: 'authorId', refTo: 'id' }, required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- CITY -------------------------------------
//--------------------------------------------------------------------------------

export type CityExcludedFields = 'computedAddressName' | 'computedName'
export type CityRelationFields = never

export function citySchema(): Schema<types.Scalars> {
  return {
    'addressId': {
      scalar: 'ID', 
      required: true
    },
    'id': {
      scalar: 'ID', 
      required: true
    },
    'name': {
      scalar: 'String', 
      required: true
    }
  }
}

type CityFilterFields = {
  'addressId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
}
export type CityFilter = CityFilterFields & LogicalOperators<CityFilterFields | CityRawFilter>
export type CityRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityRelations = Record<never, string>

export type CityProjection = {
  addressId?: boolean,
  computedAddressName?: boolean,
  computedName?: boolean,
  id?: boolean,
  name?: boolean,
}
export type CityParam<P extends CityProjection> = ParamProjection<types.City, CityProjection, P>

export type CitySortKeys = 'addressId' | 'id' | 'name'
export type CitySort = OneKey<CitySortKeys, SortDirection>
export type CityRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityUpdate = {
  'addressId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String']
}
export type CityRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type CityInsert = {
  addressId: types.Scalars['ID'],
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
}

type CityDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityRawFilter, CityRelations, CityProjection, CitySort, CityRawSort, CityInsert, CityUpdate, CityRawUpdate, CityExcludedFields, CityRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'city', DAOContext<MetadataType, OperationMetadataType>>
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class CityDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends CityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends CityProjection, P2 extends CityProjection>(p1: P1, p2: P2): SelectProjection<CityProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<CityProjection, P1, P2>
  }
  
  public constructor(params: CityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: citySchema(), 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------- DEFAULTFIELDSENTITY ------------------------------
//--------------------------------------------------------------------------------

export type DefaultFieldsEntityExcludedFields = never
export type DefaultFieldsEntityRelationFields = never

export function defaultFieldsEntitySchema(): Schema<types.Scalars> {
  return {
    'creationDate': {
      scalar: 'Int', 
      required: true, 
      defaultGenerationStrategy: 'middleware'
    },
    'id': {
      scalar: 'ID', 
      required: true
    },
    'live': {
      scalar: 'Live', 
      required: true, 
      defaultGenerationStrategy: 'generator'
    },
    'name': {
      scalar: 'String', 
      required: true
    },
    'opt1': {
      scalar: 'Live', 
      defaultGenerationStrategy: 'middleware'
    },
    'opt2': {
      scalar: 'Live', 
      defaultGenerationStrategy: 'generator'
    }
  }
}

type DefaultFieldsEntityFilterFields = {
  'creationDate'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'live'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'opt1'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators,
  'opt2'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators
}
export type DefaultFieldsEntityFilter = DefaultFieldsEntityFilterFields & LogicalOperators<DefaultFieldsEntityFilterFields | DefaultFieldsEntityRawFilter>
export type DefaultFieldsEntityRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DefaultFieldsEntityRelations = Record<never, string>

export type DefaultFieldsEntityProjection = {
  creationDate?: boolean,
  id?: boolean,
  live?: boolean,
  name?: boolean,
  opt1?: boolean,
  opt2?: boolean,
}
export type DefaultFieldsEntityParam<P extends DefaultFieldsEntityProjection> = ParamProjection<types.DefaultFieldsEntity, DefaultFieldsEntityProjection, P>

export type DefaultFieldsEntitySortKeys = 'creationDate' | 'id' | 'live' | 'name' | 'opt1' | 'opt2'
export type DefaultFieldsEntitySort = OneKey<DefaultFieldsEntitySortKeys, SortDirection>
export type DefaultFieldsEntityRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DefaultFieldsEntityUpdate = {
  'creationDate'?: types.Scalars['Int'],
  'id'?: types.Scalars['ID'],
  'live'?: types.Scalars['Live'],
  'name'?: types.Scalars['String'],
  'opt1'?: types.Scalars['Live'] | null,
  'opt2'?: types.Scalars['Live'] | null
}
export type DefaultFieldsEntityRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DefaultFieldsEntityInsert = {
  creationDate?: types.Scalars['Int'],
  id: types.Scalars['ID'],
  live?: types.Scalars['Live'],
  name: types.Scalars['String'],
  opt1?: types.Scalars['Live'],
  opt2?: types.Scalars['Live'],
}

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.DefaultFieldsEntity, 'id', 'ID', 'user', DefaultFieldsEntityFilter, DefaultFieldsEntityRawFilter, DefaultFieldsEntityRelations, DefaultFieldsEntityProjection, DefaultFieldsEntitySort, DefaultFieldsEntityRawSort, DefaultFieldsEntityInsert, DefaultFieldsEntityUpdate, DefaultFieldsEntityRawUpdate, DefaultFieldsEntityExcludedFields, DefaultFieldsEntityRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'defaultFieldsEntity', DAOContext<MetadataType, OperationMetadataType>>
export type DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends DefaultFieldsEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DefaultFieldsEntityProjection, P2 extends DefaultFieldsEntityProjection>(p1: P1, p2: P2): SelectProjection<DefaultFieldsEntityProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<DefaultFieldsEntityProjection, P1, P2>
  }
  
  public constructor(params: DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: defaultFieldsEntitySchema(), 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'user', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------ DEVICE ------------------------------------
//--------------------------------------------------------------------------------

export type DeviceExcludedFields = never
export type DeviceRelationFields = 'user'

export function deviceSchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true
    },
    'name': {
      scalar: 'String', 
      required: true
    },
    'userId': {
      scalar: 'ID'
    }
  }
}

type DeviceFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type DeviceFilter = DeviceFilterFields & LogicalOperators<DeviceFilterFields | DeviceRawFilter>
export type DeviceRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceRelations = Record<never, string>

export type DeviceProjection = {
  id?: boolean,
  name?: boolean,
  user?: UserProjection | boolean,
  userId?: boolean,
}
export type DeviceParam<P extends DeviceProjection> = ParamProjection<types.Device, DeviceProjection, P>

export type DeviceSortKeys = 'id' | 'name' | 'userId'
export type DeviceSort = OneKey<DeviceSortKeys, SortDirection>
export type DeviceRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'userId'?: types.Scalars['ID'] | null
}
export type DeviceRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DeviceInsert = {
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  userId?: types.Scalars['ID'],
}

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceRawFilter, DeviceRelations, DeviceProjection, DeviceSort, DeviceRawSort, DeviceInsert, DeviceUpdate, DeviceRawUpdate, DeviceExcludedFields, DeviceRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'device', DAOContext<MetadataType, OperationMetadataType>>
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DeviceDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends DeviceProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DeviceProjection, P2 extends DeviceProjection>(p1: P1, p2: P2): SelectProjection<DeviceProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<DeviceProjection, P1, P2>
  }
  
  public constructor(params: DeviceDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: deviceSchema(), 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'user', refFrom: 'userId', refTo: 'id', dao: 'user', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- DOG --------------------------------------
//--------------------------------------------------------------------------------

export type DogExcludedFields = never
export type DogRelationFields = 'owner'

export function dogSchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true
    },
    'name': {
      scalar: 'String', 
      required: true
    },
    'ownerId': {
      scalar: 'ID', 
      required: true
    }
  }
}

type DogFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'ownerId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type DogFilter = DogFilterFields & LogicalOperators<DogFilterFields | DogRawFilter>
export type DogRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogRelations = Record<never, string>

export type DogProjection = {
  id?: boolean,
  name?: boolean,
  owner?: UserProjection | boolean,
  ownerId?: boolean,
}
export type DogParam<P extends DogProjection> = ParamProjection<types.Dog, DogProjection, P>

export type DogSortKeys = 'id' | 'name' | 'ownerId'
export type DogSort = OneKey<DogSortKeys, SortDirection>
export type DogRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'ownerId'?: types.Scalars['ID']
}
export type DogRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type DogInsert = {
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  ownerId: types.Scalars['ID'],
}

type DogDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Dog, 'id', 'ID', 'generator', DogFilter, DogRawFilter, DogRelations, DogProjection, DogSort, DogRawSort, DogInsert, DogUpdate, DogRawUpdate, DogExcludedFields, DogRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'dog', DAOContext<MetadataType, OperationMetadataType>>
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DogDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends DogProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends DogProjection, P2 extends DogProjection>(p1: P1, p2: P2): SelectProjection<DogProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<DogProjection, P1, P2>
  }
  
  public constructor(params: DogDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: dogSchema(), 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'owner', refFrom: 'ownerId', refTo: 'id', dao: 'user', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------------- FRIENDS ------------------------------------
//--------------------------------------------------------------------------------

export type FriendsExcludedFields = never
export type FriendsRelationFields = never

export function friendsSchema(): Schema<types.Scalars> {
  return {
    'from': {
      scalar: 'ID', 
      required: true
    },
    'id': {
      scalar: 'ID', 
      required: true
    },
    'to': {
      scalar: 'ID', 
      required: true
    }
  }
}

type FriendsFilterFields = {
  'from'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'to'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
}
export type FriendsFilter = FriendsFilterFields & LogicalOperators<FriendsFilterFields | FriendsRawFilter>
export type FriendsRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsRelations = Record<never, string>

export type FriendsProjection = {
  from?: boolean,
  id?: boolean,
  to?: boolean,
}
export type FriendsParam<P extends FriendsProjection> = ParamProjection<types.Friends, FriendsProjection, P>

export type FriendsSortKeys = 'from' | 'id' | 'to'
export type FriendsSort = OneKey<FriendsSortKeys, SortDirection>
export type FriendsRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsUpdate = {
  'from'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'to'?: types.Scalars['ID']
}
export type FriendsRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type FriendsInsert = {
  from: types.Scalars['ID'],
  id?: types.Scalars['ID'],
  to: types.Scalars['ID'],
}

type FriendsDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Friends, 'id', 'ID', 'generator', FriendsFilter, FriendsRawFilter, FriendsRelations, FriendsProjection, FriendsSort, FriendsRawSort, FriendsInsert, FriendsUpdate, FriendsRawUpdate, FriendsExcludedFields, FriendsRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'friends', DAOContext<MetadataType, OperationMetadataType>>
export type FriendsDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<FriendsDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class FriendsDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<FriendsDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends FriendsProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends FriendsProjection, P2 extends FriendsProjection>(p1: P1, p2: P2): SelectProjection<FriendsProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<FriendsProjection, P1, P2>
  }
  
  public constructor(params: FriendsDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: friendsSchema(), 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//--------------------------------- ORGANIZATION ---------------------------------
//--------------------------------------------------------------------------------

export type OrganizationExcludedFields = 'computedName'
export type OrganizationRelationFields = never

export function organizationSchema(): Schema<types.Scalars> {
  return {
    'address': { embedded: addressSchema() },
    'id': {
      scalar: 'ID', 
      required: true
    },
    'name': {
      scalar: 'String', 
      required: true
    },
    'vatNumber': {
      scalar: 'String'
    }
  }
}

type OrganizationFilterFields = {
  'address.id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'vatNumber'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
}
export type OrganizationFilter = OrganizationFilterFields & LogicalOperators<OrganizationFilterFields | OrganizationRawFilter>
export type OrganizationRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationRelations = Record<never, string>

export type OrganizationProjection = {
  address?: {
    cities?: CityProjection | boolean,
    id?: boolean,
  } | boolean,
  computedName?: boolean,
  id?: boolean,
  name?: boolean,
  vatNumber?: boolean,
}
export type OrganizationParam<P extends OrganizationProjection> = ParamProjection<types.Organization, OrganizationProjection, P>

export type OrganizationSortKeys = 'address.id' | 'id' | 'name' | 'vatNumber'
export type OrganizationSort = OneKey<OrganizationSortKeys, SortDirection>
export type OrganizationRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationUpdate = {
  'address'?: types.Address | null,
  'address.id'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'vatNumber'?: types.Scalars['String'] | null
}
export type OrganizationRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type OrganizationInsert = {
  address?: types.Address,
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  vatNumber?: types.Scalars['String'],
}

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationRawFilter, OrganizationRelations, OrganizationProjection, OrganizationSort, OrganizationRawSort, OrganizationInsert, OrganizationUpdate, OrganizationRawUpdate, OrganizationExcludedFields, OrganizationRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'organization', DAOContext<MetadataType, OperationMetadataType>>
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends OrganizationProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends OrganizationProjection, P2 extends OrganizationProjection>(p1: P1, p2: P2): SelectProjection<OrganizationProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<OrganizationProjection, P1, P2>
  }
  
  public constructor(params: OrganizationDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: organizationSchema(), 
      relations: overrideRelations(
        [
          { type: '1-n', reference: 'foreign', field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never
export type UserRelationFields = 'bestFriend' | 'dogs' | 'friends'

export function userSchema(): Schema<types.Scalars> {
  return {
    'amount': {
      scalar: 'Decimal', 
      alias: 'value'
    },
    'amounts': {
      scalar: 'Decimal', 
      array: true, 
      alias: 'values'
    },
    'bestFriendId': {
      scalar: 'ID'
    },
    'credentials': { embedded: usernamePasswordCredentialsSchema() },
    'firstName': {
      scalar: 'String', 
      alias: 'name'
    },
    'id': {
      scalar: 'ID', 
      required: true, 
      alias: 'ID'
    },
    'lastName': {
      scalar: 'String', 
      alias: 'surname'
    },
    'live': {
      scalar: 'Boolean', 
      required: true, 
      alias: 'active'
    },
    'localization': {
      scalar: 'Coordinates', 
      alias: 'l'
    },
    'title': {
      scalar: 'LocalizedString', 
      alias: 't'
    }
  }
}

type UserFilterFields = {
  'amount'?: types.Scalars['Decimal'] | null | EqualityOperators<types.Scalars['Decimal']> | ElementOperators,
  'amounts'?: types.Scalars['Decimal'][] | null | EqualityOperators<types.Scalars['Decimal'][]> | ElementOperators,
  'bestFriendId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'credentials.another.test'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'credentials.password'?: types.Scalars['Password'] | null | EqualityOperators<types.Scalars['Password']> | ElementOperators,
  'credentials.username'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'firstName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'lastName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'live'?: types.Scalars['Boolean'] | null | EqualityOperators<types.Scalars['Boolean']> | ElementOperators,
  'localization'?: types.Scalars['Coordinates'] | null | EqualityOperators<types.Scalars['Coordinates']> | ElementOperators,
  'title'?: types.Scalars['LocalizedString'] | null | EqualityOperators<types.Scalars['LocalizedString']> | ElementOperators
}
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields | UserRawFilter>
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
  amount?: boolean,
  amounts?: boolean,
  bestFriend?: UserProjection | boolean,
  bestFriendId?: boolean,
  credentials?: {
    another?: {
      test?: boolean,
    } | boolean,
    password?: boolean,
    username?: boolean,
  } | boolean,
  dogs?: DogProjection | boolean,
  firstName?: boolean,
  friends?: UserProjection | boolean,
  id?: boolean,
  lastName?: boolean,
  live?: boolean,
  localization?: boolean,
  title?: boolean,
}
export type UserParam<P extends UserProjection> = ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'amount' | 'amounts' | 'bestFriendId' | 'credentials.another.test' | 'credentials.password' | 'credentials.username' | 'firstName' | 'id' | 'lastName' | 'live' | 'localization' | 'title'
export type UserSort = OneKey<UserSortKeys, SortDirection>
export type UserRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserUpdate = {
  'amount'?: types.Scalars['Decimal'] | null,
  'amounts'?: types.Scalars['Decimal'][] | null,
  'bestFriendId'?: types.Scalars['ID'] | null,
  'credentials'?: types.UsernamePasswordCredentials | null,
  'credentials.another'?: types.Another | null,
  'credentials.another.test'?: types.Scalars['String'] | null,
  'credentials.password'?: types.Scalars['Password'],
  'credentials.username'?: types.Scalars['String'],
  'firstName'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null,
  'live'?: types.Scalars['Boolean'],
  'localization'?: types.Scalars['Coordinates'] | null,
  'title'?: types.Scalars['LocalizedString'] | null
}
export type UserRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserInsert = {
  amount?: types.Scalars['Decimal'],
  amounts?: types.Scalars['Decimal'][],
  bestFriendId?: types.Scalars['ID'],
  credentials?: types.UsernamePasswordCredentials,
  firstName?: types.Scalars['String'],
  id?: types.Scalars['ID'],
  lastName?: types.Scalars['String'],
  live: types.Scalars['Boolean'],
  localization?: types.Scalars['Coordinates'],
  title?: types.Scalars['LocalizedString'],
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, UserRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'user', DAOContext<MetadataType, OperationMetadataType>>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): SelectProjection<UserProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<UserProjection, P1, P2>
  }
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema(), 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'bestFriend', refFrom: 'bestFriendId', refTo: 'id', dao: 'user', required: false },
          { type: '1-n', reference: 'foreign', field: 'dogs', refFrom: 'ownerId', refTo: 'id', dao: 'dog', required: false },
          { type: '1-n', reference: 'relation', field: 'friends', relationDao: 'friends', entityDao: 'user', refThis: { refFrom: 'from', refTo: 'id' }, refOther: { refFrom: 'to', refTo: 'id' }, required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    })
  }
  
}



//--------------------------------------------------------------------------------
//------------------------- USERNAMEPASSWORDCREDENTIALS --------------------------
//--------------------------------------------------------------------------------

export function usernamePasswordCredentialsSchema(): Schema<types.Scalars> {
  return {
    'another': { embedded: anotherSchema() },
    'password': {
      scalar: 'Password', 
      required: true, 
      alias: 'pass'
    },
    'username': {
      scalar: 'String', 
      required: true, 
      alias: 'user'
    }
  }
}

export type UsernamePasswordCredentialsProjection = {
  another?: {
    test?: boolean,
  } | boolean,
  password?: boolean,
  username?: boolean,
}
export type UsernamePasswordCredentialsParam<P extends UsernamePasswordCredentialsProjection> = ParamProjection<types.UsernamePasswordCredentials, UsernamePasswordCredentialsProjection, P>


export type DAOContextParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
  metadata?: MetadataType
  middlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    author?: Pick<Partial<AuthorDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    authorBook?: Pick<Partial<AuthorBookDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    book?: Pick<Partial<BookDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    friends?: Pick<Partial<FriendsDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>,
  log?: LogInput<'address' | 'author' | 'authorBook' | 'book' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'friends' | 'organization' | 'user'>,
  security?: DAOContextSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type DAOContextMiddleware<MetadataType = never, OperationMetadataType = never> = DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends object = never> extends AbstractDAOContext<types.Scalars, MetadataType>  {

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
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private knex: Record<'default', Knex>
  
  private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: LogFunction<'address' | 'author' | 'authorBook' | 'book' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'friends' | 'organization' | 'user'>
  
  get address() : AddressDAO<MetadataType, OperationMetadataType> {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, knex: this.knex.default, tableName: 'addresses', middlewares: [...(this.overrides?.address?.middlewares || []), ...selectMiddleware('address', this.middlewares) as DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'address', logger: this.logger })
    }
    return this._address
  }
  get author() : AuthorDAO<MetadataType, OperationMetadataType> {
    if(!this._author) {
      this._author = new AuthorDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.author, knex: this.knex.default, tableName: 'authors', middlewares: [...(this.overrides?.author?.middlewares || []), ...selectMiddleware('author', this.middlewares) as DAOMiddleware<AuthorDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'author', logger: this.logger })
    }
    return this._author
  }
  get authorBook() : AuthorBookDAO<MetadataType, OperationMetadataType> {
    if(!this._authorBook) {
      this._authorBook = new AuthorBookDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.authorBook, knex: this.knex.default, tableName: 'authorBooks', middlewares: [...(this.overrides?.authorBook?.middlewares || []), ...selectMiddleware('authorBook', this.middlewares) as DAOMiddleware<AuthorBookDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'authorBook', logger: this.logger })
    }
    return this._authorBook
  }
  get book() : BookDAO<MetadataType, OperationMetadataType> {
    if(!this._book) {
      this._book = new BookDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.book, knex: this.knex.default, tableName: 'books', middlewares: [...(this.overrides?.book?.middlewares || []), ...selectMiddleware('book', this.middlewares) as DAOMiddleware<BookDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'book', logger: this.logger })
    }
    return this._book
  }
  get city() : CityDAO<MetadataType, OperationMetadataType> {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, knex: this.knex.default, tableName: 'citys', middlewares: [...(this.overrides?.city?.middlewares || []), ...selectMiddleware('city', this.middlewares) as DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'city', logger: this.logger })
    }
    return this._city
  }
  get defaultFieldsEntity() : DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> {
    if(!this._defaultFieldsEntity) {
      this._defaultFieldsEntity = new DefaultFieldsEntityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.defaultFieldsEntity, knex: this.knex.default, tableName: 'defaultFieldsEntitys', middlewares: [...(this.overrides?.defaultFieldsEntity?.middlewares || []), ...selectMiddleware('defaultFieldsEntity', this.middlewares) as DAOMiddleware<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'defaultFieldsEntity', logger: this.logger })
    }
    return this._defaultFieldsEntity
  }
  get device() : DeviceDAO<MetadataType, OperationMetadataType> {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, knex: this.knex.default, tableName: 'devices', middlewares: [...(this.overrides?.device?.middlewares || []), ...selectMiddleware('device', this.middlewares) as DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'device', logger: this.logger })
    }
    return this._device
  }
  get dog() : DogDAO<MetadataType, OperationMetadataType> {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.dog, knex: this.knex.default, tableName: 'dogs', middlewares: [...(this.overrides?.dog?.middlewares || []), ...selectMiddleware('dog', this.middlewares) as DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'dog', logger: this.logger })
    }
    return this._dog
  }
  get friends() : FriendsDAO<MetadataType, OperationMetadataType> {
    if(!this._friends) {
      this._friends = new FriendsDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.friends, knex: this.knex.default, tableName: 'friendss', middlewares: [...(this.overrides?.friends?.middlewares || []), ...selectMiddleware('friends', this.middlewares) as DAOMiddleware<FriendsDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'friends', logger: this.logger })
    }
    return this._friends
  }
  get organization() : OrganizationDAO<MetadataType, OperationMetadataType> {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, knex: this.knex.default, tableName: 'organizations', middlewares: [...(this.overrides?.organization?.middlewares || []), ...selectMiddleware('organization', this.middlewares) as DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'organization', logger: this.logger })
    }
    return this._organization
  }
  get user() : UserDAO<MetadataType, OperationMetadataType> {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users', middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger })
    }
    return this._user
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.knex = params.knex
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
    if(params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map(k => [k, true])) as any, securityMiddlewares.others as any)] : []
      this.middlewares = [...(params.middlewares ?? []), ...defaultMiddleware, ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({[name]: true} as any, middleware as any))]
    }
  }
  
  public async execQuery<T>(run: (dbs: { knex: Record<'default', Knex> }, entities: { address: Knex.QueryBuilder<any, unknown[]>, author: Knex.QueryBuilder<any, unknown[]>, authorBook: Knex.QueryBuilder<any, unknown[]>, book: Knex.QueryBuilder<any, unknown[]>, city: Knex.QueryBuilder<any, unknown[]>, defaultFieldsEntity: Knex.QueryBuilder<any, unknown[]>, device: Knex.QueryBuilder<any, unknown[]>, dog: Knex.QueryBuilder<any, unknown[]>, friends: Knex.QueryBuilder<any, unknown[]>, organization: Knex.QueryBuilder<any, unknown[]>, user: Knex.QueryBuilder<any, unknown[]> }) => Promise<T>): Promise<T> {
    return run({ knex: this.knex }, { address: this.knex.default.table('addresses'), author: this.knex.default.table('authors'), authorBook: this.knex.default.table('authorBooks'), book: this.knex.default.table('books'), city: this.knex.default.table('citys'), defaultFieldsEntity: this.knex.default.table('defaultFieldsEntitys'), device: this.knex.default.table('devices'), dog: this.knex.default.table('dogs'), friends: this.knex.default.table('friendss'), organization: this.knex.default.table('organizations'), user: this.knex.default.table('users') })
  }
  
  public async createTables(args: { typeMap?: Partial<Record<keyof types.Scalars, { singleType: string, arrayType?: string }>>, defaultType: { singleType: string, arrayType?: string } }): Promise<void> {
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


//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

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
  middleware: DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
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
  middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): DAOContextMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as DAOContextMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
export async function mockedDAOContext<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends object = never>(params: MockDAOContextParams<DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>>) {
  const newParams = await createMockedDAOContext<DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>>(params, ['default'], [])
  return new DAOContext(newParams)
}