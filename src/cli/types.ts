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
        context?: {
          type: string
          path: string
        }
        operationsCodegenConfig?: Types.ConfiguredOutput
        resolversCodegenConfig?: Types.ConfiguredOutput
        resolversTypesCodegenConfig?: Types.ConfiguredOutput
      }
  scalars?: Record<string, string>[]
  typettaGeneratorPath?: string
}
