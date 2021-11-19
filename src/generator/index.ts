import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers'
import { parse, visit, GraphQLSchema } from 'graphql'
import { printSchemaWithDirectives } from '@graphql-toolkit/common'
import { extname } from 'path'
import { TsMongooseVisitor } from './visitor'
import { TypeScriptMongoosePluginConfig, Directives } from './config'
import { TsMongooseGenerator } from './generator'

export const plugin: PluginFunction<TypeScriptMongoosePluginConfig> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptMongoosePluginConfig): Promise<string> => {
  const printedSchema = printSchemaWithDirectives(schema)
  const astNode = parse(printedSchema)

  const visitor = new TsMongooseVisitor(schema, config)
  const visitorResult = visit(astNode, { leave: visitor as any })

  const generator = new TsMongooseGenerator(config)
  return generator.generate(visitorResult.definitions)
}

export const DIRECTIVES = `
  directive @${Directives.ID}(auto: Boolean) on FIELD_DEFINITION
  directive @${Directives.ENTITY}(collection: String) on INTERFACE | OBJECT 
  directive @${Directives.EMBEDDED} on FIELD_DEFINITION
  directive @${Directives.INNER_REF}(refFrom: String, refTo: String) on FIELD_DEFINITION
  directive @${Directives.FOREIGN_REF}(refFrom: String!, refTo: String) on FIELD_DEFINITION
  directive @${Directives.EXCLUDE} on INTERFACE | OBJECT | FIELD_DEFINITION
`

export const addToSchema = DIRECTIVES

export const validate: PluginValidateFn<any> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: any, outputFile: string) => {
  if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
    throw new Error(`Plugin "typescript-mongoose" requires extension to be ".ts" or ".tsx"!`)
  }
}
