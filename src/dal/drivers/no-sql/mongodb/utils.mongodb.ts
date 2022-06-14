import { AbstractScalars } from '../../../..'
import {
  getSchemaFieldTraversing,
  mapObject,
  modelValueToDbValue,
  MONGODB_ARRAY_VALUE_QUERY_PREFIXS,
  MONGODB_LOGIC_QUERY_PREFIXS,
  MONGODB_QUERY_PREFIXS,
  MONGODB_SINGLE_VALUE_QUERY_PREFIXS,
  MONGODB_STRING_QUERY_PREFIX,
} from '../../../../utils/utils'
import { DAOGenerics } from '../../../dao/dao.types'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { identityAdapter } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDataTypeAdapterMap } from './adapters.mongodb'
import { Filter, Document, SortDirection } from 'mongodb'

export function adaptProjection<ProjectionType extends object, Scalars extends AbstractScalars>(
  projection: AnyProjection<ProjectionType>,
  schema: Schema<Scalars>,
  defaultTrue?: true,
): AnyProjection<ProjectionType> {
  if (projection === true || projection === undefined) {
    return defaultTrue
  }
  return mapObject(projection as Record<string, unknown>, ([k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      const name = schemaField.alias ?? k
      if (schemaField.type === 'scalar') {
        return [[name, v]]
      }
      if (schemaField.type === 'relation') {
        return []
      }
      if (typeof v === 'object' && Object.keys(v ?? {}).length === 0) {
        return []
      }
      const p = adaptProjection(v as AnyProjection<ProjectionType>, schemaField.schema(), true)
      if (typeof p === 'object' && Object.keys(p).length === 0) {
        return []
      }
      return [[name, p]]
    }
    return []
  }) as AnyProjection<ProjectionType>
}

export function modelNameToDbName<Scalars extends AbstractScalars>(name: string, schema: Schema<Scalars>): string {
  const c = name.split('.')
  const k = c.shift() ?? name
  const schemaField = schema[k]
  const n = (schemaField && schemaField.alias) ?? k
  if (c.length === 0) {
    return n
  } else {
    return schemaField && schemaField.type === 'embedded' ? n + '.' + modelNameToDbName(c.join('.'), schemaField.schema()) : k + '.' + c.join('.')
  }
}

export function adaptFilter<Scalars extends AbstractScalars, T extends DAOGenerics>(filter: T['filter'], schema: Schema<Scalars>, adapters: MongoDBDataTypeAdapterMap<Scalars>): Filter<Document> {
  if (typeof filter === 'function') {
    return filter()
  }
  return mapObject(filter, ([k, v]) => {
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField) {
      if (schemaField.type === 'relation') {
        return []
      }
      const adapted = adaptToSchema(v, adapters, schemaField)
      return [[columnName, adapted]]
    } else if (MONGODB_LOGIC_QUERY_PREFIXS.has(k)) {
      return [[columnName, (v as AbstractFilter[]).map((f) => adaptFilter(f, schema, adapters))]]
    } else {
      // k is not in schema and is not a logical operator, ignore
      return []
    }
  })
}

