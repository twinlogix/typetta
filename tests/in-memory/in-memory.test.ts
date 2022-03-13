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
  const n = 20000
  const startInsert = new Date()
  for (let i = 0; i < n; i++) {
    await dao.postType.insertOne({ record: { id: i.toString(), name: i.toString() } })
  }
  console.log(`Insert avg ms: ${((new Date().getTime() - startInsert.getTime()) / n).toFixed(1)}`)

  const readInsert = new Date()
  for (let i = 0; i < 1000; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { id: { $in: ids } } })
  }
  console.log(`Read avg ms: ${((new Date().getTime() - readInsert.getTime()) / 1000).toFixed(1)}`)
})
