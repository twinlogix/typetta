import { DAOContext } from './dao.mock'
import { Scalars } from './models.mock'
import { knexJsAdapters, identityAdapter, computedField, mongoDbAdapters } from '@twinlogix/typetta'
import BigNumber from 'bignumber.js'
import knex, { Knex } from 'knex'
import { Db, MongoClient, ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import sha256 from 'sha256'
import { v4 as uuidv4 } from 'uuid'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
}

let knexInstance: Knex<any, unknown[]>
let con: MongoClient
let mongoServer: MongoMemoryServer
let db: Db
let dao: DAOContext

beforeAll(async () => {
  knexInstance = knex(config)
  mongoServer = await MongoMemoryServer.create()
  con = await MongoClient.connect(mongoServer.getUri(), {})
  db = con.db('test')
  dao = new DAOContext({
    mongoDB: db,
    knex: knexInstance,
    adapters: {
      mongoDB: {
        ...mongoDbAdapters,
        ID: identityAdapter,
        MongoID: identityAdapter,
        IntAutoInc: identityAdapter,
      },
      knexjs: {
        ...knexJsAdapters,
        IntAutoInc: identityAdapter,
        MongoID: identityAdapter,
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

  expect(ar!.value).toBe(1)
  expect(br!.value).toBe(2)
  expect(cr!.value).toBe(3)
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

  expect(dr!.value).toBe(1)
  expect(d2r!.value).toBe(11)
  expect(d2r!.id).toBe(2)
  expect(er!.value).toBe(2)
  expect(fr!.value).toBe(3)
})
