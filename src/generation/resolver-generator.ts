import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
import { toFirstLower } from './utils'
import prettier from 'prettier'

export class ResolverTypettaGenerator extends TypettaGenerator {
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
    const typeNodes = nodes.flatMap((n) => (n.type === 'type' && n.entity ? [n] : []))

    const prettierOptions = (await prettier.resolveConfig('./*.ts')) ?? { parser: 'typescript' }
    return prettier.format(
      [
        this.generateImports(),
        `export const resolvers: { Mutation: types.MutationResolvers; Query: types.QueryResolvers } = {
          Query: {
            ${this.generateQueries(typeNodes)}
          },
          Mutation: {
            ${this.generateMutations(typeNodes)}
          }
        }`,
      ].join('\n'),
      prettierOptions,
    )
  }

  private generateImports(): string {
    return `import * as T from '${this.config.typettaImport || '@twinlogix/typetta'}'
    import * as types from '${this.config.tsTypesImport}'
    import * as D from '${this.config.daoImport}'`
  }

  private generateQueries(nodes: TsTypettaGeneratorNode[]): string {
    return nodes.map((n) => this.generateQuery(n)).join('\n')
  }

  private generateMutations(nodes: TsTypettaGeneratorNode[]): string {
    return nodes.map((n) => this.generateMutation(n)).join('\n')
  }

  private generateQuery(node: TsTypettaGeneratorNode): string {
    return `${toFirstLower(node.name)}s: (parent, args, context, info) => {
      const sorts = args.sorts ? args.sorts.map((s) => T.flattenEmbeddeds(s, D.${toFirstLower(node.name)}Schema())) : undefined
      return ${this.daoContextPath()}.${toFirstLower(node.name)}.findAll({ filter: args.filter, skip: args.skip, limit: args.limit,${
      this.hasRelations(node) ? `relations: args.relations, ` : ``
    } sorts, projection: info })
    },`
  }

  private generateMutation(node: TsTypettaGeneratorNode): string {
    return `create${node.name}: async (parent, args, context, info) => {
      const inserted = await ${this.daoContextPath()}.${toFirstLower(node.name)}.insertOne(args)
      const entry = await ${this.daoContextPath()}.${toFirstLower(node.name)}.findOne({ 
        filter: { 
          [${this.daoContextPath()}.${toFirstLower(node.name)}.idField]: inserted[${this.daoContextPath()}.${toFirstLower(node.name)}.idField] 
        }, 
        projection: info 
      })
      if (!entry) {
        throw new Error('Unreachable')
      }
      return entry
    },
    update${node.name}s: async (parent, args, context) => {
      await ${this.daoContextPath()}.${toFirstLower(node.name)}.updateAll({ 
        filter: args.filter, 
        changes: T.flattenEmbeddeds(args.changes, D.${toFirstLower(node.name)}Schema()) 
      })
      return true
    },
    delete${node.name}s: async (parent, args, context) => {
      await ${this.daoContextPath()}.${toFirstLower(node.name)}.deleteAll(args)
      return true
    },`
  }

  private daoContextPath(): string {
    return this.config.daoContextPath ? `context.${this.config.daoContextPath}` : 'context'
  }
}
