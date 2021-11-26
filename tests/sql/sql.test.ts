import { DAOContext } from './dao.mock'
import { Coordinates } from '@twinlogix/tl-commons'
import { LocalizedString } from '@twinlogix/tl-commons'
import { mongoDbAdapters, knexJsAdapters, identityAdapter } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import sha256 from 'sha256'

let knexInstance: Knex<any, unknown[]>
let dao: DAOContext

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

beforeAll(async () => {})

beforeEach(async () => {
  knexInstance = knex(config)
  await knexInstance.schema.createTable('users', (table) => {
    table.string('id').primary()
    table.string('usernamePasswordCredentials').nullable()
    table.string('firstName').nullable()
    table.string('lastName').nullable()
    table.boolean('live')
    table.string('localization').nullable()
    table.string('title').nullable()
    table.decimal('amount').nullable()
    table.specificType('amounts', 'decimal ARRAY')
  })

  await knexInstance.schema.createTable('devices', (table) => {
    table.string('id').primary()
    table.string('name')
    table.string('userId').nullable()
  })
  dao = new DAOContext({ 
    knex: knexInstance,
    adapters: {
      knexjs: {
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
  })
})

afterEach(async () => {})

test('Insert and retrieve', async () => {
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

test('Inner ref', async () => {
  const useri = await dao.user.insertOne({
    record: {
      live: true,
      amount: new BigNumber(11.11),
      usernamePasswordCredentials: {
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
  const device = await dao.device.findOne({ filter: { id: devicei.id }, projection: { name: true, userId: true, user: { live: true, amount: true, usernamePasswordCredentials: { username: true } } } })
  expect(device?.name).toBe('Device 1')
  expect(device?.user?.amount?.toNumber()).toBe(11.11)
  expect(device?.user?.live).toBe(true)
  expect(device?.user?.usernamePasswordCredentials?.username).toBe('user')
})
