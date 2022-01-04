import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { Coordinates, LocalizedString } from '@twinlogix/typetta'
import { knexJsAdapters, identityAdapter, SortDirection } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'
import { v4 as uuidv4 } from 'uuid'

let knexInstance: Knex<any, unknown[]>
let dao: DAOContext<{}>

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

beforeAll(async () => {})

beforeEach(async () => {
  knexInstance = knex(config)
  dao = new DAOContext({
    knex: {
      default: knexInstance,
    },
    adapters: {
      knex: {
        ...knexJsAdapters,
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
        Password: {
          dbToModel: (o: unknown) => o as string,
          modelToDB: (o: string) => sha256(o),
        },
        ID: identityAdapter,
      },
    },
    idGenerators: { ID: () => uuidv4() },
  })
  const specificTypeMap: Map<keyof Scalars, [string, string]> = new Map([
    ['Decimal', ['decimal', 'decimal ARRAY']],
    ['Boolean', ['boolean', 'boolean ARRAY']],
    ['Float', ['decimal', 'decimal ARRAY']],
    ['Int', ['integer', 'integer ARRAY']],
  ])
  const defaultSpecificType: [string, string] = ['string', 'string ARRAY']
  await dao.device.createTable(specificTypeMap, defaultSpecificType)
  await dao.user.createTable(specificTypeMap, defaultSpecificType)
  await dao.friends.createTable(specificTypeMap, defaultSpecificType)
  await dao.dog.createTable(specificTypeMap, defaultSpecificType)
  await dao.city.createTable(specificTypeMap, defaultSpecificType)
  await dao.organization.createTable(specificTypeMap, defaultSpecificType)
})

afterEach(async () => {})

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
    sorts: [{ 'credentials.username': SortDirection.ASC }],
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
  await dao.dog.insertOne({ record: { name: 'Pippo', ownerId: user.id } })

  const foundUser = await dao.user.findOne({ projection: { id: true, dogs: { name: true, ownerId: true } }, relations: { dogs: { filter: { name: 'Charlie' } } } })
  expect(foundUser!.dogs).toBeDefined()
  expect(foundUser!.dogs!.length).toBe(1)
  expect(foundUser!.dogs![0].name).toBe('Charlie')
})

test('findOne self innerRef association', async () => {
  const user1 = await dao.user.insertOne({ record: { id: "u1", firstName: 'FirstName1', lastName: 'LastName1', live: true } })
  const user2 = await dao.user.insertOne({ record: { id: "u2", firstName: 'FirstName2', lastName: 'LastName2', live: true } })
  const user3 = await dao.user.insertOne({ record: { id: "u3", firstName: 'FirstName3', lastName: 'LastName2', live: true } })
  const user4 = await dao.user.insertOne({ record: { id: "u4", firstName: 'FirstName4', lastName: 'LastName2', live: true } })
  const user5 = await dao.user.insertOne({ record: { id: "u5", firstName: 'FirstName5', lastName: 'LastName2', live: true } })

  await dao.friends.insertOne({record: {from: "u1", to: "u2"}})
  await dao.friends.insertOne({record: {from: "u1", to: "u3"}})
  await dao.friends.insertOne({record: {from: "u1", to: "u4"}})

  await dao.friends.insertOne({record: {from: "u2", to: "u1"}})
  await dao.friends.insertOne({record: {from: "u2", to: "u4"}})

  await dao.friends.insertOne({record: {from: "u3", to: "u4"}})

  const asd = await dao.user.findAll({
    projection: {
      firstName: true,
      friends: {
        firstName: true,
        friends: {
          firstName: true
        }
      }
    },
    relations: {
      friends: {
        filter: {
          live: true
        },
        limit: 1
      }
    }
  })
  console.log(asd)
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
