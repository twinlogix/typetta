import { DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, DAORelationType, DAORelationReference, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger } from '../../src';
import * as types from './models.mock';
import { KnexJsDAOGenerics, KnexJsDAOParams, AbstractKnexJsDAO } from '../../src';
import { Knex } from 'knex';

//--------------------------------------------------------------------------------
//------------------------------------- POST -------------------------------------
//--------------------------------------------------------------------------------

export type PostExcludedFields = 'author' | 'tags'

export const postSchema: Schema<types.Scalars> = {
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
  'createdAt': {
    scalar: 'DateTime', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'metadata': {
    embedded: {
      'region': {
        scalar: 'String', 
        required: true
      },
      'typeId': {
        scalar: 'ID', 
        required: true
      },
      'visible': {
        scalar: 'Boolean', 
        required: true
      }
    }
  },
  'title': {
    scalar: 'String', 
    required: true
  },
  'views': {
    scalar: 'Int', 
    required: true
  }
};

type PostFilterFields = {
  'authorId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'body'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'clicks'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>,
  'createdAt'?: types.Scalars['DateTime'] | null | EqualityOperators<types.Scalars['DateTime']> | ElementOperators | QuantityOperators<types.Scalars['DateTime']>,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'metadata.region'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'metadata.typeId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'metadata.visible'?: types.Scalars['Boolean'] | null | EqualityOperators<types.Scalars['Boolean']> | ElementOperators,
  'title'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'views'?: types.Scalars['Int'] | null | EqualityOperators<types.Scalars['Int']> | ElementOperators | QuantityOperators<types.Scalars['Int']>
};
export type PostFilter = PostFilterFields & LogicalOperators<PostFilterFields>;
export type PostRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostRelations = {
  tags?: {
    filter?: TagFilter
    sorts?: TagSort[] | TagRawSort
    skip?: number
    limit?: number
    relations?: TagRelations
  }
}

export type PostProjection = {
  author?: UserProjection | boolean,
  authorId?: boolean,
  body?: boolean,
  clicks?: boolean,
  createdAt?: boolean,
  id?: boolean,
  metadata?: {
    region?: boolean,
    type?: PostTypeProjection | boolean,
    typeId?: boolean,
    visible?: boolean,
  } | boolean,
  tags?: TagProjection | boolean,
  title?: boolean,
  views?: boolean,
};

export type PostSortKeys = 'authorId' | 'body' | 'clicks' | 'createdAt' | 'id' | 'metadata.region' | 'metadata.typeId' | 'metadata.visible' | 'title' | 'views';
export type PostSort = OneKey<PostSortKeys, SortDirection>;
export type PostRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostUpdate = {
  'authorId'?: types.Scalars['ID'],
  'body'?: types.Scalars['String'] | null,
  'clicks'?: types.Scalars['Int'] | null,
  'createdAt'?: types.Scalars['DateTime'],
  'id'?: types.Scalars['ID'],
  'metadata'?: types.PostMetadata | null,
  'metadata.region'?: types.Scalars['String'],
  'metadata.typeId'?: types.Scalars['ID'],
  'metadata.visible'?: types.Scalars['Boolean'],
  'title'?: types.Scalars['String'],
  'views'?: types.Scalars['Int']
};
export type PostRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostInsert = {
  authorId: types.Scalars['ID'],
  body?: types.Scalars['String'],
  clicks?: types.Scalars['Int'],
  createdAt: types.Scalars['DateTime'],
  id?: types.Scalars['ID'],
  metadata?: types.PostMetadata,
  title: types.Scalars['String'],
  views: types.Scalars['Int'],
};

type PostDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Post, 'id', 'ID', 'generator', PostFilter, PostRawFilter, PostRelations, PostProjection, PostSort, PostRawSort, PostInsert, PostUpdate, PostRawUpdate, PostExcludedFields, MetadataType, OperationMetadataType, types.Scalars, 'post'>;
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class PostDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: postSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'author', refFrom: 'authorId', refTo: 'id', dao: 'user' },
          { type: DAORelationType.ONE_TO_ONE, reference: DAORelationReference.INNER, field: 'metadata.type', refFrom: 'metadata.typeId', refTo: 'id', dao: 'postType' },
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'tags', refFrom: 'postId', refTo: 'id', dao: 'tag' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}



