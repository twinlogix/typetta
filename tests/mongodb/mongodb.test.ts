import { computedField, projectionDependency, buildMiddleware, UserInputDriverDataTypeAdapterMap, inMemoryMongoDb, defaultValueMiddleware, softDelete, audit, selectMiddleware, projection, buildProjection } from '../../src'
import { Test, typeAssert } from '../utils.test'
import { CityProjection, DAOContext, UserDAO, UserProjection } from './dao.mock'
import { Scalars, State, User } from './models.mock'
import BigNumber from 'bignumber.js'
import { GraphQLResolveInfo } from 'graphql'
import { MongoClient, Db, Decimal128 } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import sha256 from 'sha256'
import { PartialDeep } from 'type-fest'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

let replSet: MongoMemoryReplSet
let connection: MongoClient
let db: Db
type DAOContextType = DAOContext<{ conn: MongoClient; dao: () => DAOContextType }>
let dao: DAOContext<{ conn: MongoClient; dao: () => DAOContextType }>
const scalars: UserInputDriverDataTypeAdapterMap<Scalars, 'mongo'> = {
  ID: {
    generate: () => uuidv4(),
  },
  Password: {
    dbToModel: (o: unknown) => o as string,
    modelToDB: (o: string) => sha256(o),
    validate: (o: string) => {
      if (o.length < 3) {
        return new Error('Password must be 3 character or more.')
      }
      return true
    },
  },
  Decimal: {
    dbToModel: (o: unknown) => new BigNumber((o as Decimal128).toString()),
    modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
  },
}

function createDao(): DAOContext<{ conn: MongoClient; dao: () => DAOContextType }> {
  return new DAOContext<{ conn: MongoClient; dao: () => DAOContextType }>({
    mongodb: {
      default: db,
      __mock: db,
    },
    metadata: {
      conn: connection,
      dao: createDao,
    },
    scalars,
    overrides: {
      user: {},
    },
    log: { maxQueryExecutionTime: 100000 },
  })
}

beforeAll(async () => {
  const mongo = await inMemoryMongoDb()
  replSet = mongo.replSet
  connection = mongo.connection
  db = mongo.db
  dao = createDao()
})

beforeEach(async () => {
  const collections = await db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

// ------------------------------------------------------------------------
// ---------------------------- FIND --------------------------------------
// ------------------------------------------------------------------------
test('empty find', async () => {
  const users = await dao.user.findAll({})
  expect(users.length).toBe(0)

  const user = await dao.user.findOne({})
  expect(user).toBeNull()
})

test('simple findAll', async () => {
  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })

  const users = await dao.user.findAll({})
  expect(users.length).toBe(1)
  expect(users[0].firstName).toBe('FirstName')
  expect(users[0].lastName).toBe('LastName')
})

test('simple findOne', async () => {
  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })

  const user = await dao.user.findOne({})
  expect(user).toBeDefined()
  expect(user!.firstName).toBe('FirstName')
  expect(user!.lastName).toBe('LastName')
})

test('simple findOne multiple filter', async () => {
  await dao.user.insertOne({ record: { firstName: '1', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '1', live: true } })

  const users = await dao.user.findAll({ filter: { $and: [{ lastName: '2' }, () => ({ name: '2' })] } })
  expect(users.length).toBe(1)
  expect(users[0].lastName).toBe('2')
})

// ------------------------------------------------------------------------
// -------------------------- ASSOCIATIONS --------------------------------
// ------------------------------------------------------------------------
test('findOne innerRef association without projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const dog = await dao.dog.findOne({})
  // expect(dog!.owner).toBeUndefined()
})

test('findOne foreignRef association without projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const users = await dao.user.findAll({})
  // expect(users[0].dogs).toBeUndefined()
})

test('findOne simple inner association', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const dog = await dao.dog.findOne({ projection: { owner: { firstName: true } } })
  expect(dog!.owner).toBeDefined()
  expect(dog!.owner!.firstName).toBe('FirstName')
})

test('findOne simple foreignRef association', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })
  await dao.dog.insertOne({ record: { name: 'Pippo', ownerId: user.id } })

  const foundUser = await dao.user.findOne({ projection: { id: true, dogs: { name: true, ownerId: true } }, relations: { dogs: { filter: { name: 'Charlie' } } } })
  expect(foundUser!.dogs).toBeDefined()
  expect(foundUser!.dogs!.length).toBe(1)
  expect(foundUser!.dogs![0].name).toBe('Charlie')
})

