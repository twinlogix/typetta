/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computedField } from '../../src'
import { DAOContext } from './dao.mock'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import { Db, Decimal128, MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { MongoMemoryServer } from 'mongodb-memory-server'

jest.setTimeout(20000)

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

let knexInstance: Knex<{ [K in string]: unknown }, unknown[]>
let con: MongoClient
let mongoServer: MongoMemoryServer
let db: Db
let dao: DAOContext

beforeEach(async () => {
  knexInstance = knex(config)
  mongoServer = await MongoMemoryServer.create()
  con = await MongoClient.connect(mongoServer.getUri(), {})
  db = con.db('test')

  dao = new DAOContext({
    mongodb: {
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
    scalars: {
      Decimal: {
        mongo: {
          dbToModel: (o: unknown) => new BigNumber((o as Decimal128).toString()),
          modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
        },
        knex: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dbToModel: (o: any) => (typeof o === 'string' ? (o.split(',').map((v) => new BigNumber(v)) as any) : new BigNumber(o)),
          modelToDB: (o: BigNumber) => o,
        },
      },
      ID: {
        generate: () => {
          return uuidv4()
        },
      },
      JSON: {
        knex: {
          dbToModel: (o: unknown) => JSON.parse(o as string),
          modelToDB: (o: unknown) => JSON.stringify(o),
        },
      },
    },
    overrides: {
      b: {
        idGenerator: () => {
          return 'entity_b' + uuidv4()
        },
      },
    },
  })
  const typeMap = {
    Decimal: { singleType: 'decimal', arrayType: 'decimal ARRAY' },
    Boolean: { singleType: 'boolean' },
    Float: { singleType: 'decimal' },
    Int: { singleType: 'integer' },
    IntAutoInc: { singleType: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  }
  const defaultType = { singleType: 'string', arrayType: 'string ARRAY' }
  await dao.d.createTable(typeMap, defaultType)
  await dao.e.createTable(typeMap, defaultType)
  await dao.f.createTable(typeMap, defaultType)
})

test('Test mongo', async () => {
  const a = await dao.a.insertOne({ record: { value: 1 } }) // id generated from db
  const ar = await dao.a.findOne({ filter: { id: a.id } })

  const b = await dao.b.insertOne({ record: { value: 2 } }) // id generated from user defined generators
  const br = await dao.b.findOne({ filter: { id: b.id } })

  const c = await dao.c.insertOne({ record: { value: 3, id: 'asd' } }) // id required
  const cr = await dao.c.findOne({ filter: { id: c.id } })

  expect(b.id.startsWith('entity_b')).toBe(true)
  expect(ar?.value).toBe(10)
  expect(br?.value).toBe(20)
  expect(cr?.value).toBe(30)
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

  expect(dr?.value).toBe(10)
  expect(d2r?.value).toBe(110)
  expect(d2r?.id).toBe(2)
  expect(er?.value).toBe(20)
  expect(fr?.value).toBe(30)
})

afterAll(async () => {
  if (con) {
    await con.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
})
