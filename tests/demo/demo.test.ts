/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computedField, flattenEmbeddeds, inMemoryKnexConfig } from '../../src'
import { EntityManager, postSchema } from './dao.generated'
import { PostUpdateInput } from './types.generated'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'

jest.setTimeout(20000)

let knexInstance: Knex<{ [K in string]: unknown }, unknown[]>
let dao: EntityManager

let idCounter = 0

beforeEach(async () => {
  knexInstance = knex(inMemoryKnexConfig())
  dao = new EntityManager({
    overrides: {
      user: {
        idGenerator: () => {
          idCounter = idCounter + 1
          return { id: 'user_' + idCounter }
        },
        middlewares: [
          computedField({
            fieldsProjection: { averageViewsPerPost: true },
            requiredProjection: { totalPostsViews: true, posts: {} } as const,
            compute: async (u) => ({ averageViewsPerPost: (u.totalPostsViews || 0) / (u.posts?.length || 1) }),
          }),
          computedField({
            fieldsProjection: { totalPostsViews: true },
            requiredProjection: { posts: { views: true } } as const,
            compute: async (u) => ({
              totalPostsViews: u.posts?.map((p) => p.views).reduce((p, c) => p + c, 0) || 0,
            }),
          }),
        ],
      },
      post: {
        idGenerator: () => {
          idCounter = idCounter + 1
          return { id: 'post_' + idCounter }
        },
      },
      tag: {
        idGenerator: () => {
          return { id: 'tag_' + idCounter }
        },
      },
    },
    knex: {
      default: knexInstance,
    },
    scalars: {
      Decimal: {
        dbToModel: (o: unknown) => new BigNumber(o as number),
        modelToDB: (o: BigNumber) => o,
      },
      JSON: {
        dbToModel: (o: unknown) => JSON.parse(o as string),
        modelToDB: (o: unknown) => JSON.stringify(o),
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
  })

  const typeMap = {
    Decimal: { singleType: 'decimal' },
    Boolean: { singleType: 'boolean' },
    Float: { singleType: 'decimal' },
    Int: { singleType: 'integer' },
    IntAutoInc: { singleType: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  }
  const defaultType = { singleType: 'string' }
  await dao.post.createTable(typeMap, defaultType)
  await dao.user.createTable(typeMap, defaultType)
  await dao.tag.createTable(typeMap, defaultType)
  await dao.postType.createTable(typeMap, defaultType)
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
      createdAt: { lte: new Date() },
      'credentials.username': 'Pippo',
    },
    projection: {
      averageViewsPerPost: true,
      posts: {
        title: true,
        author: {
          firstName: true,
        },
        tags: true,
      },
    },
    relations: {
      posts: {
        filter: { title: { in: ['Title 1', 'Title 2', 'Title 3'] } },
        limit: 2,
        skip: 1,
        sorts: (qb) => qb.orderBy('title', 'desc'),
        relations: {
          tags: {
            filter: { name: 'Sport' },
          },
        },
      },
    },
  })

  expect((pippo?.posts || [])[0].title).toBe('Title 2')
  expect((pippo?.posts || [])[0].tags?.length).toBe(1)
  expect((pippo?.posts || [])[1].title).toBe('Title 1')
})

