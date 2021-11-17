import BigNumber from 'bignumber.js'
import { Schema, model } from 'mongoose'
import { PointSchema } from '../'
import { Coordinates } from '@twinlogix/tl-commons'
import { LocalizedString } from '@twinlogix/tl-commons'
import { LocalizedStringSchema } from '../dal/mongoose/mongoose.localizedString';
;(Schema.Types as any).PointSchema = PointSchema
;(Schema.Types as any).LocalizedStringSchema = LocalizedStringSchema
import * as types from './models.mock'
import { v4 } from 'uuid'
import { Model, Document, Types } from 'mongoose'
import { DAOParams, DAOAssociationType, DAOAssociationReference, AbstractDAOContext, LogicalOperators, ComparisonOperators, ElementOperators, EvaluationOperators, GeospathialOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '../'
import { AbstractMongooseDAO } from '../dal/mongoose/mongoose';

export type SecurityContext = {
  userId: string
}

//--------------------------------------------------------------------------------
//------------------------- USERNAMEPASSWORDCREDENTIALS --------------------------
//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//------------------------------------- CITY -------------------------------------
//--------------------------------------------------------------------------------

export const CitySchema: Schema = new Schema(
  {
    id: { type: String, required: true, default: v4 },
    name: { type: String, required: true },
    addressId: { type: String, required: true },
  },
  { collection: 'citys' },
)
export const CityModel = model('City', CitySchema)

export type CityExcludedFields = 'computedName' | 'computedAddressName'

type CityFilterFields = {
  id?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  name?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  addressId?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  _?: any
}
export type CityFilter = CityFilterFields & LogicalOperators<CityFilterFields>

export type CitySortKeys = 'id' | 'name' | 'addressId'
export type CitySort = OneKey<CitySortKeys, SortDirection> | OneKey<CitySortKeys, SortDirection>[] | { sorts?: OneKey<CitySortKeys, SortDirection>[]; _?: any }

export type CityUpdate = {
  id?: string
  name?: string
  addressId?: string
  _?: any
}

export interface CityDAOParams<SecurityContext> extends DAOParams<types.City, 'id', true, CityFilter, CityUpdate, CityExcludedFields, SecurityContext> {}

export class CityDAO<SecurityContext = any> extends AbstractMongooseDAO<types.City, 'id', true, CityFilter, CitySort, CityUpdate, CityExcludedFields, SecurityContext> {
  public constructor(params: { daoContext: AbstractDAOContext } & CityDAOParams<SecurityContext>) {
    super({
      dbModel: CityModel,
      idField: 'id',
      ...params,
      associations: overrideAssociations([], params?.associations),
    })
  }
}

//--------------------------------------------------------------------------------
//----------------------------------- ADDRESS ------------------------------------
//--------------------------------------------------------------------------------

export const AddressSchema: Schema = new Schema(
  {
    id: { type: String, required: true, default: v4 },
  },
  { collection: 'addresss' },
)
export const AddressModel = model('Address', AddressSchema)

type AddressFilterFields = {
  id?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  _?: any
}
export type AddressFilter = AddressFilterFields & LogicalOperators<AddressFilterFields>

export type AddressSortKeys = 'id'
export type AddressSort = OneKey<AddressSortKeys, SortDirection> | OneKey<AddressSortKeys, SortDirection>[] | { sorts?: OneKey<AddressSortKeys, SortDirection>[]; _?: any }

export type AddressUpdate = {
  id?: string
  _?: any
}

export type AddressExcludedFields = never

export interface AddressDAOParams<SecurityContext> extends DAOParams<types.Address, 'id', true, AddressFilter, AddressUpdate, AddressExcludedFields, SecurityContext> {}

export class AddressDAO<SecurityContext = any> extends AbstractMongooseDAO<types.Address, 'id', true, AddressFilter, AddressSort, AddressUpdate, AddressExcludedFields, SecurityContext> {
  public constructor(params: { daoContext: AbstractDAOContext } & AddressDAOParams<SecurityContext>) {
    super({
      dbModel: AddressModel,
      idField: 'id',
      ...params,
      associations: overrideAssociations([{ type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'cities', refFrom: 'addressId', refTo: 'id', dao: 'city' }], params?.associations),
    })
  }
}

//--------------------------------------------------------------------------------
//--------------------------------- ORGANIZATION ---------------------------------
//--------------------------------------------------------------------------------

export const OrganizationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, default: v4 },
    name: { type: String, required: true },
    vatNumber: { type: String, required: false },
    address: {
      type: new Schema(
        {
          id: { type: String, required: true, default: v4 },
        },
        { _id: false },
      ),
      required: false,
    },
    customerUsersId: [{ type: String, required: false }],
  },
  { collection: 'organizations' },
)
export const OrganizationModel = model('Organization', OrganizationSchema)

type OrganizationFilterFields = {
  id?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  name?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  vatNumber?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  'address.id'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  _?: any
}
export type OrganizationFilter = OrganizationFilterFields & LogicalOperators<OrganizationFilterFields>

export type OrganizationSortKeys = 'id' | 'name' | 'vatNumber' | 'address.id'
export type OrganizationSort = OneKey<OrganizationSortKeys, SortDirection> | OneKey<OrganizationSortKeys, SortDirection>[] | { sorts?: OneKey<OrganizationSortKeys, SortDirection>[]; _?: any }

export type OrganizationUpdate = {
  id?: string
  name?: string
  vatNumber?: string | null
  address?: types.Address | null
  'address.id'?: string
  _?: any
}

export type OrganizationExcludedFields = 'computedName'

export interface OrganizationDAOParams<SecurityContext> extends DAOParams<types.Organization, 'id', true, OrganizationFilter, OrganizationUpdate, OrganizationExcludedFields, SecurityContext> {}

