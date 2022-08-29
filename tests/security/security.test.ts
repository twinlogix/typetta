import { SecurityPolicyReadError, SecurityPolicyWriteError } from '../../src'
import { PERMISSION } from '../../src/dal/dao/middlewares/securityPolicy/security.policy'
import { inMemoryMongoDb } from '../utils'
import { EntityManager, UserRoleParams } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

type SecurityDomain = { hotelId?: string; userId?: string; tenantId?: number }
type OperationSecurityDomain = { [K in keyof SecurityDomain]: SecurityDomain[K][] }
type SecurityContext = {
  [K in Permission]?: SecurityDomain[]
}
type SecureEntityManager = EntityManager<never, { securityDomains: OperationSecurityDomain[] }, Permission, SecurityDomain>
let unsafeDao: SecureEntityManager
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(securityContext: SecurityContext | undefined, db: Db) {
  return new EntityManager<never, { securityDomains: OperationSecurityDomain[] }, Permission, SecurityDomain>({
    mongodb: {
      default: db,
    },
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
    },
    security: {
      applySecurity: securityContext != null,
      context: {
        permissions: securityContext ?? {},
      },
      policies: {
        hotel: {
          domain: {
            hotelId: 'id',
            tenantId: 'tenantId',
            //userId: null,
          },
          permissions: {
            MANAGE_HOTEL: PERMISSION.ALLOW,
            ANALYST: { read: { totalCustomers: true } },
            VIEW_HOTEL: { read: { description: true, name: true } },
            ONLY_ID: { read: { id: true } },
          },
          defaultPermissions: {
            read: { tenantId: true },
          },
        },
        reservation: {
          defaultPermissions: PERMISSION.DENY,
        },
        room: {
          domain: {
            hotelId: 'hotelId',
            tenantId: 'tenantId',
            //userId: null,
          },
          permissions: {
            MANAGE_ROOM: { create: true },
          },
        },
        specialOr: {
          domain: {
            hotelId: { or: ['hotelId1', 'hotelId2'] },
            tenantId: { or: ['tenantId1', 'tenantId2'] },
          },
          permissions: {
            MANAGE_HOTEL: PERMISSION.ALLOW,
          },
        },
        specialAnd: {
          domain: {
            hotelId: { and: ['hotelId1', 'hotelId2'] },
            tenantId: { and: ['tenantId1', 'tenantId2'] },
          },
          permissions: {
            MANAGE_HOTEL: PERMISSION.ALLOW,
          },
        },
      },
      defaultPermission: {
        read: { id: true },
      },
      operationDomain: (metadata) => metadata?.securityDomains,
    },
  })
}

async function createSecureEntityManager(userId: string): Promise<SecureEntityManager> {
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { id: true, roles: { role: { permissions: true }, hotelId: true, userId: true, tenantId: true } } })
  if (!user) {
    throw new Error('User does not exists')
  }
  function createSecurityContext(roles: UserRoleParams<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[]): SecurityContext {
    return Object.values(Permission).reduce((permissions, key) => {
      const domains = roles.flatMap((v) => {
        if (v.role.permissions.includes(key as Permission)) {
          return {
            ...(v.hotelId ? { hotelId: v.hotelId } : {}),
            ...(v.userId ? { userId: v.userId } : {}),
            ...(v.tenantId ? { tenantId: v.tenantId } : {}),
          }
        }
        return []
      })
      if (domains.length > 0) {
        return { ...permissions, [key]: domains.some((v) => Object.keys(v).length === 0) ? true : domains }
      } else {
        return permissions
      }
    }, {})
  }
  const securityContext = createSecurityContext(user.roles)
  return createDao(securityContext, mongodb.db)
}

beforeEach(async () => {
  mongodb = await inMemoryMongoDb()
  unsafeDao = createDao(undefined, mongodb.db)
  const collections = await mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
  await unsafeDao.role.insertOne({ record: { code: 'TENANT_ADMIN', permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION', 'MANAGE_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'HOTEL_OWNER', permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION', 'MANAGE_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'HOTEL_VIEWER', permissions: ['VIEW_HOTEL'] } })
  await unsafeDao.role.insertOne({ record: { code: 'ONLY_ID', permissions: ['ONLY_ID'] } })
  await unsafeDao.role.insertOne({ record: { code: 'IS_USER', permissions: ['MANAGE_USER', 'READONLY_ROOM', 'MANAGE_RESERVATION'] } })
  await unsafeDao.role.insertOne({ record: { code: 'ANALYST', permissions: ['ANALYST'] } })
})

