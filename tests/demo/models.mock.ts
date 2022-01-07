import BigNumber from "bignumber.js";
import { Coordinates, LocalizedString } from "@twinlogix/typetta";
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
  DateTime: Date;
  Decimal: BigNumber;
  JSON: any;
  Password: string;
};

export type Credentials = {
  __typename?: 'Credentials';
  password?: Maybe<Scalars['Password']>;
  username?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  authorId: Scalars['ID'];
  body?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  metadata?: Maybe<PostMetadata>;
  tags?: Maybe<Array<Tag>>;
  title: Scalars['String'];
  views: Scalars['Int'];
};

export type PostMetadata = {
  __typename?: 'PostMetadata';
  region: Scalars['String'];
  visible: Scalars['Boolean'];
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  postId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  averageViewsPerPost?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  credentials: Credentials;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Post>>;
  totalPostsViews?: Maybe<Scalars['Int']>;
};
