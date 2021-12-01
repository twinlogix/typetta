import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { knexJsAdapters, identityAdapter, SortDirection, buildComputedField } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'

let knexInstance: Knex<any, unknown[]>
let dao: DAOContext

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

beforeAll(async () => {})

beforeEach(async () => {
  knexInstance = knex(config)
  dao = new DAOContext({
    daoOverrides: {
      user: {
        middlewares: [
          buildComputedField({
            fieldsProjection: { averageViewsPerPost: true },
            requiredProjection: { totalPostsViews: true, posts: {} },
            compute: async (u) => (
              { averageViewsPerPost: (u.totalPostsViews || 0) / (u.posts?.length || 1) }),
          }),
          buildComputedField({
            fieldsProjection: { totalPostsViews: true },
            requiredProjection: { posts: { views: true } },
            compute: async (u) => ({
              totalPostsViews: u.posts?.map((p) => p.views).reduce((p, c) => p + c, 0) || 0,
            }),
          }),
        ],
      },
    },
    knex: knexInstance,
    adapters: {
      knexjs: {
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

afterEach(async () => {})

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

  for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    await dao.post.insertOne({
      record: {
        authorId: i <= 5 ? user.id : 'random',
        createdAt: new Date(),
        title: 'Title ' + i,
        views: i,
      },
    })
  }

  const pippo = await dao.user.findOne({
    filter: {
      createdAt: { $lte: new Date() },
      'credentials.username': 'Pippo',
    },
    projection: {
      firstName: true,
      averageViewsPerPost: true,
      posts: {
        title: true,
        author: {
          firstName: true,
        },
      },
    },
  })

  console.log(user, pippo)
})
