import { QuantityOperators, EqualityOperators, ElementOperators } from '../dal/dao/filters/filters.types'
import { Schema, SchemaField } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'
import { isPlainObject } from 'is-plain-object'

export type OneKey<K extends string | number | symbol, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O ? { [Q in keyof O]: O[Q] } : never
}[K]

export function hasIdFilter<IDType, Filter extends { id?: IDType | null | QuantityOperators<IDType> | EqualityOperators<IDType> | ElementOperators }>(
  conditions: Filter,
  id: IDType | null,
): boolean {
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

export const MONGODB_LOGIC_QUERY_PREFIXS = new Set(['$or', '$and', '$not', '$nor'])
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
        ; (object[pathSplitted[0]] as any[]).forEach((o) => setTraversing(o, pathSplitted.slice(1).join('.'), value))
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
    const cp = [] as any[]
      ; (obj as any[]).forEach((v) => {
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
