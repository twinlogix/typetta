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
  Date: Date;
};

export type Like = {
  __typename?: 'Like';
  creationDate: Scalars['Date'];
  id: Scalars['ID'];
  postId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Metadata = {
  __typename?: 'Metadata';
  tags?: Maybe<Array<Scalars['String']>>;
  views?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  creationDate: Scalars['Date'];
  id: Scalars['ID'];
  likes: Array<User>;
  metadata?: Maybe<Metadata>;
  userId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  birthDate?: Maybe<Scalars['Date']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  likes: Array<Post>;
  posts?: Maybe<Array<Post>>;
};
