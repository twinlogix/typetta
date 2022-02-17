import { inMemoryMongoDb, SecurityPolicyReadError } from '../../src'
import { securityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/security.middleware'
import { CRUD } from '../../src/dal/dao/middlewares/securityPolicy/security.policy'
import { DAOContext, UserRoleParam } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type SecurityDomain = { hotelId?: string[]; userId?: string[]; tenantId?: number[] }
type SecurityContext = {
  [K in Permission]?: { hotelId?: string; userId?: string; tenantId?: number }[]
}
type DaoMetadata = {
  securityContext: SecurityContext
}
let unsafeDao: DAOContext<DaoMetadata, { securityDomain: SecurityDomain }>
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(metadata: DaoMetadata | undefined, db: Db): DAOContext<DaoMetadata, { securityDomain: SecurityDomain }> {
  if (!metadata) {
    return new DAOContext<DaoMetadata, { securityDomain: SecurityDomain }>({
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

  function mapSecurityContext<H extends string = '', U extends string = '', T extends string = ''>(
    permissions: SecurityContext,
    map: { hotelId?: H; userId?: U; tenantId?: T },
  ): { [K in Permission]?: ({ [K in H]: string } & { [K in U]: string } & { [K in T]: number })[] } {
    return Object.entries(permissions).reduce((p, [permission, securityContextPermission]) => {
      return {
        ...p,
        [permission]: securityContextPermission.map((v) => {
          return {
            ...(map.hotelId && v.hotelId ? { [map.hotelId]: v.hotelId } : {}),
            ...(map.userId && v.userId ? { [map.userId]: v.userId } : {}),
            ...(map.tenantId && v.tenantId ? { [map.tenantId]: v.tenantId } : {}),
          }
        }),
      }
    }, {})
  }

  return new DAOContext({
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
          securityPolicy({
            securityContext: (metadata) => mapSecurityContext(metadata.securityContext, { userId: 'id' }),
            securityDomain: (metadata) => ({ ...(metadata.securityDomain.userId ? { id: metadata.securityDomain.userId } : {}) }),
            securityPolicy: {
              MANAGE_USER: CRUD.ALLOW,
            },
          }),
        ],
      },
      hotel: {
        middlewares: [
          securityPolicy({
            securityContext: (metadata) => mapSecurityContext(metadata.securityContext, { hotelId: 'id', tenantId: 'tenantId' }),
            securityDomain: (metadata) => ({
              ...(metadata.securityDomain.hotelId ? { id: metadata.securityDomain.hotelId } : {}),
              ...(metadata.securityDomain.tenantId ? { tenantId: metadata.securityDomain.tenantId } : {}),
            }),
            securityPolicy: {
              MANAGE_HOTEL: CRUD.ALLOW,
              ANALYST: { read: { totalCustomers: true } },
              VIEW_HOTEL: { read: { description: true, name: true } },
              ONLY_ID: { read: { id: true } },
            },
          }),
        ],
      },
      room: {
        middlewares: [
          securityPolicy({
            securityContext: (metadata) => metadata.securityContext,
            securityDomain: (metadata) => metadata.securityDomain,
            securityPolicy: {
              MANAGE_ROOM: CRUD.ALLOW,
              READONLY_ROOM: {
                read: true,
              },
            },
          }),
        ],
      },
      reservation: {
        middlewares: [
          securityPolicy({
            securityContext: (metadata) => metadata.securityContext,
            securityDomain: (metadata) => metadata.securityDomain,
            securityPolicy: {
              MANAGE_RESERVATION: CRUD.ALLOW,
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

async function creadeDaoWithUserRoles(userId: string): Promise<DAOContext<DaoMetadata, { securityDomain: SecurityDomain }>> {
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { id: true, roles: { role: { permissions: true }, hotelId: true, userId: true, tenantId: true } } })
  if (!user) {
    throw new Error('User does not exists')
  }
  function createSecurityContext(roles: UserRoleParam<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[]): SecurityContext {
    return Object.values(Permission).reduce((permissions, key) => {
      const permission = roles.flatMap((v) => {
        if (v.role.permissions.includes(key as Permission)) {
          return {
            ...(v.hotelId ? { hotelId: v.hotelId } : {}),
            ...(v.userId ? { userId: v.userId } : {}),
            ...(v.tenantId ? { tenantId: v.tenantId } : {}),
          }
        }
        return []
      })
      if (Object.keys(permission).length > 0) {
        return { ...permissions, [key]: permission }
      } else {
        return permissions
      }
    }, {})
  }
  const securityContext = createSecurityContext(user.roles)
  return createDao(
    {
      securityContext,
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
  await unsafeDao.role.insertOne({ record: { code: 'HOTEL_VIEWER', permissions: ['VIEW_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'ONLY_ID', permissions: ['ONLY_ID'] } })
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
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', tenantId: 1 } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', tenantId: 2, hotelId: 'h1' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ONLY_ID', hotelId: 'h3' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_VIEWER', tenantId: 4 } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ANALYST', tenantId: 2 } })

  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 1', totalCustomers: 2, id: 'h1', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 2', totalCustomers: 2, id: 'h2', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 3', totalCustomers: 2, id: 'h3', tenantId: 2 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 4', totalCustomers: 2, id: 'h4', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'BHotel 1', totalCustomers: 2, id: 'h5', tenantId: 1 } })
  await unsafeDao.hotel.insertOne({ record: { name: 'AHotel 5', totalCustomers: 2, id: 'h5', tenantId: 3 } })

  const dao = await creadeDaoWithUserRoles(user.id)

  // await dao.hotel.aggregate({aggregations: { asd: {operation: 'count', field: 'name'} }, by: { tenantId: true }})
  //await dao.hotel.insertOne({ record: { name: '123', tenantId: 2, totalCustomers: 4, id: 'h12' } })

  try {
    await dao.hotel.findAll({ projection: { id: true, name: true }, filter: { name: { $startsWith: 'AHotel' } }, metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [2, 10] } } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true })
      expect(error.unauthorizedProjection).toStrictEqual({ name: true })
    } else {
      fail()
    }
  }
  try {
    await dao.hotel.findAll({
      projection: { id: true, name: true, totalCustomers: true },
      filter: { name: { $startsWith: 'AHotel' } },
      metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [4, 2] } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
    } else {
      fail()
    }
  }

  try {
    await dao.hotel.findAll({ projection: { id: true, name: true, totalCustomers: true }, filter: { name: { $startsWith: 'AHotel' } } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual(false)
    } else {
      fail()
    }
  }

  const hotels = await dao.hotel.findAll({
    projection: { id: true, name: true, totalCustomers: true },
    filter: { name: { $startsWith: 'AHotel' } },
    metadata: { securityDomain: { hotelId: ['h1', 'h2'] } },
  })
  expect(hotels.length).toBe(2)

  const hotels2 = await dao.hotel.findAll({
    projection: { id: true },
    metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'] } },
  })
  expect(hotels2.length).toBe(3)

  try {
    await dao.hotel.aggregate({
      by: {
        name: true,
      },
      aggregations: { v: { operation: 'sum', field: 'totalCustomers' } },
      metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [4, 2] } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
      expect(error.requestedProjection).toStrictEqual({ totalCustomers: true, name: true })
    } else {
      fail()
    }
  }

  try {
    await dao.hotel.aggregate({
      by: {
        totalCustomers: true,
      },
      aggregations: { v: { operation: 'count' } },
      metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [4, 2] } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
      expect(error.requestedProjection).toStrictEqual({ totalCustomers: true })
    } else {
      fail()
    }
  }

  const total = await dao.hotel.aggregate({
    aggregations: { v: { operation: 'count' } },
    metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [4, 2] } },
  })
  expect(total.v).toBe(3)

  try {
    await dao.hotel.aggregate({
      aggregations: { v: { operation: 'count' } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual(false)
      expect(error.unauthorizedProjection).toStrictEqual({})
      expect(error.requestedProjection).toStrictEqual({})
    } else {
      fail()
    }
  }
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