test('findOne simple foreignRef association 2', async () => {
  const user1 = await dao.user.insertOne({ record: { firstName: 'FirstName1', lastName: 'LastName1', live: true } })
  const user2 = await dao.user.insertOne({ record: { firstName: 'FirstName2', lastName: 'LastName2', live: true } })
  await dao.dog.insertOne({ record: { name: 'Dog 1', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 2', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 3', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 4', ownerId: user2.id } })

  const users = await dao.user.findAll({
    projection: { dogs: { name: true } },
    relations: {
      dogs: {
        limit: 1,
      },
    },
  })

  expect(users[0].dogs!.length).toBe(1)
  expect(users[1].dogs!.length).toBe(1)
})

test('findOne self innerRef association', async () => {
  const user1 = await dao.user.insertOne({ record: { firstName: 'FirstName1', lastName: 'LastName1', live: true } })
  const user2 = await dao.user.insertOne({ record: { firstName: 'FirstName2', lastName: 'LastName2', friendsId: [user1.id], live: true } })

  const foundUser = await dao.user.findOne({ filter: { firstName: 'FirstName2' }, projection: { friends: { firstName: true } } })
  expect(foundUser!.friends).toBeDefined()
  expect(foundUser!.friends!.length).toBe(1)
  expect(foundUser!.friends![0].firstName!).toBe('FirstName1')
})

test('findOne foreignRef without from and to fields in projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const foundUser = await dao.user.findOne({ projection: { dogs: { name: true } } })
  expect(foundUser!.dogs).toBeDefined()
  expect(foundUser!.dogs!.length).toBe(1)
  expect(foundUser!.dogs![0].name).toBe('Charlie')
})

test('find nested foreignRef association', async () => {
  await dao.address.insertOne({ record: { id: 'address1' } })
  await dao.organization.insertOne({ record: { id: 'organization1', name: 'Organization 1', address: { id: 'address1' } } })
  await dao.city.insertOne({ record: { id: 'city1', name: 'City 1', addressId: 'address1' } })
  await dao.city.insertOne({ record: { id: 'city2', name: 'City 2', addressId: 'address1' } })

  const response = await dao.organization.findAll({ projection: { id: true, address: { id: true, cities: { id: true, name: true } } } })
  expect(response.length).toBe(1)
  expect(response[0].address?.cities?.length).toBe(2)
  if (response[0].address?.cities) {
    expect(response[0].address.cities[0].name).toBe('City 1')
    expect(response[0].address.cities[1].name).toBe('City 2')
  }
})

// ------------------------------------------------------------------------
// ------------------------ ADVANCED PROJECTIONS --------------------------
// ------------------------------------------------------------------------
test('safe find', async () => {
  await dao.user.insertOne({ record: { id: 'u1', firstName: 'FirstName', lastName: 'LastName', live: true } })

  // Static projection
  const response = await dao.user.findAll({ projection: { firstName: true, live: true } })
  typeAssert<Test<typeof response, { firstName?: string | null; live: boolean; __projection: { firstName: true; live: true } }[]>>()
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('FirstName')
  expect(response[0].live).toBe(true)

  // Static projection
  const response1 = await dao.user.findOne({ filter: { id: 'u2' }, projection: { live: true } })
  typeAssert<Test<typeof response1, { live: boolean; __projection: { live: true } } | null>>()
  expect(response1).toBe(null)

  // Static projection
  const response2 = await dao.user.findOne({ projection: { firstName: true, live: true, c: true } })
  typeAssert<Test<typeof response2, { firstName?: string | null; live: boolean; __projection: { firstName: true; live: true; c: boolean } } | null>>()
  expect(response2).toBeDefined()
  expect(response2!.firstName).toBe('FirstName')
  expect(response2!.live).toBe(true)

  // Dynamic projection
  const proj: UserProjection = { firstName: true, live: true }
  const response3 = await dao.user.findOne({ projection: proj })
  typeAssert<Test<typeof response3, (PartialDeep<User> & { __projection: 'unknown' }) | null>>()
  expect(response3).toBeDefined()
  expect(response3!.firstName).toBe('FirstName')
  expect(response3!.live).toBe(true)

  // Static projection create before
  const proj2 = UserDAO.projection({ live: true })
  const response7 = await dao.user.findOne({ projection: proj2 })
  typeAssert<Test<typeof response7, { live: boolean; __projection: { live: true } } | null>>()
  expect(response7).toBeDefined()
  expect(response7!.live).toBe(true)

  // Static projection create before (do not use)
  const proj3: PartialDeep<UserProjection> = { live: true }
  const response8 = await dao.user.findOne({ projection: proj3 })
  typeAssert<Test<typeof response8, (PartialDeep<User> & { __projection: 'unknown' }) | null>>()
  expect(response8).toBeDefined()

  // Whole object
  const response4 = await dao.user.findOne({ projection: true })
  typeAssert<Test<typeof response4, (User & { __projection: 'all' }) | null>>()
  expect(response4).toBeDefined()
  expect(response4!.firstName).toBe('FirstName')
  expect(response4!.live).toBe(true)

  // No projection
  const response5 = await dao.user.findOne({})
  typeAssert<Test<typeof response5, (User & { __projection: 'all' }) | null>>()
  expect(response5).toBeDefined()
  expect(response5!.firstName).toBe('FirstName')
  expect(response5!.live).toBe(true)

  // Empty static projection
  const response6 = await dao.user.findOne({ projection: {} })
  typeAssert<Test<typeof response6, { __projection: 'empty' } | null>>()
  expect(response6).toBeDefined()

  // All undefined projection
  const response9 = await dao.user.findOne()
  typeAssert<Test<typeof response9, (User & { __projection: 'all' }) | null>>()
  expect(response9).toBeDefined()

  // Info to projection
  const response10 = await dao.user.findOne({ projection: {} as GraphQLResolveInfo })
  typeAssert<Test<typeof response10, (PartialDeep<User> & { __projection: 'unknown' }) | null>>()
  // expect(response10).toBeDefined()
})

// ------------------------------------------------------------------------
// ------------------------------ FILTERS ---------------------------------
// ------------------------------------------------------------------------
test('find with no filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll()
  expect(response1.length).toBe(10)
  const response2 = await dao.user.findAll({})
  expect(response2.length).toBe(10)
  const response3 = await dao.user.findAll({ projection: { id: true } })
  expect(response3.length).toBe(10)
  const response4 = await dao.user.findOne()
  expect(response4).toBeDefined()
  const response5 = await dao.user.findOne({})
  expect(response5).toBeDefined()
  const response6 = await dao.user.findOne({ projection: { id: true } })
  expect(response6).toBeDefined()
  const response7 = await dao.user.findPage()
  expect(response7.records.length).toBe(10)
  const response8 = await dao.user.findPage({})
  expect(response8.records.length).toBe(10)
  const response9 = await dao.user.findPage({ projection: { id: true } })
  expect(response9.records.length).toBe(10)
})

test('find with simple filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ filter: { firstName: '1' } })
  expect(response1.length).toBe(1)
  expect(response1[0].firstName).toBe('1')
  const response2 = await dao.user.findOne({ filter: { firstName: '1' } })
  expect(response2).toBeDefined()
  expect(response2!.firstName).toBe('1')
  const response3 = await dao.user.findPage({ filter: { firstName: '1' } })
  expect(response3.records.length).toBe(1)
  expect(response3.records[0].firstName).toBe('1')
})

test('find with $in filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ filter: { firstName: { $in: ['1'] } } })
  expect(response1.length).toBe(1)
  expect(response1[0].firstName).toBe('1')
  const response2 = await dao.user.findAll({ filter: { firstName: { $in: ['1', '2'] } } })
  expect(response2.length).toBe(2)
  const response3 = await dao.user.findAll({ filter: { firstName: { $in: ['1', 'a'] } } })
  expect(response3.length).toBe(1)
  const response4 = await dao.user.findAll({ filter: { firstName: { $in: [] } } })
  expect(response4.length).toBe(0)
  const response5 = await dao.user.findAll({ filter: { firstName: { $in: ['a'] } } })
  expect(response5.length).toBe(0)
})

