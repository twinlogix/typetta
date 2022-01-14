import { TypeScriptTypettaPluginConfig } from './config'
import { TsTypettaGenerator } from './generator'
import { TsMongooseVisitor } from './visitor'
import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers'
import { visit, GraphQLSchema } from 'graphql'
import { extname } from 'path'
import { transformSchemaAST } from '@graphql-codegen/schema-ast'

export const plugin: PluginFunction<TypeScriptTypettaPluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptTypettaPluginConfig): Promise<string> => {

  const { schema: _schema, ast } = transformSchemaAST(schema, config);

  const visitor = new TsMongooseVisitor(schema, config)
  const visitorResult = visit(ast, { leave: visitor as any })

  const generator = new TsTypettaGenerator(config)
  return generator.generate(visitorResult.definitions)
}

export const validate: PluginValidateFn<any> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: any, outputFile: string) => {
  if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
    throw new Error(`Plugin "typescript-typetta" requires extension to be ".ts" or ".tsx"!`)
  }
}
