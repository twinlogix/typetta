import { MockDAOContextParams } from '..'
import { QuantityOperators, EqualityOperators, ElementOperators } from '../dal/dao/filters/filters.types'
import { Schema, SchemaField } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'
import { isPlainObject } from 'is-plain-object'
import knex, { Knex } from 'knex'
import { Db, MongoClient } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

export type OneKey<K extends string | number | symbol, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O ? { [Q in keyof O]: O[Q] } : never
}[K]

export function hasIdFilter<IDType, Filter extends { id?: IDType | null | QuantityOperators<IDType> | EqualityOperators<IDType> | ElementOperators }>(conditions: Filter, id: IDType | null): boolean {
  return hasFieldFilter<IDType, 'id', Filter>(conditions, 'id', id)
}

export function hasFieldFilter<
  FieldType,
  FieldName extends string,
  Filter extends { [P in FieldName]?: FieldType | null | QuantityOperators<FieldType> | EqualityOperators<FieldType> | ElementOperators },
>(conditions: Filter, fieldName: FieldName, id: FieldType | null): boolean {
  return (
    (id &&
      conditions[fieldName] &&
      (conditions[fieldName] === id ||
        (typeof conditions[fieldName] === 'object' &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in!.length === 1 &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in![0] === id) ||
        (typeof conditions[fieldName] === 'object' && (conditions[fieldName] as EqualityOperators<FieldType>).$eq && (conditions[fieldName] as EqualityOperators<FieldType>).$eq! === id))) ||
    false
  )
}

export function getSchemaFieldTraversing<ScalarsType>(key: string, schema: Schema<ScalarsType>): SchemaField<ScalarsType> | null {
  const c = key.split('.')
  if (c.length === 1) {
    return c[0] in schema ? schema[c[0]] : null
  } else {
    const k = c.shift()!
    const schemaField = schema[k]
    return schemaField && 'embedded' in schemaField ? getSchemaFieldTraversing(c.join('.'), schemaField.embedded) : null
  }
}

export function modelValueToDbValue<ScalarsType>(
  value: ScalarsType[keyof ScalarsType] | ScalarsType[keyof ScalarsType][],
  schemaField: SchemaField<ScalarsType>,
  adapter: DataTypeAdapter<ScalarsType[keyof ScalarsType], any>,
): unknown {
  if (adapter.validate) {
    if (schemaField.array) {
      for (const v of value as ScalarsType[keyof ScalarsType][]) {
        const validation = adapter.validate(v)
        if (validation !== true) {
          throw validation
        }
      }
    } else {
      const validation = adapter.validate(value as ScalarsType[keyof ScalarsType])
      if (validation !== true) {
        throw validation
      }
    }
  }
  return schemaField.array ? (value as ScalarsType[keyof ScalarsType][]).map((e) => adapter.modelToDB(e)) : adapter.modelToDB(value as ScalarsType[keyof ScalarsType])
}

export function* reversed<T>(array: T[]): Iterable<T> {
  for (let i = array.length - 1; i >= 0; i--) {
    yield array[i]
  }
}

export function iteratorLength(iterator: Iterable<unknown>): number {
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _v of iterator) {
    count++
  }
  return count
}

export function* iteratorLimit<T>(iterator: Iterable<T>, skip: number, limit: number): Iterable<T> {
  if (skip < 0 || !Number.isInteger(skip)) {
    throw new Error('Invalid argument: skip')
  }
  if (limit < 0 || !Number.isInteger(limit)) {
    throw new Error('Invalid argument: limit')
  }
  for (const v of iterator) {
    if (skip > 0) {
      skip--
      continue
    }
    if (limit === 0) {
      return
    }
    limit--
    yield v
  }
}

export const MONGODB_LOGIC_QUERY_PREFIXS = new Set(['$or', '$and', '$nor'])
export const MONGODB_SINGLE_VALUE_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne'])
export const MONGODB_ARRAY_VALUE_QUERY_PREFIXS = new Set(['$in', '$nin', '$all'])
export const MONGODB_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne', '$in', '$nin', '$all', '$size', '$near', '$nearSphere', '$contains', '$startsWith', '$endsWith'])