// ------------------------------------------------------------------------
// -------------------------- PAGINATION ----------------------------------
// ------------------------------------------------------------------------
test('find with start', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ skip: 0 })
  expect(response1.length).toBe(10)
  expect(response1[0].firstName).toBe('0')
  expect(response1[1].firstName).toBe('1')
  const response2 = await dao.user.findAll({ skip: 5 })
  expect(response2.length).toBe(5)
  expect(response2[0].firstName).toBe('5')
  expect(response2[1].firstName).toBe('6')
  const response3 = await dao.user.findAll({ skip: 10 })
  expect(response3.length).toBe(0)
  const response4 = await dao.user.findAll({ skip: 20 })
  expect(response4.length).toBe(0)
})

test('find with limit', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ limit: 0 })
  expect(response1.length).toBe(0)
  const response2 = await dao.user.findAll({ limit: 1 })
  expect(response2.length).toBe(1)
  expect(response2[0].firstName).toBe('0')
  const response3 = await dao.user.findAll({ limit: 2 })
  expect(response3.length).toBe(2)
  expect(response3[0].firstName).toBe('0')
  expect(response3[1].firstName).toBe('1')
  const response4 = await dao.user.findAll({ limit: 10 })
  expect(response4.length).toBe(10)
  const response5 = await dao.user.findAll({ limit: 100 })
  expect(response5.length).toBe(10)
})

test('find with simple sorts', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response1[0].firstName).toBe('9')
  expect(response1[1].firstName).toBe('8')
  const response2 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response2[0].firstName).toBe('9')
  const response3 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response3[0].firstName).toBe('9')
  const response4 = await dao.user.findAll({ sorts: [{ firstName: 'asc' }] })
  expect(response4[0].firstName).toBe('0')
  expect(response4[1].firstName).toBe('1')
})

test('find with multiple sorts', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '1', lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }, { lastName: 'desc' }] })
  expect(response1[0].lastName).toBe('9')
  expect(response1[1].lastName).toBe('8')
})

test('find with start and limit', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ skip: 0, limit: 0 })
  expect(response1.length).toBe(0)
  const response2 = await dao.user.findAll({ skip: 1, limit: 1 })
  expect(response2.length).toBe(1)
  expect(response2[0].firstName).toBe('1')
  const response3 = await dao.user.findAll({ skip: 1, limit: 0 })
  expect(response3.length).toBe(0)
  const response4 = await dao.user.findAll({ skip: 2, limit: 2 })
  expect(response4.length).toBe(2)
  expect(response4[0].firstName).toBe('2')
  expect(response4[1].firstName).toBe('3')
  const response5 = await dao.user.findAll({ skip: 8, limit: 10 })
  expect(response5.length).toBe(2)
  expect(response5[0].firstName).toBe('8')
  expect(response5[1].firstName).toBe('9')
})

// ------------------------------------------------------------------------
// -------------------------- INSERT --------------------------------------
// ------------------------------------------------------------------------
test('simple insert', async () => {
  let response

  response = await dao.user.findAll({})
  expect(response.length).toBe(0)

  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  response = await dao.user.findAll({})
  expect(response.length).toBe(1)
})

test('ID auto-generation and find by id', async () => {
  const { id } = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  expect(id).toBeDefined()
  const response1 = await dao.user.findAll({ filter: { id } })
  expect(response1.length).toBe(1)
})

