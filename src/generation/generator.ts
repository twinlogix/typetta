import { IdGenerationStrategy } from '..'
import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaAbstractGenerator } from './generators/abstractGenerator'
import { TsTypettaDAOGenerator } from './generators/daoGenerator'
import { findField, findID, findNode, isForeignRef, isInnerRef, isRelationEntityRef, toFirstLower } from './utils'

export type EmbedFieldType = { embed: string }
export type InnerRefFieldType = { innerRef: string; refFrom?: string; refTo?: string }
export type ForeignRefFieldType = { foreignRef: string; refFrom?: string; refTo?: string }
export type RelationEntityRefFieldType = { sourceRef: string; destRef: string; entity: string; refThis?: { refFrom: string; refTo?: string }; refOther?: { refFrom: string; refTo?: string } }

export type TsTypettaGeneratorField = {
  name: string
  type: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType
  coreType: string
  graphqlType: string
  isRequired: boolean
  isID: boolean
  idGenerationStrategy?: IdGenerationStrategy
  isList: boolean
  isExcluded: boolean
  alias?: string
}

export type TsTypettaGeneratorNode = {
  type: 'type'
  name: string
  prefixedName: string
  mongoEntity?: { collection: string; source: string }
  sqlEntity?: { table: string; source: string }
  fields: TsTypettaGeneratorField[]
}

export type TsTypettaGeneratorScalar = {
  type: 'scalar'
  name: string
  isGeoPoint: boolean
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

    this.checkEntities(typesMap)
    this.checkIds(typesMap)
    this.checkReferences(typesMap)

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

  private checkEntities(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.mongoEntity && type.sqlEntity)
      .forEach((type) => {
        throw new Error(`Type ${type.name} is a @mongoEntity and a @sqlEntity ath the same time. A type can be only on one database at a time.`)
      })
  }

  private checkIds(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.mongoEntity || type.sqlEntity)
      .forEach((type) => {
        const id = findID(type)
        if (!id) {
          throw new Error(`Type ${type.name} requires an @id field being a @mongoEntity.`)
        }
      })
  }

  private checkReferences(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values()).forEach((type) => {
      type.fields.forEach((field) => {
        if (typeof field.type !== 'string') {
          if (isInnerRef(field.type)) {
            const refType = findNode(field.type.innerRef, typesMap)
            if (!refType) {
              throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.innerRef} that cannot be resolved.`)
            }
            if (!refType.mongoEntity && !refType.sqlEntity) {
              throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.innerRef} that isn't an entity.`)
            }
            if (field.type.refFrom) {
              const refFromField = findField(type, field.type.refFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.innerRef} with refFrom = '${field.type.refFrom}' that cannot be resolved.`)
              }
            }
            if (field.type.refTo) {
              const refToField = findField(refType, field.type.refTo, typesMap)
              if (!refToField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.innerRef} with refTo = '${field.type.refTo}' that cannot be resolved.`)
              }
            }
          } else if (isForeignRef(field.type)) {
            const refType = findNode(field.type.foreignRef, typesMap)
            if (!refType) {
              throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.foreignRef} that cannot be resolved.`)
            }
            if (field.type.refFrom) {
              const refFromField = findField(refType, field.type.refFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.foreignRef} with refFrom = '${field.type.refFrom}' that cannot be resolved.`)
              }
            }
            if (field.type.refTo) {
              const refToField = findField(type, field.type.refTo, typesMap)
              if (!refToField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.foreignRef} with refTo = '${field.type.refTo}' that cannot be resolved.`)
              }
            }
          } else if (isRelationEntityRef(field.type)) {
            const refType = findNode(field.type.entity, typesMap)
            const sourceRefType = findNode(field.type.sourceRef, typesMap)!
            const destRefType = findNode(field.type.destRef, typesMap)!
            if (!refType) {
              throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.entity} that cannot be resolved.`)
            }
            if (field.type.refThis) {
              const refFromField = findField(refType, field.type.refThis.refFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.entity} with refThis.refFrom = '${field.type.refThis.refFrom}' that cannot be resolved.`)
              }
              if (field.type.refThis.refTo) {
                const refToField = findField(sourceRefType, field.type.refThis.refTo, typesMap)
                if (!refToField) {
                  throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.sourceRef} with refThis.refTo = '${field.type.refThis.refTo}' that cannot be resolved.`)
                }
              }
            } else {
              const refThisrefFrom = toFirstLower(field.type.sourceRef) + 'Id'
              const refFromField = findField(refType, refThisrefFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.entity} with refThis.refFrom ${refThisrefFrom} that cannot be resolved.`)
              }
            }
            if (field.type.refOther) {
              const refFromField = findField(refType, field.type.refOther.refFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.entity} with refOther.refFrom = '${field.type.refOther.refFrom}' that cannot be resolved.`)
              }
              if (field.type.refOther.refTo) {
                const refToField = findField(destRefType, field.type.refOther.refTo, typesMap)
                if (!refToField) {
                  throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.destRef} with refOther.refTo = '${field.type.refOther.refTo}' that cannot be resolved.`)
                }
              }
            } else {
              const refOtherrefFrom = toFirstLower(field.type.destRef) + 'Id'
              const refFromField = findField(refType, refOtherrefFrom, typesMap)
              if (!refFromField) {
                throw new Error(`Field ${field.name} of type ${type.name} has a reference to ${field.type.entity} with refOther.refFrom ${refOtherrefFrom} that cannot be resolved.`)
              }
            }
          }
        }
      })
    })
  }
}
