import { TypeScriptTypettaPluginConfig } from '../config'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from '../types'
import { toFirstLower } from '../utils'

export class ResolverTypettaGenerator extends TypettaGenerator {
  constructor(config: TypeScriptTypettaPluginConfig) {
    super(config)
  }

  public async generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): Promise<string> {
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
    return `${toFirstLower(node.name)}s: (parent, args, context, info) => ${this.entityManagerPath()}.${toFirstLower(node.name)}.resolvers.read(args, info),`
  }

  private generateMutation(node: TsTypettaGeneratorNode): string {
    return `create${node.name}: async (parent, args, context, info) => ${this.entityManagerPath()}.${toFirstLower(node.name)}.resolvers.create(args, info),
    update${node.name}s: async (parent, args, context) => ${this.entityManagerPath()}.${toFirstLower(node.name)}.resolvers.update(args),
    delete${node.name}s: async (parent, args, context) => ${this.entityManagerPath()}.${toFirstLower(node.name)}.resolvers.delete(args),`
  }

  private entityManagerPath(): string {
    return this.config.entityManagerPath ? `context.${this.config.entityManagerPath}` : 'context'
  }
}
