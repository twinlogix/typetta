import { Coordinates, LocalizedString } from '../../src'
import { DAOContext } from './dao.mock'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

let knexInstance: Knex<any, unknown[]>
let dao: DAOContext<unknown>

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  log: {
    warn: () => {
      return
    },
    debug: () => {
      return
    },
    error: () => {
      return
    },
    deprecate: () => {
      return
    },
  },
}

beforeAll(async () => {
  return
})

beforeEach(async () => {
  knexInstance = knex(config)
  dao = new DAOContext({
    log: { maxQueryExecutionTime: 100000 },
    knex: {
      default: knexInstance,
    },
    scalars: {
      LocalizedString: {
        dbToModel: (o: unknown) => JSON.parse(o as string),
        modelToDB: (o: LocalizedString) => JSON.stringify(o),
      },
      Coordinates: {
        dbToModel: (o: unknown) => JSON.parse(o as string),
        modelToDB: (o: Coordinates) => JSON.stringify(o),
      },
      Decimal: {
        dbToModel: (o: any) => (typeof o === 'string' ? (o.split(',').map((v) => new BigNumber(v)) as any) : new BigNumber(o)),
        modelToDB: (o: BigNumber) => o,
      },
      JSON: {
        dbToModel: (o: unknown) => JSON.parse(o as string),
        modelToDB: (o: any) => JSON.stringify(o),
      },
      Password: {
        dbToModel: (o: unknown) => o as string,
        modelToDB: (o: string) => sha256(o),
      },
      ID: {
        generate: () => uuidv4(),
      },
      String: {
        dbToModel: (o: any) => (typeof o === 'string' ? o : o.toString()),
        modelToDB: (o: string) => o,
      },
    },
  })
  const typeMap = {
    Decimal: { singleType: 'decimal' },
    Boolean: { singleType: 'boolean' },
    Float: { singleType: 'decimal' },
    Int: { singleType: 'integer' },
  }
  const defaultType = { singleType: 'string' }
  await dao.device.createTable(typeMap, defaultType)
  await dao.user.createTable(typeMap, defaultType)
  await dao.friends.createTable(typeMap, defaultType)
  await dao.dog.createTable(typeMap, defaultType)
  await dao.city.createTable(typeMap, defaultType)
  await dao.organization.createTable(typeMap, defaultType)
  await dao.address.createTable(typeMap, defaultType)
})

afterEach(async () => {
  return
})

