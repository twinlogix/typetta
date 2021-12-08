import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGenerator } from './generator'
import { TsMongooseVisitor } from './visitor'
import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers'
import { printSchemaWithDirectives } from '@graphql-toolkit/common'
import { parse, visit, GraphQLSchema } from 'graphql'
import { extname } from 'path'

export const plugin: PluginFunction<TypeScriptTypettaPluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptTypettaPluginConfig): Promise<string> => {
  const printedSchema = printSchemaWithDirectives(schema)
  const astNode = parse(printedSchema)

  const visitor = new TsMongooseVisitor(schema, config)
  const visitorResult = visit(astNode, { leave: visitor as any })

  const generator = new TsTypettaGenerator(config)
  return generator.generate(visitorResult.definitions)
}

export const validate: PluginValidateFn<any> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: any, outputFile: string) => {
  if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
    throw new Error(`Plugin "typescript-typetta" requires extension to be ".ts" or ".tsx"!`)
  }
}
