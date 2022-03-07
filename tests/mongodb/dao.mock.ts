import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger, ParamProjection, DAOGenerics, CRUDPermission, DAOContextSecurtyPolicy, createSecurityPolicyMiddlewares, SelectProjection, mergeProjections } from '../../src';
import * as types from './models.mock';
import { MongoDBDAOGenerics, MongoDBDAOParams, AbstractMongoDBDAO, inMemoryMongoDb } from '../../src';
import { Collection, Db, Filter, Sort, UpdateFilter, Document } from 'mongodb';

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
};

type AddressFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type AddressFilter = AddressFilterFields & LogicalOperators<AddressFilterFields | AddressRawFilter>
export type AddressRawFilter = () => Filter<Document>

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

export type AddressSortKeys = 'id';
export type AddressSort = OneKey<AddressSortKeys, SortDirection>;
export type AddressRawSort = () => Sort

export type AddressUpdate = {
  'id'?: types.Scalars['ID']
};
export type AddressRawUpdate = () => UpdateFilter<Document>

export type AddressInsert = {
  id?: types.Scalars['ID'],
};

type AddressDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Address, 'id', 'ID', 'generator', AddressFilter, AddressRawFilter, AddressRelations, AddressProjection, AddressSort, AddressRawSort, AddressInsert, AddressUpdate, AddressRawUpdate, AddressExcludedFields, AddressRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'address', DAOContext<MetadataType, OperationMetadataType>>;
export type AddressDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<AddressDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class AddressDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<AddressDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
  }
  
}



//--------------------------------------------------------------------------------
//---------------------------------- AUDITABLE -----------------------------------
//--------------------------------------------------------------------------------

export function auditableSchema(): Schema<types.Scalars> {
  return {
    'createdBy': {
      scalar: 'String', 
      required: true
    },
    'createdOn': {
      scalar: 'Int', 
      required: true
    },
    'deletedOn': {
      scalar: 'Int'
    },
    'modifiedBy': {
      scalar: 'String', 
      required: true
    },
    'modifiedOn': {
      scalar: 'Int', 
      required: true
    },
    'state': {
      scalar: 'String', 
      required: true
    }
  }
};

export type AuditableProjection = {
  createdBy?: boolean,
  createdOn?: boolean,
  deletedOn?: boolean,
  modifiedBy?: boolean,
  modifiedOn?: boolean,
  state?: boolean,
}
export type AuditableParam<P extends AuditableProjection> = ParamProjection<types.Auditable, AuditableProjection, P>



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
};

type CityFilterFields = {
  'addressId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type CityFilter = CityFilterFields & LogicalOperators<CityFilterFields | CityRawFilter>
export type CityRawFilter = () => Filter<Document>

export type CityRelations = Record<never, string>

export type CityProjection = {
  addressId?: boolean,
  computedAddressName?: boolean,
  computedName?: boolean,
  id?: boolean,
  name?: boolean,
}
export type CityParam<P extends CityProjection> = ParamProjection<types.City, CityProjection, P>

export type CitySortKeys = 'addressId' | 'id' | 'name';
export type CitySort = OneKey<CitySortKeys, SortDirection>;
export type CityRawSort = () => Sort

export type CityUpdate = {
  'addressId'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String']
};
export type CityRawUpdate = () => UpdateFilter<Document>

export type CityInsert = {
  addressId: types.Scalars['ID'],
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
};

type CityDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.City, 'id', 'ID', 'generator', CityFilter, CityRawFilter, CityRelations, CityProjection, CitySort, CityRawSort, CityInsert, CityUpdate, CityRawUpdate, CityExcludedFields, CityRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'city', DAOContext<MetadataType, OperationMetadataType>>;
export type CityDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<CityDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class CityDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<CityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
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
};

