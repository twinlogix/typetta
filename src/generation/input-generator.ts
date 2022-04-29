import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
import { removeEmptyLines, toFirstUpper } from './utils'
import dedent from 'dedent'

export class InputTypettaGenerator extends TypettaGenerator {
  constructor(config: TypeScriptTypettaPluginConfig) {
    super(config)
  }

  public generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): string {
    const customScalarsMap = new Map<string, TsTypettaGeneratorScalar>()
    const typesMap = new Map<string, TsTypettaGeneratorNode>()
    nodes.forEach((node) => {
      if (node.type === 'scalar') {
        customScalarsMap.set(node.name, node)
      } else {
        typesMap.set(node.name, node)
      }
    })

    const customScalars = this.generateCustomScalarFilterInput(customScalarsMap)
    return [
      this.defaultInput(),
      customScalars,
      ...nodes.flatMap((n) => {
        if (n.type === 'scalar') {
          return []
        }
        const delimiter = `########### ${n.name} ###########`
        const insertInput = this.generateInsertInput(n, typesMap)
        if (n.entity) {
          const filterInput = this.generateFilterInput(n, typesMap)
          const relationFilterInput = this.generateRelationsFilterInput(n)
          const findInput = this.generateFindInput(n)
          const sortInput = this.generateSortInput(n, typesMap)
          const updateInput = this.generateUpdateInput(n, typesMap)
          return [removeEmptyLines([delimiter, filterInput, relationFilterInput, insertInput, updateInput, sortInput, findInput, delimiter].join('\n'))]
        } else {
          return [removeEmptyLines([delimiter, insertInput, delimiter].join('\n'))]
        }
      }),
    ].join('\n\n\n')
  }

  private defaultInput(): string {
    return dedent`
      enum SortDirection {
        ASC
        DESC
      }

      enum StringFilterMode {
        SENSITIVE
        INSENSITIVE
      }

      input StringFilterInput {
        eq: String
        ne: String
        in: [String!]
        nin: [String!]
        exists: Boolean
        contains: String
        startsWith: String
        endsWith: String
        mode: StringFilterMode
      }
      
      input IntFilterInput {
        eq: Int
        ne: Int
        in: [Int!]
        nin: [Int!]
        exists: Boolean
        gte: Int
        gt: Int
        lte: Int
        lt: Int
      }
      
      input FloatFilterInput {
        eq: Float
        ne: Float
        in: [Float!]
        nin: [Float!]
        exists: Boolean
        gte: Float
        gt: Float
        lte: Float
        lt: Float
      }
      
      input BooleanFilterInput {
        eq: Boolean
        ne: Boolean
        in: [Boolean!]
        nin: [Boolean!]
        exists: Boolean
      }
      
      input IDFilterInput {
        eq: ID
        ne: ID
        in: [ID!]
        nin: [ID!]
        exists: ID
      }`
  }

  private generateCustomScalarFilterInput(customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
    return Array.from(customScalarsMap.values())
      .map((s) => {
        const additionalFields = []
        if (s.isString) {
          additionalFields.push(`contains: ${s.name}`, `startsWith: ${s.name}`, `endsWith: ${s.name}`, `mode: StringFilterMode`)
        }
        if (s.isQuantity) {
          additionalFields.push(`gte: ${s.name}`, `gt: ${s.name}`, `lte: ${s.name}`, `lt: ${s.name}`)
        }
        return removeEmptyLines(dedent`
          input ${s.name}FilterInput {
            eq: ${s.name}
            ne: ${s.name}
            in: [${s.name}!]
            nin: [${s.name}!]
            exists: Boolean
            ${additionalFields.join('\n            ')}
          }`)
      })
      .join('\n\n')
  }

  private generateFilterInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return dedent`
      input ${node.name}FilterInput {
        ${this.flattenFields(node, typesMap)
          .map((r) => `${r.name}: ${r.field.graphqlType}FilterInput`)
          .join('\n        ')}
        and: [${node.name}FilterInput!]
        or: [${node.name}FilterInput!]
        nor: [${node.name}FilterInput!]
      }`
  }

  private hasRelations(node: TsTypettaGeneratorNode): boolean {
    return node.fields.some((f) => f.type.kind === 'innerRef' || f.type.kind === 'foreignRef' || f.type.kind === 'relationEntityRef')
  }
  private generateRelationsFilterInput(node: TsTypettaGeneratorNode): string {
    if (!this.hasRelations(node)) {
      return ''
    }
    const fields = node.fields.flatMap((f) => {
      if (f.type.kind === 'innerRef' || f.type.kind === 'foreignRef' || f.type.kind === 'relationEntityRef') {
        return [`${f.name}: ${f.graphqlType}FindInput`]
      }
      return []
    })
    return dedent`
      input ${node.name}RelationsFilterInput {
        ${fields.join('\n        ')}
      }`
  }

  private generateFindInput(node: TsTypettaGeneratorNode): string {
    return dedent`
      input ${node.name}FindInput {
        filter: ${node.name}FilterInput
        sorts: [${node.name}SortInput!]
        skip: Int
        limit: Int
        ${this.hasRelations(node) ? `relations: ${node.name}RelationsFilterInput` : ``}
      }`
  }

  private generateSortInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return dedent`
      input ${node.name}SortInput {
        ${this.flattenFields(node, typesMap)
          .map((r) => `${r.name}: SortDirection`)
          .join('\n        ')}
      }`
  }

  private generateUpdateInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return dedent`
      input ${node.name}UpdateInput {
        ${this.flattenFields(node, typesMap)
          .map((r) => `${r.name}: ${r.field.graphqlType}`)
          .join('\n        ')}
      }`
  }

  private generateInsertInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return dedent`
      input ${node.name}InsertInput {
        ${node.fields
          .flatMap((f) => {
            if (f.type.kind === 'scalar') {
              const t = f.isList ? `[${f.graphqlType}${f.isListElementRequired ? '!' : ''}]` : f.graphqlType
              return [`${f.name}: ${t}${f.isRequired ? '!' : ''}`]
            }
            if (f.type.kind === 'embedded') {
              const type = typesMap.get(f.graphqlType)
              if (type) {
                const t = f.isList ? `[${f.graphqlType}InsertInput${f.isListElementRequired ? '!' : ''}]` : f.graphqlType
                return [`${f.name}: ${t}${f.isRequired ? '!' : ''}`]
              }
            }
            return []
          })
          .join('\n        ')}
      }`
  }

  private flattenFields(
    node: TsTypettaGeneratorNode,
    typesMap: Map<string, TsTypettaGeneratorNode>,
    prefix = '',
    parents: TsTypettaGeneratorNode[] = [],
  ): { field: TsTypettaGeneratorField; name: string; parents: TsTypettaGeneratorNode[] }[] {
    return node.fields.flatMap((f) => {
      if (f.type.kind === 'scalar') {
        return [{ name: this.concatPrefix(prefix, f.name), field: f, parents }]
      }
      if (f.type.kind === 'embedded') {
        const type = typesMap.get(f.graphqlType)
        if (type) {
          return this.flattenFields(type, typesMap, this.concatPrefix(prefix, f.name), [...parents, type])
        }
      }
      return []
    })
  }

  private concatPrefix(prefix: string, name: string): string {
    //return `${prefix}${prefix.length === 0 ? name : toFirstUpper(name)}`
    return `${prefix}${prefix.length === 0 ? name : '_' + name}`
  }
}
