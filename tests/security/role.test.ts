import { DAOGenerics, Expand, inMemoryMongoDb } from '../../src'
import { roleSecurityPolicy } from '../../src/dal/dao/middlewares/securityPolicy/role.middleware'
import { DAOContext, UserParam, UserRoleParam } from './dao.mock'
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
  /*type ASDD= {
    role: {
      permissions: Maybe<Permission>[];
  }
    hotelId?: Maybe<string> | undefined;
    tenantId?: Maybe<number> | undefined;
    userId?: Maybe<string> | undefined;
}[]
  function getPermissions2<Permission extends string, G extends DAOGenerics, Keys extends keyof G['model']>(
    keys: { [K in Keys]: K },
    permissionKeys: Permission[]
    permission:
    roles: UserRoleParam<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[],
  ): HicPermission<G, Keys> {
    return Object.values(Permission).reduce((permissions, key) => {
      const asd = Object.entries(keys).reduce((obj, [k, v]) => {
        const permissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.hotelId ? [v.hotelId] : []))
        const hotel = keys.hotelId && permissions.length > 0 ? { [keys.hotelId]: permissions } : {}
        return { ...obj, ...hotel }
      }, {})

      return { ...permissions, [key]: asd }
    }, {})
  }*/

  type HicPermission<G extends DAOGenerics, Key extends keyof G['model']> = Expand<{ [K in Permission]?: { [sK in Key]: G['model'][sK][] } }>
  function getPermissions<G extends DAOGenerics, H extends keyof G['model'], U extends keyof G['model'], T extends keyof G['model']>(
    keys: { hotelId?: H; userId?: U; tenantId?: T },
    roles: UserRoleParam<{ role: { permissions: true }; hotelId: true; userId: true; tenantId: true }>[],
  ): HicPermission<G, H | U | T> {
    return Object.values(Permission).reduce((permissions, key) => {
      const hotelPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.hotelId ? [v.hotelId] : []))
      const hotel = keys.hotelId && hotelPermissions.length > 0 ? { [keys.hotelId]: hotelPermissions } : {}
      const userPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.userId ? [v.userId] : []))
      const user = keys.userId && userPermissions.length > 0 ? { [keys.userId]: userPermissions } : {}
      const tenantPermissions = roles.flatMap((v) => (v.role.permissions.includes(key as Permission) && v.tenantId ? [v.tenantId] : []))
      const tenant = keys.tenantId && tenantPermissions.length > 0 ? { [keys.tenantId]: tenantPermissions } : {}
      const permission = { ...hotel, ...user, ...tenant }
      if (Object.keys(permission).length > 0) {
        return { ...permissions, [key]: permission }
      } else {
        return permissions
      }
    }, {})
  }
  const hotelPermissions = getPermissions({ hotelId: 'id', tenantId: 'tenantId' }, metadata.user.roles)
  const userPermissions = getPermissions({ userId: 'id' }, metadata.user.roles)
  const reservationPermissions = getPermissions({ hotelId: 'hotelId', userId: 'userId', tenantId: 'tenantId' }, metadata.user.roles)
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
            securityContext: () => ({ permissions: getPermissions({ userId: 'id' }, metadata.user.roles) }),
            securityPolicy: {
              permissions: {
                MANAGE_USER: true,
              },
            },
          }),
        ],
      },
      hotel: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: () => ({ permissions: getPermissions({ hotelId: 'id', tenantId: 'tenantId' }, metadata.user.roles) }),
            securityPolicy: {
              permissions: {
                MANAGE_HOTEL: true,
              },
            },
          }),
        ],
      },
      room: {
        middlewares: [
          roleSecurityPolicy({
            securityContext: () => ({ permissions: getPermissions({ hotelId: 'hotelId', tenantId: 'tenantId' }, metadata.user.roles) }),
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
            securityContext: () => ({ permissions: getPermissions({ hotelId: 'hotelId', userId: 'userId', tenantId: 'tenantId' }, metadata.user.roles) }),
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
  await unsafeDao.role.insertOne({ record: { code: 'HOTEL_OWNER', permissions: ['MANAGE_ROOM', 'MANAGE_RESERVATION'] } })
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
