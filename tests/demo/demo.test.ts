import { DAOContext, UserExcludedFields } from './dao.mock'
import { Scalars, User } from './models.mock'
import { knexJsAdapters, identityAdapter, computedField, loggingMiddleware, SortDirection } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'

let knexInstance: Knex<any, unknown[]>
let dao: DAOContext<any>

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

let idCounter = 0
beforeEach(async () => {
  knexInstance = knex(config)
  dao = new DAOContext({
    overrides: {
      user: {
        idGenerator: () => {
          idCounter = idCounter + 1
          return 'user_' + idCounter
        },
        middlewares: [
          computedField({
            fieldsProjection: { averageViewsPerPost: true },
            requiredProjection: { totalPostsViews: true, posts: {} },
            compute: async (u) => ({ averageViewsPerPost: (u.totalPostsViews || 0) / (u.posts?.length || 1) }),
          }),
          computedField({
            fieldsProjection: { totalPostsViews: true },
            requiredProjection: { posts: { views: true } },
            compute: async (u) => ({
              totalPostsViews: u.posts?.map((p) => p.views).reduce((p, c) => p + c, 0) || 0,
            }),
          }),
        ],
      },
      post: {
        idGenerator: () => {
          idCounter = idCounter + 1
          return 'post_' + idCounter
        },
      },
      tag: {
        idGenerator: () => {
          return 'tag_' + idCounter
        },
      },
    },
    knex: {
      default: knexInstance,
    },
    adapters: {
      knex: {
        ...knexJsAdapters,
        ID: identityAdapter,
        Decimal: {
          dbToModel: (o: unknown) => new BigNumber(o as number),
          modelToDB: (o: BigNumber) => o,
        },
        Password: {
          dbToModel: (o: unknown) => o as string,
          modelToDB: (o: string) => sha256(o),
        },
        DateTime: {
          dbToModel: (o: unknown) => new Date(o as number),
          modelToDB: (o: Date) => o.getTime(),
        },
      },
    },
  })

  const specificTypeMap: Map<keyof Scalars, [string, string]> = new Map([
    ['Decimal', ['decimal', 'decimal ARRAY']],
    ['Boolean', ['boolean', 'boolean ARRAY']],
    ['Float', ['decimal', 'decimal ARRAY']],
    ['Int', ['integer', 'integer ARRAY']],
    ['DateTime', ['integer', 'integer ARRAY']],
  ])
  const defaultSpecificType: [string, string] = ['string', 'string ARRAY']
  await dao.post.createTable(specificTypeMap, defaultSpecificType)
  await dao.user.createTable(specificTypeMap, defaultSpecificType)
  await dao.tag.createTable(specificTypeMap, defaultSpecificType)
})

test('Demo', async () => {
  const user = await dao.user.insertOne({
    record: {
      firstName: 'Filippo',
      createdAt: new Date(),
      credentials: {
        username: 'Pippo',
        password: 'ganna123',
      },
    },
  })

  expect(user.id).toBe('user_1')
  for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const post = await dao.post.insertOne({
      record: {
        authorId: i <= 5 ? user.id : 'random',
        createdAt: new Date(),
        title: 'Title ' + i,
        views: i,
      },
    })
    expect(post.id).toBe('post_' + (i + 1).toString())
    await dao.tag.insertOne({ record: { postId: post.id, name: 'Sport' } })
    await dao.tag.insertOne({ record: { postId: post.id, name: 'Fitness' } })
  }

  const pippo = await dao.user.findOne({
    filter: {
      createdAt: { $lte: new Date() },
      'credentials.username': 'Pippo',
    },
    projection: {
      firstName: false,
      averageViewsPerPost: true,
      posts: {
        title: true,
        author: {
          firstName: true,
        },
        tagsId: true,
        tags: true,
      },
    },
    relations: {
      posts: {
        filter: { title: { $in: ['Title 1', 'Title 2', 'Title 3'] } },
        limit: 2,
        start: 1,
        sorts: [{ title: SortDirection.DESC }],
        relations: {
          tags: {
            filter: { name: 'Sport' },
          },
        },
      },
    },
  })

  const aggregation = await dao.user.aggregate({
    by: {
      'credentials.password': true,
      createdAt: true,
    },
    filter: { createdAt: { $gte: new Date() } },
    aggregations: { pippo: { field: 'email', operator: 'count' }, pluto: { field: 'id', operator: 'sum' } },
    having: { pippo: { $gte: 20 } },
    start: 1,
    limit: 5,
  })

  console.log(aggregation)

  expect((pippo?.posts || [])[0].title).toBe('Title 2')
  expect((pippo?.posts || [])[0].tags?.length).toBe(1)
  expect((pippo?.posts || [])[1].title).toBe('Title 1')
})