//--------------------------------------------------------------------------------
//----------------------------------- POSTTYPE -----------------------------------
//--------------------------------------------------------------------------------

export type PostTypeExcludedFields = never

export const postTypeSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String', 
    required: true
  }
};

type PostTypeFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type PostTypeFilter = PostTypeFilterFields & LogicalOperators<PostTypeFilterFields>;
export type PostTypeRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostTypeRelations = {

}

export type PostTypeProjection = {
  id?: boolean,
  name?: boolean,
};

export type PostTypeSortKeys = 'id' | 'name';
export type PostTypeSort = OneKey<PostTypeSortKeys, SortDirection>;
export type PostTypeRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostTypeUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String']
};
export type PostTypeRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostTypeInsert = {
  id: types.Scalars['ID'],
  name: types.Scalars['String'],
};

type PostTypeDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.PostType, 'id', 'ID', 'user', PostTypeFilter, PostTypeRawFilter, PostTypeRelations, PostTypeProjection, PostTypeSort, PostTypeRawSort, PostTypeInsert, PostTypeUpdate, PostTypeRawUpdate, PostTypeExcludedFields, MetadataType, OperationMetadataType, types.Scalars, 'postType'>;
export type PostTypeDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<PostTypeDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class PostTypeDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<PostTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: PostTypeDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: postTypeSchema, 
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
//------------------------------------- TAG --------------------------------------
//--------------------------------------------------------------------------------

export type TagExcludedFields = never

export const tagSchema: Schema<types.Scalars> = {
  'id': {
    scalar: 'ID', 
    required: true
  },
  'name': {
    scalar: 'String'
  },
  'postId': {
    scalar: 'ID', 
    required: true
  }
};

type TagFilterFields = {
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'name'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'postId'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators
};
export type TagFilter = TagFilterFields & LogicalOperators<TagFilterFields>;
export type TagRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type TagRelations = {

}

export type TagProjection = {
  id?: boolean,
  name?: boolean,
  postId?: boolean,
};

export type TagSortKeys = 'id' | 'name' | 'postId';
export type TagSort = OneKey<TagSortKeys, SortDirection>;
export type TagRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type TagUpdate = {
  'id'?: types.Scalars['ID'],
  'name'?: types.Scalars['String'] | null,
  'postId'?: types.Scalars['ID']
};
export type TagRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type TagInsert = {
  id?: types.Scalars['ID'],
  name?: types.Scalars['String'],
  postId: types.Scalars['ID'],
};

type TagDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Tag, 'id', 'ID', 'generator', TagFilter, TagRawFilter, TagRelations, TagProjection, TagSort, TagRawSort, TagInsert, TagUpdate, TagRawUpdate, TagExcludedFields, MetadataType, OperationMetadataType, types.Scalars, 'tag'>;
export type TagDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<TagDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class TagDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<TagDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: TagDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: tagSchema, 
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
//------------------------------------- USER -------------------------------------
//--------------------------------------------------------------------------------

export type UserExcludedFields = 'averageViewsPerPost' | 'posts' | 'totalPostsViews'

export const userSchema: Schema<types.Scalars> = {
  'createdAt': {
    scalar: 'DateTime', 
    required: true
  },
  'credentials': {
    embedded: {
      'password': {
        scalar: 'Password'
      },
      'username': {
        scalar: 'String'
      }
    }, 
    required: true
  },
  'email': {
    scalar: 'String'
  },
  'firstName': {
    scalar: 'String'
  },
  'id': {
    scalar: 'ID', 
    required: true
  },
  'lastName': {
    scalar: 'String'
  }
};

