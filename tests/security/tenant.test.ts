import { buildMiddleware, GenericProjection, inMemoryMongoDb, isFieldsContainedInProjection, isProjectionContained, mergeProjections, requiredProjection } from '../../src'
import { roleSecurityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/role.middleware'
import { DAOContext, ReservationFilter, ReservationProjection } from './dao.mock'
import { HotelRole, Role } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type DaoMetadata = {
  user: { id: string }
  hotelRoles: HotelRole[]
}
let unsafeDao: DAOContext<DaoMetadata>
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(metadata: DaoMetadata | undefined, db: Db): DAOContext<DaoMetadata> {
  return new DAOContext<DaoMetadata>({
    mongo: {
      default: db,
    },
    metadata,
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
    },
    overrides: {
      user: {
        middlewares: [],
      },
      hotel: {
        middlewares: [
          roleSecurityPolicy({
            key: 'id',
            permissions: {
              ADMIN: true,
              OWNER: {
                read: true,
                update: true,
                insert: true,
                replace: true,
                aggregate: true,
              },
              ANALYST: {
                read: { totalCustomers: true },
                update: false,
              },
            },
            roles: (metadata) => metadata.hotelRoles
          }),
        ],
      },
      reservation: {
        middlewares: [
          roleSecurityPolicy({
            key: 'hotelId',
            permissions: {
              ADMIN: true,
              OWNER: {
                read: true,
                update: true,
                insert: true,
                replace: true,
                aggregate: true,
              },
              ANALYST: {
                read: { roomId: true },
                update: false,
              },
            },
            roles: (metadata) => metadata.hotelRoles
          }),
        ],
      },
    },
  })
}

async function creadeDaoWithUserRoles(userId: string): Promise<DAOContext<DaoMetadata>> {
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { hotelRoles: true, id: true } })
  if (!user) {
    throw new Error('User does not exists')
  }
  return createDao(
    {
      hotelRoles: user.hotelRoles,
      user: { id: userId },
    },
    mongodb.db,
  )
}

beforeAll(async () => {
  mongodb = await inMemoryMongoDb()
  unsafeDao = createDao(undefined, mongodb.db)
})

beforeEach(async () => {
  const collections = await mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
})

test('crud tenant test', async () => {
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: '',
      hotelRoles: [
        { values: ['h1', 'h2'], role: 'OWNER' },
        { values: ['h3'], role: 'ANALYST' },
      ],
      firstName: 'owner',
    },
  })

  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 1', totalCustomers: 2, id: 'h1' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 2', totalCustomers: 2, id: 'h2' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'BHotel 3', totalCustomers: 2, id: 'h3' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 4', totalCustomers: 2, id: 'h4' } })

  const dao = await creadeDaoWithUserRoles(user.id)

  const hotels1 = await dao.hotel.findAll({ filter: { name: { $startsWith: 'AHotel' } } })

  const hotels2 = await dao.hotel.findAll({ projection: { totalCustomers: true, name: true } })

  console.log(hotels1)
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
