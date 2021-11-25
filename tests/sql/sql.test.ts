import { DAOContext } from './dao.mock'
import { Coordinates } from '@twinlogix/tl-commons'
import { LocalizedString } from '@twinlogix/tl-commons'
import { mongoDbAdapters, knexJsAdapters, identityAdapter } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'

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
  dao = new DAOContext({
    knex: knexInstance,
    adapters: {
      mongodb: {
        ...mongoDbAdapters,
        Coordinates: identityAdapter,
        LocalizedString: identityAdapter,
        ID: identityAdapter,
      },
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
        ID: identityAdapter,
      },
    },
  })
})

afterEach(async () => {})

test('asd', async () => {
  const ins = await dao.user.insertOne({
    record: {
      id: '1',
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
  console.log(ins)

  const all = await dao.user.findAll({ filter: { id: '1' }, projection: true })
  console.log(all)
  expect(all[0].amount?.toNumber()).toBe(11.11)
  expect(all[0].amounts![0].toNumber()).toBe(11.11)
  expect(all[0].amounts![1].toNumber()).toBe(12.11)
})