export function setTraversing(object: any, path: string, value: any) {
  if (typeof object === 'object') {
    const pathSplitted = path.split('.')
    if (pathSplitted.length === 1) {
      object[pathSplitted[0]] = value
    } else {
      if (object[pathSplitted[0]] === undefined) {
        object[pathSplitted[0]] = {}
      }
      if (Array.isArray(object[pathSplitted[0]])) {
        object[pathSplitted[0]].forEach((o: unknown) => setTraversing(o, pathSplitted.slice(1).join('.'), value))
      } else {
        setTraversing(object[pathSplitted[0]], pathSplitted.slice(1).join('.'), value)
      }
    }
  }
}

export function getTraversing(object: any, path: string): any[] {
  const pathSplitted = path.split('.').filter((pathStep) => pathStep.length > 0)
  if (path.length === 0) {
    if (Array.isArray(object)) {
      return object
    } else if (object) {
      return [object]
    } else {
      return []
    }
  } else {
    if (Array.isArray(object)) {
      return object.map((o) => getTraversing(o[pathSplitted[0]], pathSplitted.slice(1).join('.'))).reduce((a, c) => [...a, ...c], [])
    } else if (typeof object === 'object' && object) {
      if (object[pathSplitted[0]] === undefined || object[pathSplitted[0]] === null) {
        return []
      }
      return getTraversing(object[pathSplitted[0]], pathSplitted.slice(1).join('.'))
    } else {
      return []
    }
  }
}

export function deepCopy(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  if (obj instanceof Array) {
    const cp: Record<string, unknown>[] = []
    obj.forEach((v) => {
      cp.push(v)
    })
    return cp.map((n: any) => deepCopy(n)) as any
  }
  if (isPlainObject(obj)) {
    const cp = { ...(obj as { [key: string]: any }) } as { [key: string]: any }
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy(cp[k])
    })
    return cp
  }
  return obj
}

export function deepMerge(weak: any, strong: any): any {
  if (weak === null || weak === undefined) {
    return strong
  }
  if (strong === null || strong === undefined) {
    return weak
  }
  if (!isPlainObject(weak) || !isPlainObject(strong)) {
    return strong
  }

  const strongKey = new Set(Object.keys(strong))
  const weakKey = new Set(Object.keys(weak))
  const keySet = new Set([...strongKey, ...weakKey])

  const result: any = {}
  keySet.forEach((k) => {
    const [s, w] = [strongKey.has(k), weakKey.has(k)]
    if (s && w) {
      result[k] = deepMerge(weak[k], strong[k])
    } else if (s) {
      result[k] = strong[k]
    } else {
      result[k] = weak[k]
    }
  })
  return result
}

export async function inMemoryMongoDb(): Promise<{ replSet: MongoMemoryReplSet; connection: MongoClient; db: Db }> {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  const connection = await MongoClient.connect(replSet.getUri(), {})
  const db = connection.db('__mock')
  return { replSet, connection, db }
}

export function inMemorySqlite(): Knex<any, unknown> {
  return knex({
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
  })
}

export async function createMockedDAOContext<T extends object>(params: MockDAOContextParams<T>, mongoSources: string[], knexSources: string[]): Promise<T> {
  const beforeMongo = { ...Object.fromEntries(mongoSources.map((v) => [v, 'mock'])), ...((params as any).mongo ?? {}) }
  const mongo = Object.fromEntries(
    await Promise.all(
      Object.entries(beforeMongo).map(async ([k, v]) => {
        if (typeof v === 'string') {
          return [k, (await inMemoryMongoDb()).db]
        }
        return [k, v]
      }),
    ),
  )
  const beforeKnex = { ...Object.fromEntries(knexSources.map((v) => [v, 'mock'])), ...((params as any).knex ?? {}) }
  const knex = Object.fromEntries(
    await Promise.all(
      Object.entries(beforeKnex).map(async ([k, v]) => {
        if (typeof v === 'string') {
          return [k, inMemorySqlite()]
        }
        return [k, v]
      }),
    ),
  )
  return { ...params, mongo, knex } as T
}

export function filterUndefiend<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter((v) => v[1] !== undefined)) as T
}

export function mapObject<T extends Record<string, unknown>>(obj: T, f: (p: [string, T[keyof T]]) => [string, unknown][]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).flatMap(([k, v]) => f([k, v as T[keyof T]])))
}
