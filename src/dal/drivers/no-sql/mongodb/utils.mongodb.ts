import {
  getSchemaFieldTraversing,
  mapObject,
  modelValueToDbValue,
  MONGODB_ARRAY_VALUE_QUERY_PREFIXS,
  MONGODB_LOGIC_QUERY_PREFIXS,
  MONGODB_QUERY_PREFIXS,
  MONGODB_SINGLE_VALUE_QUERY_PREFIXS,
} from '../../../../utils/utils'
import { DAOGenerics } from '../../../dao/dao.types'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { DefaultModelScalars, identityAdapter } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDataTypeAdapterMap } from './adapters.mongodb'
import { Filter, Document, SortDirection } from 'mongodb'

export function adaptProjection<ProjectionType extends object, ScalarsType>(projection: AnyProjection<ProjectionType>, schema: Schema<ScalarsType>, defaultTrue?: true): AnyProjection<ProjectionType> {
  if (projection === true || projection === undefined) {
    return defaultTrue
  }
  return mapObject(projection, ([k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      const name = schemaField.alias ?? k
      if ('scalar' in schemaField) {
        return [[name, v]]
      }
      return [[name, adaptProjection(v as AnyProjection<ProjectionType>, schemaField.embedded, true)]]
    }
    return []
  }) as AnyProjection<ProjectionType>
}

export function modelNameToDbName<ScalarsType>(name: string, schema: Schema<ScalarsType>): string {
  const c = name.split('.')
  const k = c.shift() ?? name
  const schemaField = schema[k]
  const n = (schemaField && schemaField.alias) ?? k
  if (c.length === 0) {
    return n
  } else {
    return schemaField && 'embedded' in schemaField ? n + '.' + modelNameToDbName(c.join('.'), schemaField.embedded) : k + '.' + c.join('.')
  }
}

export function adaptFilter<ScalarsType extends DefaultModelScalars, T extends DAOGenerics>(
  filter: T['filter'],
  schema: Schema<ScalarsType>,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
): Filter<Document> {
  if (typeof filter === 'function') {
    return filter()
  }
  return mapObject(filter, ([k, v]) => {
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField) {
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

function adaptToSchema<ScalarsType extends DefaultModelScalars, Scalar extends ScalarsType[keyof ScalarsType] | ScalarsType[keyof ScalarsType][]>(
  value: unknown,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
  schemaField: SchemaField<ScalarsType>,
): unknown {
  if ('scalar' in schemaField) {
    // filter on scalar type
    const adapter = adapters[schemaField.scalar]
    if (!adapter) {
      throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
    } else if (typeof value === 'object' && value !== null && Object.keys(value).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
      // mongodb query
      const filter = value as Record<string, unknown>
      const mappedFilter = mapObject(filter, ([fk, fv]) => {
        if (MONGODB_SINGLE_VALUE_QUERY_PREFIXS.has(fk)) {
          return [[`$${fk}`, modelValueToDbValue(fv as Scalar, schemaField, adapter)]]
        }
        if (MONGODB_ARRAY_VALUE_QUERY_PREFIXS.has(fk)) {
          return [[`$${fk}`, (fv as Scalar[]).map((fve) => modelValueToDbValue(fve, schemaField, adapter))]]
        }
        if (fk === 'contains' || fk === 'startsWith' || fk === 'endsWith') {
          return []
        }
        return [[fk, fv]]
      })
      const stringFilter =
        'contains' in filter && 'startsWith' in filter && 'endsWith' in filter
          ? { $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.contains}).*(?<=${filter.endsWith}$)`) }
          : 'startsWith' in filter && 'endsWith' in filter
          ? { $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.endsWith}$)`) }
          : 'contains' in filter && 'startsWith' in filter
          ? { $regex: new RegExp(`(^${filter.startsWith}).*(?<=${filter.contains})`) }
          : 'contains' in filter && 'endsWith' in filter
          ? { $regex: new RegExp(`(${filter.contains}).*(?<=${filter.endsWith}$)`) }
          : 'contains' in filter
          ? { $regex: filter.contains }
          : 'startsWith' in filter
          ? { $regex: new RegExp(`^${filter.startsWith}`) }
          : 'endsWith' in filter
          ? { $regex: new RegExp(`${filter.endsWith}$`) }
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
  } else {
    // filter on embedded type
    return adaptFilter(value as AbstractFilter, schemaField.embedded, adapters)
  }
}

export function adaptUpdate<ScalarsType extends DefaultModelScalars, UpdateType>(update: UpdateType, schema: Schema<ScalarsType>, adapters: MongoDBDataTypeAdapterMap<ScalarsType>): Document {
  return mapObject(update as any, ([k, v]) => {
    if (v === undefined) {
      return []
    }
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField && 'scalar' in schemaField) {
      const adapter = adapters[schemaField.scalar] ?? identityAdapter
      return [[columnName, modelValueToDbValue(v, schemaField, adapter)]]
    } else if (schemaField) {
      return [[columnName, adaptUpdate(v, schemaField.embedded, adapters)]]
    } else {
      return []
    }
  })
}

export function adaptSorts<SortType, ScalarsType>(sort: SortType[], schema: Schema<ScalarsType>): [string, SortDirection][] {
  return sort.flatMap((s) => {
    return Object.entries(s).map(([k, v]) => {
      if (k === '$textScore') {
        return ['score', { $meta: 'textScore' }] as [string, SortDirection]
      }
      return [modelNameToDbName(k, schema), v] as [string, SortDirection]
    })
  })
}
