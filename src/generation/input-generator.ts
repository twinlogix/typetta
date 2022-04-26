import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
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

    //TODO: what for scalar ID?
    const customScalars = this.generateCustomScalarFilter(customScalarsMap)
    return [
      this.defaultInput(),
      customScalars,
      ...nodes.flatMap((n) => {
        if (n.type === 'scalar' || !n.entity) {
          return []
        }

        const filter = this.generateFilter(n, typesMap)
        const relationFilter = this.generateRelationsFilter(n)
        const findParams = this.generateFindParams(n)
        return [
          removeEmptyLines(
            [
              `########### ${n.name} ###########`,
              filter,
              relationFilter,
              `input ${n.name}SortsInput { }`,
              `input ${n.name}InsertInput { }`,
              `input ${n.name}UpdateInput { }`,
              findParams,
              `########### ${n.name} ###########`,
            ].join('\n'),
          ),
        ]
      }),
    ].join('\n\n\n')
  }

  private defaultInput(): string {
    return dedent`
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
      }`
  }

  private generateCustomScalarFilter(customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
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

  private generateFilter(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return dedent`
      input ${node.name}FilterInput {
        ${this.generateFilterFields(node, typesMap).join('\n        ')}
        and: [${node.name}FilterInput!]
        or: [${node.name}FilterInput!]
        nor: [${node.name}FilterInput!]
      }`
  }
  private generateFilterFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, prefix = ''): string[] {
    return node.fields.flatMap((f) => {
      if (f.type.kind === 'scalar') {
        return [`${prefix}${prefix.length === 0 ? f.name : toFirstUpper(f.name)}: ${f.graphqlType}FilterInput`]
      }
      if (f.type.kind === 'embedded') {
        const type = typesMap.get(f.graphqlType)
        if (type) {
          return this.generateFilterFields(type, typesMap, f.name)
        }
      }
      return []
    })
  }

  private hasRelations(node: TsTypettaGeneratorNode): boolean {
    return node.fields.some((f) => f.type.kind === 'innerRef' || f.type.kind === 'foreignRef' || f.type.kind === 'relationEntityRef')
  }
  private generateRelationsFilter(node: TsTypettaGeneratorNode): string {
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

  private generateFindParams(node: TsTypettaGeneratorNode): string {
    return dedent`
      input ${node.name}FindInput {
        filter: ${node.name}FilterInput
        sorts: ${node.name}SortsInput
        skip: Int
        limit: Int
        ${this.hasRelations(node) ? `relations: ${node.name}RelationsFilterInput` : ``}
      }`
  }
}
