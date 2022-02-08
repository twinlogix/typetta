import { DefaultGenerationStrategy, IdGenerationStrategy } from '..'
import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaAbstractGenerator } from './generators/abstractGenerator'
import { TsTypettaDAOGenerator } from './generators/daoGenerator'
import { findField, findID, findNode, toFirstLower } from './utils'

type ScalarType = { kind: 'scalar'; scalar: string }
type EmbedFieldType = { kind: 'embedded'; embed: string }
type InnerRefFieldType = { kind: 'innerRef'; innerRef: string; refFrom?: string; refTo?: string }
type ForeignRefFieldType = { kind: 'foreignRef'; foreignRef: string; refFrom?: string; refTo?: string }
type RelationEntityRefFieldType = {
  kind: 'relationEntityRef'
  sourceRef: string
  destRef: string
  entity: string
  refThis?: { refFrom: string; refTo?: string }
  refOther?: { refFrom: string; refTo?: string }
}
export type FieldTypeType = ScalarType | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType

export type TsTypettaGeneratorField = {
  name: string
  type: FieldTypeType
  graphqlType: string
  isRequired: boolean
  isID: boolean
  idGenerationStrategy?: IdGenerationStrategy
  isList: boolean
  isExcluded: boolean
  isEnum: boolean
  defaultGenerationStrategy?: DefaultGenerationStrategy
  alias?: string
}

export type TsTypettaGeneratorNode = {
  type: 'type'
  name: string
  entity?: { type: 'mongo'; collection: string; source: string } | { type: 'sql'; table: string; source: string }
  fields: TsTypettaGeneratorField[]
}

export type TsTypettaGeneratorScalar = {
  type: 'scalar'
  name: string
  isString: boolean
  isQuantity: boolean
}

export class TsTypettaGenerator {
  private _generators: TsTypettaAbstractGenerator[]

  constructor(config: TypeScriptTypettaPluginConfig) {
    this._generators = [new TsTypettaDAOGenerator(config)]
  }

