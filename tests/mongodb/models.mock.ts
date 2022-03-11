import { Coordinates } from '../../src';
import { BigNumber } from 'bignumber.js';
import { LocalizedString } from '../../src';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Coordinates: Coordinates;
  Decimal: BigNumber;
  JSON: any;
  Live: boolean;
  LocalizedString: LocalizedString;
  Password: any;
};

export type Address = {
  __typename?: 'Address';
  cities?: Maybe<Array<City>>;
  id: Scalars['ID'];
};

export type Audit = {
  __typename?: 'Audit';
  changes?: Maybe<Scalars['String']>;
  entityId: Scalars['ID'];
  id: Scalars['ID'];
};

export type Auditable = {
  __typename?: 'Auditable';
  createdBy: Scalars['String'];
  createdOn: Scalars['Int'];
  deletedOn?: Maybe<Scalars['Int']>;
  modifiedBy: Scalars['String'];
  modifiedOn: Scalars['Int'];
  state: State;
  versions: Array<Maybe<Audit>>;
};

export type City = {
  __typename?: 'City';
  addressId: Scalars['ID'];
  computedAddressName?: Maybe<Scalars['String']>;
  computedName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type DefaultFieldsEntity = {
  __typename?: 'DefaultFieldsEntity';
  creationDate: Scalars['Int'];
  id: Scalars['ID'];
  live: Scalars['Live'];
  name: Scalars['String'];
  opt1?: Maybe<Scalars['Live']>;
  opt2?: Maybe<Scalars['Live']>;
};

export type Device = {
  __typename?: 'Device';
  id: Scalars['ID'];
  name: Scalars['String'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']>;
};

export type Dog = {
  __typename?: 'Dog';
  id: Scalars['ID'];
  name: Scalars['String'];
  owner?: Maybe<User>;
  ownerId: Scalars['ID'];
};

export type Hotel = {
  __typename?: 'Hotel';
  audit: Auditable;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MockedEntity = {
  __typename?: 'MockedEntity';
  id: Scalars['ID'];
  name: Scalars['String'];
  user: User;
  userId: Scalars['ID'];
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Address>;
  computedName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  vatNumber?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  authorId: Scalars['ID'];
  body?: Maybe<Scalars['String']>;
  clicks?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  metadata?: Maybe<PostMetadata>;
  title: Scalars['String'];
  views: Scalars['Int'];
};

export type PostMetadata = {
  __typename?: 'PostMetadata';
  region: Scalars['String'];
  visible: Scalars['Boolean'];
};

export enum State {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  DRAFT = 'DRAFT',
  INACTIVE = 'INACTIVE'
}

export type User = {
  __typename?: 'User';
  amount?: Maybe<Scalars['Decimal']>;
  amounts?: Maybe<Array<Scalars['Decimal']>>;
  dogs?: Maybe<Array<Dog>>;
  firstName?: Maybe<Scalars['String']>;
  friends?: Maybe<Array<User>>;
  friendsId?: Maybe<Array<Scalars['ID']>>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  live: Scalars['Boolean'];
  localization?: Maybe<Scalars['Coordinates']>;
  title?: Maybe<Scalars['LocalizedString']>;
  usernamePasswordCredentials?: Maybe<UsernamePasswordCredentials>;
};

export type UsernamePasswordCredentials = {
  __typename?: 'UsernamePasswordCredentials';
  password: Scalars['Password'];
  username: Scalars['String'];
};