test('security test 1', async () => {
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

  const entityManager = await createSecureEntityManager(user.id)

  const res1 = await entityManager.hotel.findAll({
    projection: { id: true, name: true },
    metadata: { securityDomains: [] },
  })
  expect(res1.length).toBe(0)

  const res2 = await entityManager.hotel.findAll({
    projection: { tenantId: true },
    metadata: { securityDomains: [{}] },
  })
  expect(res2.length).toBe(6)

  const res3 = await entityManager.hotel.findAll({
    projection: { id: true, tenantId: true },
    metadata: { securityDomains: [{ hotelId: ['h1'], tenantId: [1] }, { hotelId: ['h3'] }] },
  })
  expect(res3.length).toBe(2)

  const res4 = await entityManager.hotel.findAll({
    projection: { id: true, tenantId: true, description: true },
    filter: { $and: [{ id: 'h1' }, { tenantId: 1 }], $or: [{ id: 'h1', tenantId: 1 }, { id: 'h3' }] },
  })
  expect(res4.length).toBe(1)

  const res5 = await entityManager.hotel.findAll({
    projection: { tenantId: true },
    filter: { name: { startsWith: 'AHotel' } },
  })
  expect(res5.length).toBe(5)

  const res6 = await entityManager.hotel.findAll({
    projection: { tenantId: true },
    filter: () => ({ name: 'AHotel 1' }),
  })
  expect(res6.length).toBe(1)

  const res7 = await entityManager.hotel.findAll({
    projection: { tenantId: true, id: true },
    filter: { $and: [{ id: 'h1' }, () => ({ name: 'AHotel 1' })] },
  })
  expect(res7.length).toBe(1)

  const res8 = await entityManager.hotel.findAll({
    projection: { tenantId: true },
    filter: { $or: [{ id: 'h1' }, () => ({ name: 'AHotel 1' })] },
  })
  expect(res8.length).toBe(1)

  try {
    await entityManager.hotel.findAll({
      projection: { id: true, name: true },
      filter: { name: { startsWith: 'AHotel' }, id: { in: ['h1', 'h2', 'h3'] }, tenantId: { in: [2, 10] } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ name: true })
    } else {
      fail()
    }
  }
  try {
    await entityManager.hotel.findAll({
      projection: { id: true, name: true, totalCustomers: true },
      filter: { name: { startsWith: 'AHotel' }, id: { in: ['h1', 'h2', 'h3'] }, tenantId: { in: [4, 2] } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true, tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
    } else {
      fail()
    }
  }

  try {
    await entityManager.hotel.findAll({
      projection: { id: true, name: true, totalCustomers: true },
      filter: { name: { startsWith: 'AHotel' } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ id: true, name: true, totalCustomers: true })
      expect(error.requestedProjection).toStrictEqual({ id: true, name: true, totalCustomers: true })
    } else {
      fail()
    }
  }

  const hotels = await entityManager.hotel.findAll({
    projection: { id: true, name: true, totalCustomers: true },
    filter: { name: { startsWith: 'AHotel' }, id: { in: ['h1', 'h2'] } },
  })
  expect(hotels.length).toBe(2)

  const hotels2 = await entityManager.hotel.findAll({
    projection: { id: true },
    metadata: { securityDomains: [{ hotelId: ['h1', 'h2', 'h3'] }] },
  })
  expect(hotels2.length).toBe(3)

  const hotels3 = await entityManager.hotel.findAll({
    projection: { id: true, name: true, totalCustomers: true },
    filter: { $and: [{ name: { startsWith: 'AHotel' }, id: 'h1' }, () => ({ id: 'h1' })] },
  })
  expect(hotels3.length).toBe(1)

  const hotels4 = await entityManager.hotel.findAll({
    projection: { id: true, name: true, totalCustomers: true },
    filter: { name: { startsWith: 'AHotel' }, id: 'h1', tenantId: 1, $and: [{ id: { in: ['h1', 'h2'] } }, { id: 'h1' }] },
  })
  expect(hotels4.length).toBe(1)

  const hotels5 = await entityManager.hotel.findAll({
    projection: { id: true, name: true, totalCustomers: true },
    filter: { name: { startsWith: 'AHotel' }, id: 'h1', $and: [{ id: { in: ['h3', 'h4'] } }, { id: 'h5' }] },
  })
  expect(hotels5.length).toBe(0)

  try {
    await entityManager.hotel.aggregate({
      by: {
        name: true,
      },
      filter: { id: { in: ['h1', 'h2', 'h3'] }, tenantId: { in: [4, 2] } },
      aggregations: { v: { operation: 'sum', field: 'totalCustomers' } },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true, tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
      expect(error.requestedProjection).toStrictEqual({ totalCustomers: true, name: true })
    } else {
      fail()
    }
  }

  try {
    await entityManager.hotel.aggregate({
      by: {
        totalCustomers: true,
      },
      aggregations: { v: { operation: 'count' } },
      metadata: { securityDomains: [{ hotelId: ['h1', 'h2', 'h3'], tenantId: [4, 2] }] },
    })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true, description: true, name: true, tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ totalCustomers: true })
      expect(error.requestedProjection).toStrictEqual({ totalCustomers: true })
    } else {
      fail()
    }
  }

  const total = await entityManager.hotel.aggregate({
    aggregations: { v: { operation: 'count' } },
    filter: { id: { in: ['h1', 'h2', 'h3'] }, tenantId: { in: [4, 2] } },
  })
  expect(total.v).toBe(1)

  try {
    await entityManager.reservation.aggregate({
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

  const total2 = await entityManager.user.aggregate({
    aggregations: { v: { operation: 'count' } },
  })
  expect(total2.v).toBe(1)

  try {
    await entityManager.room.insertOne({ record: { description: 'room1', from: new Date(), hotelId: 'h12', tenantId: 99, to: new Date() } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyWriteError) {
      expect(error.permissions.length).toBe(1)
    } else {
      fail()
    }
  }

  await entityManager.room.insertOne({ record: { description: 'room1', from: new Date(), hotelId: 'h1', tenantId: 2, to: new Date() } })
})

test('security test 2', async () => {
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: 'mario@domain.com',
      firstName: 'Mario',
    },
  })

  const entityManager = await createSecureEntityManager(user.id)

  try {
    await entityManager.hotel.findAll({ projection: { id: true, name: true } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ id: true, name: true })
    } else {
      fail()
    }
  }
})

