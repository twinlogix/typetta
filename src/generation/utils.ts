import { Schema } from '../dal/dao/schemas/schemas.types'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'
import { EmbedFieldType, ForeignRefFieldType, InnerRefFieldType, TsTypettaGeneratorField, TsTypettaGeneratorNode } from './generator'

export function toFirstLower(typeName: string) {
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

export function findID(node: TsTypettaGeneratorNode): TsTypettaGeneratorField | undefined {
  return node.fields.find((field) => field.isID)
}

export function findNode(code: string, typesMap: Map<String, TsTypettaGeneratorNode>): TsTypettaGeneratorNode | undefined {
  return typesMap.get(code)
}

export function findField(node: TsTypettaGeneratorNode, fieldPath: string, typesMap: Map<String, TsTypettaGeneratorNode>): TsTypettaGeneratorField | undefined {
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
export function transformObject<T, ScalarsType>(
  adapters: Map<keyof ScalarsType, DataTypeAdapter<ScalarsType, keyof ScalarsType, any>>,
  direction: 'dbToModel' | 'modelToDB',
  object: T,
  schema: Schema<ScalarsType>,
  embeddedOverride?: DataTypeAdapter<ScalarsType, keyof ScalarsType, any>,
): T {
  const result: any = {}
  Object.entries(object).map(([k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      if (!schemaField.required && (v === null || v === undefined)) {
        result[k] = v
      } else {
        if ('scalar' in schemaField) {
          const adapter = adapters.get(schemaField.scalar)
          if (Array.isArray(v) && schemaField.array) {
            result[k] = adapter ? v.map((v) => adapter[direction](v)) : v
          } else {
            result[k] = adapter ? adapter[direction](v) : v
          }
        } else {
          if (embeddedOverride) {
            if (Array.isArray(v) && schemaField.array) {
              result[k] = v.map((v) => embeddedOverride[direction](v))
            } else {
              result[k] = embeddedOverride[direction](v)
            }
          } else {
            if (Array.isArray(v) && schemaField.array) {
              result[k] = v.map((v) => transformObject(adapters, direction, v, schemaField.embedded, embeddedOverride))
            } else {
              result[k] = transformObject(adapters, direction, v, schemaField.embedded, embeddedOverride)
            }
          }
        }
      }
    } else {
      result[k] = v
    }
  })
  return result
}
