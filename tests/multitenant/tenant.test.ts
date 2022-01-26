import { UserInputDriverDataTypeAdapterMap } from '../../src'
import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { MongoClient, Db, Int32 } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import sha256 from 'sha256'

// tslint:disable-next-line: no-var-requires
global.TextEncoder = require('util').TextEncoder
// tslint:disable-next-line: no-var-requires
global.TextDecoder = require('util').TextDecoder

jest.setTimeout(20000)


let replSet: MongoMemoryReplSet
let con: MongoClient
let db: Db
type DAOContextType = DAOContext<{ dao: () => DAOContextType }>
let dao: DAOContext<{ dao: () => DAOContextType }>

const scalars: UserInputDriverDataTypeAdapterMap<Scalars, 'mongo'> = {
  Password: {
    dbToModel: (o: unknown) => o as string,
    modelToDB: (o: string) => sha256('random_salt' + o),
    validate: (o: string) => {
      if (o.length < 5) {
        return new Error('The password must be 5 character or more.')
      }
      return true
    },
  },
  Email: {
    validate: (o: string) => {
      if (o.split('@').length === 2) {
        return true
      } else {
        throw new Error('The email is invalid')
      }
    },
  },
  TenantId: {
    dbToModel: (o: unknown) => (o as Int32).value,
    modelToDB: (o: number) => new Int32(o as number),
    validate: (o: number) => {
      if (Number.isInteger(o) && o > 0) {
        return true
      } else {
        throw new Error('Tenant ID must be a positive integer')
      }
    },
  },
  Username: {
    validate: (username: string) => {
      if (!username.match(/^[0-9a-z]+$/)) {
        throw new Error('The username can contains only alphanumerical characters')
      }
      if (username.length < 3 || username.length > 20) {
        throw new Error('The username must consist of at least 3 characters up to a maximum of 20')
      }
      return true
    },
  },
}

function createDao(): DAOContextType {
  return new DAOContext<{ dao: () => DAOContextType }>({
    mongo: {
      default: db,
    },
    metadata: {
      dao: createDao,
    },
    scalars,
    overrides: {
      user: {},
    },
    log: { maxQueryExecutionTime: 100000 },
  })
}

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 3 } })
  con = await MongoClient.connect(replSet.getUri(), {})
  db = con.db('test')
  dao = createDao()
})

beforeEach(async () => {
  const collections = await db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

test('empty find', async () => {
  
  const users = await dao.user.findAll({})
  expect(users.length).toBe(0)

  const user = await dao.user.findOne({})
  expect(user).toBeNull()
})

afterAll(async () => {
  if (con) {
    await con.close()
  }
  if (replSet) {
    await replSet.stop()
  }
})
