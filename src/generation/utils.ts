import { Schema } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapterMap } from '../dal/drivers/drivers.types'
import { EmbedFieldType, ForeignRefFieldType, InnerRefFieldType, TsTypettaGeneratorField, TsTypettaGeneratorNode } from './generator'

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

export function isEmbed(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType): type is EmbedFieldType {
  return (type as EmbedFieldType).embed !== undefined
}

export function isInnerRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType): type is InnerRefFieldType {
  return (type as InnerRefFieldType).innerRef !== undefined
}

export function isForeignRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType): type is ForeignRefFieldType {
  return (type as ForeignRefFieldType).foreignRef !== undefined
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
export function transformObject<From, To, ModelScalars extends object, DBScalars extends object>(
  adapters: DataTypeAdapterMap<ModelScalars, DBScalars>,
  direction: 'dbToModel' | 'modelToDB',
  object: From,
  schema: Schema<ModelScalars>,
): To {
  const result: any = {}
  Object.entries(object).map(([key, value]) => {
    if (key in schema) {
      const schemaField = schema[key]
      if (!schemaField.required && (value === null || value === undefined)) {
        result[key] = value
      } else {
        if ('scalar' in schemaField) {
          const adapter = adapters[schemaField.scalar]
          if (Array.isArray(value) && schemaField.array) {
            result[key] = adapter ? value.map((v) => adapter[direction](v)) : value
          } else {
            result[key] = adapter ? adapter[direction](value) : value
          }
        } else {
          if (Array.isArray(value) && schemaField.array) {
            result[key] = value.map((v) => transformObject(adapters, direction, v, schemaField.embedded))
          } else {
            result[key] = transformObject(adapters, direction, value, schemaField.embedded)
          }
        }
      }
    } else {
      result[key] = value
    }
  })
  return result
}
