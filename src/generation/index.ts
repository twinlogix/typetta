import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGenerator } from './generators/dao-generator'
import { InputTypettaGenerator } from './generators/input-generator'
import { ResolverTypettaGenerator } from './generators/resolver-generator'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from './types'
import { TsTypettaVisitor } from './visitor'
import { Types, PluginFunction, PluginValidateFn, oldVisit } from '@graphql-codegen/plugin-helpers'
import { transformSchemaAST } from '@graphql-codegen/schema-ast'
import { GraphQLSchema } from 'graphql'
import { isObject } from 'lodash'
import { extname } from 'path'

export const plugin: PluginFunction<TypeScriptTypettaPluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptTypettaPluginConfig): Promise<string> => {
  const { ast } = transformSchemaAST(schema, config)

  const generators = {
    dao: () => new TsTypettaGenerator(config),
    operations: () => new InputTypettaGenerator(config),
    resolvers: () => new ResolverTypettaGenerator(config),
  }
  if (config.generationOutput) {
    const visitor = new TsTypettaVisitor(schema, config)
    const visitorResult = oldVisit(ast, { leave: visitor as any })
    const definitions: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[] = visitorResult.definitions.filter(
      (d: unknown) => isObject(d) && ((d as TsTypettaGeneratorNode).type || (d as TsTypettaGeneratorScalar).type),
    )
    const generator = generators[config.generationOutput]()
    return generator.generate(definitions)
  } else {
    throw new Error(`config.generationOutput must be one of this values: ['dao', 'operations', 'resolvers']. '${config.generationOutput}' is not a valid value.`)
  }
}

export const validate: PluginValidateFn<TypeScriptTypettaPluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptTypettaPluginConfig, outputFile: string) => {
  if (config.generationOutput === 'dao') {
    if (config.defaultIdGenerationStrategy != null) {
      const validIdGenerationStrategy = ['db', 'generator', 'user']
      if (!validIdGenerationStrategy.includes(config.defaultIdGenerationStrategy)) {
        throw new Error(`config.defaultIdGenerationStrategy must be one of this values: ${JSON.stringify(validIdGenerationStrategy)}. '${config.defaultIdGenerationStrategy}' is not a valid value.`)
      }
    }
    if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
      throw new Error(`Plugin "typescript-typetta" requires extension to be ".ts" or ".tsx" when config.generationOutput is "dao"`)
    }
  } else if (config.generationOutput === 'operations') {
    if (extname(outputFile) !== '.ts') {
      throw new Error(`Plugin "typescript-typetta" requires extension to be ".ts" when config.generationOutput is "operations"`)
    }
  } else if (config.generationOutput === 'resolvers') {
    if (extname(outputFile) !== '.ts') {
      throw new Error(`Plugin "typescript-typetta" requires extension to be ".graphql" when config.generationOutput is "resolvers"`)
    }
  } else {
    throw new Error(`config.generationOutput must be one of this values: ['dao', 'operations', 'resolvers']. '${config.generationOutput}' is not a valid value.`)
  }
}
