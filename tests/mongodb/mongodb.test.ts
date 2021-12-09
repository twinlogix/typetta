import { Test, typeAssert } from '../utils.test'
import { CityProjection, DAOContext, UserProjection } from './dao.mock'
import { User } from './models.mock'
import { projection, SortDirection, StaticProjection, computedField, mongoDbAdapters, identityAdapter, projectionDependency } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import { MongoClient, Db } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import sha256 from 'sha256'
import { PartialDeep } from 'type-fest'

let con: MongoClient
let mongoServer: MongoMemoryServer
let db: Db
let dao: DAOContext

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  con = await MongoClient.connect(mongoServer.getUri(), {})
  db = con.db('test')
  dao = new DAOContext({
    mongoDB: db,
    adapters: {
      mongoDB: {
        ...mongoDbAdapters,
        Coordinates: identityAdapter,
        LocalizedString: identityAdapter,
        ID: identityAdapter,
        Password: {
          dbToModel: (o: unknown) => o as string,
          modelToDB: (o: string) => sha256(o),
        },
      },
    },
  })
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

// ------------------------------------------------------------------------
// -------------------------- ASSOCIATIONS --------------------------------
// ------------------------------------------------------------------------
test('findOne innerRef association without projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const dog = await dao.dog.findOne({})
  expect(dog!.owner).toBeUndefined()
})

test('findOne foreignRef association without projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const users = await dao.user.findAll({})
  expect(users[0].dogs).toBeUndefined()
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

  const foundUser = await dao.user.findOne({ projection: { id: true, dogs: { name: true, ownerId: true } } })
  expect(foundUser!.dogs).toBeDefined()
  expect(foundUser!.dogs!.length).toBe(1)
  expect(foundUser!.dogs![0].name).toBe('Charlie')
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

  const response = await dao.organization.findAll({ projection: { id: true, address: { id: true, cities: { id: true, addressId: true, name: true } } } })
  expect(response.length).toBe(1)
  expect(response[0].address?.cities?.length).toBe(2)
  expect((response[0].address?.cities)![0].name).toBe('City 1')
  expect((response[0].address?.cities)![1].name).toBe('City 2')
})

// ------------------------------------------------------------------------
// ------------------------ ADVANCED PROJECTIONS --------------------------
// ------------------------------------------------------------------------
test('safe find', async () => {
  await dao.user.insertOne({ record: { id: 'u1', firstName: 'FirstName', lastName: 'LastName', live: true } })

  //Static projection
  const response = await dao.user.findAll({ projection: { firstName: true, live: true } })
  typeAssert<Test<typeof response, { firstName?: string | null; live: boolean; __projection: { firstName: true; live: true } }[]>>()
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('FirstName')
  expect(response[0].live).toBe(true)

  //Static projection
  const response1 = await dao.user.findOne({ filter: { id: 'u2' }, projection: { live: true } })
  typeAssert<Test<typeof response1, { live: boolean; __projection: { live: true } } | null>>()
  expect(response1).toBe(null)

  //Static projection
  const response2 = await dao.user.findOne({ projection: { firstName: true, live: true, c: true } })
  typeAssert<Test<typeof response2, { firstName?: string | null; live: boolean; __projection: { firstName: true; live: true; c: boolean } } | null>>()
  expect(response2).toBeDefined()
  expect(response2!.firstName).toBe('FirstName')
  expect(response2!.live).toBe(true)

  //Dynamic projection
  const proj: UserProjection = { firstName: true, live: true }
  const response3 = await dao.user.findOne({ projection: proj })
  typeAssert<Test<typeof response3, (PartialDeep<User> & { __projection: 'unknown' }) | null>>()
  expect(response3).toBeDefined()
  expect(response3!.firstName).toBe('FirstName')
  expect(response3!.live).toBe(true)

  //Static projection create before
  const proj2 = projection<User>().build({ live: true })
  const response7 = await dao.user.findOne({ projection: proj2 })
  typeAssert<Test<typeof response7, { live: boolean; __projection: { live: true } } | null>>()
  expect(response7).toBeDefined()
  expect(response7!.live).toBe(true)

  //Static projection create before (do not use)
  const proj3: StaticProjection<User> = { live: true }
  const response8 = await dao.user.findOne({ projection: proj3 })
  //typeAssert<Test<typeof response8, {} | null >>()
  expect(response8).toBeDefined()

  //Whole object
  const response4 = await dao.user.findOne({ projection: true })
  typeAssert<Test<typeof response4, (User & { __projection: 'all' }) | null>>()
  expect(response4).toBeDefined()
  expect(response4!.firstName).toBe('FirstName')
  expect(response4!.live).toBe(true)

  //No projection
  const response5 = await dao.user.findOne({})
  typeAssert<Test<typeof response5, (User & { __projection: 'all' }) | null>>()
  expect(response5).toBeDefined()
  expect(response5!.firstName).toBe('FirstName')
  expect(response5!.live).toBe(true)

  //Info to projection
  const response6 = await dao.user.findOne({ projection: true })
  typeAssert<Test<typeof response6, (User & { __projection: 'all' }) | null>>()
  expect(response6).toBeDefined()
  expect(response6!.firstName).toBe('FirstName')
  expect(response6!.live).toBe(true)
})

