import { LogicalOperators, MONGODB_LOGIC_QUERY_PREFIXS, SortDirection } from '../../..'
import { ElementOperators, EqualityOperators, QuantityOperators, StringOperators } from '../../dao/filters/filters.types'
import { ObjectId } from 'mongodb'

type AbstractFilterFields = {
  [K in string]: unknown | null | EqualityOperators<unknown> | QuantityOperators<unknown> | ElementOperators | StringOperators
}
type Filter<FilterFields extends AbstractFilterFields> = LogicalOperators<FilterFields> & FilterFields

export function getByPath(object: unknown, path: string): unknown {
  const [key, ...tail] = path.split('.')
  if (object && typeof object === 'object') {
    const value = (object as { [K in string]: unknown })[key]
    if (tail.length > 0) {
      return getByPath(value, tail.join('.'))
    }
    return value
  }
  return undefined
}

export const mock: { compare?: (l: unknown, r: unknown) => number | void | null | undefined } = {
  compare: undefined,
}

function compare(l: unknown, r: unknown): number {
  // TODO: can improve perfomance by using map of typeof
  if (Array.isArray(l)) {
    return compare(l.length, r)
  }
  if (Array.isArray(r)) {
    return Number.NaN
  }
  if (mock.compare) {
    const result = mock.compare(l, r)
    if (typeof result === 'number') {
      return result
    }
  }
  if ((typeof l === 'bigint' || typeof l === 'number') && (typeof r === 'bigint' || typeof r === 'number')) {
    return l > r ? 1 : l < r ? -1 : 0
  }
  if (typeof l === 'boolean' && typeof r === 'boolean') {
    return l === r ? 0 : l ? 1 : -1
  }
  if (typeof l === 'string' && typeof r === 'string') {
    return l.localeCompare(r)
  }
  if (l && typeof l === 'object' && typeof (l as { equals: unknown }).equals === 'function') {
    return (l as { equals: (v: unknown) => unknown }).equals(r) ? 0 : Number.NaN
  }
  return l === r ? 0 : Number.NaN
}

export function equals(l: unknown, r: unknown): boolean {
  if (l instanceof ObjectId && r instanceof ObjectId) {
    return l.equals(r)
  }
  if (Array.isArray(l) && Array.isArray(r)) {
    return l.length === r.length && l.every((v, i) => equals(v, r[i]))
  }
  if (Array.isArray(l)) {
    return l.some((v) => equals(v, r))
  }
  if (Array.isArray(r)) {
    return false
  }
  return compare(l, r) === 0
}

function logicOperators<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields> | undefined): boolean {
  if (filter && ('$and' in filter || '$or' in filter || '$nor' in filter)) {
    const andResult = filter.$and ? filter.$and.map((f) => filterEntity(entity, f)).every((v) => v) : true
    const orResult = filter.$or ? filter.$or.map((f) => filterEntity(entity, f)).some((v) => v) : true
    const norResult = filter.$nor ? filter.$nor.map((f) => filterEntity(entity, f)).every((v) => !v) : true
    return andResult && orResult && norResult
  }
  return true
}

export function filterEntity<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields> | undefined): boolean {
  if (!filter) {
    return true
  }

  return (
    logicOperators(entity, filter) &&
    Object.entries(filter)
      .filter((p) => !MONGODB_LOGIC_QUERY_PREFIXS.has(p[0]))
      .every(([key, f]) => {
        const value = getByPath(entity, key)
        if (f && typeof f === 'object' && ('eq' in f || 'in' in f || 'ne' in f || 'nin' in f)) {
          const eo = f as EqualityOperators<unknown>
          const eqResult = eo.eq != null ? equals(value, eo.eq) : true
          const neResult = eo.ne != null ? !equals(value, eo.ne) : true
          const inResult = eo.in ? eo.in.some((v) => equals(value, v)) : true
          const ninResult = eo.nin ? eo.nin.every((v) => !equals(value, v)) : true
          return eqResult && neResult && inResult && ninResult
        }
        if (f && typeof f === 'object' && ('gte' in f || 'gt' in f || 'lte' in f || 'lt' in f)) {
          const qo = f as QuantityOperators<unknown>
          const gteResult = qo.gte != null ? compare(value, qo.gte) >= 0 : true
          const gtResult = qo.gt != null ? compare(value, qo.gt) > 0 : true
          const lteResult = qo.lte != null ? compare(value, qo.lte) <= 0 : true
          const ltResult = qo.lt != null ? compare(value, qo.lt) < 0 : true
          return gteResult && gtResult && lteResult && ltResult
        }
        if (f && typeof f === 'object' && 'exists' in f) {
          const eo = f as ElementOperators
          return eo.exists === true ? value !== undefined : value === undefined
        }
        if (f && typeof f === 'object' && ('contains' in f || 'startsWith' in f || 'endsWith' in f)) {
          const so = f as StringOperators
          if (typeof value !== 'string') {
            return false
          }
          if ('contains' in so && so.contains) {
            return value.includes(so.contains)
          }
          if ('startsWith' in so && so.startsWith) {
            return value.startsWith(so.startsWith)
          }
          if ('endsWith' in so && so.endsWith) {
            return value.endsWith(so.endsWith)
          }
        }
        return equals(value, f)
      })
  )
}

export function sort<T>(entities: T[], sorts: { [K in keyof T]?: SortDirection }[], index = sorts.length - 1): T[] {
  if (index < 0) {
    return entities
  }
  const [sortKey, sortDirection] = Object.entries(sorts[index])[0] as [string, SortDirection]
  const sortM = sortDirection === 'asc' ? 1 : -1
  const sorted = entities.sort((a, b) => compare(getByPath(a, sortKey), getByPath(b, sortKey)) * sortM)
  return sort(sorted, sorts, index - 1)
}
