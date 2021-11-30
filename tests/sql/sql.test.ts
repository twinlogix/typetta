import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { Coordinates } from '@twinlogix/tl-commons'
import { LocalizedString } from '@twinlogix/tl-commons'
import { mongoDbAdapters, knexJsAdapters, identityAdapter, SortDirection } from '@twinlogix/typetta'
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
  const specificTypeMap: Map<keyof Scalars, [string, string]> = new Map([
    ['Decimal', ['decimal', 'decimal ARRAY']],
    ['Boolean', ['boolean', 'boolean ARRAY']],
    ['Float', ['decimal', 'decimal ARRAY']],
    ['Int', ['integer', 'integer ARRAY']],
  ])
  const defaultSpecificType: [string, string] = ['string', 'string ARRAY']
  await dao.device.createTable(specificTypeMap, defaultSpecificType)
  await dao.user.createTable(specificTypeMap, defaultSpecificType)
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
