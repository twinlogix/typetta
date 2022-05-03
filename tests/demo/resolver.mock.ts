import { PartialDeep } from 'type-fest'
import * as types from './input.mock'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DAOContext } from './dao.mock';


export type ResolverTypeWrapper<T> = PartialDeep<T>;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => types.Maybe<TTypes> | Promise<types.Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<types.Scalars['Boolean']>;
  BooleanFilterInput: types.BooleanFilterInput;
  Credentials: ResolverTypeWrapper<types.Credentials>;
  CredentialsInsertInput: types.CredentialsInsertInput;
  CredentialsUpdateInput: types.CredentialsUpdateInput;
  DateTime: ResolverTypeWrapper<types.Scalars['DateTime']>;
  DateTimeFilterInput: types.DateTimeFilterInput;
  Decimal: ResolverTypeWrapper<types.Scalars['Decimal']>;
  DecimalFilterInput: types.DecimalFilterInput;
  Float: ResolverTypeWrapper<types.Scalars['Float']>;
  FloatFilterInput: types.FloatFilterInput;
  ID: ResolverTypeWrapper<types.Scalars['ID']>;
  IDFilterInput: types.IdFilterInput;
  Int: ResolverTypeWrapper<types.Scalars['Int']>;
  IntFilterInput: types.IntFilterInput;
  JSON: ResolverTypeWrapper<types.Scalars['JSON']>;
  JSONFilterInput: types.JsonFilterInput;
  Mutation: ResolverTypeWrapper<{}>;
  Password: ResolverTypeWrapper<types.Scalars['Password']>;
  PasswordFilterInput: types.PasswordFilterInput;
  Post: ResolverTypeWrapper<types.Post>;
  PostFilterInput: types.PostFilterInput;
  PostFindInput: types.PostFindInput;
  PostInsertInput: types.PostInsertInput;
  PostMetadata: ResolverTypeWrapper<types.PostMetadata>;
  PostMetadataInsertInput: types.PostMetadataInsertInput;
  PostMetadataUpdateInput: types.PostMetadataUpdateInput;
  PostRelationsFilterInput: types.PostRelationsFilterInput;
  PostSortInput: types.PostSortInput;
  PostType: ResolverTypeWrapper<types.PostType>;
  PostTypeFilterInput: types.PostTypeFilterInput;
  PostTypeFindInput: types.PostTypeFindInput;
  PostTypeInsertInput: types.PostTypeInsertInput;
  PostTypeSortInput: types.PostTypeSortInput;
  PostTypeUpdateInput: types.PostTypeUpdateInput;
  PostUpdateInput: types.PostUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  SortDirection: types.SortDirection;
  String: ResolverTypeWrapper<types.Scalars['String']>;
  StringFilterInput: types.StringFilterInput;
  StringFilterMode: types.StringFilterMode;
  Tag: ResolverTypeWrapper<types.Tag>;
  TagFilterInput: types.TagFilterInput;
  TagFindInput: types.TagFindInput;
  TagInsertInput: types.TagInsertInput;
  TagSortInput: types.TagSortInput;
  TagUpdateInput: types.TagUpdateInput;
  User: ResolverTypeWrapper<types.User>;
  UserFilterInput: types.UserFilterInput;
  UserFindInput: types.UserFindInput;
  UserInsertInput: types.UserInsertInput;
  UserRelationsFilterInput: types.UserRelationsFilterInput;
  UserSortInput: types.UserSortInput;
  UserUpdateInput: types.UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: types.Scalars['Boolean'];
  BooleanFilterInput: types.BooleanFilterInput;
  Credentials: types.Credentials;
  CredentialsInsertInput: types.CredentialsInsertInput;
  CredentialsUpdateInput: types.CredentialsUpdateInput;
  DateTime: types.Scalars['DateTime'];
  DateTimeFilterInput: types.DateTimeFilterInput;
  Decimal: types.Scalars['Decimal'];
  DecimalFilterInput: types.DecimalFilterInput;
  Float: types.Scalars['Float'];
  FloatFilterInput: types.FloatFilterInput;
  ID: types.Scalars['ID'];
  IDFilterInput: types.IdFilterInput;
  Int: types.Scalars['Int'];
  IntFilterInput: types.IntFilterInput;
  JSON: types.Scalars['JSON'];
  JSONFilterInput: types.JsonFilterInput;
  Mutation: {};
  Password: types.Scalars['Password'];
  PasswordFilterInput: types.PasswordFilterInput;
  Post: types.Post;
  PostFilterInput: types.PostFilterInput;
  PostFindInput: types.PostFindInput;
  PostInsertInput: types.PostInsertInput;
  PostMetadata: types.PostMetadata;
  PostMetadataInsertInput: types.PostMetadataInsertInput;
  PostMetadataUpdateInput: types.PostMetadataUpdateInput;
  PostRelationsFilterInput: types.PostRelationsFilterInput;
  PostSortInput: types.PostSortInput;
  PostType: types.PostType;
  PostTypeFilterInput: types.PostTypeFilterInput;
  PostTypeFindInput: types.PostTypeFindInput;
  PostTypeInsertInput: types.PostTypeInsertInput;
  PostTypeSortInput: types.PostTypeSortInput;
  PostTypeUpdateInput: types.PostTypeUpdateInput;
  PostUpdateInput: types.PostUpdateInput;
  Query: {};
  String: types.Scalars['String'];
  StringFilterInput: types.StringFilterInput;
  Tag: types.Tag;
  TagFilterInput: types.TagFilterInput;
  TagFindInput: types.TagFindInput;
  TagInsertInput: types.TagInsertInput;
  TagSortInput: types.TagSortInput;
  TagUpdateInput: types.TagUpdateInput;
  User: types.User;
  UserFilterInput: types.UserFilterInput;
  UserFindInput: types.UserFindInput;
  UserInsertInput: types.UserInsertInput;
  UserRelationsFilterInput: types.UserRelationsFilterInput;
  UserSortInput: types.UserSortInput;
  UserUpdateInput: types.UserUpdateInput;
};