  public generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): string {
    const typesMap = new Map<string, TsTypettaGeneratorNode>()
    nodes.filter((node) => node.type === 'type').forEach((type) => typesMap.set(type.name, type as TsTypettaGeneratorNode))

    const customScalarsMap = new Map<string, TsTypettaGeneratorScalar>()
    nodes.filter((node) => node.type === 'scalar').forEach((type) => customScalarsMap.set(type.name, type as TsTypettaGeneratorScalar))

    this.checkIds(typesMap)
    this.checkReferences(typesMap)
    this.checkArrayInSqlEntities(typesMap)

    const imports = this._generators
      .map((generator) => {
        return generator.generateImports(typesMap)
      })
      .reduce((a, c) => [...a, ...c], [])

    const definitions = [...typesMap.values()].flatMap((node) => {
      const definition = this._generators
        .map((generator) => generator.generateDefinition(node, typesMap, customScalarsMap))
        .filter((def) => def !== '')
        .join('\n\n')
      if (definition.trim().length === 0) {
        return []
      } else {
        return [[this._generateTitle(node), definition].join('\n\n')]
      }
    })

    const exports = this._generators.map((generator) => generator.generateExports(typesMap, customScalarsMap))

    return [imports.join('\n'), definitions.join('\n\n\n\n'), exports.join('\n\n')].join('\n\n')
  }

  private _generateTitle(node: TsTypettaGeneratorNode): string {
    return (
      '//' +
      '-'.repeat(80) +
      '\n' +
      '//' +
      '-'.repeat((80 - node.name.length - ((node.name.length % 2) + 1)) / 2) +
      ' ' +
      node.name.toUpperCase() +
      ' ' +
      '-'.repeat((80 - node.name.length - 1) / 2) +
      '\n' +
      '//' +
      '-'.repeat(80)
    )
  }

  private checkIds(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.entity)
      .forEach((type) => {
        const id = findID(type)
        if (!id) {
          throw new Error(`Type ${type.name} requires an @id field being a @mongodb.`)
        }
      })
  }

  private checkArrayInSqlEntities(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.entity?.type === 'sql')
      .forEach((type) => {
        type.fields.forEach((f) => {
          if ((typeof f.type === 'string' || 'embedded' in f.type) && f.isList) {
            console.warn(
              `Type ${type.name} is an sql entity and have an array field: ${f.name}. Plain field or embedded field are not supported as array, the only way to define an array is through references (@foreignRef or @relationEntityRef).`,
            )
          }
        })
      })
  }

  private checkReferences(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values()).forEach((type) => {
      type.fields.forEach((field) => {
        if (typeof field.type !== 'string') {
          if (field.type.kind === 'innerRef') {
            const refType = findNode(field.type.innerRef, typesMap)
            if (!refType) {
              throw new Error(`Field ${field.name} of type ${type.name} has a inner reference to ${field.type.innerRef} that cannot be resolved.`)
            }
            if (!refType.entity) {
              throw new Error(`Field ${field.name} of type ${type.name} has a inner reference to ${field.type.innerRef} that isn't an entity.`)
            }
            const refFrom = field.type.refFrom ?? field.name + 'Id'
            const refFromField = findField(type, refFrom, typesMap)
            if (!refFromField) {
              throw new Error(`Field ${field.name} of type ${type.name} has a inner reference to ${field.type.innerRef} with refFrom = '${refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(refType, refTo, typesMap)
            if (!refToField) {
              throw new Error(`Field ${field.name} of type ${type.name} has a inner reference to ${field.type.innerRef} with refTo = '${refTo}' that cannot be resolved.`)
            }
            if (refFromField.graphqlType !== refToField.graphqlType) {
              throw new Error(
                `Field '${type.name}.${refFrom}: ${refFromField.graphqlType}' has a inner reference to '${refType.name}.${refTo}: ${refToField.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'foreignRef') {
            const refType = findNode(field.type.foreignRef, typesMap)
            if (!refType) {
              throw new Error(`Field ${field.name} of type ${type.name} has a foreign reference to ${field.type.foreignRef} that cannot be resolved.`)
            }
            const refFrom = field.type.refFrom ?? `${toFirstLower(type.name)}Id`
            const refFromField = findField(refType, refFrom, typesMap)
            if (!refFromField) {
              throw new Error(`Field ${field.name} of type ${type.name} has a foreign reference to ${field.type.foreignRef} with refFrom = '${field.type.refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(type, refTo, typesMap)
            if (!refToField) {
              throw new Error(`Field ${field.name} of type ${type.name} has a foreign reference to ${field.type.foreignRef} with refTo = '${field.type.refTo}' that cannot be resolved.`)
            }
            if (refFromField.graphqlType !== refToField.graphqlType) {
              throw new Error(
                `Field '${type.name}.${refFrom}: ${refFromField.graphqlType}' has a foreign reference to '${refType.name}.${refTo}: ${refToField.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'relationEntityRef') {
            const refType = findNode(field.type.entity, typesMap)
            const sourceRefType = findNode(field.type.sourceRef, typesMap)!
            const destRefType = findNode(field.type.destRef, typesMap)!
            if (!refType) {
              throw new Error(`Field ${type.name}.${field.name} is related to ${field.type.entity} that cannot be resolved.`)
            }

            // Ref this check (source type)
            const refThisRefFrom = field.type.refThis?.refFrom ?? `${toFirstLower(field.type.sourceRef)}Id`
            const refThisRefFromField = findField(refType, refThisRefFrom, typesMap)
            if (!refThisRefFromField) {
              throw new Error(`Field ${type.name}.${field.name} is related to ${field.type.entity} with refThis.refFrom = '${refThisRefFrom}' that cannot be resolved.`)
            }
            const refThisRefTo = field.type.refThis?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refThisRefToField = findField(sourceRefType, refThisRefTo, typesMap)
            if (!refThisRefToField) {
              throw new Error(`Field ${type.name}.${field.name} is related to ${field.type.sourceRef} with refThis.refTo = '${refThisRefTo}' that cannot be resolved.`)
            }
            if (refThisRefToField.graphqlType !== refThisRefFromField.graphqlType) {
              throw new Error(
                `Field '${refType.name}.${refThisRefFrom}: ${refThisRefFromField.graphqlType}' is related to '${sourceRefType.name}.${refThisRefTo}: ${refThisRefToField.graphqlType}' but they have different scalar type.`,
              )
            }

            // Ref other check (dest type)
            const refOtherRefFrom = field.type.refOther?.refFrom ?? `${toFirstLower(field.type.destRef)}Id`
            const refOtherRefFromField = findField(refType, refOtherRefFrom, typesMap)
            if (!refOtherRefFromField) {
              throw new Error(`Field ${type.name}.${field.name} is related to ${field.type.entity} with refOther.refFrom = '${refOtherRefFrom}' that cannot be resolved.`)
            }
            const refOtherRefTo = field.type.refOther?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refOtherRefToField = findField(destRefType, refOtherRefTo, typesMap)
            if (!refOtherRefToField) {
              throw new Error(`Field ${type.name}.${field.name} is related to ${field.type.destRef} with refOther.refTo = '${refOtherRefTo}' that cannot be resolved.`)
            }
            if (refOtherRefToField.graphqlType !== refOtherRefFromField.graphqlType) {
              throw new Error(
                `Field '${refType.name}.${refOtherRefFrom}: ${refOtherRefFromField.graphqlType}' is related to '${destRefType.name}.${refOtherRefTo}: ${refThisRefToField.graphqlType}' but they have different scalar type.`,
              )
            }
          }
        }
      })
    })
  }
}