type DefaultFieldsEntityFilterFields = {
  'creationDate'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'live'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'opt1'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators,
  'opt2'?: types.Scalars['Live'] | null | EqualityOperators<types.Scalars['Live']> | ElementOperators
};
export type DefaultFieldsEntityFilter = DefaultFieldsEntityFilterFields & LogicalOperators<DefaultFieldsEntityFilterFields | DefaultFieldsEntityRawFilter>
export type DefaultFieldsEntityRawFilter = () => Filter<Document>

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

export type DefaultFieldsEntitySortKeys = 'creationDate' | 'id' | 'live' | 'name' | 'opt1' | 'opt2';
export type DefaultFieldsEntitySort = OneKey<DefaultFieldsEntitySortKeys, SortDirection>;
export type DefaultFieldsEntityRawSort = () => Sort

export type DefaultFieldsEntityUpdate = {
  'creationDate'?: types.Scalars['Int'],
  'id'?: types.Scalars['ID'],
  'live'?: types.Scalars['Live'],
  'name'?: types.Scalars['String'],
  'opt1'?: types.Scalars['Live'] | null,
  'opt2'?: types.Scalars['Live'] | null
};
export type DefaultFieldsEntityRawUpdate = () => UpdateFilter<Document>

export type DefaultFieldsEntityInsert = {
  creationDate?: types.Scalars['Int'],
  id: types.Scalars['ID'],
  live?: types.Scalars['Live'],
  name: types.Scalars['String'],
  opt1?: types.Scalars['Live'],
  opt2?: types.Scalars['Live'],
};

type DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.DefaultFieldsEntity, 'id', 'ID', 'user', DefaultFieldsEntityFilter, DefaultFieldsEntityRawFilter, DefaultFieldsEntityRelations, DefaultFieldsEntityProjection, DefaultFieldsEntitySort, DefaultFieldsEntityRawSort, DefaultFieldsEntityInsert, DefaultFieldsEntityUpdate, DefaultFieldsEntityRawUpdate, DefaultFieldsEntityExcludedFields, DefaultFieldsEntityRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'defaultFieldsEntity', DAOContext<MetadataType, OperationMetadataType>>;
export type DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
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
};

type DeviceFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type DeviceFilter = DeviceFilterFields & LogicalOperators<DeviceFilterFields | DeviceRawFilter>
export type DeviceRawFilter = () => Filter<Document>

export type DeviceRelations = Record<never, string>

export type DeviceProjection = {
  id?: boolean,
  name?: boolean,
  user?: UserProjection | boolean,
  userId?: boolean,
}
export type DeviceParam<P extends DeviceProjection> = ParamProjection<types.Device, DeviceProjection, P>

export type DeviceSortKeys = 'id' | 'name' | 'userId';
export type DeviceSort = OneKey<DeviceSortKeys, SortDirection>;
export type DeviceRawSort = () => Sort

export type DeviceUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'userId'?: types.Scalars['ID'] | null
};
export type DeviceRawUpdate = () => UpdateFilter<Document>

export type DeviceInsert = {
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  userId?: types.Scalars['ID'],
};

type DeviceDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Device, 'id', 'ID', 'generator', DeviceFilter, DeviceRawFilter, DeviceRelations, DeviceProjection, DeviceSort, DeviceRawSort, DeviceInsert, DeviceUpdate, DeviceRawUpdate, DeviceExcludedFields, DeviceRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'device', DAOContext<MetadataType, OperationMetadataType>>;
export type DeviceDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<DeviceDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DeviceDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<DeviceDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
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
};

type DogFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'ownerId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type DogFilter = DogFilterFields & LogicalOperators<DogFilterFields | DogRawFilter>
export type DogRawFilter = () => Filter<Document>

export type DogRelations = Record<never, string>

export type DogProjection = {
  id?: boolean,
  name?: boolean,
  owner?: UserProjection | boolean,
  ownerId?: boolean,
}
export type DogParam<P extends DogProjection> = ParamProjection<types.Dog, DogProjection, P>

export type DogSortKeys = 'id' | 'name' | 'ownerId';
export type DogSort = OneKey<DogSortKeys, SortDirection>;
export type DogRawSort = () => Sort

