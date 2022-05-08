import { Types } from '@graphql-codegen/plugin-helpers'

export type Config = {
  schema?: Types.Schema | Types.Schema[]
  outputDir: string
  generateTypes?:
    | boolean
    | {
        codegenConfig?: Types.ConfiguredOutput
      }
  generateORM?:
    | boolean
    | {
        codegenConfig?: Types.ConfiguredOutput
      }
  generateGraphQLOperations?:
    | boolean
    | {
        contextType?: string
        codegenConfig?: Types.ConfiguredOutput
        daoContextPath?: string
      }
  scalars?: Record<string, string>[]
  typettaGeneratorPath?: string
}
