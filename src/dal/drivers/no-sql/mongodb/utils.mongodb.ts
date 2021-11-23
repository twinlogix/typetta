import { Projection } from '../../../dao/projections/projections.types'
import { Schema } from '../../../dao/schemas/schemas.types'

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
            const subSchema: Schema<any> = (schema[key] as { embedded: Schema<any> }).embedded;
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