export type DogUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'ownerId'?: types.Scalars['ID']
};
export type DogRawUpdate = () => UpdateFilter<Document>

export type DogInsert = {
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  ownerId: types.Scalars['ID'],
};

type DogDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Dog, 'id', 'ID', 'generator', DogFilter, DogRawFilter, DogRelations, DogProjection, DogSort, DogRawSort, DogInsert, DogUpdate, DogRawUpdate, DogExcludedFields, DogRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'dog', DAOContext<MetadataType, OperationMetadataType>>;
export type DogDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<DogDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class DogDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<DogDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------ HOTEL -------------------------------------
//--------------------------------------------------------------------------------

export type HotelExcludedFields = never
export type HotelRelationFields = never

export function hotelSchema(): Schema<types.Scalars> {
  return {
    'audit': { embedded: auditableSchema() },
    'id': {
      scalar: 'ID', 
      required: true, 
      alias: '_id'
    },
    'name': {
      scalar: 'String', 
      required: true
    }
  }
};

type HotelFilterFields = {
  'audit.createdBy'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'audit.createdOn'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'audit.deletedOn'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'audit.modifiedBy'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'audit.modifiedOn'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'audit.state'?: types.State | null | EqualityOperators<types.State> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type HotelFilter = HotelFilterFields & LogicalOperators<HotelFilterFields | HotelRawFilter>
export type HotelRawFilter = () => Filter<Document>

export type HotelRelations = Record<never, string>

export type HotelProjection = {
  audit?: {
    createdBy?: boolean,
    createdOn?: boolean,
    deletedOn?: boolean,
    modifiedBy?: boolean,
    modifiedOn?: boolean,
    state?: boolean,
  } | boolean,
  id?: boolean,
  name?: boolean,
}
export type HotelParam<P extends HotelProjection> = ParamProjection<types.Hotel, HotelProjection, P>

export type HotelSortKeys = 'audit.createdBy' | 'audit.createdOn' | 'audit.deletedOn' | 'audit.modifiedBy' | 'audit.modifiedOn' | 'audit.state' | 'id' | 'name';
export type HotelSort = OneKey<HotelSortKeys, SortDirection>;
export type HotelRawSort = () => Sort

export type HotelUpdate = {
  'audit'?: types.Auditable,
  'audit.createdBy'?: types.Scalars['String'],
  'audit.createdOn'?: types.Scalars['Int'],
  'audit.deletedOn'?: types.Scalars['Int'] | null,
  'audit.modifiedBy'?: types.Scalars['String'],
  'audit.modifiedOn'?: types.Scalars['Int'],
  'audit.state'?: types.State,
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String']
};
export type HotelRawUpdate = () => UpdateFilter<Document>

export type HotelInsert = {
  audit?: types.Auditable,
  name: types.Scalars['String'],
};

type HotelDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Hotel, 'id', 'ID', 'db', HotelFilter, HotelRawFilter, HotelRelations, HotelProjection, HotelSort, HotelRawSort, HotelInsert, HotelUpdate, HotelRawUpdate, HotelExcludedFields, HotelRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'hotel', DAOContext<MetadataType, OperationMetadataType>>;
export type HotelDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<HotelDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class HotelDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<HotelDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends HotelProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends HotelProjection, P2 extends HotelProjection>(p1: P1, p2: P2): SelectProjection<HotelProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<HotelProjection, P1, P2>
  }
  
  public constructor(params: HotelDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: hotelSchema(), 
      relations: overrideRelations(
        [
          
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//--------------------------------- MOCKEDENTITY ---------------------------------
//--------------------------------------------------------------------------------

export type MockedEntityExcludedFields = never
export type MockedEntityRelationFields = 'user'

export function mockedEntitySchema(): Schema<types.Scalars> {
  return {
    'id': {
      scalar: 'ID', 
      required: true, 
      alias: '_id'
    },
    'name': {
      scalar: 'String', 
      required: true
    },
    'userId': {
      scalar: 'ID', 
      required: true
    }
  }
};

type MockedEntityFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'userId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type MockedEntityFilter = MockedEntityFilterFields & LogicalOperators<MockedEntityFilterFields | MockedEntityRawFilter>
export type MockedEntityRawFilter = () => Filter<Document>

export type MockedEntityRelations = Record<never, string>

export type MockedEntityProjection = {
  id?: boolean,
  name?: boolean,
  user?: UserProjection | boolean,
  userId?: boolean,
}
export type MockedEntityParam<P extends MockedEntityProjection> = ParamProjection<types.MockedEntity, MockedEntityProjection, P>

export type MockedEntitySortKeys = 'id' | 'name' | 'userId';
export type MockedEntitySort = OneKey<MockedEntitySortKeys, SortDirection>;
export type MockedEntityRawSort = () => Sort

export type MockedEntityUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'userId'?: types.Scalars['ID']
};
export type MockedEntityRawUpdate = () => UpdateFilter<Document>

export type MockedEntityInsert = {
  name: types.Scalars['String'],
  userId: types.Scalars['ID'],
};

type MockedEntityDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.MockedEntity, 'id', 'ID', 'db', MockedEntityFilter, MockedEntityRawFilter, MockedEntityRelations, MockedEntityProjection, MockedEntitySort, MockedEntityRawSort, MockedEntityInsert, MockedEntityUpdate, MockedEntityRawUpdate, MockedEntityExcludedFields, MockedEntityRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'mockedEntity', DAOContext<MetadataType, OperationMetadataType>>;
export type MockedEntityDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class MockedEntityDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends MockedEntityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends MockedEntityProjection, P2 extends MockedEntityProjection>(p1: P1, p2: P2): SelectProjection<MockedEntityProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<MockedEntityProjection, P1, P2>
  }
  
  public constructor(params: MockedEntityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: mockedEntitySchema(), 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'user', refFrom: 'userId', refTo: 'id', dao: 'user', required: true }
        ]
      ), 
      idGeneration: 'db', 
      idScalar: 'ID' 
    });
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
};

