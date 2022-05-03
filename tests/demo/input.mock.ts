import { BigNumber } from 'bignumber.js';
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

export type BooleanFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  ne?: InputMaybe<Scalars['Boolean']>;
  nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type Credentials = {
  __typename?: 'Credentials';
  password?: Maybe<Scalars['Password']>;
  username?: Maybe<Scalars['String']>;
};

export type CredentialsInsertInput = {
  password?: InputMaybe<Scalars['Password']>;
  username?: InputMaybe<Scalars['String']>;
};

export type CredentialsUpdateInput = {
  password?: InputMaybe<Scalars['Password']>;
  username?: InputMaybe<Scalars['String']>;
};

export type DateTimeFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  ne?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type DecimalFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Decimal']>;
  gte?: InputMaybe<Scalars['Decimal']>;
  in?: InputMaybe<Array<Scalars['Decimal']>>;
  lt?: InputMaybe<Scalars['Decimal']>;
  lte?: InputMaybe<Scalars['Decimal']>;
  ne?: InputMaybe<Scalars['Decimal']>;
  nin?: InputMaybe<Array<Scalars['Decimal']>>;
};

export type FloatFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  nin?: InputMaybe<Array<Scalars['Float']>>;
};

export type IdFilterInput = {
  eq?: InputMaybe<Scalars['ID']>;
  exists?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<Scalars['ID']>>;
  ne?: InputMaybe<Scalars['ID']>;
  nin?: InputMaybe<Array<Scalars['ID']>>;
};

export type IntFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<Scalars['Int']>>;
};

export type JsonFilterInput = {
  eq?: InputMaybe<Scalars['JSON']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['JSON']>>;
  ne?: InputMaybe<Scalars['JSON']>;
  nin?: InputMaybe<Array<Scalars['JSON']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createPostType: PostType;
  createTag: Tag;
  createUser: User;
  deletePostTypes?: Maybe<Scalars['Boolean']>;
  deletePosts?: Maybe<Scalars['Boolean']>;
  deleteTags?: Maybe<Scalars['Boolean']>;
  deleteUsers?: Maybe<Scalars['Boolean']>;
  updatePostTypes?: Maybe<Scalars['Boolean']>;
  updatePosts?: Maybe<Scalars['Boolean']>;
  updateTags?: Maybe<Scalars['Boolean']>;
  updateUsers?: Maybe<Scalars['Boolean']>;
};


export type MutationCreatePostArgs = {
  record?: InputMaybe<PostInsertInput>;
};


export type MutationCreatePostTypeArgs = {
  record?: InputMaybe<PostTypeInsertInput>;
};


export type MutationCreateTagArgs = {
  record?: InputMaybe<TagInsertInput>;
};


export type MutationCreateUserArgs = {
  record?: InputMaybe<UserInsertInput>;
};


export type MutationDeletePostTypesArgs = {
  filter?: InputMaybe<PostTypeFilterInput>;
};


export type MutationDeletePostsArgs = {
  filter?: InputMaybe<PostFilterInput>;
};


export type MutationDeleteTagsArgs = {
  filter?: InputMaybe<TagFilterInput>;
};


export type MutationDeleteUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
};


export type MutationUpdatePostTypesArgs = {
  changes?: InputMaybe<PostTypeUpdateInput>;
  filter?: InputMaybe<PostTypeFilterInput>;
};


export type MutationUpdatePostsArgs = {
  changes?: InputMaybe<PostUpdateInput>;
  filter?: InputMaybe<PostFilterInput>;
};


export type MutationUpdateTagsArgs = {
  changes?: InputMaybe<TagUpdateInput>;
  filter?: InputMaybe<TagFilterInput>;
};


export type MutationUpdateUsersArgs = {
  changes?: InputMaybe<UserUpdateInput>;
  filter?: InputMaybe<UserFilterInput>;
};

export type PasswordFilterInput = {
  contains?: InputMaybe<Scalars['Password']>;
  endsWith?: InputMaybe<Scalars['Password']>;
  eq?: InputMaybe<Scalars['Password']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Password']>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<Scalars['Password']>;
  nin?: InputMaybe<Array<Scalars['Password']>>;
  startsWith?: InputMaybe<Scalars['Password']>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  authorId: Scalars['ID'];
  body?: Maybe<Scalars['String']>;
  clicks?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  metadata?: Maybe<PostMetadata>;
  tags?: Maybe<Array<Tag>>;
  title: Scalars['String'];
  views: Scalars['Int'];
};

