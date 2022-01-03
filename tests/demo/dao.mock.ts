import BigNumber from "bignumber.js";
import { MongoDBDAOGenerics, KnexJsDAOGenerics, Coordinates, LocalizedString, DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAORelationType, DAORelationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideRelations } from '@twinlogix/typetta';
import * as types from './models.mock';
import { Db } from 'mongodb';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid'

//--------------------------------------------------------------------------------
//------------------------------------- POST -------------------------------------
//--------------------------------------------------------------------------------

export type PostExcludedFields = 'author' | 'tags'

export const postSchema : Schema<types.Scalars>= {
  'authorId': {
    scalar: 'ID', 
    required: true
  },
  'body': {
    scalar: 'String'
  },
  'createdAt': {
    scalar: 'DateTime', 
    required: true
  },
  'id': {
    scalar: 'ID', 
    required: true
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
  'createdAt'?: Date | null | EqualityOperators<Date> | ElementOperators | QuantityOperators<Date>,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'title'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'views'?: number | null | EqualityOperators<number> | ElementOperators | QuantityOperators<number>
};
export type PostFilter = PostFilterFields & LogicalOperators<PostFilterFields>;

export type PostRelations = {
  tags?: {
    filter?: TagFilter
    sorts?: TagSort[]
    start?: number
    limit?: number
    relations?: TagRelations
  }
}

export type PostProjection = {
  author?: UserProjection | boolean,
  authorId?: boolean,
  body?: boolean,
  createdAt?: boolean,
  id?: boolean,
  tags?: TagProjection | boolean,
  title?: boolean,
  views?: boolean,
};

export type PostSortKeys = 
  'authorId'|
  'body'|
  'createdAt'|
  'id'|
  'title'|
  'views';
export type PostSort = OneKey<PostSortKeys, SortDirection>;

export type PostUpdate = {
  'authorId'?: string,
  'body'?: string | null,
  'createdAt'?: Date,
  'id'?: string,
  'title'?: string,
  'views'?: number
};

export type PostInsert = {
  authorId: string,
  body?: string,
  createdAt: Date,
  id?: string,
  title: string,
  views: number,
};

type PostDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Post, 'id', 'ID', 'generator', PostFilter, PostRelations, PostProjection, PostSort, PostInsert, PostUpdate, PostExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

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

export const tagSchema : Schema<types.Scalars>= {
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

export type TagUpdate = {
  'id'?: string,
  'name'?: string | null,
  'postId'?: string
};

export type TagInsert = {
  id?: string,
  name?: string,
  postId: string,
};

type TagDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.Tag, 'id', 'ID', 'generator', TagFilter, TagRelations, TagProjection, TagSort, TagInsert, TagUpdate, TagExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type TagDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<TagDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

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

export const userSchema : Schema<types.Scalars>= {
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
  'createdAt'?: Date | null | EqualityOperators<Date> | ElementOperators | QuantityOperators<Date>,
  'credentials.password'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'credentials.username'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'email'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'firstName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'id'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators,
  'lastName'?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
};
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>;

export type UserRelations = {
  posts?: {
    filter?: PostFilter
    sorts?: PostSort[]
    start?: number
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

export type UserUpdate = {
  'createdAt'?: Date,
  'credentials'?: types.Credentials,
  'credentials.password'?: string | null,
  'credentials.username'?: string | null,
  'email'?: string | null,
  'firstName'?: string | null,
  'id'?: string,
  'lastName'?: string | null
};

export type UserInsert = {
  createdAt: Date,
  credentials: types.Credentials,
  email?: string,
  firstName?: string,
  id?: string,
  lastName?: string,
};

type UserDAOGenerics<MetadataType, OperationMetadataType> = KnexJsDAOGenerics<types.User, 'id', 'ID', 'generator', UserFilter, UserRelations, UserProjection, UserSort, UserInsert, UserUpdate, UserExcludedFields, MetadataType, OperationMetadataType, types.Scalars>;
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<KnexJsDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idGeneration' | 'idScalar'>

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
  overrides?: { 
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    tag?: Pick<Partial<TagDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  },
  knex: Record<'default', Knex>,
  adapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>,
  idGenerators?: { [K in keyof types.Scalars]?: () => types.Scalars[K] }
};

export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {

  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined;
  private _tag: TagDAO<MetadataType, OperationMetadataType> | undefined;
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined;
  
  private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];
  private knex: Record<'default', Knex>;
  
  get post() {
    if(!this._post) {
      this._post = new PostDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.post, knex: this.knex.default, tableName: 'posts' });
    }
    return this._post;
  }
  get tag() {
    if(!this._tag) {
      this._tag = new TagDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.tag, knex: this.knex.default, tableName: 'tags' });
    }
    return this._tag;
  }
  get user() {
    if(!this._user) {
      this._user = new UserDAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.user, knex: this.knex.default, tableName: 'users' });
    }
    return this._user;
  }
  
  constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {
    super(params)
    this.overrides = params.overrides
    this.knex = params.knex;
  }

}