import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaAbstractGenerator } from './generators/abstractGenerator'
import { TsTypettaDAOGenerator } from './generators/daoGenerator'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
import { findField, findID, findNode, removeParentPath, toFirstLower } from './utils'

export class TsTypettaGenerator extends TypettaGenerator {
  private _generators: TsTypettaAbstractGenerator[]

  constructor(config: TypeScriptTypettaPluginConfig) {
    super(config)
    this._generators = [new TsTypettaDAOGenerator(config)]
  }

  public async generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): Promise<string> {
    const typesMap = new Map<string, TsTypettaGeneratorNode>()
    nodes.filter((node) => node.type === 'type').forEach((type) => typesMap.set(type.name, type as TsTypettaGeneratorNode))

    const customScalarsMap = new Map<string, TsTypettaGeneratorScalar>()
    nodes.filter((node) => node.type === 'scalar').forEach((type) => customScalarsMap.set(type.name, type as TsTypettaGeneratorScalar))

    this.checkIds(typesMap)
    this.checkReferences(typesMap, (type) => (type.entity ? true : false))
    this.checkArrayInSqlEntities(typesMap)

    const imports = this._generators
      .map((generator) => {
        return generator.generateImports(typesMap)
      })
      .reduce((a, c) => [...a, ...c], [])

    if (!Array.from(typesMap.values()).some((v) => v.entity?.type)) {
      throw new Error('At least one entity is required for code generation. (@entity)')
    }
    const definitions = [...typesMap.values()]
      .filter((node) => node.name !== 'Query' && node.name !== 'Mutation')
      .flatMap((node) => {
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
          throw new Error(`Type ${type.name} requires an @id field being a @entity.`)
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

  private checkReferences(typesMap: Map<string, TsTypettaGeneratorNode>, filter: (type: TsTypettaGeneratorNode) => boolean, parents: TsTypettaGeneratorNode[] = []) {
    Array.from(typesMap.values())
      .filter(filter)
      .forEach((type) => {
        const errorPrefix = `(Type: ${type.name}${parents.length > 0 ? `, Parents: ${parents.map((v) => v.name).join('<-')}` : ''})`
        type.fields.forEach((field) => {
          if (field.type.kind === 'embedded') {
            const type2Name = field.type.embed
            this.checkReferences(typesMap, (t) => t.name === type2Name, [type, ...parents])
          } else if (field.type.kind === 'innerRef') {
            const refType = findNode(field.type.innerRef, typesMap)
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} that cannot be resolved.`)
            }
            if (!refType.entity) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} that isn't an entity.`)
            }
            const refFrom = field.type.refFrom ?? field.name + 'Id'
            const refFromField = findField(type, refFrom, typesMap, parents)
            if (!refFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} with refFrom = '${refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(refType, refTo, typesMap, parents)
            if (!refToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} with refTo = '${refTo}' that cannot be resolved.`)
            }
            if (refFromField.field.graphqlType !== refToField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refFromField.root.name}.${removeParentPath(refFrom)}: ${refFromField.field.graphqlType}' has a inner reference to '${refToField.root.name}.${removeParentPath(
                  refTo,
                )}: ${refToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'foreignRef') {
            const refType = findNode(field.type.foreignRef, typesMap)
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} that cannot be resolved.`)
            }
            const refFrom = field.type.refFrom ?? `${toFirstLower(type.name)}Id`
            const refFromField = findField(refType, refFrom, typesMap, parents)
            if (!refFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} with refFrom = '${field.type.refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(type, refTo, typesMap, parents)
            if (!refToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} with refTo = '${field.type.refTo}' that cannot be resolved.`)
            }
            if (refFromField.field.graphqlType !== refToField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refFromField.root.name}.${removeParentPath(refFrom)}: ${refFromField.field.graphqlType}' has a foreign reference to '${
                  refToField.root.name
                }.${removeParentPath(refTo)}: ${refToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'relationEntityRef') {
            const refType = findNode(field.type.entity, typesMap)
            const sourceRefType = findNode(field.type.sourceRef, typesMap)
            const destRefType = findNode(field.type.destRef, typesMap)
            if (!sourceRefType || !destRefType) {
              throw new Error('Unreachable')
            }
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} that cannot be resolved.`)
            }

            // Ref this check (source type)
            const refThisRefFrom = field.type.refThis?.refFrom ?? `${toFirstLower(field.type.sourceRef)}Id`
            const refThisRefFromField = findField(refType, refThisRefFrom, typesMap, parents)
            if (!refThisRefFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} with refThis.refFrom = '${refThisRefFrom}' that cannot be resolved.`)
            }
            const refThisRefTo = field.type.refThis?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refThisRefToField = findField(sourceRefType, refThisRefTo, typesMap, parents)
            if (!refThisRefToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.sourceRef} with refThis.refTo = '${refThisRefTo}' that cannot be resolved.`)
            }
            if (refThisRefToField.field.graphqlType !== refThisRefFromField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refThisRefFromField.root.name}.${removeParentPath(refThisRefFrom)}: ${refThisRefFromField.field.graphqlType}' is related to '${
                  refThisRefToField.root.name
                }.${removeParentPath(refThisRefTo)}: ${refThisRefToField.field.graphqlType}' but they have different scalar type.`,
              )
            }

            // Ref other check (dest type)
            const refOtherRefFrom = field.type.refOther?.refFrom ?? `${toFirstLower(field.type.destRef)}Id`
            const refOtherRefFromField = findField(refType, refOtherRefFrom, typesMap, parents)
            if (!refOtherRefFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} with refOther.refFrom = '${refOtherRefFrom}' that cannot be resolved.`)
            }
            const refOtherRefTo = field.type.refOther?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refOtherRefToField = findField(destRefType, refOtherRefTo, typesMap, parents)
            if (!refOtherRefToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.destRef} with refOther.refTo = '${refOtherRefTo}' that cannot be resolved.`)
            }
            if (refOtherRefToField.field.graphqlType !== refOtherRefFromField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refOtherRefFromField.root.name}.${removeParentPath(refOtherRefFrom)}: ${refOtherRefFromField.field.graphqlType}' is related to '${
                  refOtherRefToField.root.name
                }.${removeParentPath(refOtherRefTo)}: ${refThisRefToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          }
        })
      })
  }
}
