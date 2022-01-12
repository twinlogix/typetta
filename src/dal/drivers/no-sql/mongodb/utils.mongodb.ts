import {
  getSchemaFieldTraversing,
  modelValueToDbValue,
  MONGODB_ARRAY_VALUE_QUERY_PREFIXS,
  MONGODB_LOGIC_QUERY_PREFIXS,
  MONGODB_QUERY_PREFIXS,
  MONGODB_SINGLE_VALUE_QUERY_PREFIXS,
} from '../../../../utils/utils'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { DefaultModelScalars, identityAdapter } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDataTypeAdapterMap } from './adapters.mongodb'
import { Filter, Document, SortDirection } from 'mongodb'

export function adaptProjection<ProjectionType extends object, ScalarsType>(projection: AnyProjection<ProjectionType>, schema: Schema<ScalarsType>): AnyProjection<ProjectionType> {
  if (projection === true || projection === undefined) {
    return undefined
  }
  return Object.entries(projection).reduce<object>((result, [k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      const name = schemaField.alias || k
      if ('scalar' in schemaField) {
        return {
          ...result,
          [name]: v,
        }
      }
      return {
        ...result,
        [name]: adaptProjection(v as AnyProjection<ProjectionType>, schemaField.embedded),
      }
    }
    return result
  }, {} as object) as AnyProjection<ProjectionType>
}

export function modelNameToDbName<ScalarsType>(name: string, schema: Schema<ScalarsType>): string {
  const c = name.split('.')
  const k = c.shift()!
  const schemaField = schema[k]
  const n = (schemaField && schemaField.alias) || k
  if (c.length === 0) {
    return n
  } else {
    return schemaField && 'embedded' in schemaField ? n + '.' + modelNameToDbName(c.join('.'), schemaField.embedded) : k + '.' + c.join('.')
  }
}

export function adaptFilter<FilterType extends AbstractFilter, ScalarsType extends DefaultModelScalars>(
  filter: FilterType,
  schema: Schema<ScalarsType>,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
): Filter<Document> {
  return Object.entries(filter).reduce<Filter<Document>>((result, [k, v]) => {
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField) {
      return {
        ...result,
        ...adaptToSchema(columnName, v, adapters, schemaField),
      }
    } else if (MONGODB_LOGIC_QUERY_PREFIXS.has(k)) {
      return {
        ...result,
        [columnName]: (v as AbstractFilter[]).map((f) => adaptFilter(f, schema, adapters)),
      }
    } else {
      // k is not in schema and is not a logical operator, ignore
      return result
    }
  }, {})
}

function adaptToSchema<ScalarsType extends DefaultModelScalars, Scalar extends ScalarsType[keyof ScalarsType] | ScalarsType[keyof ScalarsType][]>(
  key: string,
  value: unknown,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
  schemaField: SchemaField<ScalarsType>,
): Filter<Document> {
  const result: Filter<Document> = {}
  if ('scalar' in schemaField) {
    // filter on scalar type
    const adapter = adapters[schemaField.scalar]
    if (!adapter) {
      throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
    } else if (typeof value === 'object' && value !== null && Object.keys(value).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
      // mongodb query
      result[key] = Object.entries(value).reduce((p, [fk, fv]) => {
        if (MONGODB_SINGLE_VALUE_QUERY_PREFIXS.has(fk)) {
          return { [fk]: modelValueToDbValue(fv as Scalar, schemaField, adapter), ...p }
        }
        if (MONGODB_ARRAY_VALUE_QUERY_PREFIXS.has(fk)) {
          return { [fk]: (fv as Scalar[]).map((fve) => modelValueToDbValue(fve, schemaField, adapter)), ...p }
        }
        if (fk === '$contains') {
          return { $regex: fv, ...p }
        }
        if (fk === '$startsWith') {
          return { $regex: new RegExp(`^${fv}`), ...p }
        }
        if (fk === '$endsWith') {
          return { $regex: new RegExp(`${fv}$`), ...p }
        }
        return { [fk]: fv, ...p }
      }, {})
    } else {
      // plain value
      if (value === null) {
        result[key] = null
      } else if (value !== undefined) {
        result[key] = modelValueToDbValue(value as Scalar, schemaField, adapter)
      }
    }
  } else {
    // filter on embedded type
    result[key] = adaptFilter(value as AbstractFilter, schemaField.embedded, adapters)
  }
  return result
}

export function adaptUpdate<ScalarsType extends DefaultModelScalars, UpdateType>(update: UpdateType, schema: Schema<ScalarsType>, adapters: MongoDBDataTypeAdapterMap<ScalarsType>): Document {
  return Object.entries(update).reduce((p, [k, v]) => {
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField && 'scalar' in schemaField) {
      const adapter = adapters[schemaField.scalar] ?? identityAdapter
      return { [columnName]: modelValueToDbValue(v, schemaField, adapter), ...p }
    } else if (schemaField) {
      return { [columnName]: adaptUpdate(v, schemaField.embedded, adapters), ...p }
    } else {
      return p
    }
  }, {})
}

export function adaptSorts<SortType, ScalarsType>(sorts: SortType[], schema: Schema<ScalarsType>): [string, SortDirection][] {
  return sorts.flatMap((s) => {
    return Object.entries(s).map(([k, v]) => {
      if(k === '$textScore') {
        return ['score', { $meta: "textScore" }] as [string, SortDirection]
      }
      return [modelNameToDbName(k, schema), v] as [string, SortDirection]
    })
  })
}