test('insert and find embedded entity', async () => {
  await dao.user.insertOne({ record: { usernamePasswordCredentials: { username: 'username', password: 'password' }, live: true } })
  const response = await dao.user.findAll({})
  expect(response.length).toBe(1)
  expect(response[0].usernamePasswordCredentials).toBeDefined()
  expect(response[0].usernamePasswordCredentials!.username).toBe('username')
  expect(response[0].usernamePasswordCredentials!.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('insert generic test 1', async () => {
  const ins = await dao.user.insertOne({
    record: {
      live: true,
      localization: { latitude: 1.1, longitude: 2.2 },
      amount: new BigNumber(11.11),
      amounts: [new BigNumber(11.11), new BigNumber(12.11)],
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  expect(ins.usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
  const all = await dao.user.findAll({ filter: { id: ins.id }, projection: true })
  expect(all.length).toBe(1)
  expect(all[0].live).toBe(true)
  expect(all[0].localization?.latitude).toBe(1.1)
  expect(all[0].localization?.longitude).toBe(2.2)
  expect(all[0].amount?.toNumber()).toBe(11.11)
  expect(all[0].amounts![0].toNumber()).toBe(11.11)
  expect(all[0].amounts![1].toNumber()).toBe(12.11)
  expect(all[0].usernamePasswordCredentials?.username).toBe('user')
  expect(all[0].usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('insert validation fails', async () => {
  try {
    await dao.user.insertOne({
      record: {
        live: true,
        usernamePasswordCredentials: {
          username: 'user',
          password: 'p',
        },
      },
    })
    fail()
  } catch (error: any) {
    expect(error.message).toBe('Password must be 3 character or more.')
  }
})

test('Insert default', async () => {
  try {
    await dao.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1' } })
    fail()
  } catch (error: unknown) {
    expect(((error as Error).message as string).startsWith('Generator for scalar Live is needed for generate default fields live')).toBe(true)
  }

  const dao1 = new DAOContext({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars: {
      ...scalars,
      Live: {
        generate: () => true,
      },
    },
  })

  try {
    await dao1.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1' } })
    fail()
  } catch (error: unknown) {
    expect(((error as Error).message as string).startsWith('Fields creationDate should have been generated from a middleware but it is undefined')).toBe(true)
  }

  const e1 = await dao1.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1', creationDate: 123 } })
  expect(e1.live).toBe(true)

  const dao2 = new DAOContext({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars: {
      ...scalars,
      Live: {
        generate: () => true,
      },
    },
    overrides: {
      defaultFieldsEntity: {
        middlewares: [defaultValueMiddleware('creationDate', () => 1234)],
      },
    },
  })

  const e2 = await dao2.defaultFieldsEntity.insertOne({ record: { id: 'id2', name: 'n1' } })
  expect(e2.live).toBe(true)
  expect(e2.creationDate).toBe(1234)
  expect(e2.opt1).toBe(undefined)
  expect(e2.opt2).toBe(true)

  const e3 = await dao2.defaultFieldsEntity.insertOne({ record: { id: 'id3', name: 'n1', opt1: undefined } })
  expect(e3.opt1).toBe(undefined)
})

test('update validation fails', async () => {
  await dao.user.insertOne({
    record: {
      live: true,
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  try {
    await dao.user.updateAll({
      filter: {},
      changes: { 'usernamePasswordCredentials.password': 'p' },
    })
    fail()
  } catch (error: any) {
    expect(error.message).toBe('Password must be 3 character or more.')
  }
})

test('replace validation fails', async () => {
  await dao.user.insertOne({
    record: {
      live: true,
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  try {
    await dao.user.replaceOne({
      filter: {},
      replace: {
        live: true,
        usernamePasswordCredentials: {
          username: 'user',
          password: 'p',
        },
      },
    })
    fail()
  } catch (error: any) {
    expect(error.message).toBe('Password must be 3 character or more.')
  }
})

// ------------------------------------------------------------------------
// ------------------------------ UPDATE ----------------------------------
// ------------------------------------------------------------------------
test('simple update', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateOne({ filter: { id: user.id }, changes: { lastName: 'LastName' } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2!.firstName).toBe(user.firstName)
  expect(user2!.lastName).toBe('LastName')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { firstName: 'NewFirstName' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3!.firstName).toBe('NewFirstName')
  expect(user3!.lastName).toBe(user3!.lastName)
})

test('update embedded entity', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateOne({ filter: { id: user.id }, changes: { usernamePasswordCredentials: { username: 'username', password: 'password' } } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2!.usernamePasswordCredentials).toBeDefined()
  expect(user2!.usernamePasswordCredentials!.username).toBe('username')
  expect(user2!.usernamePasswordCredentials!.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { usernamePasswordCredentials: { username: 'newUsername', password: 'newPassword' } } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3!.usernamePasswordCredentials).toBeDefined()
  expect(user3!.usernamePasswordCredentials!.username).toBe('newUsername')
  expect(user3!.usernamePasswordCredentials!.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { 'usernamePasswordCredentials.username': 'newUsername_2' } })
  const user4 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user4!.usernamePasswordCredentials).toBeDefined()
  expect(user4!.usernamePasswordCredentials!.username).toBe('newUsername_2')
  expect(user4!.usernamePasswordCredentials!.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')
})

test('update with undefined', async () => {
  const user = await dao.user.insertOne({
    record: {
      id: 'u1',
      firstName: 'FirstName',
      lastName: 'LastName',
      live: true,
    },
  })
  await dao.user.updateOne({ filter: { id: user.id }, changes: { live: undefined } })
  const user2 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user2?.live).toBe(true)
  await dao.user.updateAll({ filter: { id: user.id }, changes: { live: undefined, firstName: 'Mario' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user3?.live).toBe(true)
})

// ------------------------------------------------------------------------
// ------------------------------ REPLACE ---------------------------------
// ------------------------------------------------------------------------
test('simple replace', async () => {
  const user: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })
  await dao.user.replaceOne({ filter: { id: user.id }, replace: { id: user.id, firstName: 'FirstName 1', live: true } })
  const user1 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user1).toBeDefined()
  expect(user1?.firstName).toBe('FirstName 1')
})

// ------------------------------------------------------------------------
// ------------------------------ DELETE ----------------------------------
// ------------------------------------------------------------------------
test('simple delete', async () => {
  const user: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  const user1 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user1).toBeDefined()

  await dao.user.deleteOne({ filter: { id: user.id } })

  const user2 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user2).toBeNull()
})

// ------------------------------------------------------------------------
// --------------------------- GEOJSON FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve geojson field', async () => {
  const iuser: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, localization: { latitude: 1.111, longitude: 2.222 } } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, localization: true } })
  expect(user).toBeDefined()
  expect(user!.localization?.latitude).toBe(1.111)
  expect(user!.localization?.longitude).toBe(2.222)
})

// ------------------------------------------------------------------------
// --------------------------- DECIMAL FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve decimal field', async () => {
  const iuser: User = await dao.user.insertOne({ record: { id: 'ID1', firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

  /*const user1 = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amount: true } })
  expect(user1).toBeDefined()
  expect(user1!.amount!.comparedTo(12.12)).toBe(0)*/

  const user2 = await dao.user.findOne({ filter: { amount: new BigNumber(12.12) }, projection: { id: true, amount: true } })
  expect(user2).toBeDefined()
  expect(user2!.amount!.comparedTo(12.12)).toBe(0)
  expect(user2!.id!).toBe('ID1')
})

test('insert and retrieve decimal field 2', async () => {
  await dao.user.insertOne({ record: { id: 'ID1', live: true, amounts: [new BigNumber(1.1), new BigNumber(2.2)] } })

  const user2 = await dao.user.findOne({ filter: { amounts: { $in: [[new BigNumber(1.1), new BigNumber(2.2)]] } }, projection: { id: true, amounts: true } })
  expect(user2).toBeDefined()
  expect(user2!.amounts!.length).toBe(2)
  expect(user2!.id!).toBe('ID1')
})

test('update and retrieve decimal field', async () => {
  const iuser: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amount: true } })
  expect(user).toBeDefined()
  expect(user!.amount!.comparedTo(12.12)).toBe(0)

  await dao.user.updateOne({ filter: { id: user!.id }, changes: { amount: new BigNumber(14.14) } })
  const user1 = await dao.user.findOne({ filter: { id: user!.id }, projection: { id: true, amount: true } })

  expect(user1).toBeDefined()
  expect(user1!.amount!.comparedTo(14.14)).toBe(0)
})

test('insert and retrieve decimal array field', async () => {
  const iuser: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amounts: [new BigNumber(1.02), new BigNumber(2.223)] } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amounts: true } })
  expect(user).toBeDefined()
  expect(user!.amounts?.length).toBe(2)
  expect(user!.amounts![0].comparedTo(1.02)).toBe(0)
  expect(user!.amounts![1].comparedTo(2.223)).toBe(0)
})