type UserFilterFields = {
  'createdAt'?: types.Scalars['DateTime'] | null | EqualityOperators<types.Scalars['DateTime']> | ElementOperators | QuantityOperators<types.Scalars['DateTime']>,
  'credentials.password'?: types.Scalars['Password'] | null | EqualityOperators<types.Scalars['Password']> | ElementOperators | StringOperators,
  'credentials.username'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'email'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'firstName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators,
  'id'?: types.Scalars['ID'] | null | EqualityOperators<types.Scalars['ID']> | ElementOperators,
  'lastName'?: types.Scalars['String'] | null | EqualityOperators<types.Scalars['String']> | ElementOperators | StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;
export type UserRawFilter = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserRelations = {
  posts?: {
    filter?: PostFilter
    sorts?: PostSort[] | PostRawSort
    skip?: number
    limit?: number
    relations?: PostRelations
  }
}

export type UserProjection = {
  averageViewsPerPost?: boolean,
  createdAt?: boolean,
  credentials?: {
    password?: boolean,
    username?: boolean,
  } | boolean,
  email?: boolean,
  firstName?: boolean,
  id?: boolean,
  lastName?: boolean,
  posts?: PostProjection | boolean,
  totalPostsViews?: boolean,
};

export type UserSortKeys = 'createdAt' | 'credentials.password' | 'credentials.username' | 'email' | 'firstName' | 'id' | 'lastName';
export type UserSort = OneKey<UserSortKeys, SortDirection>;
export type UserRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserUpdate = {
  'createdAt'?: types.Scalars['DateTime'],
  'credentials'?: types.Credentials,
  'credentials.password'?: types.Scalars['Password'] | null,
  'credentials.username'?: types.Scalars['String'] | null,
  'email'?: types.Scalars['String'] | null,
  'firstName'?: types.Scalars['String'] | null,
  'id'?: types.Scalars['ID'],
  'lastName'?: types.Scalars['String'] | null
};
export type UserRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserInsert = {
  createdAt: types.Scalars['DateTime'],
  credentials: types.Credentials,
  email?: types.Scalars['String'],
  firstName?: types.Scalars['String'],
  id?: types.Scalars['ID'],
  lastName?: types.Scalars['String'],
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars, 'user'>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>

export class UserDAO<MetadataType, OperationMetadataType> extends AbstractKnexJsDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      idField: 'id', 
      schema: userSchema, 
      relations: overrideRelations(
        [
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'posts', refFrom: 'authorId', refTo: 'id', dao: 'post' }
        ]
      ), 
      idGeneration: 'generator', 
      idScalar: 'ID' 
    });
  }
  
}

export type DAOContextParams<MetadataType, OperationMetadataType> = {
  metadata?: MetadataType
  middlewares?: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  overrides?: { 
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    postType?: Pick<Partial<PostTypeDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    tag?: Pick<Partial<TagDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>,
  log?: LogInput<'post' | 'postType' | 'tag' | 'user'>
};

type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType> | PostTypeDAOGenerics<MetadataType, OperationMetadataType> | TagDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined;
  private _postType: PostTypeDAO<MetadataType, OperationMetadataType> | undefined;
  private _tag: TagDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private knex: Record<'default', Knex>;
  
  private middlewares: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  
  private logger?: LogFunction<'post' | 'postType' | 'tag' | 'user'>
  
  get post() {
    if(!this._post) {
      this._post = new PostDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.post, knex: this.knex.default, tableName: 'posts', middlewares: [...(this.overrides?.post?.middlewares || []), ...this.middlewares as DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'post', logger: this.logger });
    }
    return this._post;
  }
  get postType() {
    if(!this._postType) {
      this._postType = new PostTypeDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.postType, knex: this.knex.default, tableName: 'postTypes', middlewares: [...(this.overrides?.postType?.middlewares || []), ...this.middlewares as DAOMiddleware<PostTypeDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'postType', logger: this.logger });
    }
    return this._postType;
  }
  get tag() {
    if(!this._tag) {
      this._tag = new TagDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.tag, knex: this.knex.default, tableName: 'tags', middlewares: [...(this.overrides?.tag?.middlewares || []), ...this.middlewares as DAOMiddleware<TagDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'tag', logger: this.logger });
    }
    return this._tag;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users', middlewares: [...(this.overrides?.user?.middlewares || []), ...this.middlewares as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'user', logger: this.logger });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['DateTime', 'Decimal', 'JSON', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.knex = params.knex
    this.middlewares = params.middlewares || []
    this.logger = logInputToLogger(params.log)
  }
  
  public async execQuery<T>(run: (dbs: { knex: Record<'default', Knex> }, entities: { post: Knex.QueryBuilder<any, unknown[]>; postType: Knex.QueryBuilder<any, unknown[]>; tag: Knex.QueryBuilder<any, unknown[]>; user: Knex.QueryBuilder<any, unknown[]> }) => Promise<T>): Promise<T> {
    return run({ knex: this.knex }, { post: this.knex.default.table('posts'), postType: this.knex.default.table('postTypes'), tag: this.knex.default.table('tags'), user: this.knex.default.table('users') })
  }

}