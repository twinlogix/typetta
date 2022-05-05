import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
import { removeEmptyLines, toFirstLower } from './utils'
import prettier from 'prettier'

export class InputTypettaGenerator extends TypettaGenerator {
  constructor(config: TypeScriptTypettaPluginConfig) {
    super(config)
  }

  public async generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): Promise<string> {
    const customScalarsMap = new Map<string, TsTypettaGeneratorScalar>()
    const typesMap = new Map<string, TsTypettaGeneratorNode>()
    nodes.forEach((node) => {
      if (node.type === 'scalar') {
        customScalarsMap.set(node.name, node)
      } else {
        typesMap.set(node.name, node)
      }
    })

    const customScalars = this.generateCustomScalars(customScalarsMap)
    const customScalarsFilterInput = this.generateCustomScalarFilterInput(customScalarsMap)
    return prettier.format(
      [
        this.defaultInput(),
        customScalars,
        customScalarsFilterInput,
        ...nodes
          .filter((n) => n.name !== 'Query' && n.name !== 'Mutation')
          .flatMap((n) => {
            if (n.type === 'scalar') {
              return []
            }
            const delimiter = `########### ${n.name} ###########`
            const insertInput = this.generateInsertInput(n, typesMap)
            const updateInput = this.generateUpdateInput(n, typesMap)
            const sortInput = this.generateSortInput(n, typesMap)
            const enitityInputs = (() => {
              if (n.entity) {
                const filterInput = this.generateFilterInput(n, typesMap)
                const relationFilterInput = this.generateRelationsFilterInput(n)
                const findInput = this.generateFindInput(n)
                return [filterInput, relationFilterInput, findInput]
              } else {
                return []
              }
            })()
            return [removeEmptyLines([delimiter, insertInput, updateInput, sortInput, ...enitityInputs, delimiter].join('\n'))]
          }),
        this.generateQuery(typesMap),
        this.generateMutation(typesMap),
      ].join('\n\n'),
      {
        parser: 'graphql',
      },
    )
  }

  private defaultInput(): string {
    return `
      enum SortDirection {
        asc
        desc
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

  private generateCustomScalars(customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
    return Array.from(customScalarsMap.values())
      .map((s) => `scalar ${s.name}`)
      .join('\n')
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
        return removeEmptyLines(`
          input ${s.name}FilterInput {
            eq: ${s.name}
            ne: ${s.name}
            in: [${s.name}!]
            nin: [${s.name}!]
            exists: Boolean
            ${additionalFields.join('\n')}
          }`)
      })
      .join('\n\n')
  }

  private generateFilterInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return `
      input ${node.name}FilterInput {
        ${this.flattenFields(node, typesMap)
          .filter((r) => r.kind === 'leaf' && r.parents.length === 0)
          .map((r) => `${r.name}: ${r.field.graphqlType}FilterInput`)
          .join('\n')}
      }`
    //and: [${node.name}FilterInput!]
    //or: [${node.name}FilterInput!]
    //nor: [${node.name}FilterInput!]
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
    return `
      input ${node.name}RelationsFilterInput {
        ${fields.join('\n')}
      }`
  }

  private generateSortInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return `
      input ${node.name}SortInput {
        ${this.flattenFields(node, typesMap)
          .filter((r) => r.parents.length === 0)
          .map((r) => {
            if (r.kind === 'leaf') {
              return `${r.name}: SortDirection`
            } else {
              return `${r.name}: ${r.node.name}SortInput`
            }
          })
          .join('\n')}
      }`
  }

  private generateUpdateInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return `
      input ${node.name}UpdateInput {
        ${this.flattenFields(node, typesMap)
          .filter((r) => r.parents.length === 0)
          .map((r) => {
            if (r.field.isID) return ''
            if (r.kind === 'leaf') {
              return `${r.name}: ${r.field.graphqlType}`
            } else {
              return `${r.name}: ${r.node.name}UpdateInput`
            }
          })
          .join('\n')}
      }`
  }

  private generateInsertInput(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return `
      input ${node.name}InsertInput {
        ${this.flattenFields(node, typesMap)
          .filter((r) => r.parents.length === 0)
          .flatMap((r) => {
            if ((r.field.isID && r.field.idGenerationStrategy === 'db') || r.field.isExcluded) {
              return []
            }
            const type = r.kind === 'leaf' ? r.field.graphqlType : `${r.field.graphqlType}InsertInput`
            const t = r.field.isList ? `[${type}${r.field.isListElementRequired ? '!' : ''}]` : r.field.graphqlType
            const required = (r.field.isID && r.field.idGenerationStrategy === 'user') || (!r.field.isID && r.field.isRequired && !r.field.defaultGenerationStrategy)
            return [`${r.name}: ${t}${required ? '!' : ''}`]
          })
          .join('\n')}
      }`
  }

  private generateFindInput(node: TsTypettaGeneratorNode): string {
    return `
      input ${node.name}FindInput {
        filter: ${node.name}FilterInput
        sorts: [${node.name}SortInput!]
        skip: Int
        limit: Int
        ${this.hasRelations(node) ? `relations: ${node.name}RelationsFilterInput` : ''}
      }`
  }

  private generateQuery(typesMap: Map<string, TsTypettaGeneratorNode>) {
    const enitityNodes = [...typesMap.values()].filter((n) => n.entity)
    return `
    type Query {
      ${enitityNodes
        .map((n) => {
          return `${toFirstLower(n.name)}s(filter: ${n.name}FilterInput, sorts: [${n.name}SortInput!], ${this.hasRelations(n) ? `relations: ${n.name}RelationsFilterInput, ` : ''}skip: Int, limit: Int): [${n.name}!]!`
        })
        .join('\n')}
    }`
  }

  private generateMutation(typesMap: Map<string, TsTypettaGeneratorNode>) {
    const enitityNodes = [...typesMap.values()].filter((n) => n.entity)
    return `
    type Mutation {
      ${enitityNodes
        .flatMap((n) => {
          return [
            `create${n.name}(record: ${n.name}InsertInput!): ${n.name}!`,
            `update${n.name}s(filter: ${n.name}FilterInput!, changes: ${n.name}UpdateInput!): Boolean`,
            `delete${n.name}s(filter: ${n.name}FilterInput!): Boolean`,
          ]
        })
        .join('\n')}
    }`
  }

  private flattenFields(
    node: TsTypettaGeneratorNode,
    typesMap: Map<string, TsTypettaGeneratorNode>,
    prefix = '',
    parents: TsTypettaGeneratorNode[] = [],
  ): (
    | { kind: 'leaf'; field: TsTypettaGeneratorField; name: string; parents: TsTypettaGeneratorNode[] }
    | { kind: 'node'; field: TsTypettaGeneratorField; node: TsTypettaGeneratorNode; name: string; parents: TsTypettaGeneratorNode[] }
  )[] {
    return node.fields.flatMap((field) => {
      if (field.type.kind === 'scalar') {
        return [{ kind: 'leaf', name: this.concatPrefix(prefix, field.name), field, parents }]
      }
      if (field.type.kind === 'embedded') {
        const node = typesMap.get(field.graphqlType)
        if (node) {
          return [{ kind: 'node', node, name: this.concatPrefix(prefix, field.name), field, parents }, ...this.flattenFields(node, typesMap, this.concatPrefix(prefix, field.name), [...parents, node])]
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
