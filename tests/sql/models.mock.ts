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
  LocalizedString: LocalizedString;
  Password: string;
};

export type Address = {
  __typename?: 'Address';
  cities?: Maybe<Array<City>>;
  id: Scalars['ID'];
};

export type Another = {
  __typename?: 'Another';
  test?: Maybe<Scalars['String']>;
};

export type City = {
  __typename?: 'City';
  addressId: Scalars['ID'];
  computedAddressName?: Maybe<Scalars['String']>;
  computedName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
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

export type Friends = {
  __typename?: 'Friends';
  from: Scalars['ID'];
  id: Scalars['ID'];
  to: Scalars['ID'];
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Address>;
  computedName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  vatNumber?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  amount?: Maybe<Scalars['Decimal']>;
  amounts?: Maybe<Array<Scalars['Decimal']>>;
  bestFriend?: Maybe<User>;
  bestFriendId?: Maybe<Scalars['ID']>;
  credentials?: Maybe<UsernamePasswordCredentials>;
  dogs?: Maybe<Array<Dog>>;
  firstName?: Maybe<Scalars['String']>;
  friends?: Maybe<Array<Maybe<User>>>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  live: Scalars['Boolean'];
  localization?: Maybe<Scalars['Coordinates']>;
  title?: Maybe<Scalars['LocalizedString']>;
};

export type UsernamePasswordCredentials = {
  __typename?: 'UsernamePasswordCredentials';
  another?: Maybe<Another>;
  password: Scalars['Password'];
  username: Scalars['String'];
};
