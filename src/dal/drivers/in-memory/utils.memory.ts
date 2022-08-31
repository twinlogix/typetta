import { LogicalOperators, MONGODB_LOGIC_QUERY_PREFIXS, SortDirection } from '../../..'
import { getSchemaFieldTraversing, hasKeys, modelValueToDbValue } from '../../../utils/utils'
import { ElementOperators, EqualityOperators, QuantityOperators, StringOperators } from '../../dao/filters/filters.types'
import { AbstractScalars } from '../../dao/schemas/ast.types'
import { Schema, SchemaField } from '../../dao/schemas/schemas.types'
import { DataTypeAdapter, identityAdapter } from '../drivers.types'
import { modelNameToDbName } from '../no-sql/mongodb/utils.mongodb'
import { InMemoryDataTypeAdapterMap } from './adapters.memory'
import { IN_MEMORY_STATE } from './state.memory'
import { ObjectId } from 'mongodb'

export type AbstractFilterFields = {
  [K in string]: unknown | null | EqualityOperators<unknown> | QuantityOperators<unknown> | ElementOperators | StringOperators
}
type Filter<FilterFields extends AbstractFilterFields> = LogicalOperators<FilterFields> & FilterFields

export function getByPath(object: unknown, path: string): unknown {
  const [key, ...tail] = path.split('.')
  if (object && typeof object === 'object' && !Array.isArray(object)) {
    const value = (object as { [K in string]: unknown })[key]
    if (tail.length > 0) {
      return getByPath(value, tail.join('.'))
    }
    return value
  }
  if (object && typeof object === 'object' && Array.isArray(object)) {
    return object.map((v) => getByPath(v, path))
  }
  return undefined
}

export type MockIdSpecification<T> = {
  generate?: () => T
  stringify?: (t: T) => string
}
type MockOverrides = {
  compare?: (l: unknown, r: unknown) => number | void | null | undefined
  idSpecifications?: { [key: string]: MockIdSpecification<unknown> }
  readonly clearMemory: () => void
}
export const mock: MockOverrides = {
  compare: undefined,
  idSpecifications: undefined,
  clearMemory: () => IN_MEMORY_STATE.clear(),
}