// ------------------------------------------------------------------------
// ---------------------- LOCALIZED STRING FIELD --------------------------
// ------------------------------------------------------------------------
test('insert and retrieve localized string field', async () => {
  const iuser: User = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, title: { it: 'Ciao', en: 'Hello' } } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, title: true } })
  expect(user).toBeDefined()
  expect(user!.title?.en).toBe('Hello')
  expect(user!.title?.it).toBe('Ciao')
})

// ------------------------------------------------------------------------
// --------------------------- MIDDLEWARE ---------------------------------
// ------------------------------------------------------------------------
test('middleware 1', async () => {
  let operationCount = 0
  const dao2 = new DAOContext({
    log: ['error', 'warning'],
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      user: {
        middlewares: [
          projectionDependency({ fieldsProjection: { id: true }, requiredProjection: { live: true } }),
          {
            before: async (args, context) => {
              if (args.operation === 'insert') {
                if (args.params.record.id === 'u1' && args.params.record.firstName === 'Mario') {
                  throw new Error('is Mario')
                }
                if (args.params.record.firstName) {
                  return {
                    continue: true,
                    operation: 'insert',
                    params: { ...args.params, record: { ...args.params.record, firstName: args.params.record.firstName?.toUpperCase() } },
                  }
                }
              }

              if (args.operation === 'find') {
                if (args.params.projection !== true && args.params.projection?.id) {
                  expect(args.params.projection.live).toBe(true)
                  operationCount++
                }
              }

              if (args.operation === 'update') {
                if (typeof args.params.filter !== 'function' && !Array.isArray(args.params.filter) && args.params.filter?.id === 'u1') {
                  return {
                    continue: true,
                    operation: args.operation,
                    params: { ...args.params, changes: { ...args.params.changes, lastName: 'Bros' } },
                  }
                }
              }

              if (args.operation === 'delete') {
                if (typeof args.params.filter !== 'function' && !Array.isArray(args.params.filter) && args.params.filter?.id === 'u1') {
                  return {
                    continue: true,
                    operation: args.operation,
                    params: { ...args.params, filter: { id: 'u3' } },
                  }
                }
              }

              if (args.operation === 'replace') {
                if (typeof args.params.filter !== 'function' && !Array.isArray(args.params.filter) && args.params.filter?.id === 'u1') {
                  return {
                    continue: true,
                    operation: args.operation,
                    params: { ...args.params, replace: { ...args.params.replace, firstName: 'Luigi' } },
                  }
                }
              }
            },
            after: async (args, context) => {
              if (args.operation === 'insert') {
                if (args.params.record?.id === 'u1' && args.record.firstName) {
                  return {
                    continue: true,
                    operation: 'insert',
                    params: args.params,
                    record: { ...args.record, firstName: args.record.firstName + ' OK' },
                  }
                }
              }
              if (args.operation === 'find') {
                if (context.specificOperation === 'exists') {
                  return
                }
                return {
                  continue: true,
                  operation: 'find',
                  params: args.params,
                  records: args.records.map((record) => {
                    if (typeof args.params.filter === 'object' && !Array.isArray(args.params.filter) && args.params.filter?.id === 'u1' && record.firstName) {
                      return { ...record, firstName: record.firstName + ' OK' }
                    }
                    return record
                  }),
                }
              }
              if (args.operation === 'update' || args.operation === 'delete' || args.operation === 'replace') {
                operationCount++
              }
            },
          },
        ],
      },
    },
  })

  try {
    await dao2.user.insertOne({ record: { id: 'u1', firstName: 'Mario', live: true } })
    fail()
  } catch (error) {
    expect((error as Error).message).toBe('is Mario')
  }

  await dao2.user.insertOne({ record: { id: 'u1', firstName: 'Luigi', live: true } })
  const u = await dao2.user.findOne({ filter: { id: 'u1' } })
  expect(u!.firstName).toBe('LUIGI OK')

  await dao2.user.updateOne({ filter: { id: 'u1' }, changes: { firstName: 'Mario' } })
  const lastName = (await dao2.user.findOne({ filter: { id: 'u1' } }))?.lastName
  expect(lastName).toBe('Bros')

  const asd1 = await dao2.user.findAll({})
  await dao2.user.deleteOne({ filter: { id: 'u1' } })
  const asd2 = await dao2.user.findAll({})
  expect(await dao2.user.exists({ filter: { id: 'u1' } })).toBe(true)

  await dao2.user.insertOne({ record: { id: 'u2', firstName: 'Mario', live: true } })
  await dao2.user.deleteOne({ filter: { id: 'u2' } })
  expect(await dao2.user.exists({ filter: { id: 'u2' } })).toBe(false)

  await dao2.user.replaceOne({ filter: { id: 'u1' }, replace: { live: true, id: 'u3' } })
  const luigi = await dao2.user.findOne({ filter: { id: 'u3' }, projection: { firstName: true, live: true } })
  expect(luigi!.firstName).toBe('Luigi')

  expect(operationCount).toBe(4)
})

test('middleware 2', async () => {
  const dao2 = new DAOContext<any>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      user: {
        middlewares: [
          buildMiddleware({
            beforeFind: async (params) => {
              return {
                continue: false,
                params,
                records: [{ id: 'u1', firstName: 'Mario' }],
              }
            },
            afterFind: async (params, records) => {
              return {
                continue: true,
                params,
                records: records.map((u) => ({ ...u, firstName: 'MARIO' })),
              }
            },
          }),
          {
            before: async (args, context) => {
              throw new Error('Should not be called')
            },
            after: async (args, context) => {
              throw new Error('Should not be called')
            },
          },
        ],
      },
    },
  })
  const mario = await dao2.user.findOne({})
  expect(mario?.firstName).toBe('MARIO')
})

test('middleware options', async () => {
  const dao2 = new DAOContext<{ m1?: string; m2?: string }, { m3: string }>({
    metadata: { m1: 'test1', m2: 'no' },
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      user: {
        middlewares: [
          {
            before: async (args, context) => {
              expect(context.metadata?.m1).toBe('test1')
              expect(context.metadata?.m2).toBe('no')
              expect(args.params.metadata?.m3).toBe('yes')
            },
          },
        ],
      },
    },
  })
  await dao2.user.insertOne({ record: { live: true }, metadata: { m3: 'yes' } })
})

