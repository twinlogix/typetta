import { computedField, mock } from '../../src'
import { DAOContext } from './dao.mock'
import BigNumber from 'bignumber.js'
import sha256 from 'sha256'

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

test('benchmark', async () => {
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
    await dao.postType.findAll({ filter: { id: { $in: ids } } })
  }
  console.log(`Read avg ms: ${((new Date().getTime() - readInsert.getTime()) / 10000).toFixed(3)}`)
  expect((new Date().getTime() - readInsert.getTime()) / 10000).toBeLessThan(1)

  const read2Insert = new Date()
  for (let i = 0; i < 2; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { name: { $in: ids } } })
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
    await dao.postType.deleteAll({ filter: { id: { $in: ids } } })
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
})
