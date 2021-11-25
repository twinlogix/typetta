import { Projection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { DataTypeAdapter, DefaultModelScalars } from '../../drivers.types'
import { AbstractFilter } from '../../sql/knexjs/utils.knexjs'
import { MongoDBDataTypeAdapterMap } from './adapters.mongodb'
import { Filter, Document } from 'mongodb'

export function buildProjections<ModelType>(projections: Projection<ModelType>, schema: Schema<any>, prefix: string = '') {
  if (projections) {
    let mongooseProjections: any = {}
    Object.entries(projections).forEach(([key, value]) => {
      if (value === true) {
        if (schema[key]) {
          mongooseProjections[prefix + key] = 1
        }
      } else if (typeof value === 'object') {
        if (schema[key]) {
          if ((schema[key] as { embedded: Schema<any> }).embedded) {
            const subSchema: Schema<any> = (schema[key] as { embedded: Schema<any> }).embedded
            mongooseProjections = { ...mongooseProjections, ...buildProjections(value, subSchema, prefix + key + '.') }
          } else {
            mongooseProjections[prefix + key] = 1
          }
        }
      }
    })
    return mongooseProjections
  } else {
    return null
  }
}

const singleValueQuery = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne'])
const arrayValueQuery = new Set(['$in', '$nin', '$all'])
const otherQuery = new Set(['$size', '$text', '$near', '$nearSphere'])

function adaptValue(value: any, schemaField: SchemaField<any>, adapter: DataTypeAdapter<any, any>): any {
  return schemaField.array ? (value as Array<any>).map((e) => adapter.modelToDB(e)) : adapter.modelToDB(value)
}

export function adaptFilter<FilterType extends AbstractFilter, ScalarsType extends DefaultModelScalars>(
  filter: FilterType,
  schema: Schema<ScalarsType>,
  adapters: MongoDBDataTypeAdapterMap<ScalarsType>,
): Filter<Document> {
  const result: Filter<Document> = {}
  for (const [k, v] of Object.entries(filter)) {
    if (k in schema) {
      const schemaField = schema[k]
      if ('scalar' in schemaField) {
        // filter on scalar type
        const adapter = adapters[schemaField.scalar]
        if (!adapter) {
          result[k] = v
          continue //TODO: throw if adapter is undefined?
        }
        if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => singleValueQuery.has(kv) || arrayValueQuery.has(kv) || otherQuery.has(kv))) {
          //mongodb query
          result[k] = Object.entries(v).reduce((p, [fk, fv]) => {
            if (singleValueQuery.has(fk)) {
              return { [fk]: adaptValue(fv, schemaField, adapter), ...p }
            }
            if (arrayValueQuery.has(fk)) {
              return { [fk]: fv.map((fve: any) => adaptValue(fve, schemaField, adapter)), ...p }
            }
            return { [fk]: fv, ...p }
          }, {})
          console.log(result)
        } else {
          //plain value
          if (v === null) {
            result[k] = null
          } else if (v !== undefined) {
            result[k] = adaptValue(v, schemaField, adapter)
          }
        }
      } else {
        // filter on embedded type
        result[k] = adaptFilter(v as AbstractFilter, schemaField.embedded, adapters)
      }
    } else if (k === '$or' || k === '$and' || k === '$nor' || k === '$not') {
      return (result[k] = (v as AbstractFilter[]).map((filter) => adaptFilter(filter, schema, adapters)))
    } else {
      // k is not in schema, ignore
    }
  }
  return result
}
