import { Schema } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../dal/drivers/drivers.types'
import { EmbedFieldType, ForeignRefFieldType, InnerRefFieldType, RelationEntityRefFieldType, TsTypettaGeneratorField, TsTypettaGeneratorNode } from './generator'

export function toFirstLower(typeName: string) {
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

export function findID(node: TsTypettaGeneratorNode): TsTypettaGeneratorField | undefined {
  return node.fields.find((field) => field.isID)
}

export function findNode(code: string, typesMap: Map<string, TsTypettaGeneratorNode>): TsTypettaGeneratorNode | undefined {
  return typesMap.get(code)
}

export function findField(node: TsTypettaGeneratorNode, fieldPath: string, typesMap: Map<string, TsTypettaGeneratorNode>): TsTypettaGeneratorField | undefined {
  const fieldPathSplitted = fieldPath.split('.')
  if (fieldPathSplitted.length === 1) {
    return node.fields.find((f) => f.name === fieldPathSplitted[0])
  } else {
    const key = fieldPathSplitted.shift()
    const tmpField = node.fields.find((f) => f.name === key)
    if (tmpField && isEmbed(tmpField.type)) {
      const embeddedType = findNode(tmpField.type.embed, typesMap)
      return embeddedType && findField(embeddedType, fieldPathSplitted.join('.'), typesMap)
    }
    return tmpField
  }
}

export function isEmbed(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType): type is EmbedFieldType {
  return (type as EmbedFieldType).embed !== undefined
}

export function isInnerRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType): type is InnerRefFieldType {
  return (type as InnerRefFieldType).innerRef !== undefined
}

export function isForeignRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType): type is ForeignRefFieldType {
  return (type as ForeignRefFieldType).foreignRef !== undefined
}

export function isRelationEntityRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType): type is RelationEntityRefFieldType {
  return (type as RelationEntityRefFieldType).entity !== undefined
}

export function isEntity(node: TsTypettaGeneratorNode): boolean {
  return node.mongoEntity !== undefined || node.sqlEntity !== undefined
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
  const keySet = new Set(Object.keys(object))
  for (const [fieldName, schemaField] of Object.entries(schema)) {
    const sourceName = schemaField.alias && direction === 'dbToModel' ? schemaField.alias : fieldName
    const destName = schemaField.alias && direction === 'modelToDB' ? schemaField.alias : fieldName
    if (sourceName in object) {
      const value = object[sourceName]
      keySet.delete(sourceName)
      if (!schemaField.required && (value === null || value === undefined)) {
        result[destName] = value
      } else {
        if ('scalar' in schemaField) {
          const adapter = adapters[schemaField.scalar] ?? identityAdapter
          const mapper =
            direction === 'modelToDB' && adapter.validate
              ? (data: ModelScalars[keyof ModelScalars]) => {
                const validation = adapter.validate!(data)
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
  for (const key of keySet.values()) {
    // copy remaining unknown key
    result[key] = object[key]
  }
  return result
}
