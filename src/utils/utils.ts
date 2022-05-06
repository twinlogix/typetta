import { FlattenEmbeddedFilter } from '..'
import { Schema, SchemaField } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'
import { isPlainObject } from 'is-plain-object'
import knex, { Knex } from 'knex'

export function getSchemaFieldTraversing<ScalarsType>(key: string, schema: Schema<ScalarsType>): SchemaField<ScalarsType> | null {
  const c = key.split('.')
  if (c.length === 1) {
    return c[0] in schema ? schema[c[0]] : null
  } else {
    const k = c.shift()
    if (!k) {
      throw new Error('Unreachable')
    }
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

export const MONGODB_LOGIC_QUERY_PREFIXS = new Set(['$or', '$and', '$nor'])
export const MONGODB_SINGLE_VALUE_QUERY_PREFIXS = new Set(['eq', 'gte', 'gt', 'lte', 'lt', 'ne'])
export const MONGODB_ARRAY_VALUE_QUERY_PREFIXS = new Set(['in', 'nin'])
export const MONGODB_STRING_QUERY_PREFIX = new Set(['contains', 'startsWith', 'endsWith', 'mode'])
export const MONGODB_QUERY_PREFIXS = new Set(['eq', 'gte', 'gt', 'lte', 'lt', 'ne', 'in', 'nin', 'exists', 'contains', 'startsWith', 'endsWith'])

export function setTraversing(object: any, path: string, value: any) {
  if (typeof object === 'object') {
    const pathSplitted = path.split('.')
    const key = pathSplitted[0]
    if (key === '__proto__') {
      return
    }
    if (pathSplitted.length === 1) {
      object[key] = value
    } else {
      if (object[key] === undefined) {
        object[key] = {}
      }
      if (Array.isArray(object[key])) {
        object[key].forEach((o: unknown) => setTraversing(o, pathSplitted.slice(1).join('.'), value))
      } else {
        setTraversing(object[key], pathSplitted.slice(1).join('.'), value)
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

export function deepMerge(weak: any, strong: any, nullsAsUndefined = true): any {
  if ((nullsAsUndefined && weak === null) || weak === undefined) {
    return strong
  }
  if ((nullsAsUndefined && strong === null) || strong === undefined) {
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
      result[k] = deepMerge(weak[k], strong[k], nullsAsUndefined)
    } else if (s) {
      result[k] = strong[k]
    } else {
      result[k] = weak[k]
    }
  })
  return result
}

export function inMemoryKnexConfig(): Knex.Config {
  return {
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
}

export function inMemorySqlite(): Knex<any, unknown> {
  return knex(inMemoryKnexConfig())
}

export function filterUndefiendFields<T extends Record<string, unknown>>(obj: T): T {
  return mapObject(obj, ([k, v]) => (v === undefined ? [] : [[k, v]])) as T
}

export function filterNullFields<T extends Record<string, unknown>>(obj: T): T {
  return mapObject(obj, ([k, v]) => (v === null ? [] : [[k, v]])) as T
}

export function mapObject<T extends Record<string, unknown>>(obj: T, f: (p: [string, T[keyof T]]) => [string, unknown][]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).flatMap(([k, v]) => f([k, v as T[keyof T]])))
}

export function flattenEmbeddeds<T extends Record<string, unknown>, ScalarsType>(obj: T, schema: Schema<ScalarsType>, prefix = ''): FlattenEmbeddedFilter<T> {
  if (!obj) {
    return obj
  }
  return mapObject(obj, ([k, v]) => {
    const field = schema[k]
    if ('embedded' in field) {
      if (!v) {
        return [[`${prefix}${k}`, v]]
      }
      return Object.entries(flattenEmbeddeds(v as T, field.embedded, `${prefix}${k}.`))
    }
    return [[`${prefix}${k}`, v]]
  }) as FlattenEmbeddedFilter<T>
}

export function renameLogicalOperators<T extends Record<string, unknown>>(obj: T): Omit<T, 'and_' | 'or_' | 'nor_'> & Record<'$and', T['and_']> & Record<'$or', T['or_']> & Record<'$nor', T['nor_']> {
  return mapObject(obj, ([k, v]) => {
    if (k === 'and_') return [['$and', v]]
    if (k === 'or_') return [['$or', v]]
    if (k === 'nor_') return [['$nor', v]]
    return [[k, v]]
  }) as Omit<T, 'and_' | 'or_' | 'nor_'> & Record<'$and', T['and_']> & Record<'$or', T['or_']> & Record<'$nor', T['nor_']>
}
