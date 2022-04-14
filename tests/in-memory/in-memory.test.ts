import { mock } from '../../src'
import { DAOContext } from './dao.mock'

jest.setTimeout(20000)

let dao: DAOContext
mock.compare = (l, r) => {
  if (l instanceof Date && r instanceof Date) {
    return l.getTime() - r.getTime()
  }
}

beforeEach(async () => {
  dao = new DAOContext({})
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

  for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const post = await dao.post.insertOne({
      record: {
        authorId: i <= 5 ? user.id : 'random',
        createdAt: new Date(),
        title: 'Title ' + i,
        views: i,
      },
    })
    await dao.tag.insertOne({ record: { postId: post.id, name: 'Sport' } })
    await dao.tag.insertOne({ record: { postId: post.id, name: 'Fitness' } })
  }

  const pippo = await dao.user.findOne({
    filter: {
      createdAt: { lte: new Date() },
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
        filter: { title: { in: ['Title 1', 'Title 2', 'Title 3'] } },
        limit: 2,
        skip: 1,
        sorts: [{ title: 'desc' }],
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


/*test('benchmark', async () => {
  const n = 50000
  const startInsert = new Date()
  for (let i = 0; i < n; i++) {
    await dao.postType.insertOne({ record: { id: i.toString(), name: i.toString() } })
  }
  console.log(`Insert avg ms: ${((new Date().getTime() - startInsert.getTime()) / n).toFixed(3)}`)
  expect((new Date().getTime() - startInsert.getTime()) / n).toBeLessThan(1)

  const readInsert = new Date()
  for (let i = 0; i < 10000; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { id: { in: ids } } })
  }
  console.log(`Read avg ms: ${((new Date().getTime() - readInsert.getTime()) / 10000).toFixed(3)}`)
  expect((new Date().getTime() - readInsert.getTime()) / 10000).toBeLessThan(1)

  const read2Insert = new Date()
  for (let i = 0; i < 2; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { name: { in: ids } } })
  }
  console.log(`Read avg (no index) ms: ${((new Date().getTime() - read2Insert.getTime()) / 2).toFixed(3)}`)
  expect(100 - (new Date().getTime() - read2Insert.getTime()) / 2).toBeLessThan(0)

  const read3Insert = new Date()
  for (let i = 0; i < 20; i++) {
    await dao.postType.findAll({ skip: Math.floor((Math.random() * (n / 2))), limit: Math.floor((Math.random() * (n / 2))) })
  }
  console.log(`Read avg (no filter, start & limit) ms: ${((new Date().getTime() - read3Insert.getTime()) / 2).toFixed(3)}`)

  const deleteInsert = new Date()
  for (let i = 0; i < 10000; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.deleteAll({ filter: { id: { in: ids } } })
  }
  console.log(`Delete avg ms: ${((new Date().getTime() - deleteInsert.getTime()) / 10000).toFixed(3)}`)
  expect((new Date().getTime() - deleteInsert.getTime()) / 10000).toBeLessThan(1)

  for (let i = 0; i < 20000; i++) {
    await dao.postType.insertOne({ record: { id: 'n' + i.toString(), name: i.toString() } })
  }

  for (let i = 0; i < 10000; i++) {
    const id = (Math.random() * (n - 1)).toFixed(0)
    const res = await dao.postType.findOne({ filter: { id } })
    if (res) {
      expect(res?.name).toBe(id.toString())
    }
  }
})*/


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
