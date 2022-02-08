import { defaultValueMiddleware, inMemoryMongoDb, tenantSecurityPolicy } from '../../src'
import { DAOContext, groupMiddleware } from './dao.mock'
import { MongoClient, Db, Int32 } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import sha256 from 'sha256'

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
      groupMiddleware.excludes(
        {
          tenant: true,
        },
        defaultValueMiddleware('tenantId', () => tenantId),
      ),
      groupMiddleware.excludes(
        {
          tenant: true,
          hotel: true,
          reservation: true,
        },
        tenantSecurityPolicy({
          tenantKey: 'tenantId',
        }),
      ),
      groupMiddleware.includes(
        {
          hotel: true,
          reservation: true,
        },
        tenantSecurityPolicy({
          tenantKey: 'tenantId',
        }),
      ),
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
  const user0t2 = await dao2.user.insertOne({ record: { firstName: 'Mario', email: '2@hotel.com' } })
  try {
    await dao1.user.insertOne({ record: { email: '1@hotel.com', tenantId: 2 } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  const user0t1 = await dao1.user.insertOne({ record: { firstName: 'Mario', email: '1@hotel.com' } })
  expect(user0t1.tenantId).toBe(1)
  const user1t1 = await dao1.user.insertOne({ record: { firstName: 'Mario', email: '1@hotel.com' } })
  expect(user1t1.tenantId).toBe(1)

  const user2t1 = await dao1.user.findOne({ filter: { id: user0t2.id } })
  expect(user2t1).toBe(null)

  const user3t1 = await dao1.user.findOne({ filter: { id: user0t1.id } })
  expect(user3t1?.tenantId).toBe(1)

  const userst2 = await dao2.user.findAll({ filter: () => ({ firstName: 'Mario' }) })
  expect(userst2.length).toBe(1)
  expect(userst2[0].id).toStrictEqual(user0t2.id)

  try {
    await dao1.user.findOne({ filter: { tenantId: 2 } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }

  try {
    await dao1.user.updateOne({ filter: { tenantId: 1 }, changes: { tenantId: 2 } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  try {
    await dao1.user.updateOne({ filter: { tenantId: 2 }, changes: { email: 't2@gmail.com' } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  await dao1.user.updateOne({ filter: { id: user0t1.id }, changes: { email: 'tt1@gmail.com' } })
  const user4t1 = await dao1.user.findOne({ filter: { email: 'tt1@gmail.com' } })
  expect(user4t1?.email).toBe('tt1@gmail.com')

  try {
    await dao1.user.replaceOne({ filter: { tenantId: 2 }, replace: { email: 't2@gmail.com' } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  try {
    await dao1.user.replaceOne({ filter: { tenantId: 1 }, replace: { email: 't2@gmail.com', tenantId: 2 } })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
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
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
  await dao1.user.deleteAll({ filter: { tenantId: 1 } })
  const users = await dao1.user.findAll({ filter: { tenantId: 1 } })
  expect(users.length).toBe(0)

  try {
    await dao1.user.aggregate({
      filter: { tenantId: 2 },
      aggregations: { count: { operation: 'count' } },
    })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }

  await dao1.tenant.insertOne({ record: { id: 1, info: 'T1' } })
  await dao1.tenant.insertOne({ record: { id: 2, info: 'T2' } })
  const tenants = await dao1.tenant.findAll()
  expect(tenants.length).toBe(2)
})

test('tenant wrong ref test', async () => {
  const u1 = await dao1.user.insertOne({ record: { email: 'u1@gmail.com' } })
  const h1 = await dao1.hotel.insertOne({ record: { name: 'H1' } })
  const h2 = await dao2.hotel.insertOne({ record: { name: 'H2' } })
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

  const res = await dao1.reservation.aggregate({
    by: {
      userId: true,
    },
    aggregations: { count: { operation: 'count' } },
  })
  expect(res[0].count).toBe(2)
})

test('tenant raw operation test', async () => {
  try {
    await dao1.user.updateOne({
      filter: {},
      changes: () => ({
        $inc: { a: 1 },
      }),
    })
    fail()
  } catch (error) {
    expect((error as Error).message.startsWith('[Tenant Middleware]')).toBe(true)
  }
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