// ------------------------------------------------------------------------
// ------------------------- COMPUTED FIELDS ------------------------------
// ------------------------------------------------------------------------
test('computed fields (one dependency - same level - one calculated)', async () => {
  const customDao = new DAOContext<any>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      city: {
        middlewares: [
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (city) => ({ computedName: `Computed: ${city.name}` }),
          }),
        ],
      },
    },
  })

  await customDao.city.insertOne({ record: { id: 'cesena', name: 'Cesena', addressId: 'address1' } })
  await customDao.city.insertOne({ record: { id: 'forlì', name: 'Forlì', addressId: 'address1' } })

  const cesena = await customDao.city.findOne({ filter: { id: 'cesena' }, projection: { id: true, computedName: true } })
  const forli = await customDao.city.findOne({ filter: { id: 'forlì' }, projection: { computedName: true } })

  expect(cesena?.computedName).toBe('Computed: Cesena')
  expect(cesena?.id).toBe('cesena')
  expect(forli?.computedName).toBe('Computed: Forlì')
})

test('computed fields (two dependencies - same level - one calculated)', async () => {
  const customDao = new DAOContext<any>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      city: {
        middlewares: [
          computedField({
            fieldsProjection: { computedAddressName: true } as CityProjection,
            requiredProjection: { name: true, addressId: true },
            compute: async (city) => ({ computedAddressName: `${city.name}_${city.addressId}` }),
          }),
        ],
      },
    },
  })
  await customDao.city.insertOne({ record: { id: 'milano', name: 'Milano', addressId: 'address1' } })
  const milano = await customDao.city.findOne({ filter: { id: 'milano' }, projection: { computedAddressName: true } })
  expect(milano?.computedAddressName).toBe('Milano_address1')
})

test('computed fields (two dependencies - same level - two calculated)', async () => {
  const customDao = new DAOContext<any>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      city: {
        middlewares: [
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (city) => ({ computedName: `Computed: ${city.name}` }),
          }),
          computedField({
            fieldsProjection: { computedAddressName: true },
            requiredProjection: { name: true, addressId: true },
            compute: async (city) => ({ computedAddressName: `${city.name}_${city.addressId}` }),
          }),
        ],
      },
    },
  })
  await customDao.city.insertOne({ record: { id: 'torino', name: 'Torino', addressId: 'address1' } })
  const torino = await customDao.city.findOne({ filter: { id: 'torino' }, projection: { computedName: true, computedAddressName: true } })
  expect(torino?.computedAddressName).toBe('Torino_address1')
  expect(torino?.computedName).toBe('Computed: Torino')
})

test('computed fields (one dependency - same level - one calculated - multiple models)', async () => {
  const dao2 = new DAOContext<any>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      city: {
        middlewares: [
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (city) => ({ computedName: `Computed: ${city.name}` }),
          }),
        ],
      },
    },
  })

  await dao2.city.insertOne({ record: { id: 'c1', name: 'c1', addressId: 'address1' } })
  await dao2.city.insertOne({ record: { id: 'c2', name: 'c1', addressId: 'address1' } })
  await dao2.city.insertOne({ record: { id: 'c3', name: 'c1', addressId: 'address1' } })
  const cities = await dao2.city.findAll({ projection: { id: true, computedName: true } })
  cities.forEach((c) => {
    expect(c?.computedName).toBe('Computed: c1')
  })
})

/*test('computed fields (one dependency - deep level - one calculated)', async () => {
  const dao2 = new DAOContext<any>({
    idGenerators: { ID: () => uuidv4() },
    mongo: {
      default: db,
    },
    overrides: {
      organization: {
        middlewares: [
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (organization) => ({ computedName: `Computed: ${organization.name}` }),
          }),
        ],
      },
    },
  })
  //TODO
})

test('computed fields (two dependency - deep level - two calculated)', async () => {
  const dao2 = new DAOContext<any>({
    idGenerators: { ID: () => uuidv4() },
    mongo: {
      default: db,
    },
    overrides: {
      organization: {
        middlewares: [
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (organization) => ({ computedName: `Computed: ${organization.name}` }),
          }),
          computedField({
            fieldsProjection: { computedName: true },
            requiredProjection: { name: true },
            compute: async (organization) => ({ computedName: `Computed: ${organization.name}` }),
          }),
        ],
      },
    },
  })
  //TODO
})*/

// ------------------------------------------------------------------------
// --------------------------- TRANSACTIONS -------------------------------
// ------------------------------------------------------------------------

test('Simple transaction', async () => {
  const session = connection.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  })
  const options = { session }
  const user1 = await dao.user.insertOne({ record: { id: '123', live: true }, options })
  const user2 = await dao.user.findOne({ filter: { id: '123' } })
  const user3 = await dao.user.findOne({ filter: { id: '123' }, options })
  const res = await session.commitTransaction()
  const user4 = await dao.user.findOne({ filter: { id: '123' } })
  expect(res.ok).toBe(1)
  expect(user1.live).toBe(true)
  expect(user2).toBe(null)
  expect(user3?.live).toBe(true)
  expect(user4?.live).toBe(true)
})

test('Simple transaction 2', async () => {
  await dao.user.insertOne({ record: { id: '123', live: true } })
  const session = connection.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  })
  const options = { session }
  await dao.user.updateOne({ filter: { id: '123' }, changes: { live: false }, options })
  await dao.user.deleteOne({ filter: { id: '123' } })
  try {
    await session.commitTransaction()
    fail()
  } catch (error: any) {
    expect(error.ok).toBe(0)
  }
})

