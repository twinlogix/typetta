global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { knexJsAdapters, identityAdapter, mongoDbAdapters, computedField } from '@twinlogix/typetta'
import knex, { Knex } from 'knex'
import { Db, Decimal128, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { v4 as uuidv4 } from 'uuid'
import BigNumber from 'bignumber.js'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

let knexInstance: Knex<any, unknown[]>
let con: MongoClient
let mongoServer: MongoMemoryServer
let db: Db
let dao: DAOContext<{}>

beforeAll(async () => {
  knexInstance = knex(config)
  mongoServer = await MongoMemoryServer.create()
  con = await MongoClient.connect(mongoServer.getUri(), {})
  db = con.db('test')
  dao = new DAOContext({
    mongo: {
      default: db,
      a: db,
    },
    knex: {
      default: knexInstance,
    },
    middlewares: [
      computedField({
        fieldsProjection: { value: true },
        requiredProjection: { value: true },
        compute: async (r) => {
          return { value: r.value * 10 }
        },
      }),
    ],
    adapters: {
      mongo: {
        ...mongoDbAdapters,
        ID: identityAdapter,
        MongoID: identityAdapter,
        IntAutoInc: identityAdapter,
        Decimal: {
          dbToModel: (o: unknown) => new BigNumber((o as Decimal128).toString()),
          modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
        },
        JSON: identityAdapter,
      },
      knex: {
        ...knexJsAdapters,
        IntAutoInc: identityAdapter,
        MongoID: identityAdapter,
        ID: identityAdapter,
        Decimal: {
          dbToModel: (o: any) => (typeof o === 'string' ? (o.split(',').map((v) => new BigNumber(v)) as any) : new BigNumber(o)),
          modelToDB: (o: BigNumber) => o,
        },
        JSON: {
          dbToModel: (o: unknown) => JSON.parse(o as string),
          modelToDB: (o: any) => JSON.stringify(o),
        },
      },
    },
    idGenerators: { ID: () => uuidv4() },
  })
  const specificTypeMap: Map<keyof Scalars, [string, string]> = new Map([
    ['Decimal', ['decimal', 'decimal ARRAY']],
    ['Boolean', ['boolean', 'boolean ARRAY']],
    ['Float', ['decimal', 'decimal ARRAY']],
    ['Int', ['integer', 'integer ARRAY']],
    ['IntAutoInc', ['INTEGER PRIMARY KEY AUTOINCREMENT', 'none']],
  ])
  const defaultSpecificType: [string, string] = ['string', 'string ARRAY']
  await dao.d.createTable(specificTypeMap, defaultSpecificType)
  await dao.e.createTable(specificTypeMap, defaultSpecificType)
  await dao.f.createTable(specificTypeMap, defaultSpecificType)
})

test('Test mongo', async () => {
  const a = await dao.a.insertOne({ record: { value: 1 } }) // id generated from db
  const ar = await dao.a.findOne({ filter: { id: a.id } })

  const b = await dao.b.insertOne({ record: { value: 2 } }) // id generated from user defined generators
  const br = await dao.b.findOne({ filter: { id: b.id } })

  const c = await dao.c.insertOne({ record: { value: 3, id: 'asd' } }) // id required
  const cr = await dao.c.findOne({ filter: { id: c.id } })

  expect(ar!.value).toBe(10)
  expect(br!.value).toBe(20)
  expect(cr!.value).toBe(30)
})

test('Test sql', async () => {
  const d = await dao.d.insertOne({ record: { value: 1 } }) // id generated from db
  const dr = await dao.d.findOne({ filter: { id: d.id } })

  const e = await dao.e.insertOne({ record: { value: 2 } }) // id generated from user defined generators
  const er = await dao.e.findOne({ filter: { id: e.id } })

  const f = await dao.f.insertOne({ record: { value: 3, id: 'asd' } }) // id required
  const fr = await dao.f.findOne({ filter: { id: f.id } })

  const d2 = await dao.d.insertOne({ record: { value: 11 } }) // id generated from db
  const d2r = await dao.d.findOne({ filter: { id: d2.id } })

  expect(dr!.value).toBe(10)
  expect(d2r!.value).toBe(110)
  expect(d2r!.id).toBe(2)
  expect(er!.value).toBe(20)
  expect(fr!.value).toBe(30)
})

afterAll(async () => {
  if (con) {
    await con.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
})
