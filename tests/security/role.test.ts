import { DAOGenerics, Expand, inMemoryMongoDb } from '../../src'
import { roleSecurityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/role.middleware'
import { DAOContext, UserDAOGenerics, UserParam, UserRoleParam } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type DaoMetadata = {
  user: UserParam<{ id: true; roles: { role: { permissions: true }; hotelId: true; userId: true; tenantId: true } }>
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

  function getPermissions(roles: UserRoleParam<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[]): {
    [K in Permission]?: { hotelId: string[]; userId: string[]; tenantId: number[] }
  } {
    return Object.values(Permission).reduce((permissions, key) => {
      const hotelPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.hotelId ? [v.hotelId] : []))
      const hotel = hotelPermissions.length > 0 ? { hotelId: hotelPermissions } : {}
      const userPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.userId ? [v.userId] : []))
      const user = userPermissions.length > 0 ? { userId: userPermissions } : {}
      const tenantPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.tenantId ? [v.tenantId] : []))
      const tenant = tenantPermissions.length > 0 ? { tenantId: tenantPermissions } : {}
      const permission = { ...hotel, ...user, ...tenant }
      if (Object.keys(permission).length > 0) {
        return { ...permissions, [key]: permission }
      } else {
        return permissions
      }
    }, {})
  }

  const permissions = getPermissions(metadata.user.roles)
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
      /*user: {
        middlewares: [
          roleSecurityPolicy<'hotelId' | 'tenantId' | 'userId', Permission, UserDAOGenerics<DaoMetadata, never>, { userId: 'id' }>({
            securityContext: permissions,
            keyOverrides: { userId: 'id' },
            securityPolicy: {
              permissions: {
                MANAGE_USER: true,
              },
            },
          }),
        ],
      },*/
     /* hotel: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: () => ({ permissions }),
            securityPolicy: {
              permissions: {
                MANAGE_HOTEL: true,
              },
            },
          }),
        ],
      },*/
      room: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: permissions,
            securityPolicy: {
              permissions: {
                MANAGE_ROOM: true,
                READONLY_ROOM: {
                  read: true,
                },
              },
            },
          }),
        ],
      },
      reservation: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: permissions,
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
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { id: true, roles: { role: { permissions: true }, hotelId: true, userId: true, tenantId: true } } })
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
  await unsafeDao.role.insertOne({ record: { code: 'TENANT_ADMIN', permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION', 'MANAGE_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'HOTEL_OWNER', permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION', 'MANAGE_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'IS_USER', permissions: ['MANAGE_USER', 'READONLY_ROOM', 'MANAGE_RESERVATION'] } })
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: 'mario@domain.com',
      firstName: 'Mario',
    },
  })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'IS_USER', userId: user.id } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', hotelId: 'h1' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', hotelId: 'h2' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'TENANT_ADMIN', tenantId: 2 } })

  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 1', totalCustomers: 2, id: 'h1', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 2', totalCustomers: 2, id: 'h2', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'BHotel 3', totalCustomers: 2, id: 'h3', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 4', totalCustomers: 2, id: 'h4', tenantId: 1 } })

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
