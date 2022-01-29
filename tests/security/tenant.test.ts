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
  roles: HotelRole[]
}
let daoOwner: DAOContext<DaoMetadata>
let daoAdmin: DAOContext<DaoMetadata>
let daoAnalyst: DAOContext<DaoMetadata>
let mongodb: {
  replSet: MongoMemoryReplSet
  connection: MongoClient
  db: Db
}

function createDao(metadata: DaoMetadata, db: Db): DAOContext<DaoMetadata> {
  return new DAOContext<DaoMetadata>({
    mongo: {
      default: db,
    },
    metadata: {
      ...metadata,
    },
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
    },
    overrides: {
      user: {
        middlewares: [],
      },
      reservation: {
        middlewares: [
          roleSecurityPolicy('hotelId', {
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
          }),
        ],
      },
    },
  })
}

beforeAll(async () => {
  mongodb = await inMemoryMongoDb()

  daoOwner = createDao(
    {
      user: { id: 'u1' },
      roles: [
        { hotelId: 'u1', role: 'OWNER' },
        { hotelId: 'u2', role: 'OWNER' },
        { hotelId: 'u3', role: 'ANALYST' },
      ],
    },
    mongodb.db,
  )
  daoAdmin = createDao({ user: { id: 'u2' }, roles: [{ all: true, role: 'ADMIN' }] }, mongodb.db)
  daoAnalyst = createDao(
    {
      user: { id: 'u2' },
      roles: [
        { hotelId: 'u2', role: 'ANALYST' },
        { hotelId: 'u3', role: 'ANALYST' },
      ],
    },
    mongodb.db,
  )
})

beforeEach(async () => {
  const collections = await mongodb.db.collections()
  for (const collection of collections ?? []) {
    await collection.deleteMany({})
  }
})

test('crud tenant test', async () => {
  // await daoOwner.user.insertOne({ record: { email: '', role: Role.CUSTOMER, firstName: '1' } })
  // await daoOwner.user.insertOne({ record: { email: '', role: Role.CUSTOMER, firstName: '2' } })
  const asd = await daoOwner.user.findAll({ filter: { $and: [{ $or: [{ firstName: '1' }, { firstName: '2' }] }, { $or: [{ firstName: '1' }, { firstName: '3' }] }] } })
  return
})

afterAll(async () => {
  if (mongodb.connection) {
    await mongodb.connection.close()
    await mongodb.replSet.stop()
  }
})
