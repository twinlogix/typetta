import { inMemoryMongoDb, UserInputDriverDataTypeAdapterMap, buildMiddleware, mergeProjections, projection, tenantSecurityPolicy } from '../../src'
import { DAOContext } from './dao.mock'
import { MongoClient, Db, Int32 } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import sha256 from 'sha256'

// tslint:disable-next-line: no-var-requires
global.TextEncoder = require('util').TextEncoder
// tslint:disable-next-line: no-var-requires
global.TextDecoder = require('util').TextDecoder

jest.setTimeout(20000)

type DaoMetadata = {
  tenantId: number
  dao: (tenantId: number, db: Db) => DAOContext<DaoMetadata>
}
let dao1: DAOContext<DaoMetadata>
let dao2: DAOContext<DaoMetadata>
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}
function createDao(tenantId: number, db: Db): DAOContext<DaoMetadata> {
  return new DAOContext<DaoMetadata>({
    mongo: {
      default: db,
    },
    metadata: {
      dao: createDao,
      tenantId,
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
        dbToModel: (o: unknown) => o as number,
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
        tenantKey: 'tenantId',
      }),
    ],
  })
}

beforeAll(async () => {
  mongodb = await inMemoryMongoDb()
  dao1 = createDao(1, mongodb.db)
  dao2 = createDao(2, mongodb.db)
})

beforeEach(async () => {
  const collections = await mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
})

test('crud tenant test', async () => {
  const user0t2 = await dao2.user.insertOne({ record: { email: '2@hotel.com', tenantId: 2 } })
  try {
    await dao1.user.insertOne({ record: { email: '1@hotel.com', tenantId: 2 } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  const user0t1 = await dao1.user.insertOne({ record: { email: '1@hotel.com' } })
  expect(user0t1.tenantId).toBe(1)
  const user1t1 = await dao1.user.insertOne({ record: { email: '1@hotel.com', tenantId: 1 } })
  expect(user1t1.tenantId).toBe(1)

  const user2t1 = await dao1.user.findOne({ filter: { id: user0t2.id } })
  expect(user2t1).toBe(null)

  const user3t1 = await dao1.user.findOne({ filter: { id: user0t1.id } })
  expect(user3t1?.tenantId).toBe(1)

  try {
    await dao1.user.findOne({ filter: { tenantId: 2 } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }

  try {
    await dao1.user.updateOne({ filter: { tenantId: 1 }, changes: { tenantId: 2 } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  try {
    await dao1.user.updateOne({ filter: { tenantId: 2 }, changes: { email: 't2@gmail.com' } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  await dao1.user.updateOne({ filter: { id: user0t1.id }, changes: { email: 'tt1@gmail.com' } })
  const user4t1 = await dao1.user.findOne({ filter: { email: 'tt1@gmail.com' } })
  expect(user4t1?.email).toBe('tt1@gmail.com')

  try {
    await dao1.user.replaceOne({ filter: { tenantId: 2 }, replace: { email: 't2@gmail.com' } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  try {
    await dao1.user.replaceOne({ filter: { tenantId: 1 }, replace: { email: 't2@gmail.com', tenantId: 2 } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }

  await dao1.user.replaceOne({ filter: { id: user0t1.id }, replace: { email: 'a@gmail.com' } })
  const user5t1 = await dao1.user.findOne({ filter: { id: user0t1.id } })
  expect(user5t1?.email).toBe('a@gmail.com')
  expect(user5t1?.tenantId).toBe(1)
  await dao1.user.replaceOne({ filter: { id: user0t1.id }, replace: { email: 'a@gmail.com', tenantId: 1 } })
  const user5t2 = await dao1.user.findOne({ filter: { id: user0t1.id } })
  expect(user5t2?.email).toBe('a@gmail.com')
  expect(user5t2?.tenantId).toBe(1)

  try {
    await dao1.user.deleteOne({ filter: { tenantId: 2 } })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  await dao1.user.deleteAll({ filter: { tenantId: 1 } })
  const users = await dao1.user.findAll({ filter: { tenantId: 1 } })
  expect(users.length).toBe(0)
})

test('tenant wrong ref test', async () => {
  const u1 = await dao1.user.insertOne({ record: { email: 'u1@gmail.com' } })
  const h1 = await dao1.hotel.insertOne({ record: { name: 'H1', tenantId: 1 } })
  const h2 = await dao2.hotel.insertOne({ record: { name: 'H2', tenantId: 2 } })
  const r1 = await dao1.room.insertOne({ record: { hotelId: h1.id, size: '1' } })
  const r2 = await dao2.room.insertOne({ record: { hotelId: h2.id, size: '2' } })
  await dao1.reservation.insertOne({ record: { roomId: r1.id, userId: u1.id } })
  await dao2.reservation.insertOne({ record: { roomId: r2.id, userId: u1.id } })
  await dao1.reservation.insertOne({ record: { roomId: r2.id, userId: u1.id } })
  await dao2.reservation.insertOne({ record: { roomId: r1.id, userId: u1.id } })

  const user = await dao1.user.findOne({ filter: { id: u1.id }, projection: { reservations: { room: { size: true } } } })
  expect(user?.reservations.length).toBe(2)
  expect(user?.reservations[0]?.room?.size).toBe('1')
  expect(user?.reservations[1]?.room).toBe(null)
})

test('tenant raw operation test', async () => {
  try {
    await dao1.user.findOne({ filter: () => ({}) })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  try {
    await dao1.user.updateOne({
      filter: {},
      changes: () => ({
        $inc: { a: 1 },
      }),
    })
    fail()
  } catch (error: any) {
    expect(error.message.startsWith('[Tenant Middleware]')).toBe(true)
  }
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