export type PostFilterInput = {
  authorId?: InputMaybe<IdFilterInput>;
  body?: InputMaybe<StringFilterInput>;
  clicks?: InputMaybe<IntFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  views?: InputMaybe<IntFilterInput>;
};

export type PostFindInput = {
  filter?: InputMaybe<PostFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<PostRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<PostSortInput>>;
};

export type PostInsertInput = {
  authorId: Scalars['ID'];
  body?: InputMaybe<Scalars['String']>;
  clicks?: InputMaybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  metadata?: InputMaybe<PostMetadata>;
  title: Scalars['String'];
  views: Scalars['Int'];
};

export type PostMetadata = {
  __typename?: 'PostMetadata';
  region: Scalars['String'];
  type?: Maybe<PostType>;
  typeId: Scalars['ID'];
  visible: Scalars['Boolean'];
};

export type PostMetadataInsertInput = {
  region: Scalars['String'];
  typeId: Scalars['ID'];
  visible: Scalars['Boolean'];
};

export type PostMetadataUpdateInput = {
  region?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['ID']>;
  visible?: InputMaybe<Scalars['Boolean']>;
};

export type PostRelationsFilterInput = {
  author?: InputMaybe<UserFindInput>;
  tags?: InputMaybe<TagFindInput>;
};

export type PostSortInput = {
  authorId?: InputMaybe<SortDirection>;
  body?: InputMaybe<SortDirection>;
  clicks?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  title?: InputMaybe<SortDirection>;
  views?: InputMaybe<SortDirection>;
};

export type PostType = {
  __typename?: 'PostType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type PostTypeFilterInput = {
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
};

export type PostTypeFindInput = {
  filter?: InputMaybe<PostTypeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<PostTypeSortInput>>;
};

export type PostTypeInsertInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type PostTypeSortInput = {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
};

export type PostTypeUpdateInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PostUpdateInput = {
  authorId?: InputMaybe<Scalars['ID']>;
  body?: InputMaybe<Scalars['String']>;
  clicks?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  metadata?: InputMaybe<PostMetadataUpdateInput>;
  title?: InputMaybe<Scalars['String']>;
  views?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  postTypes: Array<PostType>;
  posts: Array<Post>;
  tags: Array<Tag>;
  users: Array<User>;
};


export type QueryPostTypesArgs = {
  filter?: InputMaybe<PostTypeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<PostTypeSortInput>>;
};


export type QueryPostsArgs = {
  filter?: InputMaybe<PostFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<PostRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<PostSortInput>>;
};


export type QueryTagsArgs = {
  filter?: InputMaybe<TagFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<TagSortInput>>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSortInput>>;
};

export const SortDirection = {
  Asc: 'ASC',
  Desc: 'DESC'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export type StringFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export const StringFilterMode = {
  Insensitive: 'INSENSITIVE',
  Sensitive: 'SENSITIVE'
} as const;

export type StringFilterMode = typeof StringFilterMode[keyof typeof StringFilterMode];
export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  postId: Scalars['ID'];
};

export type TagFilterInput = {
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  postId?: InputMaybe<IdFilterInput>;
};

export type TagFindInput = {
  filter?: InputMaybe<TagFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<TagSortInput>>;
};

export type TagInsertInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  postId: Scalars['ID'];
};

export type TagSortInput = {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  postId?: InputMaybe<SortDirection>;
};

export type TagUpdateInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  postId?: InputMaybe<Scalars['ID']>;
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

export type UserFilterInput = {
  averageViewsPerPost?: InputMaybe<FloatFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  firstName?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  lastName?: InputMaybe<StringFilterInput>;
  totalPostsViews?: InputMaybe<IntFilterInput>;
};

export type UserFindInput = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSortInput>>;
};

export type UserInsertInput = {
  averageViewsPerPost?: InputMaybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  credentials: Credentials;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  totalPostsViews?: InputMaybe<Scalars['Int']>;
};

export type UserRelationsFilterInput = {
  posts?: InputMaybe<PostFindInput>;
};

export type UserSortInput = {
  averageViewsPerPost?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  email?: InputMaybe<SortDirection>;
  firstName?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  lastName?: InputMaybe<SortDirection>;
  totalPostsViews?: InputMaybe<SortDirection>;
};

export type UserUpdateInput = {
  averageViewsPerPost?: InputMaybe<Scalars['Float']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  credentials?: InputMaybe<CredentialsUpdateInput>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  lastName?: InputMaybe<Scalars['String']>;
  totalPostsViews?: InputMaybe<Scalars['Int']>;
};