export type CredentialsResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['Credentials'] = ResolversParentTypes['Credentials']> = {
  password?: Resolver<types.Maybe<ResolversTypes['Password']>, ParentType, ContextType>;
  username?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, Partial<types.MutationCreatePostArgs>>;
  createPostType?: Resolver<ResolversTypes['PostType'], ParentType, ContextType, Partial<types.MutationCreatePostTypeArgs>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, Partial<types.MutationCreateTagArgs>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<types.MutationCreateUserArgs>>;
  deletePostTypes?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationDeletePostTypesArgs>>;
  deletePosts?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationDeletePostsArgs>>;
  deleteTags?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationDeleteTagsArgs>>;
  deleteUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationDeleteUsersArgs>>;
  updatePostTypes?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationUpdatePostTypesArgs>>;
  updatePosts?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationUpdatePostsArgs>>;
  updateTags?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationUpdateTagsArgs>>;
  updateUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<types.MutationUpdateUsersArgs>>;
};

export interface PasswordScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Password'], any> {
  name: 'Password';
}

export type PostResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<types.Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  body?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clicks?: Resolver<types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<types.Maybe<ResolversTypes['PostMetadata']>, ParentType, ContextType>;
  tags?: Resolver<types.Maybe<Array<ResolversTypes['Tag']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostMetadataResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['PostMetadata'] = ResolversParentTypes['PostMetadata']> = {
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<types.Maybe<ResolversTypes['PostType']>, ParentType, ContextType>;
  typeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  visible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostTypeResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['PostType'] = ResolversParentTypes['PostType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  postTypes?: Resolver<Array<ResolversTypes['PostType']>, ParentType, ContextType, Partial<types.QueryPostTypesArgs>>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<types.QueryPostsArgs>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, Partial<types.QueryTagsArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<types.QueryUsersArgs>>;
};

export type TagResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = DAOContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  averageViewsPerPost?: Resolver<types.Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  credentials?: Resolver<ResolversTypes['Credentials'], ParentType, ContextType>;
  email?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  posts?: Resolver<types.Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  totalPostsViews?: Resolver<types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = DAOContext> = {
  Credentials?: CredentialsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Decimal?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Password?: GraphQLScalarType;
  Post?: PostResolvers<ContextType>;
  PostMetadata?: PostMetadataResolvers<ContextType>;
  PostType?: PostTypeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

