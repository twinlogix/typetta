import { AbstractScalars } from '..'
import { DAOGenerics } from '../dal/dao/dao.types'
import { Schema, SchemaField } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'
import { DeepRequired, RecursiveKeyOfLeaf, TypeTraversal } from './utils.types'
import { isPlainObject } from 'is-plain-object'
import knex, { Knex } from 'knex'

export function getSchemaFieldTraversing<Scalars extends AbstractScalars>(key: string, schema: Schema<Scalars>): SchemaField<Scalars> | null {
  const c = key.split('.')
  if (c.length === 1) {
    return c[0] in schema ? schema[c[0]] : null
  } else {
    const k = c.shift()
    if (!k) {
      throw new Error('Unreachable')
    }
    const schemaField = schema[k]
    return schemaField && schemaField.type === 'embedded' ? getSchemaFieldTraversing(c.join('.'), schemaField.schema()) : null
  }
}

export function modelValueToDbValue<Scalars extends AbstractScalars>(
  value: Scalars[keyof Scalars]['type'] | Scalars[keyof Scalars]['type'][],
  schemaField: SchemaField<Scalars>,
  adapter: DataTypeAdapter<Scalars[keyof Scalars]['type'], unknown>,
): unknown {
  if (adapter.validate) {
    if (schemaField.isList) {
      for (const v of value as Scalars[keyof Scalars]['type'][]) {
        const validation = adapter.validate(v)
        if (validation !== true) {
          throw validation
        }
      }
    } else {
      const validation = adapter.validate(value as Scalars[keyof Scalars])
      if (validation !== true) {
        throw validation
      }
    }
  }
  return schemaField.isList ? (value as Scalars[keyof Scalars]['type'][]).map((e) => adapter.modelToDB(e)) : adapter.modelToDB(value as Scalars[keyof Scalars]['type'])
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

export function hasKeys(i: unknown, keys: string[]): boolean {
  return i && typeof i === 'object' && keys.some((k) => k in i && typeof (i as Record<string, unknown>)[k] !== 'function') ? true : false
}

type FlattenEmbeddedFilter<T> = {
  [K in RecursiveKeyOfLeaf<DeepRequired<T>>]?: TypeTraversal<T, K>
}

export function flattenEmbeddeds<T extends Record<string, unknown>, Scalars extends AbstractScalars>(obj: T, schema: Schema<Scalars>, prefix = ''): FlattenEmbeddedFilter<T> {
  if (!obj) {
    return obj
  }
  return mapObject(obj, ([k, v]) => {
    const field = schema[k]
    if (!field) {
      return [[k, v]]
    }
    if (field.type === 'embedded') {
      if (!v) {
        return [[`${prefix}${k}`, v]]
      }
      return Object.entries(flattenEmbeddeds(v as T, field.schema(), `${prefix}${k}.`))
    }
    return [[`${prefix}${k}`, v]]
  }) as FlattenEmbeddedFilter<T>
}

export function adaptResolverFilterToTypettaFilter<T extends Record<string, unknown>, D extends DAOGenerics, Scalars extends AbstractScalars>(obj: T, schema: Schema<Scalars>): D['pureFilter'] {
  const r1 = renameLogicalOperators(obj)
  const r2 = flattenEmbeddedsInFilter(r1, schema)
  const r3 = renameHasOperator(r2)
  return r3
}

function flattenEmbeddedsInFilter<T extends Record<string, unknown>, D extends DAOGenerics, Scalars extends AbstractScalars>(obj: T, schema: Schema<Scalars>): D['pureFilter'] {
  return flattenEmbeddeds(
    mapObject(obj, ([k, v]) => {
      if (k === '$and') return [['$and', (v as Record<string, unknown>[]).map((ve) => flattenEmbeddedsInFilter(ve, schema))]]
      if (k === '$or') return [['$or', (v as Record<string, unknown>[]).map((ve) => flattenEmbeddedsInFilter(ve, schema))]]
      if (k === '$nor') return [['$nor', (v as Record<string, unknown>[]).map((ve) => flattenEmbeddedsInFilter(ve, schema))]]
      return [[k, v]]
    }),
    schema,
  ) as D['pureFilter']
}

function renameHasOperator<T extends Record<string, unknown>, D extends DAOGenerics>(obj: T): D['pureFilter'] {
  return mapObject(obj, ([k, v]) => {
    if (k === '$and') return [['$and', (v as Record<string, unknown>[]).map((ve) => renameHasOperator(ve))]]
    if (k === '$or') return [['$or', (v as Record<string, unknown>[]).map((ve) => renameHasOperator(ve))]]
    if (k === '$nor') return [['$nor', (v as Record<string, unknown>[]).map((ve) => renameHasOperator(ve))]]
    if (v && typeof v === 'object' && 'has' in v) {
      return [[k, (v as Record<string, unknown>).has]]
    }
    return [[k, v]]
  }) as D['pureFilter']
}

function renameLogicalOperators<T extends Record<string, unknown>, D extends DAOGenerics>(obj: T): D['pureFilter'] {
  return mapObject(obj, ([k, v]) => {
    if (k === 'and_' || k === '$and') return [['$and', (v as Record<string, unknown>[]).map((ve) => renameLogicalOperators(ve))]]
    if (k === 'or_' || k === '$or') return [['$or', (v as Record<string, unknown>[]).map((ve) => renameLogicalOperators(ve))]]
    if (k === 'nor_' || k === '$nor') return [['$nor', (v as Record<string, unknown>[]).map((ve) => renameLogicalOperators(ve))]]
    return [[k, v]]
  }) as D['pureFilter']
}

export function intersection<T>(values: T[][], equals: (l: T, r: T) => boolean): T[] {
  if (values.length === 0) {
    return []
  }
  const [head, ...tail] = values
  return tail.reduce((p, c) => {
    return p.filter((x) => {
      for (const x2 of c) {
        if (equals(x, x2)) {
          return true
        }
      }
      return false
    })
  }, head)
}
