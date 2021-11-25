import { Projection } from '../../../dao/projections/projections.types'
import { Schema } from '../../../dao/schemas/schemas.types'
import { DefaultModelScalars } from '../../drivers.types'
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

// TODO: text search, array filtering
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
        const adapter = adapters[schemaField.scalar]
        if (typeof v === 'object' && v !== null && ('$exists' in v || '$eq' in v || '$in' in v || '$gte' in v || '$gt' in v || '$lte' in v || '$lt' in v || '$ne' in v || '$nin' in v)) {
          result[k] = Object.entries(v).reduce((p, [fk, fv]) => {
            const av = adapter ? (Array.isArray(fv) ? fv.map((fve) => adapter.modelToDB(fve)) : adapter.modelToDB(fv)) : fv
            return { [fk]: av, ...p }
          }, {})
        } else {
          if (v === null) {
            result[k] = null
          } else if (v !== undefined) {
            const av = adapter ? adapter.modelToDB(v as any) : v
            result[k] = av
          }
        }
      } else {
        result[k] = adaptFilter(v as AbstractFilter, schemaField.embedded, adapters)
      }
    } else if (k === '$or' || k === '$and' || k === '$nor' || k === '$not') {
      return (result[k] = (v as AbstractFilter[]).map((filter) => adaptFilter(filter, schema, adapters)))
    } else {
      throw new Error(`${k} is not a scalar in the schema. (Filtering on embedded types is not supported.)`)
    }
  }
  return result
}