// ------------------------------------------------------------------------
// ------------------------------ FILTERS ---------------------------------
// ------------------------------------------------------------------------
test('find with no filter', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }

  response = await dao.user.findAll()
  expect(response.length).toBe(10)

  response = await dao.user.findAll({})
  expect(response.length).toBe(10)

  response = await dao.user.findAll({ projection: { id: true } })
  expect(response.length).toBe(10)

  response = await dao.user.findOne()
  expect(response).toBeDefined()

  response = await dao.user.findOne({})
  expect(response).toBeDefined()

  response = await dao.user.findOne({ projection: { id: true } })
  expect(response).toBeDefined()

  response = await dao.user.findPage()
  expect(response.records.length).toBe(10)

  response = await dao.user.findPage({})
  expect(response.records.length).toBe(10)

  response = await dao.user.findPage({ projection: { id: true } })
  expect(response.records.length).toBe(10)
})

test('find with simple filter', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }

  response = await dao.user.findAll({ filter: { firstName: '1' } })
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('1')

  response = await dao.user.findOne({ filter: { firstName: '1' } })
  expect(response).toBeDefined()
  expect(response!.firstName).toBe('1')

  response = await dao.user.findPage({ filter: { firstName: '1' } })
  expect(response.records.length).toBe(1)
  expect(response.records[0].firstName).toBe('1')
})

test('find with $in filter', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }

  response = await dao.user.findAll({ filter: { firstName: { $in: ['1'] } } })
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('1')

  response = await dao.user.findAll({ filter: { firstName: { $in: ['1', '2'] } } })
  expect(response.length).toBe(2)

  response = await dao.user.findAll({ filter: { firstName: { $in: ['1', 'a'] } } })
  expect(response.length).toBe(1)

  response = await dao.user.findAll({ filter: { firstName: { $in: [] } } })
  expect(response.length).toBe(0)

  response = await dao.user.findAll({ filter: { firstName: { $in: ['a'] } } })
  expect(response.length).toBe(0)
})

// ------------------------------------------------------------------------
// -------------------------- PAGINATION ----------------------------------
// ------------------------------------------------------------------------
test('find with start', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }

  response = await dao.user.findAll({ start: 0 })
  expect(response.length).toBe(10)
  expect(response[0].firstName).toBe('0')
  expect(response[1].firstName).toBe('1')

  response = await dao.user.findAll({ start: 5 })
  expect(response.length).toBe(5)
  expect(response[0].firstName).toBe('5')
  expect(response[1].firstName).toBe('6')

  response = await dao.user.findAll({ start: 10 })
  expect(response.length).toBe(0)

  response = await dao.user.findAll({ start: 20 })
  expect(response.length).toBe(0)
})

test('find with limit', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }

  response = await dao.user.findAll({ limit: 0 })
  expect(response.length).toBe(0)

  response = await dao.user.findAll({ limit: 1 })
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('0')

  response = await dao.user.findAll({ limit: 2 })
  expect(response.length).toBe(2)
  expect(response[0].firstName).toBe('0')
  expect(response[1].firstName).toBe('1')

  response = await dao.user.findAll({ limit: 10 })
  expect(response.length).toBe(10)

  response = await dao.user.findAll({ limit: 100 })
  expect(response.length).toBe(10)
})

