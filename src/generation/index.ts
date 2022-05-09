import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGenerator } from './dao-generator'
import { InputTypettaGenerator } from './input-generator'
import { ResolverTypettaGenerator } from './resolver-generator'
import { TsTypettaVisitor } from './visitor'
import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers'
import { transformSchemaAST } from '@graphql-codegen/schema-ast'
import { visit, GraphQLSchema } from 'graphql'
import { extname } from 'path'

export const plugin: PluginFunction<TypeScriptTypettaPluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptTypettaPluginConfig): Promise<string> => {
  const { ast } = transformSchemaAST(schema, config)

  const visitor = new TsTypettaVisitor(schema, config)
  const visitorResult = visit(ast, { leave: visitor })

  const generator =
    config.generationOutput === 'dao' ? new TsTypettaGenerator(config) : config.generationOutput === 'operations' ? new InputTypettaGenerator(config) : new ResolverTypettaGenerator(config)
  return generator.generate(visitorResult.definitions)
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
