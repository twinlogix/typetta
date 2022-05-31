import * as T from '../../src'
import * as types from './models.mock'

export type AST = {
  Like: {
    creationDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    postId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Metadata: {
    tags: { type: 'scalar'; isList: true; astName: 'String'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Post: {
    content: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    creationDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    likes: {
      type: 'relation'
      relation: 'relationEntity'
      isList: true
      astName: 'User'
      isRequired: true
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    metadata: { type: 'embedded'; isList: false; astName: 'Metadata'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  User: {
    birthDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    firstName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    lastName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    likes: {
      type: 'relation'
      relation: 'relationEntity'
      isList: true
      astName: 'Post'
      isRequired: true
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    posts: { type: 'relation'; relation: 'foreign'; isList: true; astName: 'Post'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
}

export type LikeExcludedFields = never

export type LikeEmbeddedFields = never
export type LikeRelationFields = never
export type LikeRetrieveAll = Omit<types.Like, LikeRelationFields | LikeEmbeddedFields> & {}

export function likeSchema(): T.Schema<types.Scalars> {
  return {
    creationDate: {
      type: 'scalar',
      scalar: 'Date',
      required: true,
      generationStrategy: 'generator',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    postId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type LikeFilterFields = {
  creationDate?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  postId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type LikeFilter = LikeFilterFields & T.LogicalOperators<LikeFilterFields | LikeRawFilter>
export type LikeRawFilter = never

export type LikeRelations = Record<never, string>

export type LikeProjection = {
  creationDate?: boolean
  id?: boolean
  postId?: boolean
  userId?: boolean
}
export type LikeParam<P extends LikeProjection> = T.ParamProjection<types.Like, LikeProjection, P>

export type LikeSortKeys = 'creationDate' | 'id' | 'postId' | 'userId'
export type LikeSort = Partial<Record<LikeSortKeys, T.SortDirection>>
export type LikeRawSort = never

export type LikeUpdate = {
  creationDate?: types.Scalars['Date'] | null
  id?: types.Scalars['ID'] | null
  postId?: types.Scalars['ID'] | null
  userId?: types.Scalars['ID'] | null
}
export type LikeRawUpdate = never

export type LikeInsert = {
  creationDate?: null | types.Scalars['Date']
  id?: null | types.Scalars['ID']
  postId: types.Scalars['ID']
  userId: types.Scalars['ID']
}

type LikeDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  types.Like,
  'id',
  'ID',
  LikeFilter,
  LikeRawFilter,
  LikeRelations,
  LikeProjection,
  LikeSort,
  LikeRawSort,
  LikeInsert,
  LikeUpdate,
  LikeRawUpdate,
  LikeExcludedFields,
  LikeRelationFields,
  LikeEmbeddedFields,
  LikeRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'like',
  EntityManager<MetadataType, OperationMetadataType>
>
export type LikeDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<LikeDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryLikeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<LikeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class LikeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<LikeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends LikeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends LikeProjection, P2 extends LikeProjection>(p1: P1, p2: P2): T.SelectProjection<LikeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<LikeProjection, P1, P2>
  }

  public constructor(params: LikeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: likeSchema(),
    })
  }
}

export class InMemoryLikeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<LikeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends LikeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends LikeProjection, P2 extends LikeProjection>(p1: P1, p2: P2): T.SelectProjection<LikeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<LikeProjection, P1, P2>
  }

  public constructor(params: InMemoryLikeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: likeSchema(),
    })
  }
}

export type MetadataEmbeddedFields = never
export type MetadataRelationFields = never
export type MetadataRetrieveAll = Omit<types.Metadata, MetadataRelationFields | MetadataEmbeddedFields> & {}

export function metadataSchema(): T.Schema<types.Scalars> {
  return {
    tags: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      isList: true,
    },
    views: {
      type: 'scalar',
      scalar: 'Int',
    },
  }
}

export type MetadataProjection = {
  tags?: boolean
  views?: boolean
}
export type MetadataParam<P extends MetadataProjection> = T.ParamProjection<types.Metadata, MetadataProjection, P>

export type MetadataInsert = {
  tags?: null | types.Scalars['String'][]
  views?: null | types.Scalars['Int']
}

export type PostExcludedFields = never

export type PostEmbeddedFields = 'metadata'
export type PostRelationFields = 'likes'
export type PostRetrieveAll = Omit<types.Post, PostRelationFields | PostEmbeddedFields> & {
  metadata?: types.Maybe<MetadataRetrieveAll>
}

export function postSchema(): T.Schema<types.Scalars> {
  return {
    content: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    creationDate: {
      type: 'scalar',
      scalar: 'Date',
      required: true,
      generationStrategy: 'generator',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    likes: {
      type: 'relation',
      relation: 'relationEntity',
      schema: () => userSchema(),
      refThis: {
        refFrom: 'postId',
        refTo: 'id',
      },
      refOther: {
        refFrom: 'userId',
        refTo: 'id',
        dao: 'user',
      },
      relationEntity: { schema: () => likeSchema(), dao: 'like' },
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    metadata: {
      type: 'embedded',
      schema: () => metadataSchema(),
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type PostFilterFields = {
  content?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  creationDate?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  'metadata.tags'?: types.Scalars['String'][] | null | T.EqualityOperators<types.Scalars['String'][]> | T.ElementOperators | T.StringOperators
  'metadata.views'?: types.Scalars['Int'] | null | T.EqualityOperators<types.Scalars['Int']> | T.ElementOperators | T.QuantityOperators<types.Scalars['Int']>
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type PostFilter = PostFilterFields & T.LogicalOperators<PostFilterFields | PostRawFilter>
export type PostRawFilter = never

export type PostRelations = {
  likes?: {
    filter?: UserFilter
    sorts?: UserSort[] | UserRawSort
    skip?: number
    limit?: number
    relations?: UserRelations
  }
}

export type PostProjection = {
  content?: boolean
  creationDate?: boolean
  id?: boolean
  likes?: UserProjection | boolean
  metadata?: MetadataProjection | boolean
  userId?: boolean
}
export type PostParam<P extends PostProjection> = T.ParamProjection<types.Post, PostProjection, P>

export type PostSortKeys = 'content' | 'creationDate' | 'id' | 'metadata.tags' | 'metadata.views' | 'userId'
export type PostSort = Partial<Record<PostSortKeys, T.SortDirection>>
export type PostRawSort = never

export type PostUpdate = {
  content?: types.Scalars['String'] | null
  creationDate?: types.Scalars['Date'] | null
  id?: types.Scalars['ID'] | null
  metadata?: MetadataInsert | null
  'metadata.tags'?: types.Scalars['String'][] | null
  'metadata.views'?: types.Scalars['Int'] | null
  userId?: types.Scalars['ID'] | null
}
export type PostRawUpdate = never

export type PostInsert = {
  content: types.Scalars['String']
  creationDate?: null | types.Scalars['Date']
  id?: null | types.Scalars['ID']
  metadata?: null | MetadataInsert
  userId: types.Scalars['ID']
}

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  types.Post,
  'id',
  'ID',
  PostFilter,
  PostRawFilter,
  PostRelations,
  PostProjection,
  PostSort,
  PostRawSort,
  PostInsert,
  PostUpdate,
  PostRawUpdate,
  PostExcludedFields,
  PostRelationFields,
  PostEmbeddedFields,
  PostRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'post',
  EntityManager<MetadataType, OperationMetadataType>
>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostProjection, P2 extends PostProjection>(p1: P1, p2: P2): T.SelectProjection<PostProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostProjection, P1, P2>
  }

  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export class InMemoryPostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends PostProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends PostProjection, P2 extends PostProjection>(p1: P1, p2: P2): T.SelectProjection<PostProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<PostProjection, P1, P2>
  }

  public constructor(params: InMemoryPostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export type UserExcludedFields = never

export type UserEmbeddedFields = never
export type UserRelationFields = 'likes' | 'posts'
export type UserRetrieveAll = Omit<types.User, UserRelationFields | UserEmbeddedFields> & {}

export function userSchema(): T.Schema<types.Scalars> {
  return {
    birthDate: {
      type: 'scalar',
      scalar: 'Date',
    },
    firstName: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'generator',
      required: true,
    },
    lastName: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    likes: {
      type: 'relation',
      relation: 'relationEntity',
      schema: () => postSchema(),
      refThis: {
        refFrom: 'userId',
        refTo: 'id',
      },
      refOther: {
        refFrom: 'postId',
        refTo: 'id',
        dao: 'post',
      },
      relationEntity: { schema: () => likeSchema(), dao: 'like' },
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    posts: {
      type: 'relation',
      relation: 'foreign',
      schema: () => postSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'post',
      isListElementRequired: true,
      isList: true,
    },
  }
}

type UserFilterFields = {
  birthDate?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  firstName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  lastName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = never

export type UserRelations = {
  likes?: {
    filter?: PostFilter
    sorts?: PostSort[] | PostRawSort
    skip?: number
    limit?: number
    relations?: PostRelations
  }
  posts?: {
    filter?: PostFilter
    sorts?: PostSort[] | PostRawSort
    skip?: number
    limit?: number
    relations?: PostRelations
  }
}

export type UserProjection = {
  birthDate?: boolean
  firstName?: boolean
  id?: boolean
  lastName?: boolean
  likes?: PostProjection | boolean
  posts?: PostProjection | boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'birthDate' | 'firstName' | 'id' | 'lastName'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = never

export type UserUpdate = {
  birthDate?: types.Scalars['Date'] | null
  firstName?: types.Scalars['String'] | null
  id?: types.Scalars['ID'] | null
  lastName?: types.Scalars['String'] | null
}
export type UserRawUpdate = never

export type UserInsert = {
  birthDate?: null | types.Scalars['Date']
  firstName: types.Scalars['String']
  id?: null | types.Scalars['ID']
  lastName: types.Scalars['String']
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<
  types.User,
  'id',
  'ID',
  UserFilter,
  UserRawFilter,
  UserRelations,
  UserProjection,
  UserSort,
  UserRawSort,
  UserInsert,
  UserUpdate,
  UserRawUpdate,
  UserExcludedFields,
  UserRelationFields,
  UserEmbeddedFields,
  UserRetrieveAll,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'user',
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }

  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }

  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    like?: Pick<Partial<LikeDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    post?: Pick<Partial<PostDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'idGenerator' | 'middlewares' | 'metadata'>
  }
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'knex'>
  log?: T.LogInput<'like' | 'post' | 'user'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, never, types.Scalars, MetadataType> {
  private _like: LikeDAO<MetadataType, OperationMetadataType> | undefined
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'like' | 'post' | 'user'>

  get like(): LikeDAO<MetadataType, OperationMetadataType> {
    if (!this._like) {
      this._like = new LikeDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.like,
        middlewares: [...(this.overrides?.like?.middlewares || []), ...(selectMiddleware('like', this.middlewares) as T.DAOMiddleware<LikeDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'like',
        logger: this.logger,
      })
    }
    return this._like
  }
  get post(): PostDAO<MetadataType, OperationMetadataType> {
    if (!this._post) {
      this._post = new PostDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.post,
        middlewares: [...(this.overrides?.post?.middlewares || []), ...(selectMiddleware('post', this.middlewares) as T.DAOMiddleware<PostDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'post',
        logger: this.logger,
      })
    }
    return this._post
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      this._user = new UserDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.user,
        middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'user',
        logger: this.logger,
      })
    }
    return this._user
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined,
    })
    this.overrides = params.overrides
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if (params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others
        ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map((k) => [k, true])) as any, securityMiddlewares.others as any)]
        : []
      this.middlewares = [
        ...(params.middlewares ?? []),
        ...defaultMiddleware,
        ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({ [name]: true } as any, middleware as any)),
      ]
    }
    this.params = params
  }

  public async execQuery<T>(run: (dbs: {}, entities: {}) => Promise<T>): Promise<T> {
    return run({}, {})
  }

  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  like: LikeDAOGenerics<MetadataType, OperationMetadataType>
  post: PostDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