test('find with simple sorts', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }

  response = await dao.user.findAll({ sorts: [{ firstName: SortDirection.DESC }] })
  expect(response[0].firstName).toBe('9')
  expect(response[1].firstName).toBe('8')

  response = await dao.user.findAll({ sorts: [{ firstName: SortDirection.DESC }] })
  expect(response[0].firstName).toBe('9')

  response = await dao.user.findAll({ sorts: [{ firstName: SortDirection.DESC }] })
  expect(response[0].firstName).toBe('9')

  response = await dao.user.findAll({ sorts: [{ firstName: SortDirection.ASC }] })
  expect(response[0].firstName).toBe('0')
  expect(response[1].firstName).toBe('1')
})

test('find with multiple sorts', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '1', lastName: '' + (9 - i), live: true } })
  }

  response = await dao.user.findAll({ sorts: [{ firstName: SortDirection.DESC }, { lastName: SortDirection.DESC }] })
  expect(response[0].lastName).toBe('9')
  expect(response[1].lastName).toBe('8')
})

test('find with start and limit', async () => {
  let response

  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }

  response = await dao.user.findAll({ start: 0, limit: 0 })
  expect(response.length).toBe(0)

  response = await dao.user.findAll({ start: 1, limit: 1 })
  expect(response.length).toBe(1)
  expect(response[0].firstName).toBe('1')

  response = await dao.user.findAll({ start: 1, limit: 0 })
  expect(response.length).toBe(0)

  response = await dao.user.findAll({ start: 2, limit: 2 })
  expect(response.length).toBe(2)
  expect(response[0].firstName).toBe('2')
  expect(response[1].firstName).toBe('3')

  response = await dao.user.findAll({ start: 8, limit: 10 })
  expect(response.length).toBe(2)
  expect(response[0].firstName).toBe('8')
  expect(response[1].firstName).toBe('9')
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
  let response

  const { id } = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  expect(id).toBeDefined()

  response = await dao.user.findAll({ filter: { id } })
  expect(response.length).toBe(1)
})

test('insert and find embedded entity', async () => {
  let response

  await dao.user.insertOne({ record: { usernamePasswordCredentials: { username: 'username', password: 'password' }, live: true } })

  response = await dao.user.findAll({})
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
})

// ------------------------------------------------------------------------
// ------------------------------ REPLACE ---------------------------------
// ------------------------------------------------------------------------
test('simple replace', async () => {
  let user: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })
  await dao.user.replaceOne({ filter: { id: user.id }, replace: { id: user.id, firstName: 'FirstName 1', live: true } })
  user = await dao.user.findOne({ filter: { id: user!.id } })

  expect(user).toBeDefined()
  expect(user?.firstName).toBe('FirstName 1')
})

// ------------------------------------------------------------------------
// ------------------------------ DELETE ----------------------------------
// ------------------------------------------------------------------------
test('simple delete', async () => {
  let user: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  user = await dao.user.findOne({ filter: { id: user.id } })
  expect(user).toBeDefined()

  await dao.user.deleteOne({ filter: { id: user!.id } })

  user = await dao.user.findOne({ filter: { id: user!.id } })
  expect(user).toBeNull()
})

// ------------------------------------------------------------------------
// --------------------------- GEOJSON FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve geojson field', async () => {
  const iuser: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, localization: { latitude: 1.111, longitude: 2.222 } } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, localization: true } })
  expect(user).toBeDefined()
  expect(user!.localization?.latitude).toBe(1.111)
  expect(user!.localization?.longitude).toBe(2.222)
})

// ------------------------------------------------------------------------
// --------------------------- DECIMAL FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve decimal field', async () => {
  const iuser: User | null = await dao.user.insertOne({ record: { id: 'ID1', firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

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
  const iuser: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amount: true } })
  expect(user).toBeDefined()
  expect(user!.amount!.comparedTo(12.12)).toBe(0)

  await dao.user.updateOne({ filter: { id: user!.id }, changes: { amount: new BigNumber(14.14) } })
  const user1 = await dao.user.findOne({ filter: { id: user!.id }, projection: { id: true, amount: true } })

  expect(user1).toBeDefined()
  expect(user1!.amount!.comparedTo(14.14)).toBe(0)
})

test('insert and retrieve decimal array field', async () => {
  const iuser: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amounts: [new BigNumber(1.02), new BigNumber(2.223)] } })

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
  const iuser: User | null = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, title: { it: 'Ciao', en: 'Hello' } } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, title: true } })
  expect(user).toBeDefined()
  expect(user!.title?.en).toBe('Hello')
  expect(user!.title?.it).toBe('Ciao')
})