test('Aggregate test', async () => {
  for (let i = 0; i < 100; i++) {
    await dao.post.insertOne({
      record: {
        authorId: `user_${Math.floor(i / 10)}`,
        title: 'Title ' + i,
        views: i,
        metadata: {
          region: i % 2 === 0 ? 'it' : 'en',
          visible: i % 2 === 0 || i === 99,
        },
      },
    })
  }

  const aggregation1 = await dao.post.aggregate(
    {
      by: {
        authorId: true,
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
      filter: { 'metadata.visible': true, views: { $gt: 0 } },
      skip: 1,
      limit: 2,
    },
    { sorts: [{ authorId: 'desc' }, { totalAuthorViews: 'desc' }], having: { totalAuthorViews: { $lt: 150 } } },
  )
  expect(aggregation1.length).toBe(2)
  // expect(aggregation1[0]).toEqual({ count: 1, totalAuthorViews: 99, authorId: 'user_9', 'metadata.region': 'en' })
  expect(aggregation1[0]).toEqual({ count: 5, totalAuthorViews: 120, authorId: 'user_2', 'metadata.region': 'it' })
  expect(aggregation1[1]).toEqual({ count: 5, totalAuthorViews: 70, authorId: 'user_1', 'metadata.region': 'it' })
  // expect(aggregation1[3]).toEqual({ count: 4, totalAuthorViews: 20, authorId: 'user_0', 'metadata.region': 'it' })

  const aggregation2 = await dao.post.aggregate({
    aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' }, avgAuthorViews: { field: 'views', operation: 'avg' } },
  })
  expect(aggregation2.avgAuthorViews!).toBe(49.5)
  expect(aggregation2.avgAuthorViews!).toBe(aggregation2.totalAuthorViews! / aggregation2.count!)

  const aggregation3 = await dao.post.aggregate({
    aggregations: { max: { field: 'views', operation: 'max' }, min: { field: 'views', operation: 'min' } },
  })
  expect(aggregation3.max).toBe(99)
  expect(aggregation3.min).toBe(0)

  const aggregation4 = await dao.user.aggregate({ aggregations: { max: { operation: 'max', field: 'amount' }, count: { operation: 'count' } } })
  expect(aggregation4.max).toBe(null)
  expect(aggregation4.count).toBe(0)

  const aggregation5 = await dao.post.aggregate({
    by: { authorId: true },
    aggregations: {
      max: { operation: 'max', field: 'clicks' },
      avg: { operation: 'avg', field: 'clicks' },
      sum: { operation: 'sum', field: 'clicks' },
      count: { operation: 'count' },
    },
  })
  expect(aggregation5[0].max).toBe(null)
  expect(aggregation5[0].avg).toBe(null)
  expect(aggregation5[0].sum).toBe(0)
  expect(aggregation5[0].count).toBe(10)

  const aggregation6 = await dao.post.aggregate({
    by: {
      id: true,
    },
    aggregations: { count: { operation: 'count' } },
  })
  for (const a of aggregation6) {
    expect(a.count).toBe(1)
  }
})

test('Text filter test', async () => {
  await dao.organization.insertOne({ record: { name: 'Microsoft' } })
  await dao.organization.insertOne({ record: { name: 'Macrosoft' } })
  await dao.organization.insertOne({ record: { name: 'Macdonalds' } })
  await dao.organization.insertOne({ record: { name: 'Micdonalds' } })
  await dao.organization.insertOne({ record: { name: 'Lolft' } })

  const found1 = (await dao.organization.findAll({ filter: { name: { $contains: 'soft' } } })).map((o) => o.name)
  const found2 = (await dao.organization.findAll({ filter: { name: { $contains: 'Soft' } } })).map((o) => o.name)
  const found3 = (await dao.organization.findAll({ filter: { name: { $startsWith: 'Mic' } } })).map((o) => o.name)
  const found4 = (await dao.organization.findAll({ filter: { name: { $startsWith: 'mic' } } })).map((o) => o.name)
  const found5 = (await dao.organization.findAll({ filter: { name: { $endsWith: 'ft' } } })).map((o) => o.name)
  const found6 = (await dao.organization.findAll({ filter: { name: { $endsWith: 'Ft' } } })).map((o) => o.name)

  await dao.execQuery(async (dbs, entities) => {
    await entities.organization.createIndex({ name: 'text' }, { name: 'nameIndex' })
  })
  const found10 = (await dao.organization.findAll({ filter: () => ({ $text: { $search: 'Microsoft' } }), sorts: () => [['score', { $meta: 'textScore' }]] })).map((o) => o.name)

  expect(found1.length).toBe(2)
  expect(found1.includes('Microsoft')).toBe(true)
  expect(found1.includes('Macrosoft')).toBe(true)
  expect(found2.length).toBe(0)
  expect(found3.length).toBe(2)
  expect(found3.includes('Microsoft')).toBe(true)
  expect(found3.includes('Micdonalds')).toBe(true)
  expect(found4.length).toBe(0)
  expect(found5.length).toBe(3)
  expect(found5.includes('Microsoft')).toBe(true)
  expect(found5.includes('Macrosoft')).toBe(true)
  expect(found5.includes('Lolft')).toBe(true)
  expect(found6.length).toBe(0)
  expect(found10.length).toBe(1)
})

test('Raw update', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true, amounts: [new BigNumber(1)] } })
  await dao.user.updateOne({ filter: { id: user.id }, changes: () => ({ $push: { amounts: dao.adapters.mongo.Decimal.modelToDB(new BigNumber(2)) } as any }) })
  const user2 = await dao.user.findOne()
  expect(user2?.amounts?.length).toBe(2)
})

test('Raw find', async () => {
  await dao.user.insertOne({ record: { firstName: '1', lastName: '1', live: true } })
  await dao.user.insertOne({ record: { firstName: '1', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '2', live: true } })
  const users = await dao.user.findAll({
    filter: { $or: [{ $and: [() => ({ name: '1' }), () => ({ lastName: '1' })] }, { $and: [() => ({ name: '2' }), () => ({ lastName: '2' })] }] },
    sorts: [{ firstName: 'asc' }],
  })
  expect(users.length).toBe(2)
  expect(users[0].firstName).toBe('1')
  expect(users[1].firstName).toBe('2')
  const users1 = await dao.user.findAll({
    filter: { $or: [() => ({ name: '1', lastName: '1' }), { $and: [() => ({ name: '2' }), () => ({ lastName: '2' })] }] },
    sorts: [{ firstName: 'asc' }],
  })
  expect(users1.length).toBe(2)
  expect(users1[0].firstName).toBe('1')
  expect(users1[1].firstName).toBe('2')
})