function adaptToSchema<Scalars extends AbstractScalars, Scalar extends Scalars[keyof Scalars]['type'] | Scalars[keyof Scalars]['type'][]>(
  value: unknown,
  adapters: MongoDBDataTypeAdapterMap<Scalars>,
  schemaField: SchemaField<Scalars>,
): unknown {
  if (schemaField.type === 'scalar') {
    // filter on scalar type
    const adapter = adapters[schemaField.scalar]
    if (!adapter) {
      throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
    } else if (typeof value === 'object' && value !== null && Object.keys(value).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
      // mongodb query
      const filter = value as Record<string, unknown>
      const mappedFilter = mapObject(filter, ([fk, fv]) => {
        if (MONGODB_SINGLE_VALUE_QUERY_PREFIXS.has(fk)) {
          if (fk === 'eq' && 'mode' in filter && filter.mode === 'insensitive') {
            return [
              ['$options', 'i'],
              ['$regex', `^${modelValueToDbValue(fv as Scalar, schemaField, adapter)}$`],
            ]
          }
          return [[`$${fk}`, modelValueToDbValue(fv as Scalar, schemaField, adapter)]]
        }
        if (MONGODB_ARRAY_VALUE_QUERY_PREFIXS.has(fk)) {
          return [[`$${fk}`, (fv as Scalar[]).map((fve) => modelValueToDbValue(fve, schemaField, adapter))]]
        }
        if (MONGODB_STRING_QUERY_PREFIX.has(fk)) {
          return []
        }
        if (fk === 'exists') {
          if (fv == null) {
            return []
          }
          return [[`$${fk}`, fv]]
        }
        return [[fk, fv]]
      })
      const $options = 'mode' in filter && filter.mode === 'sensitive' ? '' : 'i'
      // TODO: should filter.startsWith, filter.contains, filter.endsWith pass through adapter?
      const stringFilter =
        'contains' in filter && 'startsWith' in filter && 'endsWith' in filter
          ? { $options, $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.contains}).*(?<=${filter.endsWith}$)`) }
          : 'startsWith' in filter && 'endsWith' in filter
          ? { $options, $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.endsWith}$)`) }
          : 'contains' in filter && 'startsWith' in filter
          ? { $options, $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.contains})`) }
          : 'contains' in filter && 'endsWith' in filter
          ? { $options, $regex: new RegExp(`(${filter.contains}).*(?<=${filter.endsWith}$)`) }
          : 'contains' in filter
          ? { $options, $regex: filter.contains }
          : 'startsWith' in filter
          ? { $options, $regex: new RegExp(`^${filter.startsWith}`) }
          : 'endsWith' in filter
          ? { $options, $regex: new RegExp(`${filter.endsWith}$`) }
          : {}
      return { ...mappedFilter, ...stringFilter }
    } else {
      // plain value
      if (value === null) {
        return null
      } else if (value !== undefined) {
        return modelValueToDbValue(value as Scalar, schemaField, adapter)
      }
    }
  } else if (schemaField.type === 'embedded') {
    // filter on embedded type
    return adaptFilter(value as AbstractFilter, schemaField.schema(), adapters)
  }
}

export function adaptUpdate<Scalars extends AbstractScalars, UpdateType>(update: UpdateType, schema: Schema<Scalars>, adapters: MongoDBDataTypeAdapterMap<Scalars>): Document {
  return mapObject(update as unknown as Record<string, Scalars[keyof Scalars]['type'] | Scalars[keyof Scalars]['type'][]>, ([k, v]) => {
    if (v === undefined) {
      return []
    }
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField && schemaField.type === 'scalar') {
      if (v === null) {
        return [[columnName, null]]
      }
      const adapter = adapters[schemaField.scalar] ?? identityAdapter()
      return [[columnName, modelValueToDbValue(v, schemaField, adapter)]]
    } else if (schemaField && schemaField.type === 'embedded') {
      if (schemaField.isList) {
        return [[columnName, v === null ? null : (v as unknown[]).map((ve) => (ve === null ? null : adaptUpdate(ve, schemaField.schema(), adapters)))]]
      }
      return [[columnName, v === null ? null : adaptUpdate(v, schemaField.schema(), adapters)]]
    } else {
      return []
    }
  })
}

export function adaptSorts<SortType, Scalars extends AbstractScalars>(sort: SortType[], schema: Schema<Scalars>): [string, SortDirection][] {
  return sort.flatMap((s) => {
    return Object.entries(s).map(([k, v]) => {
      if (k === '$textScore') {
        return ['score', { $meta: 'textScore' }] as [string, SortDirection]
      }
      return [modelNameToDbName(k, schema), v] as [string, SortDirection]
    })
  })
}
