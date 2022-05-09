import { SecurityPolicyReadError } from '../../src'
import { EntityManager } from './dao.mock'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'
import { inMemoryMongoDb } from '../utils'

jest.setTimeout(20000)

let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao() {
  return new EntityManager({
    mongodb: {
      default: mongodb.db,
    },
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
    },
    security: {
      applySecurity: true,
      policies: {
        hotel: {
          defaultPermissions: {
            read: { tenantId: true },
          },
        },
      },
      defaultPermission: {
        read: { id: true },
      },
    },
  })
}

function createDao2() {
  return new EntityManager({
    mongodb: {
      default: mongodb.db,
    },
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
    },
    security: {
      applySecurity: true,
      defaultPermission: {
        read: { id: true },
      },
    },
  })
}


beforeAll(async () => {
  mongodb = await inMemoryMongoDb()
})

beforeEach(async () => {
  const collections = await mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
})

test('security test 1', async () => {
  const entityManager = await createDao()
  try {
    await entityManager.hotel.findAll({})
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ tenantId: true })
      expect(error.unauthorizedProjection).toStrictEqual(true)
    } else {
      fail()
    }
  }

  try {
    await entityManager.reservation.findAll({})
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true })
      expect(error.unauthorizedProjection).toStrictEqual(true)
    } else {
      fail()
    }
  }

  const entityManager2 = await createDao2()
  try {
    await entityManager2.hotel.findAll({})
    fail()
  } catch (error: unknown) {
    if (error instanceof SecurityPolicyReadError) {
      expect(error.allowedProjection).toStrictEqual({ id: true })
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
