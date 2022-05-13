import { Types } from '@graphql-codegen/plugin-helpers'

export type GenerateConfig = {
  output?: string
  codegenConfig?: Record<string, unknown>
}

export type GenerateGraphQLOperations = {
  operations: boolean | GenerateConfig
  resolvers: boolean | (GenerateConfig & { resolversTypesImport?: string; ormImport?: string })
  resolversTypes: boolean | (GenerateConfig & { typesImport?: string; ormImport?: string })
  context?: {
    type: string
    path: string
  }
}

export type GenerateORM = GenerateConfig & {
  typesImport?: string
}

export type Config = {
  schema?: Types.Schema | Types.Schema[]
  outputDir?: string
  generateTypes?: boolean | GenerateConfig
  generateORM?: boolean | GenerateORM
  generateGraphQLOperations?: boolean | GenerateGraphQLOperations
  scalars?: Record<string, string>[]
  typettaGeneratorPath?: string
}
