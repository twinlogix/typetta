import { inMemoryMongoDb, UserInputDriverDataTypeAdapterMap, buildMiddleware, mergeProjections, projection, tenantSecurityPolicy } from '../../src'
import { DAOContext, HotelDAOGenerics } from './dao.mock'
import { Scalars } from './models.mock'
import { MongoClient, Db, Int32 } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import sha256 from 'sha256'

// tslint:disable-next-line: no-var-requires
global.TextEncoder = require('util').TextEncoder
// tslint:disable-next-line: no-var-requires
global.TextDecoder = require('util').TextDecoder

jest.setTimeout(20000)

type DaoMetadata = {
  mongodb: {
    replSet: MongoMemoryReplSet
    connection: MongoClient
    db: Db
  }
  tenantId: number
  dao: () => Promise<DAOContext<DaoMetadata>>
}
let dao: DAOContext<DaoMetadata>

async function createDao(): Promise<DAOContext<DaoMetadata>> {
  const mongodb = await inMemoryMongoDb()
  return new DAOContext<DaoMetadata>({
    mongo: {
      default: mongodb.db,
    },
    metadata: {
      dao: createDao,
      mongodb,
      tenantId: 1,
    },
    scalars: {
      Password: {
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
    },
    middlewares: [
      tenantSecurityPolicy({
        tenantKey: '',
      }),
    ],
  })
}

beforeAll(async () => {
  dao = await createDao()
})

beforeEach(async () => {
  const collections = await dao.metadata?.mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
})

test('empty find', async () => {
  await dao.user.insertOne({ record: { email: 'luca@hotel.com', tenantId: 2 } })

  const user1 = await dao.user.findOne({ filter: { email: 'luca@hotel.com' } })
  const user2 = await dao.user.findOne({ filter: { tenantId: 2 } })
  const user3 = await dao.user.findOne({ filter: { tenantId: 1 } })
})

afterAll(async () => {
  if (dao.metadata?.mongodb.connection) {
    await dao.metadata.mongodb.connection.close()
  }
  if (dao.metadata?.mongodb.replSet) {
    await dao.metadata.mongodb.replSet.stop()
  }
})
