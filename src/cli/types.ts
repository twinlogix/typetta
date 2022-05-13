import { Types } from '@graphql-codegen/plugin-helpers'

export type GenerateConfig = {
  output?: string
  codegenConfig?: Record<string, unknown>
}

export type GenerateGraphQLOperations = {
  operations: boolean | GenerateConfig
  resolvers: boolean | GenerateConfig
  resolversTypes: boolean | GenerateConfig
  context?: {
    type: string
    path: string
  }
}

export type Config = {
  schema?: Types.Schema | Types.Schema[]
  outputDir: string
  generateTypes?: boolean | GenerateConfig
  generateORM?: boolean | GenerateConfig
  generateGraphQLOperations?: boolean | GenerateGraphQLOperations
  scalars?: Record<string, string>[]
  typettaGeneratorPath?: string
}
