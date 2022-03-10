import { LogicalOperators } from '..'
import { ElementOperators, EqualityOperators, QuantityOperators, StringOperators } from '../dal/dao/filters/filters.types'

type AbstractFilterFields = {
  [K in string]: Record<string, unknown> | null | EqualityOperators<unknown> | QuantityOperators<unknown> | ElementOperators | StringOperators
}
type Filter<FilterFields extends AbstractFilterFields> = LogicalOperators<FilterFields> & FilterFields

function andResult<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields>): boolean {
  return filter.$and ? filter.$and.map((f) => filterEntity(entity, f)).every((v) => v) : true
}
function orResult<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields>): boolean {
  return filter.$or ? filter.$or.map((f) => filterEntity(entity, f)).some((v) => v) : true
}
function notResult<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields>): boolean {
  return filter.$not ? !filterEntity(entity, filter.$not) : true
}
function norResult<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields>): boolean {
  return filter.$nor ? filter.$nor.map((f) => !filterEntity(entity, f)).some((v) => v) : true
}
function equals(l: unknown, r: unknown) {
  if (l && typeof l === 'object' && typeof (l as any).equals === 'function') {
    return (l as any).equals(r)
  }
  return l === r
}
export function filterEntity<FilterFields extends AbstractFilterFields>(entity: unknown, filter: Filter<FilterFields> | undefined): boolean {
  if (!filter) {
    return true
  }
  const logicResult = andResult(entity, filter) && orResult(entity, filter) && notResult(entity, filter) && norResult(entity, filter)
  if (!logicResult) {
    return false
  }
  return Object.entries(filter).every(([key, f]) => {
    const value = getByPath(entity, key)
    if (f && ('$and' in f || '$or' in f || '$not' in f || '$or' in f)) {
      return true // checked before
    }
    if (f && ('$eq' in f || '$in' in f || '$ne' in f || '$nin' in f)) {
      const eqResult = f.$eq ? equals(value, f.$eq) : true
      const neResult = f.$ne ? !equals(value, f.$ne) : true
      const inResult = f.$in ? (f as EqualityOperators<unknown>).$in?.some((v) => equals(value, v)) : true
      const ninResult = f.$nin ? (f as EqualityOperators<unknown>).$nin?.every((v) => !equals(value, v)) : true
      return eqResult && neResult && inResult && ninResult
    }
    if (f && ('$gte' in f || '$gt' in f || '$lte' in f || '$lt' in f)) {
      return true
    }
    if (f && '$exists' in f) {
      return true
    }
    if (f && '$contains' in f) {
      return true
    }
    if (f && '$startsWith' in f) {
      return true
    }
    if (f && '$endsWith' in f) {
      return true
    }
    return equals(value, f)
  })
}

function getByPath(object: unknown, path: string): unknown {
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
