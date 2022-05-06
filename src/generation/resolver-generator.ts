import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from './types'
import { toFirstLower } from './utils'

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

    return [
      this.generateImports(),
      `export const resolvers: { Mutation: types.MutationResolvers; Query: types.QueryResolvers } = {
          Query: {
            ${this.generateQueries(typeNodes)}
          },
          Mutation: {
            ${this.generateMutations(typeNodes)}
          }
        }`,
    ].join('\n')
  }

  private generateImports(): string {
    return `import * as types from '${this.config.tsTypesImport}'`
  }

  private generateQueries(nodes: TsTypettaGeneratorNode[]): string {
    return nodes.map((n) => this.generateQuery(n)).join('\n')
  }

  private generateMutations(nodes: TsTypettaGeneratorNode[]): string {
    return nodes.map((n) => this.generateMutation(n)).join('\n')
  }

  private generateQuery(node: TsTypettaGeneratorNode): string {
    return `${toFirstLower(node.name)}s: (parent, args, context, info) => ${this.daoContextPath()}.${toFirstLower(node.name)}.resolvers.read(args, info),`
  }

  private generateMutation(node: TsTypettaGeneratorNode): string {
    return `create${node.name}: async (parent, args, context, info) => ${this.daoContextPath()}.${toFirstLower(node.name)}.resolvers.create(args, info),
    update${node.name}s: async (parent, args, context) => ${this.daoContextPath()}.${toFirstLower(node.name)}.resolvers.update(args),
    delete${node.name}s: async (parent, args, context) => ${this.daoContextPath()}.${toFirstLower(node.name)}.resolvers.delete(args),`
  }

  private daoContextPath(): string {
    return this.config.daoContextPath ? `context.${this.config.daoContextPath}` : 'context'
  }
}
