import * as T from '../../src'
import * as types from './models.mock'

export type Scalars = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Date: { type: types.Scalars['Date']; isTextual: false; isQuantitative: false }
}

export type AST = {
  Like: {
    fields: {
      creationDate: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
      postId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Metadata: {
    fields: {
      tags: { type: 'scalar'; isList: true; astName: 'String'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      views: { type: 'scalar'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  Post: {
    fields: {
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
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  User: {
    fields: {
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
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
}

export function likeSchema(): T.Schema<Scalars> {
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

type LikeDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<'Like', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type LikeDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<LikeDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryLikeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<LikeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type LikeInsert = T.Insert<'Like', AST, Scalars>
export type LikeInsertResult = T.GenerateModel<'Like', AST, Scalars, 'relation'>
export type LikeProjection = T.Projection<'Like', AST>
export type LikeParams<P extends LikeProjection> = T.Params<'Like', AST, Scalars, P>
export type LikeUpdate = T.Update<'Like', AST, Scalars>
export type LikeFilter = T.Filter<'Like', AST, Scalars>
export type LikeSortElement = T.SortElement<'Like', AST>

export class LikeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<LikeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Like', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Like', AST>, P2 extends T.Projection<'Like', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Like', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Like', AST>, P1, P2>
  }
  public constructor(params: LikeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: likeSchema(),
    })
  }
}

export class InMemoryLikeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<LikeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Like', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Like', AST>, P2 extends T.Projection<'Like', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Like', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Like', AST>, P1, P2>
  }
  public constructor(params: InMemoryLikeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: likeSchema(),
    })
  }
}
export function metadataSchema(): T.Schema<Scalars> {
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
export function postSchema(): T.Schema<Scalars> {
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

type PostDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<'Post', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type PostDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryPostDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<PostDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type PostInsert = T.Insert<'Post', AST, Scalars>
export type PostInsertResult = T.GenerateModel<'Post', AST, Scalars, 'relation'>
export type PostProjection = T.Projection<'Post', AST>
export type PostParams<P extends PostProjection> = T.Params<'Post', AST, Scalars, P>
export type PostUpdate = T.Update<'Post', AST, Scalars>
export type PostFilter = T.Filter<'Post', AST, Scalars>
export type PostSortElement = T.SortElement<'Post', AST>

export class PostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Post', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Post', AST>, P2 extends T.Projection<'Post', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Post', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Post', AST>, P1, P2>
  }
  public constructor(params: PostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}

export class InMemoryPostDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<PostDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Post', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Post', AST>, P2 extends T.Projection<'Post', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Post', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Post', AST>, P1, P2>
  }
  public constructor(params: InMemoryPostDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: postSchema(),
    })
  }
}
export function userSchema(): T.Schema<Scalars> {
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

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.InMemoryDAOGenerics<'User', AST, Scalars, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserInsert = T.Insert<'User', AST, Scalars>
export type UserInsertResult = T.GenerateModel<'User', AST, Scalars, 'relation'>
export type UserProjection = T.Projection<'User', AST>
export type UserParams<P extends UserProjection> = T.Params<'User', AST, Scalars, P>
export type UserUpdate = T.Update<'User', AST, Scalars>
export type UserFilter = T.Filter<'User', AST, Scalars>
export type UserSortElement = T.SortElement<'User', AST>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
  }
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
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
  scalars?: T.UserInputDriverDataTypeAdapterMap<Scalars, 'knex'>
  log?: T.LogInput<'Like' | 'Post' | 'User'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<never, never, Scalars, MetadataType> {
  private _like: LikeDAO<MetadataType, OperationMetadataType> | undefined
  private _post: PostDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'Like' | 'Post' | 'User'>

  get like(): LikeDAO<MetadataType, OperationMetadataType> {
    if (!this._like) {
      this._like = new LikeDAO({
        entityManager: this,
        datasource: null,
        metadata: this.metadata,
        ...this.overrides?.like,
        middlewares: [...(this.overrides?.like?.middlewares || []), ...(selectMiddleware('like', this.middlewares) as T.DAOMiddleware<LikeDAOGenerics<MetadataType, OperationMetadataType>>[])],
        name: 'Like',
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
        name: 'Post',
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
        name: 'User',
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
