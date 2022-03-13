import { Schema } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../dal/drivers/drivers.types'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode } from './generator'

export function toFirstLower(typeName: string) {
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

export function findID(node: TsTypettaGeneratorNode): TsTypettaGeneratorField | undefined {
  return node.fields.find((field) => field.isID)
}

export function findNode(code: string, typesMap: Map<string, TsTypettaGeneratorNode>): TsTypettaGeneratorNode | undefined {
  return typesMap.get(code)
}

export function getID(node: TsTypettaGeneratorNode): TsTypettaGeneratorField {
  const field = node.fields.find((field) => field.isID)
  if (!field) {
    throw new Error(`Id field in node ${node.name} not found!`)
  }
  return field
}

export function getNode(code: string, typesMap: Map<string, TsTypettaGeneratorNode>): TsTypettaGeneratorNode {
  const node = typesMap.get(code)
  if (!node) {
    throw new Error(`Node with code ${code} not found!`)
  }
  return node
}

// example:
// id -> id
// entity.id -> entity.id
// entity.../id -> id
export function resolveParentPath(fieldPath: string): string {
  const c: (string | null)[] = fieldPath.split('../').join('__PARENT__').split('.')
  for (let i = 1; i < c.length; i++) {
    const value = c[i]
    if (value && value.includes('__PARENT__')) {
      c[i - 1] = null
    }
  }
  return c.flatMap((v) => (v === null ? [] : [v.split('__PARENT__').join('')])).join('.')
}

export function removeParentPath(fieldPath: string): string {
  return fieldPath.split('../').join('')
}

export function findField(
  node: TsTypettaGeneratorNode,
  fieldPath: string,
  typesMap: Map<string, TsTypettaGeneratorNode>,
  parents: TsTypettaGeneratorNode[],
): { field?: TsTypettaGeneratorField; root: TsTypettaGeneratorNode } {
  let parentIndex = -1
  while (fieldPath.startsWith('../')) {
    fieldPath = fieldPath.substring(3)
    parentIndex++
  }
  if (parentIndex >= parents.length) {
    return { root: node }
  }
  if (parentIndex != -1) {
    node = parents[parentIndex]
  }

  const fieldPathSplitted = fieldPath.split('.')
  if (fieldPathSplitted.length === 1) {
    return { field: node.fields.find((f) => f.name === fieldPathSplitted[0]), root: node }
  } else {
    const key = fieldPathSplitted.shift()
    const tmpField = node.fields.find((f) => f.name === key)
    if (tmpField && tmpField.type.kind === 'embedded') {
      const embeddedType = findNode(tmpField.type.embed, typesMap)
      return { field: embeddedType && findField(embeddedType, fieldPathSplitted.join('.'), typesMap, []).field, root: node }
    }
    return { field: tmpField, root: node }
  }
}

export function indentMultiline(str: string, count = 1): string {
  const indentation = '  '.repeat(count)
  const replaceWith = '\n' + indentation
  return indentation + str.replace(/\n/g, replaceWith)
}

/**
 * Transforms object from database representation to model representation or vice versa.
 * @param adapters the adapters map
 * @param direction the direction of the transformation
 * @param object the object to transform
 * @param schema the model schema
 * @param embeddedOverride optionally, an override adapter for embedded types (typically JSON)
 * @returns a new transformed object
 */
export function transformObject<From extends { [key: string]: any }, To, ModelScalars extends DefaultModelScalars, DBScalars extends object>(
  adapters: DataTypeAdapterMap<ModelScalars, DBScalars>,
  direction: 'dbToModel' | 'modelToDB',
  object: From,
  schema: Schema<ModelScalars>,
): To {
  const result: any = {}
  const isModelToDB = direction === 'modelToDB'
  const isDbToModel = !isModelToDB
  for (const [fieldName, schemaField] of Object.entries(schema)) {
    const sourceName = schemaField.alias && isDbToModel ? schemaField.alias : fieldName
    const destName = schemaField.alias && isModelToDB ? schemaField.alias : fieldName
    if (sourceName in object) {
      const value = object[sourceName]
      if (!schemaField.required && (value === null || value === undefined)) {
        result[destName] = value
      } else {
        if ('scalar' in schemaField) {
          const adapter = adapters[schemaField.scalar] ?? identityAdapter
          const validator = adapter.validate
          const mapper =
            validator && isModelToDB
              ? (data: ModelScalars[keyof ModelScalars]) => {
                  const validation = validator(data)
                  if (validation === true) {
                    return adapter.modelToDB(data)
                  }
                  throw validation
                }
              : adapter[direction]
          if (Array.isArray(value) && schemaField.array) {
            result[destName] = adapter ? value.map((v) => mapper(v)) : value
          } else {
            result[destName] = adapter ? mapper(value) : value
          }
        } else {
          if (Array.isArray(value) && schemaField.array) {
            result[destName] = value.map((v) => transformObject(adapters, direction, v, schemaField.embedded))
          } else {
            result[destName] = transformObject(adapters, direction, value, schemaField.embedded)
          }
        }
      }
    }
  }
  return result
}