type OrganizationFilterFields = {
  'address.id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'vatNumber'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type OrganizationFilter = OrganizationFilterFields & LogicalOperators<OrganizationFilterFields | OrganizationRawFilter>
export type OrganizationRawFilter = () => Filter<Document>

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

export type OrganizationSortKeys = 'address.id' | 'id' | 'name' | 'vatNumber';
export type OrganizationSort = OneKey<OrganizationSortKeys, SortDirection>;
export type OrganizationRawSort = () => Sort

export type OrganizationUpdate = {
  'address'?: types.Address | null,
  'address.id'?: types.Scalars['ID'],
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'],
  'vatNumber'?: types.Scalars['String'] | null
};
export type OrganizationRawUpdate = () => UpdateFilter<Document>

export type OrganizationInsert = {
  address?: types.Address,
  id?: types.Scalars['ID'],
  name: types.Scalars['String'],
  vatNumber?: types.Scalars['String'],
};

type OrganizationDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Organization, 'id', 'ID', 'generator', OrganizationFilter, OrganizationRawFilter, OrganizationRelations, OrganizationProjection, OrganizationSort, OrganizationRawSort, OrganizationInsert, OrganizationUpdate, OrganizationRawUpdate, OrganizationExcludedFields, OrganizationRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'organization', DAOContext<MetadataType, OperationMetadataType>>;
export type OrganizationDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class OrganizationDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<OrganizationDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------------------- POST -------------------------------------
//--------------------------------------------------------------------------------

export type PostExcludedFields = never
export type PostRelationFields = 'author'

export function postSchema(): Schema<types.Scalars> {
  return {
    'authorId': {
      scalar: 'ID', 
      required: true, 
      alias: 'aId'
    },
    'body': {
      scalar: 'String'
    },
    'clicks': {
      scalar: 'Int'
    },
    'id': {
      scalar: 'ID', 
      required: true
    },
    'metadata': { embedded: postMetadataSchema() },
    'title': {
      scalar: 'String', 
      required: true
    },
    'views': {
      scalar: 'Int', 
      required: true
    }
  }
};

type PostFilterFields = {
  'authorId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'body'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'clicks'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'metadata.region'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'metadata.visible'?: types.Scalars['Boolean'] | null | EqualityOperators<types.Scalars['Boolean']> | ElementOperators,
  'title'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'views'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type PostFilter = PostFilterFields & LogicalOperators<PostFilterFields | PostRawFilter>
export type PostRawFilter = () => Filter<Document>

export type PostRelations = Record<never, string>

export type PostProjection = {
  author?: UserProjection | boolean,
  authorId?: boolean,
  body?: boolean,
  clicks?: boolean,
  id?: boolean,
  metadata?: {
    region?: boolean,
    visible?: boolean,
  } | boolean,
  title?: boolean,
  views?: boolean,
}
export type PostParam<P extends PostProjection> = ParamProjection<types.Post, PostProjection, P>

export type PostSortKeys = 'authorId' | 'body' | 'clicks' | 'id' | 'metadata.region' | 'metadata.visible' | 'title' | 'views';
export type PostSort = OneKey<PostSortKeys, SortDirection>;
export type PostRawSort = () => Sort

export type PostUpdate = {
  'authorId'?: types.Scalars['ID'],
  'body'?: types.Scalars['String'] | null,
  'clicks'?: types.Scalars['Int'] | null,
  'id'?: types.Scalars['ID'],
  'metadata'?: types.PostMetadata | null,
  'metadata.region'?: types.Scalars['String'],
  'metadata.visible'?: types.Scalars['Boolean'],
  'title'?: types.Scalars['String'],
  'views'?: types.Scalars['Int']
};
export type PostRawUpdate = () => UpdateFilter<Document>

export type PostInsert = {
  authorId: types.Scalars['ID'],
  body?: types.Scalars['String'],
  clicks?: types.Scalars['Int'],
  id?: types.Scalars['ID'],
  metadata?: types.PostMetadata,
  title: types.Scalars['String'],
  views: types.Scalars['Int'],
};

type PostDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.Post, 'id', 'ID', 'generator', PostFilter, PostRawFilter, PostRelations, PostProjection, PostSort, PostRawSort, PostInsert, PostUpdate, PostRawUpdate, PostExcludedFields, PostRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'post', DAOContext<MetadataType, OperationMetadataType>>;
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class PostDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
  public static projection<P extends PostProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostProjection, P2 extends PostProjection>(p1: P1, p2: P2): SelectProjection<PostProjection, P1, P2> {
    return mergeProjections(p1, p2) as SelectProjection<PostProjection, P1, P2>
  }
  
  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: postSchema(), 
      relations: overrideRelations(
        [
          { type: '1-1', reference: 'inner', field: 'author', refFrom: 'authorId', refTo: 'id', dao: 'user', required: true }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//--------------------------------- POSTMETADATA ---------------------------------
//--------------------------------------------------------------------------------

export function postMetadataSchema(): Schema<types.Scalars> {
  return {
    'region': {
      scalar: 'String', 
      required: true
    },
    'visible': {
      scalar: 'Boolean', 
      required: true
    }
  }
};

export type PostMetadataProjection = {
  region?: boolean,
  visible?: boolean,
}
export type PostMetadataParam<P extends PostMetadataProjection> = ParamProjection<types.PostMetadata, PostMetadataProjection, P>



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = never
export type UserRelationFields = 'dogs' | 'friends'

export function userSchema(): Schema<types.Scalars> {
  return {
    'amount': {
      scalar: 'Decimal'
    },
    'amounts': {
      scalar: 'Decimal', 
      array: true, 
      alias: 'amounts'
    },
    'firstName': {
      scalar: 'String', 
      alias: 'name'
    },
    'friendsId': {
      scalar: 'ID', 
      array: true, 
      alias: 'fIds'
    },
    'id': {
      scalar: 'ID', 
      required: true, 
      alias: 'ID'
    },
    'lastName': {
      scalar: 'String'
    },
    'live': {
      scalar: 'Boolean', 
      required: true
    },
    'localization': {
      scalar: 'Coordinates'
    },
    'title': {
      scalar: 'LocalizedString'
    },
    'usernamePasswordCredentials': { embedded: usernamePasswordCredentialsSchema() }
  }
};

type UserFilterFields = {
  'amount'?: types.Scalars['Decimal'] | null | EqualityOperators<types.Scalars['Decimal']> | ElementOperators,
  'amounts'?: types.Scalars['Decimal'][] | null | EqualityOperators<types.Scalars['Decimal'][]> | ElementOperators,
  'firstName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'friendsId'?: types.Scalars['ID'][] | null | EqualityOperators<types.Scalars['ID'][]> | ElementOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'lastName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'live'?: types.Scalars['Boolean'] | null | EqualityOperators<types.Scalars['Boolean']> | ElementOperators,
  'localization'?: types.Scalars['Coordinates'] | null | EqualityOperators<types.Scalars['Coordinates']> | ElementOperators,
  'title'?: types.Scalars['LocalizedString'] | null | EqualityOperators<types.Scalars['LocalizedString']> | ElementOperators,
  'usernamePasswordCredentials.password'?: types.Scalars['Password'] | null | EqualityOperators<types.Scalars['Password']> | ElementOperators,
  'usernamePasswordCredentials.username'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = () => Filter<Document>

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
  dogs?: DogProjection | boolean,
  firstName?: boolean,
  friends?: UserProjection | boolean,
  friendsId?: boolean,
  id?: boolean,
  lastName?: boolean,
  live?: boolean,
  localization?: boolean,
  title?: boolean,
  usernamePasswordCredentials?: {
    password?: boolean,
    username?: boolean,
  } | boolean,
}
export type UserParam<P extends UserProjection> = ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'amount' | 'amounts' | 'firstName' | 'friendsId' | 'id' | 'lastName' | 'live' | 'localization' | 'title' | 'usernamePasswordCredentials.password' | 'usernamePasswordCredentials.username';
export type UserSort = OneKey<UserSortKeys, SortDirection>;
export type UserRawSort = () => Sort

export type UserUpdate = {
  'amount'?: types.Scalars['Decimal'] | null,
  'amounts'?: types.Scalars['Decimal'][] | null,
  'firstName'?: types.Scalars['String'] | null,
  'friendsId'?: types.Scalars['ID'][] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null,
  'live'?: types.Scalars['Boolean'],
  'localization'?: types.Scalars['Coordinates'] | null,
  'title'?: types.Scalars['LocalizedString'] | null,
  'usernamePasswordCredentials'?: types.UsernamePasswordCredentials | null,
  'usernamePasswordCredentials.password'?: types.Scalars['Password'],
  'usernamePasswordCredentials.username'?: types.Scalars['String']
};
export type UserRawUpdate = () => UpdateFilter<Document>

export type UserInsert = {
  amount?: types.Scalars['Decimal'],
  amounts?: types.Scalars['Decimal'][],
  firstName?: types.Scalars['String'],
  friendsId?: types.Scalars['ID'][],
  id?: types.Scalars['ID'],
  lastName?: types.Scalars['String'],
  live: types.Scalars['Boolean'],
  localization?: types.Scalars['Coordinates'],
  title?: types.Scalars['LocalizedString'],
  usernamePasswordCredentials?: types.UsernamePasswordCredentials,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = MongoDBDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, UserRelationFields, MetadataType, OperationMetadataType, types.Scalars, 'user', DAOContext<MetadataType, OperationMetadataType>>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  
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
          { type: '1-n', reference: 'foreign', field: 'dogs', refFrom: 'ownerId', refTo: 'id', dao: 'dog', required: false },
          { type: '1-n', reference: 'inner', field: 'friends', refFrom: 'friendsId', refTo: 'id', dao: 'user', required: false }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//------------------------- USERNAMEPASSWORDCREDENTIALS --------------------------
//--------------------------------------------------------------------------------

export function usernamePasswordCredentialsSchema(): Schema<types.Scalars> {
  return {
    'password': {
      scalar: 'Password', 
      required: true, 
      alias: 'pwd'
    },
    'username': {
      scalar: 'String', 
      required: true, 
      alias: 'user'
    }
  }
};

export type UsernamePasswordCredentialsProjection = {
  password?: boolean,
  username?: boolean,
}
export type UsernamePasswordCredentialsParam<P extends UsernamePasswordCredentialsProjection> = ParamProjection<types.UsernamePasswordCredentials, UsernamePasswordCredentialsProjection, P>


export type DAOContextParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
  metadata?: MetadataType
  middlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    address?: Pick<Partial<AddressDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    city?: Pick<Partial<CityDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    defaultFieldsEntity?: Pick<Partial<DefaultFieldsEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    device?: Pick<Partial<DeviceDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    dog?: Pick<Partial<DogDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    hotel?: Pick<Partial<HotelDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    mockedEntity?: Pick<Partial<MockedEntityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    organization?: Pick<Partial<OrganizationDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  mongodb: Record<'default' | '__mock', Db>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>,
  log?: LogInput<'address' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'user'>,
  security?: DAOContextSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
};

type DAOContextMiddleware<MetadataType = never, OperationMetadataType = never> = DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends object = never> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _address: AddressDAO<MetadataType, OperationMetadataType> | undefined;
  private _city: CityDAO<MetadataType, OperationMetadataType> | undefined;
  private _defaultFieldsEntity: DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> | undefined;
  private _device: DeviceDAO<MetadataType, OperationMetadataType> | undefined;
  private _dog: DogDAO<MetadataType, OperationMetadataType> | undefined;
  private _hotel: HotelDAO<MetadataType, OperationMetadataType> | undefined;
  private _mockedEntity: MockedEntityDAO<MetadataType, OperationMetadataType> | undefined;
  private _organization: OrganizationDAO<MetadataType, OperationMetadataType> | undefined;
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides'];
  private mongodb: Record<'default' | '__mock', Db>;
  
  private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: LogFunction<'address' | 'city' | 'defaultFieldsEntity' | 'device' | 'dog' | 'hotel' | 'mockedEntity' | 'organization' | 'post' | 'user'>
  
  get address() : AddressDAO<MetadataType, OperationMetadataType> {
    if(!this._address) {
      this._address = new AddressDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.address, collection: this.mongodb.default.collection('addresses'), middlewares: [...(this.overrides?.address?.middlewares || []), ...selectMiddleware('address', this.middlewares) as DAOMiddleware<AddressDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'address', logger: this.logger });
    }
    return this._address;
  }
  get city() : CityDAO<MetadataType, OperationMetadataType> {
    if(!this._city) {
      this._city = new CityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.city, collection: this.mongodb.default.collection('citys'), middlewares: [...(this.overrides?.city?.middlewares || []), ...selectMiddleware('city', this.middlewares) as DAOMiddleware<CityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'city', logger: this.logger });
    }
    return this._city;
  }
  get defaultFieldsEntity() : DefaultFieldsEntityDAO<MetadataType, OperationMetadataType> {
    if(!this._defaultFieldsEntity) {
      this._defaultFieldsEntity = new DefaultFieldsEntityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.defaultFieldsEntity, collection: this.mongodb.default.collection('defaultFieldsEntitys'), middlewares: [...(this.overrides?.defaultFieldsEntity?.middlewares || []), ...selectMiddleware('defaultFieldsEntity', this.middlewares) as DAOMiddleware<DefaultFieldsEntityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'defaultFieldsEntity', logger: this.logger });
    }
    return this._defaultFieldsEntity;
  }
  get device() : DeviceDAO<MetadataType, OperationMetadataType> {
    if(!this._device) {
      this._device = new DeviceDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.device, collection: this.mongodb.default.collection('devices'), middlewares: [...(this.overrides?.device?.middlewares || []), ...selectMiddleware('device', this.middlewares) as DAOMiddleware<DeviceDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'device', logger: this.logger });
    }
    return this._device;
  }
  get dog() : DogDAO<MetadataType, OperationMetadataType> {
    if(!this._dog) {
      this._dog = new DogDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.dog, collection: this.mongodb.default.collection('dogs'), middlewares: [...(this.overrides?.dog?.middlewares || []), ...selectMiddleware('dog', this.middlewares) as DAOMiddleware<DogDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'dog', logger: this.logger });
    }
    return this._dog;
  }
  get hotel() : HotelDAO<MetadataType, OperationMetadataType> {
    if(!this._hotel) {
      this._hotel = new HotelDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.hotel, collection: this.mongodb.default.collection('hotels'), middlewares: [...(this.overrides?.hotel?.middlewares || []), ...selectMiddleware('hotel', this.middlewares) as DAOMiddleware<HotelDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'hotel', logger: this.logger });
    }
    return this._hotel;
  }
  get mockedEntity() : MockedEntityDAO<MetadataType, OperationMetadataType> {
    if(!this._mockedEntity) {
      this._mockedEntity = new MockedEntityDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.mockedEntity, collection: this.mongodb.__mock.collection('mockedEntitys'), middlewares: [...(this.overrides?.mockedEntity?.middlewares || []), ...selectMiddleware('mockedEntity', this.middlewares) as DAOMiddleware<MockedEntityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'mockedEntity', logger: this.logger });
    }
    return this._mockedEntity;
  }
  get organization() : OrganizationDAO<MetadataType, OperationMetadataType> {
    if(!this._organization) {
      this._organization = new OrganizationDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.organization, collection: this.mongodb.default.collection('organizations'), middlewares: [...(this.overrides?.organization?.middlewares || []), ...selectMiddleware('organization', this.middlewares) as DAOMiddleware<OrganizationDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'organization', logger: this.logger });
    }
    return this._organization;
  }
  get post() : PostDAO<MetadataType, OperationMetadataType> {
    if(!this._post) {
      this._post = new PostDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.post, collection: this.mongodb.default.collection('posts'), middlewares: [...(this.overrides?.post?.middlewares || []), ...selectMiddleware('post', this.middlewares) as DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'post', logger: this.logger });
    }
    return this._post;
  }
  get user() : UserDAO<MetadataType, OperationMetadataType> {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, collection: this.mongodb.default.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Coordinates', 'Decimal', 'JSON', 'Live', 'LocalizedString', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
    if(params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map(k => [k, true])) as any, securityMiddlewares.others as any)] : []
      this.middlewares = [...(params.middlewares ?? []), ...defaultMiddleware, ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({[name]: true} as any, middleware as any))]
    }
  }
  
  public async execQuery<T>(run: (dbs: { mongodb: Record<'default' | '__mock', Db> }, entities: { address: Collection<Document>; city: Collection<Document>; defaultFieldsEntity: Collection<Document>; device: Collection<Document>; dog: Collection<Document>; hotel: Collection<Document>; mockedEntity: Collection<Document>; organization: Collection<Document>; post: Collection<Document>; user: Collection<Document> }) => Promise<T>): Promise<T> {
    return run({ mongodb: this.mongodb }, { address: this.mongodb.default.collection('addresses'), city: this.mongodb.default.collection('citys'), defaultFieldsEntity: this.mongodb.default.collection('defaultFieldsEntitys'), device: this.mongodb.default.collection('devices'), dog: this.mongodb.default.collection('dogs'), hotel: this.mongodb.default.collection('hotels'), mockedEntity: this.mongodb.__mock.collection('mockedEntitys'), organization: this.mongodb.default.collection('organizations'), post: this.mongodb.default.collection('posts'), user: this.mongodb.default.collection('users') })
  }
  
  

}


//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  address: AddressDAOGenerics<MetadataType, OperationMetadataType>
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