export class OrganizationDAO<SecurityContext = any> extends AbstractMongooseDAO<types.Organization, 'id', true, OrganizationFilter, OrganizationSort, OrganizationUpdate, OrganizationExcludedFields, SecurityContext> {
  public constructor(params: { daoContext: AbstractDAOContext } & OrganizationDAOParams<SecurityContext>) {
    super({
      dbModel: OrganizationModel,
      idField: 'id',
      ...params,
      associations: overrideAssociations(
        [
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.FOREIGN, field: 'address.cities', refFrom: 'addressId', refTo: 'address.id', dao: 'city' },
          { type: DAOAssociationType.ONE_TO_MANY, reference: DAOAssociationReference.INNER, field: 'customerUsers', refFrom: 'customerUsersId', refTo: 'id', dao: 'customerUser' },
        ],
        params?.associations,
      ),
    })
  }
}

//--------------------------------------------------------------------------------
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export const UserSchema: Schema = new Schema(
  {
    __typename: { type: String, required: false },
    id: { type: String, required: true, default: v4 },
    usernamePasswordCredentials: {
      type: new Schema(
        {
          username: { type: String, required: true },
          password: { type: String, required: true },
        },
        { _id: false },
      ),
      required: false,
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    live: { type: Boolean, required: true },
    localization: { type: PointSchema, required: false },
    title: { type: LocalizedStringSchema, required: false },
    amounts: [{ type: Types.Decimal128, required: false }],
    amount: { type: Types.Decimal128, required: false },
    customerUser: {
      type: new Schema(
        {
          computedOrgName: { type: String, required: false },
          organizationId: { type: String, required: false },
        },
        { _id: false },
      ),
      required: false,
    },
  },
  { collection: 'users' },
)
export const UserModel = model('User', UserSchema)

type UserFilterFields = {
  id?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  'usernamePasswordCredentials.username'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  'usernamePasswordCredentials.password'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  firstName?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  lastName?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  live?: boolean | null | ComparisonOperators<boolean> | ElementOperators<boolean> | EvaluationOperators<boolean>
  localization?: Coordinates | null | ComparisonOperators<Coordinates> | ElementOperators<Coordinates> | EvaluationOperators<Coordinates>
  title?: LocalizedString | null | ComparisonOperators<LocalizedString> | ElementOperators<LocalizedString> | EvaluationOperators<LocalizedString>
  amounts?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber> | ArrayOperators<BigNumber>
  amount?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>
  _?: any
}
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>

export type UserSortKeys = 'id' | 'usernamePasswordCredentials.username' | 'usernamePasswordCredentials.password' | 'firstName' | 'lastName' | 'live' | 'localization' | 'title' | 'amounts' | 'amount'
export type UserSort = OneKey<UserSortKeys, SortDirection> | OneKey<UserSortKeys, SortDirection>[] | { sorts?: OneKey<UserSortKeys, SortDirection>[]; _?: any }

export type UserUpdate = {
  id?: string
  usernamePasswordCredentials?: types.UsernamePasswordCredentials | null
  'usernamePasswordCredentials.username'?: string
  'usernamePasswordCredentials.password'?: string
  firstName?: string | null
  lastName?: string | null
  live?: boolean
  localization?: Coordinates | null
  title?: LocalizedString | null
  amounts?: Array<BigNumber> | null
  amount?: BigNumber | null
  _?: any
}

export type UserExludedFields = never

export interface UserDAOParams<SecurityContext> extends DAOParams<types.User, 'id', true, UserFilter, UserUpdate, UserExludedFields, SecurityContext> {}

export class UserDAO<SecurityContext = any> extends AbstractMongooseDAO<types.User, 'id', true, UserFilter, UserSort, UserUpdate, UserExludedFields, SecurityContext> {
  public constructor(params: { daoContext: AbstractDAOContext } & UserDAOParams<SecurityContext>) {
    super({
      dbModel: UserModel,
      idField: 'id',
      ...params,
      associations: overrideAssociations([{ type: DAOAssociationType.ONE_TO_ONE, reference: DAOAssociationReference.INNER, field: 'customerUser.organization', refFrom: 'customerUser.organizationId', refTo: 'id', dao: 'organization' }], params?.associations),
    })
  }
}

export interface DAOContextParams {
  daoOverrides?: {
    city?: CityDAOParams<SecurityContext>
    address?: AddressDAOParams<SecurityContext>
    organization?: OrganizationDAOParams<SecurityContext>
    user?: UserDAOParams<SecurityContext>
  }
}

export class DAOContext<SecurityContext = any> extends AbstractDAOContext {
  private _city: CityDAO<SecurityContext> | undefined
  private _address: AddressDAO<SecurityContext> | undefined
  private _organization: OrganizationDAO<SecurityContext> | undefined
  private _user: UserDAO<SecurityContext> | undefined

  private daoOverrides: DAOContextParams['daoOverrides']

  get city() {
    if (!this._city) {
      this._city = new CityDAO<SecurityContext>({ daoContext: this, ...this.daoOverrides?.city })
    }
    return this._city
  }
  get address() {
    if (!this._address) {
      this._address = new AddressDAO<SecurityContext>({ daoContext: this, ...this.daoOverrides?.address })
    }
    return this._address
  }
  get organization() {
    if (!this._organization) {
      this._organization = new OrganizationDAO<SecurityContext>({ daoContext: this, ...this.daoOverrides?.organization })
    }
    return this._organization
  }
  get user() {
    if (!this._user) {
      this._user = new UserDAO<SecurityContext>({ daoContext: this, ...this.daoOverrides?.user })
    }
    return this._user
  }

  constructor(options?: DAOContextParams) {
    super()
    this.daoOverrides = options?.daoOverrides
  }
}