test('Inner ref required', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true, amounts: [new BigNumber(1)] } })
  const post0 = await dao.post.insertOne({ record: { authorId: 'random', title: 'title', views: 1 } })
  const post1 = await dao.post.insertOne({ record: { authorId: user.id, title: 'title', views: 1 } })
  const post2 = (await dao.post.findOne({ filter: { id: post1.id } }))!
  const post3 = (await dao.post.findOne({ filter: { id: post1.id }, projection: { author: true } }))!
  const post4 = (await dao.post.findOne({ filter: { id: post1.id }, projection: { title: true } }))!

  typeAssert<Test<'author' extends keyof typeof post1 ? true : false, false>>()
  typeAssert<Test<'author' extends keyof typeof post2 ? true : false, false>>()
  typeAssert<Test<'author' extends keyof typeof post3 ? true : false, true>>()
  typeAssert<Test<'author' extends keyof typeof post4 ? true : false, false>>()
  expect('author' in post1).toBe(false)
  expect('author' in post2).toBe(false)
  expect('author' in post3).toBe(true)
  expect('author' in post4).toBe(false)
  try {
    await dao.post.findOne({ filter: { id: post0.id }, projection: { author: true } })
    fail()
  } catch (error: any) {
    expect((error.message as string).startsWith('dao: post'))
  }
})

test('Mock entity', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.mockedEntity.insertOne({ record: { name: 'name', userId: user.id } })
  const mocked = await dao.mockedEntity.findAll({ projection: { user: true } })
  expect(mocked[0].user.firstName).toBe('FirstName')
})

test('Soft delete middleware', async () => {
  const dao2 = new DAOContext({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      user: {
        middlewares: [softDelete(() => ({ changes: { live: false }, filter: { live: true } }))],
      },
    },
  })

  await dao2.user.insertOne({ record: { live: true, firstName: 'Mario' } })
  await dao2.user.insertOne({ record: { live: true, firstName: 'Luigi' } })

  const users = await dao2.user.findAll()
  expect(users.length).toBe(2)

  await dao2.user.deleteOne({ filter: { firstName: 'Mario' } })

  const deletedUser = await dao.user.findAll({ filter: { live: false } })
  expect(deletedUser.length).toBe(1)
  expect(deletedUser[0].firstName).toBe('Mario')

  const liveUsers = await dao2.user.findAll({ filter: { firstName: { $in: ['Mario', 'Luigi'] } } })
  expect(liveUsers.length).toBe(1)
  expect(liveUsers[0].firstName).toBe('Luigi')
})

test('Audit middlewares', async () => {
  const dao2 = new DAOContext({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      hotel: {
        middlewares: [
          softDelete(() => ({ changes: { 'audit.deletedOn': 3, 'audit.state': State.DELETED, 'audit.modifiedBy': 'userId3' }, filter: { 'audit.state': { $ne: State.DELETED } } })),
          audit(() => ({
            changes: { 'audit.modifiedOn': 2, 'audit.modifiedBy': 'userId2' },
            insert: { audit: { createdBy: 'userId1', createdOn: 1, modifiedBy: 'userId1', modifiedOn: 1, state: State.ACTIVE } },
          })),
        ],
      },
    },
  })

  await dao2.hotel.insertOne({ record: { name: 'h1' } })
  await dao2.hotel.insertOne({ record: { name: 'H2' } })

  const hotels = await dao2.hotel.findAll()
  expect(hotels.length).toBe(2)
  expect(hotels[0].audit.createdBy).toBe('userId1')
  expect(hotels[0].audit.createdOn).toBe(1)
  expect(hotels[0].audit.modifiedOn).toBe(1)

  await dao2.hotel.updateOne({ filter: { name: 'h1' }, changes: { name: 'H1' } })
  const h1 = await dao2.hotel.findOne({ filter: { name: 'H1' } })
  expect(h1?.audit.modifiedOn).toBe(2)
  expect(h1?.audit.modifiedBy).toBe('userId2')

  await dao2.hotel.deleteAll({ filter: { name: { $in: ['H1', 'H2'] } } })
  const hotels2 = await dao2.hotel.findAll()
  expect(hotels2.length).toBe(0)

  const hotels3 = await dao.hotel.findAll()
  expect(hotels3.length).toBe(2)
  expect(hotels3[0].audit.deletedOn).toBe(3)
  expect(hotels3[0].audit.modifiedBy).toBe('userId3')

  await dao2.hotel.insertOne({ record: { name: 'H3' } })
  await dao2.hotel.replaceOne({ replace: { name: 'H4' }, filter: { name: 'H3' } })
  const h4 = await dao2.hotel.aggregate({ by: { 'audit.modifiedBy': true }, aggregations: { c: { operation: 'count' } } })
  expect(h4[0]['audit.modifiedBy']).toBe('userId1')
})

test('Audit middlewares', async () => {
  const dao2 = new DAOContext<never, { opts: 1 | 2 }>({
    mongodb: {
      default: db,
      __mock: db,
    },
    scalars,
    overrides: {
      city: {
        middlewares: [
          selectMiddleware((args) => {
            if (args.params.metadata?.opts === 1) {
              return computedField({
                fieldsProjection: { computedName: true },
                requiredProjection: { name: true },
                compute: async (city) => ({ computedName: `Computed: ${city.name}` }),
              })
            }
          }),
        ],
      },
    },
  })

  await dao2.city.insertOne({ record: { id: 'cesena', name: 'Cesena', addressId: 'address1' } })

  const cesena1 = await dao2.city.findOne({ filter: { id: 'cesena' }, projection: { id: true, computedName: true }, metadata: { opts: 1 } })
  const cesena2 = await dao2.city.findOne({ filter: { id: 'cesena' }, projection: { id: true, computedName: true } })

  expect(cesena1?.computedName).toBe('Computed: Cesena')
  expect(cesena2?.computedName).toBe(undefined)
})

// ------------------------------------------------------------------------
// ------------------------- SECURITY POLICIES ----------------------------
// ------------------------------------------------------------------------

afterAll(async () => {
  if (connection) {
    await connection.close()
  }
  if (replSet) {
    await replSet.stop()
  }
})
