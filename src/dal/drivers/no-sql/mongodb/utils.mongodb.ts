import { MONGODB_ARRAY_VALUE_QUERY_PREFIXS, MONGODB_LOGIC_QUERY_PREFIXS, MONGODB_QUERY_PREFIXS, MONGODB_SINGLE_VALUE_QUERY_PREFIXS } from '../../../../utils/utils'
import { AnyProjection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { DataTypeAdapter, DefaultModelScalars } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDataTypeAdapterMap } from './adapters.mongodb'
import { Filter, Document } from 'mongodb'

export function adaptProjection<ModelType, ProjectionType, ScalarsType>(projection: AnyProjection<ModelType, ProjectionType>, schema: Schema<ScalarsType>): AnyProjection<ModelType, ProjectionType> {
  if (projection === true || projection === undefined) {
    return projection
  }
  return Object.entries(projection).reduce<object>((result, [k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      if ('scalar' in schemaField) {
        return {
          ...result,
          [k]: v,
        }
      }
      return {
        ...result,
        [k]: adaptProjection(v, schemaField.embedded),
      }
    }
    return result
  }, {} as object) as AnyProjection<ModelType, ProjectionType>
}

export function adaptFilter<FilterType extends AbstractFilter, ScalarsType extends DefaultModelScalars>(
  filter: FilterType,
  schema: Schema<ScalarsType>,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
): Filter<Document> {
  return Object.entries(filter).reduce<Filter<Document>>((result, [k, v]) => {
    if (k in schema) {
      return {
        ...result,
        ...adaptToSchema(k, v, adapters, schema[k]),
      }
    } else if (MONGODB_LOGIC_QUERY_PREFIXS.has(k)) {
      return {
        ...result,
        [k]: (v as AbstractFilter[]).map((f) => adaptFilter(f, schema, adapters)),
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
          return { [fk]: adaptToSchemaValue(fv as Scalar, schemaField, adapter), ...p }
        }
        if (MONGODB_ARRAY_VALUE_QUERY_PREFIXS.has(fk)) {
          return { [fk]: (fv as Scalar[]).map((fve) => adaptToSchemaValue(fve, schemaField, adapter)), ...p }
        }
        return { [fk]: fv, ...p }
      }, {})
    } else {
      // plain value
      if (value === null) {
        result[key] = null
      } else if (value !== undefined) {
        result[key] = adaptToSchemaValue(value as Scalar, schemaField, adapter)
      }
    }
  } else {
    // filter on embedded type
    result[key] = adaptFilter(value as AbstractFilter, schemaField.embedded, adapters)
  }
  return result
}

function adaptToSchemaValue<ScalarsType>(
  value: ScalarsType[keyof ScalarsType] | ScalarsType[keyof ScalarsType][],
  schemaField: SchemaField<ScalarsType>,
  adapter: DataTypeAdapter<ScalarsType[keyof ScalarsType], any>,
): unknown {
  return schemaField.array ? (value as ScalarsType[keyof ScalarsType][]).map((e) => adapter.modelToDB(e)) : adapter.modelToDB(value as ScalarsType[keyof ScalarsType])
}
