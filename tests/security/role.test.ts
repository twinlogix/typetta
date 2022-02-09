import { Expand, inMemoryMongoDb } from '../../src'
import { roleSecurityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/role.middleware'
import { DAOContext, UserParam, UserRoleParam } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type DomainPermissions = {
  [K in Permission]?: { hotelId?: string[]; userId?: string[]; tenantId?: number[] }
}
type DaoMetadata = {
  permissions: DomainPermissions
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

  type MappedDomainPermissions<Mapping extends object> = Expand<{
    [K in Permission]?: { [sK in Exclude<keyof Mapping, ''>]?: Mapping[sK] }
  }>
  function mapPermissions<H extends string = '', U extends string = '', T extends string = ''>(
    permissions: DomainPermissions,
    map: { hotelId?: H; userId?: U; tenantId?: T },
  ): MappedDomainPermissions<{ [K in H]: string[] } & { [K in U]: string[] } & { [K in T]: number[] }> {
    return Object.fromEntries(
      Object.entries(permissions).flatMap(([k, v]) => {
        const entries = Object.entries(map).flatMap(([key, value]) => {
          if (value && v[key as 'hotelId' | 'userId' | 'tenantId']) {
            return [[value, v[key as 'hotelId' | 'userId' | 'tenantId']]]
          }
          return []
        })
        if (entries.length > 0) {
          return [[k, Object.fromEntries(entries)]]
        } else {
          return []
        }
      }),
    )
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
        middlewares: [
          roleSecurityPolicy({
            securityContext: (metadata) => mapPermissions(metadata.permissions, { userId: 'id' }),
            securityPolicy: {
              MANAGE_USER: true,
            },
          }),
        ],
      },
      hotel: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: (metadata) => mapPermissions(metadata.permissions, { tenantId: 'tenantId', hotelId: 'id' }),
            securityPolicy: {
              MANAGE_HOTEL: true,
              ANALYST: { read: { totalCustomers: true } },
            },
          }),
        ],
      },
      room: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: (metadata) => metadata.permissions,
            securityPolicy: {
              MANAGE_ROOM: true,
              READONLY_ROOM: {
                read: true,
              },
            },
          }),
        ],
      },
      reservation: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: (metadata) => metadata.permissions,
            securityPolicy: {
              MANAGE_RESERVATION: true,
              READONLY_RESERVATION: {
                read: true,
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
  function getPermissions(roles: UserRoleParam<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[]): DomainPermissions {
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
  const permissions = getPermissions(user.roles)
  return createDao(
    {
      permissions,
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
  await unsafeDao.role.insertOne({ record: { code: 'ANALYST', permissions: ['ANALYST'] } })
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
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ANALYST', tenantId: 3 } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ANALYST', tenantId: 2 } })

  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 1', totalCustomers: 2, id: 'h1', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 2', totalCustomers: 2, id: 'h2', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 3', totalCustomers: 2, id: 'h3', tenantId: 2 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 4', totalCustomers: 2, id: 'h4', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'BHotel 1', totalCustomers: 2, id: 'h5', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 5', totalCustomers: 2, id: 'h5', tenantId: 3 } })

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