export function compare(l: unknown, r: unknown): number {
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
  if (l instanceof ObjectId && r instanceof ObjectId) {
    return l.equals(r) ? 0 : l.toHexString().localeCompare(r.toHexString())
  }
  if (l instanceof Date && r instanceof Date) {
    return l.getTime() - r.getTime()
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

async function logicOperators<FilterFields extends AbstractFilterFields, Scalars extends AbstractScalars>(
  entity: unknown,
  filter: Filter<FilterFields> | undefined,
  schema?: Schema<Scalars>,
  adapters?: InMemoryDataTypeAdapterMap<Scalars>,
): Promise<boolean> {
  if (filter && ('$and' in filter || '$or' in filter || '$nor' in filter)) {
    const andResult = filter.$and ? (await Promise.all(filter.$and.map((f) => filterEntity(entity, f, schema, adapters)))).every((v) => v) : true
    const orResult = filter.$or ? (await Promise.all(filter.$or.map((f) => filterEntity(entity, f, schema, adapters)))).some((v) => v) : true
    const norResult = filter.$nor ? (await Promise.all(filter.$nor.map((f) => filterEntity(entity, f, schema, adapters)))).every((v) => !v) : true
    return andResult && orResult && norResult
  }
  return true
}

export async function filterEntity<FilterFields extends AbstractFilterFields, Scalars extends AbstractScalars>(
  entity: unknown,
  filter: Filter<FilterFields> | undefined,
  schema?: Schema<Scalars>,
  adapters?: InMemoryDataTypeAdapterMap<Scalars>,
): Promise<boolean> {
  if (!filter) {
    return true
  }

  const logical = await logicOperators(entity, filter, schema, adapters)
  if (!logical) {
    return false
  }

  for (const [keyF, f] of Object.entries(filter).filter((p) => p[1] !== undefined && !MONGODB_LOGIC_QUERY_PREFIXS.has(p[0]))) {
    let adapter: DataTypeAdapter<unknown, unknown>
    let schemaField: SchemaField<Scalars>
    let key: string
    if (schema && adapters) {
      const schemaField2 = getSchemaFieldTraversing(keyF, schema)
      key = modelNameToDbName(keyF, schema)
      if (!schemaField2 || !('scalar' in schemaField2)) {
        return false
      }
      schemaField = schemaField2
      adapter = adapters[schemaField.scalar]
      if (!adapter) {
        throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
      }
    } else {
      adapter = identityAdapter()
      key = keyF
      schemaField = {
        type: 'scalar',
        directives: {},
        scalar: 'String',
      }
    }

    const value = getByPath(entity, key)

    if (hasKeys(f, ['eq', 'in', 'ne', 'nin'])) {
      const eo = f as EqualityOperators<unknown>
      const eq = eo.eq !== undefined ? await modelValueToDbValue(eo.eq, schemaField, adapter) : eo.eq
      const eqResult =
        eq !== undefined
          ? (f as Record<string, unknown>).mode === 'insensitive' && typeof value === 'string' && typeof eq === 'string'
            ? equals(value.toLocaleLowerCase(), eq.toLocaleLowerCase())
            : equals(value, eq)
          : true
      const asyncSome = async <T>(arr: T[], predicate: (t: T) => Promise<boolean>) => {
        for (const e of arr) {
          if (await predicate(e)) {
            return true
          }
        }
        return false
      }
      const asyncEvery = async <T>(arr: T[], predicate: (t: T) => Promise<boolean>) => {
        for (const e of arr) {
          if (!(await predicate(e))) {
            return false
          }
        }
        return true
      }
      const neResult = eo.ne !== undefined ? !equals(value, await modelValueToDbValue(eo.ne, schemaField, adapter)) : true
      const inResult = eo.in ? await asyncSome(eo.in, async (v) => equals(value, await modelValueToDbValue(v, schemaField, adapter))) : true
      const ninResult = eo.nin ? await asyncEvery(eo.nin, async (v) => !equals(value, await modelValueToDbValue(v, schemaField, adapter))) : true
      if (!(eqResult && neResult && inResult && ninResult)) {
        return false
      }
    } else if (hasKeys(f, ['gte', 'gt', 'lte', 'lt'])) {
      const qo = f as QuantityOperators<unknown>
      const gteResult = qo.gte != null ? compare(value, await modelValueToDbValue(qo.gte, schemaField, adapter)) >= 0 : true
      const gtResult = qo.gt != null ? compare(value, await modelValueToDbValue(qo.gt, schemaField, adapter)) > 0 : true
      const lteResult = qo.lte != null ? compare(value, await modelValueToDbValue(qo.lte, schemaField, adapter)) <= 0 : true
      const ltResult = qo.lt != null ? compare(value, await modelValueToDbValue(qo.lt, schemaField, adapter)) < 0 : true
      if (!(gteResult && gtResult && lteResult && ltResult)) {
        return false
      }
    } else if (hasKeys(f, ['exists'])) {
      const eo = f as ElementOperators
      if (!(eo.exists == null ? true : eo.exists === true ? value !== undefined && value !== null : value === undefined || value === null)) {
        return false
      }
    } else if (hasKeys(f, ['contains', 'startsWith', 'endsWith'])) {
      const so = f as StringOperators
      if (typeof value !== 'string') {
        return false
      }
      if ((f as Record<string, unknown>).mode && (f as Record<string, unknown>).mode === 'sensitive') {
        if ('contains' in so && so.contains && !value.includes(so.contains)) {
          return false
        }
        if ('startsWith' in so && so.startsWith && !value.startsWith(so.startsWith)) {
          return false
        }
        if ('endsWith' in so && so.endsWith && !value.endsWith(so.endsWith)) {
          return false
        }
      } else {
        if ('contains' in so && so.contains && !value.toLocaleLowerCase().includes(so.contains.toLocaleLowerCase())) {
          return false
        }
        if ('startsWith' in so && so.startsWith && !value.toLocaleLowerCase().startsWith(so.startsWith.toLocaleLowerCase())) {
          return false
        }
        if ('endsWith' in so && so.endsWith && !value.toLocaleLowerCase().endsWith(so.endsWith.toLocaleLowerCase())) {
          return false
        }
      }
    } else {
      const adaptedF = await modelValueToDbValue(f, schemaField, adapter)
      if (!equals(value, adaptedF)) {
        return false
      }
    }
  }
  return true
}

export function sort<T>(entities: T[], sorts: { [K in keyof T]?: SortDirection }[], index = sorts.length - 1): T[] {
  if (index < 0) {
    return entities
  }
  const sorted = Object.entries(sorts[index]).reduce((sorted, [sortKey, sortDirection]) => {
    const sortM = sortDirection === 'asc' ? 1 : -1
    return sorted.sort((a, b) => compare(getByPath(a, sortKey), getByPath(b, sortKey)) * sortM)
  }, entities)
  return sort(sorted, sorts, index - 1)
}
