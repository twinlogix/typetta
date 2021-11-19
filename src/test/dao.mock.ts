import BigNumber from "bignumber.js";
import {Coordinates} from "@twinlogix/tl-commons";
import {LocalizedString} from "@twinlogix/tl-commons";
import { Schema, model, Connection } from 'mongoose';
import { PointSchema } from "../dal/mongoose/point";
(Schema.Types as any).PointSchema = PointSchema;
import { LocalizedStringSchema } from "../dal/mongoose/localizedString";
(Schema.Types as any).LocalizedStringSchema = LocalizedStringSchema;
import * as types from './models.mock';
import { v4 } from 'uuid';
import { Model, Document, Types } from 'mongoose';
import { DAOParams, DAOAssociationType, DAOAssociationReference, AbstractMongooseDAO, AbstractDAOContext, LogicalOperators, ComparisonOperators, ElementOperators, EvaluationOperators, GeospathialOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export const AddressSchema : Schema = new Schema({
    id: { type: String, required: true, default: v4 },
}, {collection: 'addresss'});

export type AddressExcludedFields = never

type AddressFilterFields = {
    'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    _?: any,
};
export type AddressFilter = AddressFilterFields & LogicalOperators<AddressFilterFields>;

export type AddressSortKeys = 
    'id';
export type AddressSort = OneKey<AddressSortKeys, SortDirection> | OneKey<AddressSortKeys, SortDirection>[] | { sorts?: OneKey<AddressSortKeys, SortDirection>[],  _?: any };

export type AddressUpdate = {
    'id'?: string,
    _?: any,
};

export interface AddressDAOParams extends DAOParams<types.Address, 'id', true, AddressFilter, AddressUpdate, AddressExcludedFields, AddressSort, { mongoose?: any }>{}

export class AddressDAO extends AbstractMongooseDAO<types.Address, 'id', true, AddressFilter, AddressSort, AddressUpdate, AddressExcludedFields, { mongoose?: any }> {
    
    public constructor(params: { daoContext: AbstractDAOContext } & AddressDAOParams, connection?: Connection){
        super({     
            dbModel: connection ? connection.model<Document>('Address', AddressSchema) : model<Document>('Address', AddressSchema), 
            idField: 'id', 
            ...params, 
            associations: overrideAssociations(
                [
                    { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }
                ]
            ), 
        });
    }
    
}



//--------------------------------------------------------------------------------
//------------------------------------- CITY -------------------------------------
//--------------------------------------------------------------------------------

export const CitySchema : Schema = new Schema({
    id: { type: String, required: true, default: v4 },
    name: { type: String, required: true },
    addressId: { type: String, required: true },
}, {collection: 'citys'});

export type CityExcludedFields = 'computedName' | 'computedAddressName'

type CityFilterFields = {
    'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'name'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'addressId'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    _?: any,
};
export type CityFilter = CityFilterFields & LogicalOperators<CityFilterFields>;

export type CitySortKeys = 
    'id'|
    'name'|
    'addressId';
export type CitySort = OneKey<CitySortKeys, SortDirection> | OneKey<CitySortKeys, SortDirection>[] | { sorts?: OneKey<CitySortKeys, SortDirection>[],  _?: any };

export type CityUpdate = {
    'id'?: string,
    'name'?: string,
    'addressId'?: string,
    _?: any,
};

export interface CityDAOParams extends DAOParams<types.City, 'id', true, CityFilter, CityUpdate, CityExcludedFields, CitySort, { mongoose?: any }>{}

export class CityDAO extends AbstractMongooseDAO<types.City, 'id', true, CityFilter, CitySort, CityUpdate, CityExcludedFields, { mongoose?: any }> {
    
    public constructor(params: { daoContext: AbstractDAOContext } & CityDAOParams, connection?: Connection){
        super({     
            dbModel: connection ? connection.model<Document>('City', CitySchema) : model<Document>('City', CitySchema), 
            idField: 'id', 
            ...params, 
            associations: overrideAssociations(
                [
                    
                ]
            ), 
        });
    }
    
}



//--------------------------------------------------------------------------------
//--------------------------------- ORGANIZATION ---------------------------------
//--------------------------------------------------------------------------------

export const OrganizationSchema : Schema = new Schema({
    id: { type: String, required: true, default: v4 },
    name: { type: String, required: true },
    vatNumber: { type: String, required: false },
    address: {
        type: new Schema(
            {
                id: { type: String, required: true, default: v4 },
            },
            { _id: false }
        ),
        required: false
    },
}, {collection: 'organizations'});

export type OrganizationExcludedFields = 'computedName'

type OrganizationFilterFields = {
    'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'name'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'vatNumber'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'address.id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    _?: any,
};
export type OrganizationFilter = OrganizationFilterFields & LogicalOperators<OrganizationFilterFields>;

export type OrganizationSortKeys = 
    'id'|
    'name'|
    'vatNumber'|
    'address.id';
export type OrganizationSort = OneKey<OrganizationSortKeys, SortDirection> | OneKey<OrganizationSortKeys, SortDirection>[] | { sorts?: OneKey<OrganizationSortKeys, SortDirection>[],  _?: any };

export type OrganizationUpdate = {
    'id'?: string,
    'name'?: string,
    'vatNumber'?: string | null,
    'address'?: types.Address | null,
    'address.id'?: string,
    _?: any,
};

export interface OrganizationDAOParams extends DAOParams<types.Organization, 'id', true, OrganizationFilter, OrganizationUpdate, OrganizationExcludedFields, OrganizationSort, { mongoose?: any }>{}

export class OrganizationDAO extends AbstractMongooseDAO<types.Organization, 'id', true, OrganizationFilter, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, { mongoose?: any }> {
    
    public constructor(params: { daoContext: AbstractDAOContext } & OrganizationDAOParams, connection?: Connection){
        super({     
            dbModel: connection ? connection.model<Document>('Organization', OrganizationSchema) : model<Document>('Organization', OrganizationSchema), 
            idField: 'id', 
            ...params, 
            associations: overrideAssociations(
                [
                    { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' }
                ]
            ), 
        });
    }
    
}



//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export const UserSchema : Schema = new Schema({
    id: { type: String, required: true, default: v4 },
    usernamePasswordCredentials: {
        type: new Schema(
            {
                username: { type: String, required: true },
                password: { type: String, required: true },
            },
            { _id: false }
        ),
        required: false
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    live: { type: Boolean, required: true },
    localization: { type: PointSchema, required: false },
    title: { type: LocalizedStringSchema, required: false },
    amounts: [{ type: Types.Decimal128, required: false }],
    amount: { type: Types.Decimal128, required: false },
}, {collection: 'users'});

export type UserExcludedFields = never

type UserFilterFields = {
    'id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'usernamePasswordCredentials.username'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'usernamePasswordCredentials.password'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'firstName'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'lastName'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>,
    'live'?: boolean | null | ComparisonOperators<boolean> | ElementOperators<boolean> | EvaluationOperators<boolean>,
    'localization'?: Coordinates | null | ComparisonOperators<Coordinates> | ElementOperators<Coordinates> | EvaluationOperators<Coordinates>,
    'title'?: LocalizedString | null | ComparisonOperators<LocalizedString> | ElementOperators<LocalizedString> | EvaluationOperators<LocalizedString>,
    'amounts'?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>| ArrayOperators<BigNumber>,
    'amount'?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>,
    _?: any,
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;

export type UserSortKeys = 
    'id'|
    'usernamePasswordCredentials.username'|
    'usernamePasswordCredentials.password'|
    'firstName'|
    'lastName'|
    'live'|
    'localization'|
    'title'|
    'amounts'|
    'amount';
export type UserSort = OneKey<UserSortKeys, SortDirection> | OneKey<UserSortKeys, SortDirection>[] | { sorts?: OneKey<UserSortKeys, SortDirection>[],  _?: any };

export type UserUpdate = {
    'id'?: string,
    'usernamePasswordCredentials'?: types.UsernamePasswordCredentials | null,
    'usernamePasswordCredentials.username'?: string,
    'usernamePasswordCredentials.password'?: string,
    'firstName'?: string | null,
    'lastName'?: string | null,
    'live'?: boolean,
    'localization'?: Coordinates | null,
    'title'?: LocalizedString | null,
    'amounts'?: Array<BigNumber> | null,
    'amount'?: BigNumber | null,
    _?: any,
};

export interface UserDAOParams extends DAOParams<types.User, 'id', true, UserFilter, UserUpdate, UserExcludedFields, UserSort, { mongoose?: any }>{}

export class UserDAO extends AbstractMongooseDAO<types.User, 'id', true, UserFilter, UserSort, UserUpdate, UserExcludedFields, { mongoose?: any }> {
    
    public constructor(params: { daoContext: AbstractDAOContext } & UserDAOParams, connection?: Connection){
        super({     
            dbModel: connection ? connection.model<Document>('User', UserSchema) : model<Document>('User', UserSchema), 
            idField: 'id', 
            ...params, 
            associations: overrideAssociations(
                [
                    
                ]
            ), 
        });
    }
    
}



//--------------------------------------------------------------------------------
//------------------------- USERNAMEPASSWORDCREDENTIALS --------------------------
//--------------------------------------------------------------------------------





export interface DAOContextParams {
    daoOverrides?: { 
        address?: AddressDAOParams,
        city?: CityDAOParams,
        organization?: OrganizationDAOParams,
        user?: UserDAOParams 
    }, 
    connection?: Connection
};

export class DAOContext extends AbstractDAOContext {

    private _address: AddressDAO | undefined;
    private _city: CityDAO | undefined;
    private _organization: OrganizationDAO | undefined;
    private _user: UserDAO | undefined;
    
    private daoOverrides: DAOContextParams['daoOverrides'];
    private connection: Connection | undefined
    
    get address() {
        if(!this._address) {
            this._address = new AddressDAO({ daoContext: this, ...this.daoOverrides?.address }, this.connection);
        }
        return this._address;
    }
    get city() {
        if(!this._city) {
            this._city = new CityDAO({ daoContext: this, ...this.daoOverrides?.city }, this.connection);
        }
        return this._city;
    }
    get organization() {
        if(!this._organization) {
            this._organization = new OrganizationDAO({ daoContext: this, ...this.daoOverrides?.organization }, this.connection);
        }
        return this._organization;
    }
    get user() {
        if(!this._user) {
            this._user = new UserDAO({ daoContext: this, ...this.daoOverrides?.user }, this.connection);
        }
        return this._user;
    }
    
    constructor(options?: DAOContextParams) {
        super()
        this.daoOverrides = options?.daoOverrides
        this.connection = options?.connection
    }

}