test('security test 3', async () => {
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: 'mario@domain.com',
      firstName: 'Mario',
    },
  })

  const entityManager = await createSecureEntityManager(user.id)

  try {
    await entityManager.hotel.findAll({ projection: { id: true, name: true }, metadata: { securityDomains: [{ hotelId: ['none'] }] } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual({ id: true, name: true })
    } else {
      fail()
    }
  }
})

test('security test 4', async () => {
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: 'mario@domain.com',
      firstName: 'Mario',
    },
  })

  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER' } })

  const entityManager = await createSecureEntityManager(user.id)

  await entityManager.hotel.findAll({ projection: { id: true, name: true }, metadata: { securityDomains: [{ hotelId: ['h1'] }] } })
  await entityManager.hotel.findAll({ projection: { id: true, name: true } })
})

test('security test 5', async () => {
  const user = await unsafeDao.user.insertOne({
    record: {
      id: 'u1',
      email: 'mario@domain.com',
      firstName: 'Mario',
    },
  })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', hotelId: 'h1' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', hotelId: 'h2' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', tenantId: 1 } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_OWNER', tenantId: 2 } })

  await unsafeDao.specialOr.insertOne({ record: { hotelId1: 'h1', hotelId2: 'h3', tenantId1: 3, tenantId2: 4 } })
  await unsafeDao.specialOr.insertOne({ record: { hotelId1: 'h3', hotelId2: 'h2', tenantId1: 3, tenantId2: 4 } })
  await unsafeDao.specialOr.insertOne({ record: { hotelId1: 'h3', hotelId2: 'h4', tenantId1: 1, tenantId2: 4 } })
  await unsafeDao.specialOr.insertOne({ record: { hotelId1: 'h3', hotelId2: 'h4', tenantId1: 3, tenantId2: 2 } })
  await unsafeDao.specialOr.insertOne({ record: { hotelId1: 'h3', hotelId2: 'h4', tenantId1: 3, tenantId2: 5 } })

  const entityManager = await createSecureEntityManager(user.id)

  const r1 = await entityManager.specialOr.findAll({ filter: { $or: [{ hotelId1: 'h1' }, { hotelId2: 'h2' }, { tenantId1: 1 }, { tenantId2: 2 }] } })
  expect(r1.length).toBe(4)

  try {
    await entityManager.specialOr.findAll({ filter: { hotelId1: 'h3' } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true })
      expect(error.unauthorizedProjection).toStrictEqual(true)
    } else {
      fail()
    }
  }

  await unsafeDao.specialAnd.insertOne({ record: { hotelId1: 'h1', hotelId2: 'h1', tenantId1: 1, tenantId2: 1 } })
  await unsafeDao.specialAnd.insertOne({ record: { hotelId1: 'h3', hotelId2: 'h2', tenantId1: 3, tenantId2: 4 } })

  try {
    await entityManager.specialAnd.findAll({ filter: { hotelId1: 'h3' } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true })
      expect(error.unauthorizedProjection).toStrictEqual(true)
    } else {
      fail()
    }
  }

  const r2 = await entityManager.specialAnd.findAll({ filter: { $and: [{ hotelId1: 'h1' }, { hotelId2: 'h1' }, { tenantId1: 1 }, { tenantId2: 1 }] } })
  expect(r2.length).toBe(1)
})

afterEach(async () => {
  await mongodb.connection.close()
  await mongodb.replSet.stop()
})
