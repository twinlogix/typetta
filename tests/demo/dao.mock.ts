import { DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, DAORelationType, DAORelationReference, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter } from '../../src';
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
  'authorId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'body'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'clicks'?: number | null | EqualityOperators<number> | ElementOperators | StringOperators | QuantityOperators<number>,
  'createdAt'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'metadata.region'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'metadata.visible'?: boolean | null | EqualityOperators<boolean> | ElementOperators | StringOperators,
  'title'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'views'?: number | null | EqualityOperators<number> | ElementOperators | StringOperators | QuantityOperators<number>
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
    visible?: boolean,
  } | boolean,
  tags?: TagProjection | boolean,
  title?: boolean,
  views?: boolean,
};

export type PostSortKeys = 
  'authorId'|
  'body'|
  'clicks'|
  'createdAt'|
  'id'|
  'metadata.region'|
  'metadata.visible'|
  'title'|
  'views';
export type PostSort = OneKey<PostSortKeys, SortDirection>;
export type PostRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostUpdate = {
  'authorId'?: string,
  'body'?: string | null,
  'clicks'?: number | null,
  'createdAt'?: any,
  'id'?: string,
  'metadata'?: types.PostMetadata | null,
  'metadata.region'?: string,
  'metadata.visible'?: boolean,
  'title'?: string,
  'views'?: number
};
export type PostRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type PostInsert = {
  authorId: string,
  body?: string,
  clicks?: number,
  createdAt: any,
  id?: string,
  metadata?: types.PostMetadata,
  title: string,
  views: number,
};

type PostDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Post, 'id', 'ID', 'generator', PostFilter, PostRawFilter, PostRelations, PostProjection, PostSort, PostRawSort, PostInsert, PostUpdate, PostRawUpdate, PostExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
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
          { type: DAORelationType.ONE_TO_MANY, reference: DAORelationReference.FOREIGN, field: 'tags', refFrom: 'postId', refTo: 'id', dao: 'tag' }
        ]
      ), 
      idGeneration: 'generator', 
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
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'name'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'postId'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
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

export type TagSortKeys = 
  'id'|
  'name'|
  'postId';
export type TagSort = OneKey<TagSortKeys, SortDirection>;
export type TagRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type TagUpdate = {
  'id'?: string,
  'name'?: string | null,
  'postId'?: string
};
export type TagRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type TagInsert = {
  id?: string,
  name?: string,
  postId: string,
};

type TagDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Tag, 'id', 'ID', 'generator', TagFilter, TagRawFilter, TagRelations, TagProjection, TagSort, TagRawSort, TagInsert, TagUpdate, TagRawUpdate, TagExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
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
  'createdAt'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'credentials.password'?: any | null | EqualityOperators<any> | ElementOperators | StringOperators,
  'credentials.username'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'email'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
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

export type UserSortKeys = 
  'createdAt'|
  'credentials.password'|
  'credentials.username'|
  'email'|
  'firstName'|
  'id'|
  'lastName';
export type UserSort = OneKey<UserSortKeys, SortDirection>;
export type UserRawSort = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserUpdate = {
  'createdAt'?: any,
  'credentials'?: types.Credentials,
  'credentials.password'?: any | null,
  'credentials.username'?: string | null,
  'email'?: string | null,
  'firstName'?: string | null,
  'id'?: string,
  'lastName'?: string | null
};
export type UserRawUpdate = (builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>

export type UserInsert = {
  createdAt: any,
  credentials: types.Credentials,
  email?: string,
  firstName?: string,
  id?: string,
  lastName?: string,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRawFilter, UserRelations, UserProjection, UserSort, UserRawSort, UserInsert, UserUpdate, UserRawUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
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
    tag?: Pick<Partial<TagDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  scalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>
};

type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType> | TagDAOGenerics<MetadataType, OperationMetadataType> | UserDAOGenerics<MetadataType, OperationMetadataType>>

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined;
  private _tag: TagDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private knex: Record<'default', Knex>;
  
  private middlewares: DAOContextMiddleware<MetadataType, OperationMetadataType>[]
  
  get post() {
    if(!this._post) {
      this._post = new PostDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.post, knex: this.knex.default, tableName: 'posts', middlewares: [...(this.overrides?.post?.middlewares || []), ...this.middlewares as DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._post;
  }
  get tag() {
    if(!this._tag) {
      this._tag = new TagDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.tag, knex: this.knex.default, tableName: 'tags', middlewares: [...(this.overrides?.tag?.middlewares || []), ...this.middlewares as DAOMiddleware<TagDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._tag;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users', middlewares: [...(this.overrides?.user?.middlewares || []), ...this.middlewares as DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]] });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['DateTime', 'Decimal', 'JSON', 'Password', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.knex = params.knex;
    this.middlewares = params.middlewares || []
  }
  
  public async execQuery<T>(run: (dbs: { knex: Record<'default', Knex> }, entities: { post: Knex.QueryBuilder<any, unknown[]>; tag: Knex.QueryBuilder<any, unknown[]>; user: Knex.QueryBuilder<any, unknown[]> }) => Promise<T>): Promise<T> {
    return run({ knex: this.knex }, { post: this.knex.default.table('posts'), tag: this.knex.default.table('tags'), user: this.knex.default.table('users') })
  }

}