/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mock } from '../../src'
import { DAOContext } from './dao.mock'
import { v4 as uuid } from 'uuid'

jest.setTimeout(20000)

const dao: DAOContext = new DAOContext({
  scalars: {
    ID: { generate: () => uuid() },
    Date: { generate: () => new Date() },
  },
  log: async (args) => {
    console.log(args.operation, args.dao, JSON.parse(args.query ?? '{}')?.filter, JSON.parse(args.query ?? '{}')?.sorts)
  },
})

beforeEach(async () => {
  mock.clearMemory()
})

test('Test 1', async () => {
  await dao.user.insertOne({
    record: {
      id: '123',
      firstName: 'Mattia',
      lastName: 'Minotti',
    },
  })
  await dao.user.insertOne({
    record: {
      id: '124',
      firstName: 'Edoardo',
      lastName: 'Barbieri',
    },
  })

  await dao.post.insertOne({
    record: {
      id: '1',
      content: 'Typetta is awesome',
      userId: '123',
    },
  })
  await dao.post.insertOne({
    record: {
      id: '2',
      content: 'Graphql Security',
      userId: '123',
      metadata: { views: 2 },
    },
  })
  await dao.post.insertOne({
    record: {
      id: '3',
      content: 'Graphql Federations',
      userId: '123',
      metadata: { views: 1 },
    },
  })
  await dao.post.insertOne({
    record: {
      id: '4',
      content: 'Graphql 101',
      userId: '123',
    },
  })

  await dao.like.insertOne({
    record: {
      userId: '124',
      postId: '3',
    },
  })
  await dao.like.insertOne({
    record: {
      userId: '124',
      postId: '2',
    },
  })
  await dao.like.insertOne({
    record: {
      userId: '123',
      postId: '3',
    },
  })

  const results = await dao.user.findAll({
    filter: { firstName: { startsWith: 'M' } },
    relations: {
      posts: {
        relations: {
          likes: { sorts: [{ firstName: 'desc' }] },
        },
      },
    },
    projection: { firstName: true, posts: { content: true, likes: { firstName: true } } },
  })
  expect((results[0].posts ?? [])[2].likes[0].firstName).toBe('Mattia')
  expect((results[0].posts ?? [])[2].likes[1].firstName).toBe('Edoardo')
})