// ------------------------------------------------------------------------
// --------------------------- MIDDLEWARE ---------------------------------
// ------------------------------------------------------------------------
test('middleware', async () => {
  let operationCount = 0
  const dao = new DAOContext({
    mongoDB: db,
    overrides: {
      user: {
        middlewares: [
          projectionDependency({ fieldsProjection: { id: true }, requiredProjection: { live: true } }),
          {
            beforeInsert: async (params) => {
              //expect(params.options?.test).toBe('test') //TODO
              if (params.record.id === 'u1' && params.record.firstName === 'Mario') {
                throw new Error('is Mario')
              }
              if (params.record.firstName) {
                return { ...params, record: { ...params.record, firstName: params.record.firstName?.toUpperCase() } }
              }
              return params
            },
            afterInsert: async (params, result) => {
              if (params.record?.id === 'u1' && result.firstName) {
                return { ...result, firstName: result.firstName + ' OK' }
              }
              return result
            },
            beforeFind: async (params) => {
              if (params.projection !== true && params.projection?.id) {
                expect(params.projection.live).toBe(true)
                operationCount++
              }
              return params
            },
            afterFind: async (params, result) => {
              if (params.filter?.id === 'u1' && result.firstName) {
                return { ...result, firstName: result.firstName + ' OK' }
              }
              return result
            },
            beforeUpdate: async (params) => {
              if (params.filter?.id === 'u1') {
                return { ...params, changes: { ...params.changes, lastName: 'Bros' } }
              }
              return params
            },
            afterUpdate: async (params) => {
              operationCount++
            },
            beforeReplace: async (params) => {
              if (params.filter?.id === 'u1') {
                return { ...params, replace: { ...params.replace, firstName: 'Luigi' } }
              }
              return params
            },
            afterReplace: async (params) => {
              operationCount++
            },
            beforeDelete: async (params) => {
              if (params.filter?.id === 'u2') {
                return { ...params, filter: { id: 'u3' } }
              }
              return params
            },
            afterDelete: async (params) => {
              operationCount++
            },
          },
        ],
      },
    },
  })
})

test('middleware options', async () => {

  const dao = new DAOContext<{ testType: string }>({
    options: { testType: "test1" },
    mongoDB: db,
    overrides: {
      user: {
        middlewares: [
          {
            beforeInsert: async (params) => {
              expect(params.options?.testType).toBe("test1");
              expect(params.options?.testType).toBeDefined();
              return params;
            },
          },
        ],
      },
    },
  })
  await dao.user.insertOne({ record: { live: true } });

})

test('middleware options overrides', async () => {

  const dao = new DAOContext({
    options: { testType: "test1" },
    mongoDB: db,
    overrides: {
      user: {
        middlewares: [
          {
            beforeInsert: async (params) => {
              expect(params.options?.testType).toBe("test2");
              expect(params.options?.testType).toBeDefined();
              return params;
            },
          },
        ],
      },
    },
  })
  await dao.user.insertOne({ record: { live: true }, options: { testType: 'test2' } });

})

// ------------------------------------------------------------------------
// ------------------------- COMPUTED FIELDS ------------------------------
// ------------------------------------------------------------------------
test('computed fields (one dependency - same level - one calculated)', async () => {
  const customDao = new DAOContext({
    mongoDB: db,
    adapters: dao.adapters,
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
  const customDao = new DAOContext({
    mongoDB: db,
    adapters: dao.adapters,
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
  const customDao = new DAOContext({
    mongoDB: db,
    adapters: dao.adapters,
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
  const dao = new DAOContext({
    mongoDB: db,
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

  await dao.city.insertOne({ record: { id: 'c1', name: 'c1', addressId: 'address1' } })
  await dao.city.insertOne({ record: { id: 'c2', name: 'c1', addressId: 'address1' } })
  await dao.city.insertOne({ record: { id: 'c3', name: 'c1', addressId: 'address1' } })
  const cities = await dao.city.findAll({ projection: { id: true, computedName: true } })
  cities.forEach((c) => {
    expect(c?.computedName).toBe('Computed: c1')
  })
})

test('computed fields (one dependency - deep level - one calculated)', async () => {
  const dao = new DAOContext({
    mongoDB: db,
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
  const dao = new DAOContext({
    mongoDB: db,
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
})

afterAll(async () => {
  if (con) {
    await con.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
})