test('Aggregate test', async () => {
  const type1 = await dao.postType.insertOne({ record: { name: 'type1', id: '1' } })
  for (let i = 0; i < 100; i++) {
    await dao.post.insertOne({
      record: {
        authorId: `user_${Math.floor(i / 10)}`,
        createdAt: new Date(),
        title: 'Title ' + i,
        views: i,
        metadata: {
          region: i % 2 === 0 ? 'it' : 'en',
          visible: i % 2 === 0 || i === 99,
          typeId: type1.id,
        },
      },
    })
  }

  const p = await dao.post.findOne({ projection: { metadata: { type: { name: true } } } })
  expect(p?.metadata?.type?.name).toBe('type1')

  const aggregation1 = await dao.post.aggregate(
    {
      by: {
        authorId: true,
        'metadata.region': true,
      },
      aggregations: { count: { field: 'authorId', operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
      filter: { 'metadata.visible': true, views: { gt: 0 } },
      skip: 1,
      limit: 2,
    },
    { sorts: [{ totalAuthorViews: 'asc' }], having: { totalAuthorViews: { lt: 150 } } },
  )
  expect(aggregation1.length).toBe(2)
  // expect(aggregation1[0]).toEqual({ count: 4, totalAuthorViews: 20, authorId: 'user_0', 'metadata.region': 'it' })
  expect(aggregation1[0]).toEqual({ count: 5, totalAuthorViews: 70, authorId: 'user_1', 'metadata.region': 'it' })
  expect(aggregation1[1]).toEqual({ count: 1, totalAuthorViews: 99, authorId: 'user_9', 'metadata.region': 'en' })
  // expect(aggregation1[3]).toEqual({ count: 5, totalAuthorViews: 120, authorId: 'user_2', 'metadata.region': 'it' })
  const aggregation2 = await dao.post.aggregate({
    aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' }, avgAuthorViews: { field: 'views', operation: 'avg' } },
  })
  expect(aggregation2.avgAuthorViews).toBe(49.5)
  expect(aggregation2.avgAuthorViews).toBe((aggregation2.totalAuthorViews ?? 0) / aggregation2.count)

  const aggregation3 = await dao.post.aggregate({
    aggregations: { max: { field: 'views', operation: 'max' }, min: { field: 'views', operation: 'min' } },
  })
  expect(aggregation3.max).toBe(99)
  expect(aggregation3.min).toBe(0)

  const aggregation4 = await dao.user.aggregate({ aggregations: { max: { operation: 'max', field: 'email' }, count: { operation: 'count' } } })
  expect(aggregation4.max).toBe(null)
  expect(aggregation4.count).toBe(0)

  const aggregation5 = await dao.post.aggregate({
    by: { authorId: true },
    aggregations: {
      max: { operation: 'max', field: 'clicks' },
      avg: { operation: 'avg', field: 'clicks' },
      sum: { operation: 'sum', field: 'clicks' },
      count: { operation: 'count', field: 'clicks' },
      count2: { operation: 'count', field: 'views' },
      count3: { operation: 'count' },
    },
  })
  expect(aggregation5[0].max).toBe(null)
  expect(aggregation5[0].avg).toBe(null)
  expect(aggregation5[0].sum).toBe(null)
  expect(aggregation5[0].count).toBe(0)
  expect(aggregation5[0].count2).toBe(10)
  expect(aggregation5[0].count3).toBe(10)

  const aggregation6 = await dao.post.aggregate({
    by: {
      id: true,
    },
    aggregations: { count: { field: 'id', operation: 'count' } },
  })
  for (const a of aggregation6) {
    expect(a.count).toBe(1)
  }
})

test('Aggregate test 2', async () => {
  const type1 = await dao.postType.insertOne({ record: { name: 'type1', id: '1' } })
  for (let i = 0; i < 100; i++) {
    await dao.post.insertOne({
      record: {
        authorId: `user_${Math.floor(i / 10)}`,
        title: 'Title ' + i,
        views: i,
        createdAt: new Date(),
        metadata:
          i % 4 === 0
            ? null
            : i % 4 === 1
              ? undefined
              : {
                  region: i % 4 === 2 ? 'it' : 'en',
                  visible: i % 2 === 0 || i === 99,
                  typeId: type1.id,
                },
      },
    })
  }
  const aggregation1 = await dao.post.aggregate(
    {
      by: {
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
    },
    { sorts: [{ 'metadata.region': 'desc' }, { totalAuthorViews: 'desc' }] },
  )
  expect(aggregation1.length).toBe(3)
  expect(aggregation1.find((a) => a['metadata.region'] == null)?.count).toBe(50)
  expect(aggregation1.find((a) => a['metadata.region'] === 'it')?.count).toBe(25)
  expect(aggregation1.find((a) => a['metadata.region'] === 'en')?.count).toBe(25)

  const aggregation2 = await dao.post.aggregate(
    {
      by: {
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
      filter: { 'metadata.visible': true, views: { gt: 0 } },
    },
    { sorts: [{ 'metadata.region': 'desc' }, { totalAuthorViews: 'desc' }] },
  )
  expect(aggregation2.length).toBe(2)
  expect(aggregation2.find((a) => a['metadata.region'] === 'it')?.count).toBe(25)
  expect(aggregation2.find((a) => a['metadata.region'] === 'en')?.count).toBe(1)
})

test('flattenEmbeddedFilter', () => {
  const f: PostUpdateInput = {
    authorId: '123',
    metadata: {
      region: 'it',
    },
  }
  const r = flattenEmbeddeds(f, postSchema())
  if (!r) {
    fail()
  }
  expect(r['metadata.region']).toBe('it')
  expect(r['metadata.typeId']).toBe(undefined)
  expect(r.authorId).toBe('123')
  expect(r.body).toBe(undefined)

  const r1 = flattenEmbeddeds(
    {
      metadata: null,
    },
    postSchema(),
  )
  expect(r1.metadata).toBe(null)
})
