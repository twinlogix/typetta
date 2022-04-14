import { SecurityPolicyReadError } from '../../src'
import { PERMISSION } from '../../src/dal/dao/middlewares/securityPolicy/security.policy'
import { DAOContext, UserRoleParam } from './dao.mock'
import { Permission } from './models.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'
import { inMemoryMongoDb } from '../utils'

jest.setTimeout(20000)

type SecurityDomain = { hotelId?: string; userId?: string; tenantId?: number }
type OperationSecurityDomain = { [K in keyof SecurityDomain]: SecurityDomain[K][] }
type SecurityContext = Permission[]
type SecureDAOContext = DAOContext<never, { securityDomain: OperationSecurityDomain }, Permission, SecurityDomain>
let unsafeDao: SecureDAOContext
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(securityContext: SecurityContext | undefined, db: Db) {
  return new DAOContext<never, { securityDomain: OperationSecurityDomain }, Permission, never>({
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
      context: securityContext ?? [],
      policies: {
        hotel: {
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
          permissions: {
            MANAGE_ROOM: { create: true },
          },
        },
      },
      defaultPermission: {
        read: { id: true },
      },
    },
  })
}

async function createSecureDaoContext(userId: string): Promise<SecureDAOContext> {
  const user = await unsafeDao.user.findOne({ filter: { id: userId }, projection: { id: true, roles: { role: { permissions: true }, hotelId: true, userId: true, tenantId: true } } })
  if (!user) {
    throw new Error('User does not exists')
  }
  function createSecurityContext(roles: UserRoleParam<{ role: { permissions: true } }>[]): SecurityContext {
    return Array.from(new Set(roles.flatMap((r) => r.role.permissions.flatMap((v) => (v ? [v] : [])))).values())
  }
  const securityContext = createSecurityContext(user.roles)
  return createDao(securityContext, mongodb.db)
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
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'IS_USER' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ONLY_ID' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'HOTEL_VIEWER' } })
  await unsafeDao.userRole.insertOne({ record: { refUserId: user.id, roleCode: 'ANALYST' } })

  const dao = await createSecureDaoContext(user.id)

  try {
    await dao.hotel.findAll({ filter: { name: { startsWith: 'AHotel' } }, metadata: { securityDomain: { hotelId: ['h1', 'h2', 'h3'], tenantId: [2, 10] } } })
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ totalCustomers: true, description: true, name: true, id: true, tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual(true)
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
