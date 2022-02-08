import { inMemoryMongoDb } from '../../src'
import { roleSecurityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/role.middleware'
import { DAOContext, UserParams } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type DaoMetadata = {
  user: UserParams<{ id: true; roles: { role: { permissions: true }; hotelId: true } }>
}
let unsafeDao: DAOContext<DaoMetadata>
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(metadata: DaoMetadata | undefined, db: Db): DAOContext<DaoMetadata> {
  if (!metadata) {
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
    })
  }
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
            securityContext: () => ({
              permissions: {
                MANAGE_HOTEL: {
                  id: metadata.user.roles.flatMap((v) => (v.role.permissions.includes('MANAGE_HOTEL') && v.hotelId ? [v.hotelId] : [])) ?? [],
                },
              },
            }),
            securityPolicy: {
              permissions: {
                MANAGE_HOTEL: true,
              },
            },
          }),
        ],
      },
      reservation: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: (metadata) => ({
              permissions: {
                MANAGE_RESERVATION: {
                  userId: metadata?.user.id,
                  hotelId: ['1', '2'],
                },
                MANAGE_HOTEL: {},
              },
            }),
            securityPolicy: {
              permissions: {
                MANAGE_RESERVATION: true,
                READONLY_RESERVATION: {
                  read: true,
                },
              },
            },
          }),
        ],
      },
    },
  })
}

async function creadeDaoWithUserRoles(userId: string): Promise<DAOContext<DaoMetadata>> {
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { id: true, roles: { hotelId: true, role: { permissions: true } } } })
  if (!user) {
    throw new Error('User does not exists')
  }
  return createDao(
    {
      user,
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
  await unsafeDao.role.insertOne({ record: { permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION', 'MANAGE_HOTEL'], code: 'HOTEL_OWNER' } })
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: '',
      firstName: 'owner',
    },
  })
  await unsafeDao.userRole.insertOne({ record: { roleCode: 'HOTEL_OWNER', userId: user.id, hotelId: 'h1' } })
  await unsafeDao.userRole.insertOne({ record: { roleCode: 'HOTEL_OWNER', userId: user.id, hotelId: 'h2' } })

  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 1', totalCustomers: 2, id: 'h1' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 2', totalCustomers: 2, id: 'h2' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'BHotel 3', totalCustomers: 2, id: 'h3' } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 4', totalCustomers: 2, id: 'h4' } })

  const dao = await creadeDaoWithUserRoles(user.id)

  const hotels1 = await dao.hotel.findAll({ filter: { name: { $startsWith: 'AHotel' } } })

  const hotels2 = await dao.hotel.findAll({ projection: { totalCustomers: true } })

  console.log(hotels1)
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
