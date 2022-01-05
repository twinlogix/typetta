import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { knexJsAdapters, identityAdapter, computedField, loggingMiddleware } from '@twinlogix/typetta'
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
      },
    },
  })
})
