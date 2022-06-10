import { Coordinates } from '../../src'
import { LocalizedString } from '../types'
import { BigNumber } from 'bignumber.js'
import { ObjectId } from 'mongodb'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Coordinates: Coordinates
  Decimal: BigNumber
  JSON: any
  Live: boolean
  LocalizedString: LocalizedString
  MongoID: ObjectId
  Password: any
}

export type Address = {
  __typename?: 'Address'
  cities?: Maybe<Array<City>>
  id: Scalars['ID']
}

export type Audit = {
  __typename?: 'Audit'
  changes?: Maybe<Scalars['String']>
  entityId: Scalars['ID']
  id: Scalars['ID']
}

export type Auditable = {
  __typename?: 'Auditable'
  createdBy: Scalars['String']
  createdOn: Scalars['Int']
  deletedOn?: Maybe<Scalars['Int']>
  modifiedBy: Scalars['String']
  modifiedOn: Scalars['Int']
  state: State
  versions: Array<Maybe<Audit>>
}

export type City = {
  __typename?: 'City'
  addressId: Scalars['ID']
  computedAddressName?: Maybe<Scalars['String']>
  computedName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  name: Scalars['String']
}

export type DefaultFieldsEntity = {
  __typename?: 'DefaultFieldsEntity'
  creationDate: Scalars['Int']
  id: Scalars['ID']
  live: Scalars['Live']
  name: Scalars['String']
  opt1?: Maybe<Scalars['Live']>
  opt2?: Maybe<Scalars['Live']>
}

export type Device = {
  __typename?: 'Device'
  id: Scalars['ID']
  name: Scalars['String']
  user?: Maybe<User>
  userId?: Maybe<Scalars['ID']>
}

export type Dog = {
  __typename?: 'Dog'
  id: Scalars['ID']
  name: Scalars['String']
  owner?: Maybe<User>
  ownerId: Scalars['ID']
}

export type EmbeddedUser = {
  __typename?: 'EmbeddedUser'
  e?: Maybe<Array<EmbeddedUser2>>
  user: User
  userId: Scalars['ID']
}

export type EmbeddedUser2 = {
  __typename?: 'EmbeddedUser2'
  user: User
  userId: Scalars['ID']
}

export type EmbeddedUser3 = {
  __typename?: 'EmbeddedUser3'
  user?: Maybe<User>
  value?: Maybe<Scalars['Int']>
}

export type EmbeddedUser4 = {
  __typename?: 'EmbeddedUser4'
  e?: Maybe<EmbeddedUser5>
  user?: Maybe<User>
}

export type EmbeddedUser5 = {
  __typename?: 'EmbeddedUser5'
  userId?: Maybe<Scalars['ID']>
}

export type Hotel = {
  __typename?: 'Hotel'
  audit: Auditable
  embeddedUser3?: Maybe<EmbeddedUser3>
  embeddedUser4?: Maybe<EmbeddedUser4>
  embeddedUsers?: Maybe<Array<EmbeddedUser>>
  embeddedUsers3?: Maybe<Array<EmbeddedUser3>>
  embeddedUsers4?: Maybe<Array<EmbeddedUser4>>
  id: Scalars['ID']
  name: Scalars['String']
  userId?: Maybe<Scalars['ID']>
  users?: Maybe<UserCollection>
}

export type MockedEntity = {
  __typename?: 'MockedEntity'
  id: Scalars['MongoID']
  name: Scalars['String']
  user: User
  userId: Scalars['ID']
}

export type Organization = {
  __typename?: 'Organization'
  address?: Maybe<Address>
  computedName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  name: Scalars['String']
  vatNumber?: Maybe<Scalars['String']>
}

export type Post = {
  __typename?: 'Post'
  author: User
  authorId: Scalars['ID']
  body?: Maybe<Scalars['String']>
  clicks?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  metadata?: Maybe<PostMetadata>
  title: Scalars['String']
  views: Scalars['Int']
}

export type PostMetadata = {
  __typename?: 'PostMetadata'
  region: Scalars['String']
  visible: Scalars['Boolean']
}

export enum State {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  DRAFT = 'DRAFT',
  INACTIVE = 'INACTIVE',
}

export type User = {
  __typename?: 'User'
  amount?: Maybe<Scalars['Decimal']>
  amounts?: Maybe<Array<Scalars['Decimal']>>
  credentials?: Maybe<Array<Maybe<UsernamePasswordCredentials>>>
  dogs?: Maybe<Array<Dog>>
  embeddedPost?: Maybe<Post>
  embeddedUser?: Maybe<EmbeddedUser2>
  firstName?: Maybe<Scalars['String']>
  friends?: Maybe<Array<User>>
  friendsId?: Maybe<Array<Scalars['ID']>>
  id: Scalars['ID']
  int?: Maybe<Scalars['Int']>
  lastName?: Maybe<Scalars['String']>
  live: Scalars['Boolean']
  localization?: Maybe<Scalars['Coordinates']>
  title?: Maybe<Scalars['LocalizedString']>
  usernamePasswordCredentials?: Maybe<UsernamePasswordCredentials>
}

export type UserCollection = {
  __typename?: 'UserCollection'
  users: Array<User>
  usersId: Array<Scalars['ID']>
}

export type UsernamePasswordCredentials = {
  __typename?: 'UsernamePasswordCredentials'
  password: Scalars['Password']
  user?: Maybe<User>
  username: Scalars['String']
}