test('Insert and retrieve', async () => {
  await dao.user.insertOne({
    record: {
      live: false,
      credentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  const ins = await dao.user.insertOne({
    record: {
      live: true,
      localization: { latitude: 1.1, longitude: 2.2 },
      amount: new BigNumber(11.11),
      amounts: [new BigNumber(11.11), new BigNumber(12.11)],
      credentials: {
        username: 'aser',
        password: 'password',
        another: {
          test: 'asd',
        },
      },
    },
  })
  expect(ins.credentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
  const all = await dao.user.findAll({
    filter: { 'credentials.password': 'password' },
    projection: true,
    sorts: [{ 'credentials.username': 'asc' }],
  })
  expect(all.length).toBe(2)
  expect(all[0].live).toBe(true)
  expect(all[0].localization?.latitude).toBe(1.1)
  expect(all[0].localization?.longitude).toBe(2.2)
  expect(all[0].amount?.toNumber()).toBe(11.11)
  expect(all[0].amounts![0].toNumber()).toBe(11.11)
  expect(all[0].amounts![1].toNumber()).toBe(12.11)
  expect(all[0].credentials?.username).toBe('aser')
  expect(all[0].credentials?.another?.test).toBe('asd')
  expect(all[0].credentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')

  await dao.user.updateAll({ filter: { id: ins.id }, changes: { 'credentials.password': 'lol' } })
  const u1 = await dao.user.findOne({ filter: { id: ins.id } })
  expect(u1?.credentials?.password).toBe('07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc')

  await dao.user.updateAll({ filter: { id: ins.id }, changes: { credentials: { password: 'asd', username: 'u' } } })
  const u2 = await dao.user.findOne({ filter: { id: ins.id } })
  expect(u2?.credentials?.password).toBe('688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6')
})

test('Inner ref', async () => {
  const useri = await dao.user.insertOne({
    record: {
      live: true,
      amount: new BigNumber(11.11),
      credentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  const devicei = await dao.device.insertOne({
    record: {
      name: 'Device 1',
      userId: useri.id,
    },
  })
  const device = await dao.device.findOne({
    filter: { id: devicei.id },
    projection: { name: true, userId: true, user: { live: true, amount: true, credentials: { username: true, another: { test: true } } } },
  })
  expect(device?.name).toBe('Device 1')
  expect(device?.user?.amount?.toNumber()).toBe(11.11)
  expect(device?.user?.live).toBe(true)
  expect(device?.user?.credentials?.username).toBe('user')
  expect(device?.user?.credentials?.another?.test).toBe(null)
})

test('Simple transaction', async () => {
  const trx = await knexInstance.transaction({ isolationLevel: 'snapshot' })
  await dao.device.insertOne({ record: { name: 'dev' }, options: { trx } })
  const dev1 = await dao.device.findOne({ filter: { name: 'dev' }, options: { trx } })
  expect(dev1!.name).toBe('dev')
  await trx.rollback()
  const dev2 = await dao.device.findOne({ filter: { name: 'dev' } })
  expect(dev2).toBe(null)
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

test('simple findOne multiple filter', async () => {
  await dao.user.insertOne({ record: { firstName: '1', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '1', live: true } })

  const users = await dao.user.findAll({ filter: { $and: [{ lastName: '2' }, (qb) => qb.where('name', '=', '2')] } })
  expect(users.length).toBe(1)
  expect(users[0].lastName).toBe('2')
})

test('simple findAll with custom where', async () => {
  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.user.insertOne({ record: { firstName: 'asd', lastName: 'asd', live: true } })
  const users = await dao.user.findAll({ filter: (qb) => qb.where('name', 'like', '%st%') })
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
  await dao.user.insertOne({ record: { id: 'u1', firstName: 'FirstName1', lastName: 'LastName1', live: true } })
  await dao.user.insertOne({ record: { id: 'u2', firstName: 'FirstName2', lastName: 'LastName2', live: true } })
  await dao.user.insertOne({ record: { id: 'u3', firstName: 'FirstName3', lastName: 'LastName2', live: true } })
  await dao.user.insertOne({ record: { id: 'u4', firstName: 'FirstName4', lastName: 'LastName2', live: true } })
  await dao.user.insertOne({ record: { id: 'u5', firstName: 'FirstName5', lastName: 'LastName2', live: true } })

  await dao.friends.insertOne({ record: { from: 'u1', to: 'u2' } })
  await dao.friends.insertOne({ record: { from: 'u1', to: 'u3' } })
  await dao.friends.insertOne({ record: { from: 'u1', to: 'u4' } })

  await dao.friends.insertOne({ record: { from: 'u2', to: 'u1' } })
  await dao.friends.insertOne({ record: { from: 'u2', to: 'u4' } })

  await dao.friends.insertOne({ record: { from: 'u3', to: 'u4' } })

  const users = await dao.user.findAll({
    projection: {
      firstName: true,
      friends: {
        firstName: true,
        friends: {
          firstName: true,
        },
      },
    },
    relations: {
      friends: {
        filter: {
          live: true,
        },
        limit: 1,
      },
    },
  })
  const friend = (users[1].friends || [])[0]
  expect(friend!.friends!.length).toBe(3)
})

// TODO: ask @minox86 if this behaviuor is desired
test('Foreign ref in embedded entity', async () => {
  await dao.city.insertOne({ record: { addressId: 'a1', name: 'C1', id: 'c1' } })
  await dao.organization.insertOne({ record: { id: 'o1', name: 'O1', address: { id: 'a1' } } })

  const o1 = await dao.organization.findOne({
    projection: {
      name: true,
      address: {
        cities: true,
      },
    },
  })
  expect(o1!.address!.cities!.length).toBe(1)
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
    expect(response[0].address?.cities[0].name).toBe('City 1')
    expect(response[0].address?.cities[1].name).toBe('City 2')
  }
})

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

test('simple insert', async () => {
  const response1 = await dao.user.findAll({})
  expect(response1.length).toBe(0)
  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  const response2 = await dao.user.findAll({})
  expect(response2.length).toBe(1)
})

test('ID auto-generation and find by id', async () => {
  const { id } = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  expect(id).toBeDefined()
  const response1 = await dao.user.findAll({ filter: { id } })
  expect(response1.length).toBe(1)
})

test('insert and find embedded entity', async () => {
  await dao.user.insertOne({ record: { credentials: { username: 'username', password: 'password' }, live: true } })
  const response = await dao.user.findAll({})
  expect(response.length).toBe(1)
  expect(response[0].credentials).toBeDefined()
  expect(response[0].credentials!.username).toBe('username')
  expect(response[0].credentials!.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('insert generic test 1', async () => {
  const ins = await dao.user.insertOne({
    record: {
      live: true,
      localization: { latitude: 1.1, longitude: 2.2 },
      amount: new BigNumber(11.11),
      amounts: [new BigNumber(11.11), new BigNumber(12.11)],
      credentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  expect(ins.credentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
  const all = await dao.user.findAll({ filter: { id: ins.id }, projection: true })
  expect(all.length).toBe(1)
  expect(all[0].live).toBe(true)
  expect(all[0].localization?.latitude).toBe(1.1)
  expect(all[0].localization?.longitude).toBe(2.2)
  expect(all[0].amount?.toNumber()).toBe(11.11)
  expect(all[0].amounts![0].toNumber()).toBe(11.11)
  expect(all[0].amounts![1].toNumber()).toBe(12.11)
  expect(all[0].credentials?.username).toBe('user')
  expect(all[0].credentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('simple update', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateAll({ filter: { id: user.id }, changes: { lastName: 'LastName' } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2!.firstName).toBe(user.firstName)
  expect(user2!.lastName).toBe('LastName')

  await dao.user.updateAll({ filter: { id: user.id }, changes: { firstName: 'NewFirstName' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3!.firstName).toBe('NewFirstName')
  expect(user3!.lastName).toBe(user3!.lastName)
})

test('update embedded entity', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateAll({ filter: { id: user.id }, changes: { credentials: { username: 'username', password: 'password' } } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2!.credentials).toBeDefined()
  expect(user2!.credentials!.username).toBe('username')
  expect(user2!.credentials!.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')

  await dao.user.updateAll({ filter: { id: user.id }, changes: { credentials: { username: 'newUsername', password: 'newPassword' } } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3!.credentials).toBeDefined()
  expect(user3!.credentials!.username).toBe('newUsername')
  expect(user3!.credentials!.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')

  await dao.user.updateAll({ filter: { id: user.id }, changes: { 'credentials.username': 'newUsername_2' } })
  const user4 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user4!.credentials).toBeDefined()
  expect(user4!.credentials!.username).toBe('newUsername_2')
  expect(user4!.credentials!.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')
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
  await dao.user.updateAll({ filter: { id: user.id }, changes: { live: undefined } })
  const user2 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user2?.live).toBe(true)
  await dao.user.updateAll({ filter: { id: user.id }, changes: { live: undefined, firstName: 'Mario' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user3?.live).toBe(true)
})

test('simple delete', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })
  const user1 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user1).toBeDefined()
  await dao.user.deleteAll({ filter: { id: user.id } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user2).toBeNull()
})

test('not supported operation', async () => {
  try {
    await dao.user.deleteOne({ filter: { id: '' } })
    fail()
  } catch {
    try {
      await dao.user.replaceOne({ replace: { live: true }, filter: {} })
      fail()
    } catch {
      try {
        await dao.user.updateOne({ changes: { live: false }, filter: {} })
        fail()
      } catch {
        return
      }
    }
  }
})

test('Text filter test', async () => {
  await dao.organization.insertOne({ record: { name: 'Microsoft' } })
  await dao.organization.insertOne({ record: { name: 'Macrosoft' } })
  await dao.organization.insertOne({ record: { name: 'Macdonalds' } })
  await dao.organization.insertOne({ record: { name: 'Micdonalds' } })
  await dao.organization.insertOne({ record: { name: 'Lolft' } })

  const found1 = (await dao.organization.findAll({ filter: { name: { $contains: 'soft' } } })).map((o) => o.name)
  const found3 = (await dao.organization.findAll({ filter: { name: { $startsWith: 'Mic' } } })).map((o) => o.name)
  const found5 = (await dao.organization.findAll({ filter: { name: { $endsWith: 'ft' } } })).map((o) => o.name)

  expect(found1.length).toBe(2)
  expect(found1.includes('Microsoft')).toBe(true)
  expect(found1.includes('Macrosoft')).toBe(true)
  expect(found3.length).toBe(2)
  expect(found3.includes('Microsoft')).toBe(true)
  expect(found3.includes('Micdonalds')).toBe(true)
  expect(found5.length).toBe(3)
  expect(found5.includes('Microsoft')).toBe(true)
  expect(found5.includes('Macrosoft')).toBe(true)
  expect(found5.includes('Lolft')).toBe(true)
})

test('Raw update', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.user.updateAll({ filter: { id: user.id }, changes: (qb) => qb.update({ name: 'FirstName2' }) })
  const user2 = await dao.user.findOne()
  expect(user2?.firstName).toBe('FirstName2')
})

test('Raw find', async () => {
  await dao.user.insertOne({ record: { firstName: '1', lastName: '1', live: true } })
  await dao.user.insertOne({ record: { firstName: '1', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '2', live: true } })
  const users = await dao.user.findAll({
    filter: { $or: [{ $and: [(qb) => qb.where('name', '=', '1'), (qb) => qb.where('surname', '=', '1')] }, { $and: [(qb) => qb.where('name', '=', '2'), (qb) => qb.where('surname', '=', '2')] }] },
    sorts: [{ firstName: 'asc' }],
  })
  expect(users.length).toBe(2)
  expect(users[0].firstName).toBe('1')
  expect(users[1].firstName).toBe('2')
  const users1 = await dao.user.findAll({
    filter: { $or: [(qb) => qb.where('name', '=', '1').and.where('surname', '=', '1'), { $and: [(qb) => qb.where('name', '=', '2'), (qb) => qb.where('surname', '=', '2')] }] },
    sorts: [{ firstName: 'asc' }],
  })
  expect(users1.length).toBe(2)
  expect(users1[0].firstName).toBe('1')
  expect(users1[1].firstName).toBe('2')
})
