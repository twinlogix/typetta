import { Schema } from '../schemas/schemas.types'
import { DAORelation } from './relations.types'

export function daoRelationsFromSchema<ScalarsType>(schema: Schema<ScalarsType>, path = ''): DAORelation[] {
  return Object.entries(schema).flatMap(([fieldName, fieldSchema]) => {
    if (fieldSchema.type === 'embedded') {
      return daoRelationsFromSchema(fieldSchema.schema(), path + fieldName + '.')
    }
    if (fieldSchema.type !== 'relation') {
      return []
    }
    if (fieldSchema.relation === 'inner') {
      const relation: DAORelation = {
        reference: 'inner',
        type: fieldSchema.array ? '1-n' : '1-1',
        field: path + fieldName,
        refFrom: resolveParentPath(path + fieldSchema.refFrom),
        refTo: resolveParentPath(fieldSchema.refTo),
        required: fieldSchema.required ?? false,
        dao: fieldSchema.dao,
      }
      return [relation]
    } else if (fieldSchema.relation === 'foreign') {
      const relation: DAORelation = {
        reference: 'foreign',
        type: fieldSchema.array ? '1-n' : '1-1',
        field: path + fieldName,
        refFrom: resolveParentPath(fieldSchema.refFrom),
        refTo: resolveParentPath(path + fieldSchema.refTo),
        required: fieldSchema.required ?? false,
        dao: fieldSchema.dao,
      }
      return [relation]
    } else {
      const relation: DAORelation = {
        reference: 'relation',
        type: fieldSchema.array ? '1-n' : '1-1',
        field: path + fieldName,
        refThis: {
          refFrom: fieldSchema.refThis.refFrom,
          refTo: fieldSchema.refThis.refTo,
        },
        refOther: {
          refFrom: fieldSchema.refOther.refFrom,
          refTo: fieldSchema.refOther.refTo,
          dao: fieldSchema.refOther.dao,
        },
        relationDao: fieldSchema.relationEntity.dao,
        required: fieldSchema.required ?? false,
      }
      return [relation]
    }
  })
}

// example:
// id -> id
// entity.id -> entity.id
// entity.../id -> id
function resolveParentPath(fieldPath: string): string {
  const c: (string | null)[] = fieldPath.split('../').join('__PARENT__').split('.')
  for (let i = 1; i < c.length; i++) {
    const value = c[i]
    if (value && value.includes('__PARENT__')) {
      c[i - 1] = null
    }
  }
  return c.flatMap((v) => (v === null ? [] : [v.split('__PARENT__').join('')])).join('.')
}
