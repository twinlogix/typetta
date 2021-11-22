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
  return (type as EmbedFieldType).embed !== undefined;
}

export function isInnerRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType): type is InnerRefFieldType {
  return (type as InnerRefFieldType).innerRef !== undefined;
}

export function isForeignRef(type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType): type is ForeignRefFieldType {
  return (type as ForeignRefFieldType).foreignRef !== undefined;
}

export function isEntity(node: TsTypettaGeneratorNode): boolean {
  return node.mongoEntity !== undefined || node.sqlEntity !== undefined;
}

export function indentMultiline(str: string, count = 1): string {
  const indentation = '  '.repeat(count)
  const replaceWith = '\n' + indentation
  return indentation + str.replace(/\n/g, replaceWith)
}