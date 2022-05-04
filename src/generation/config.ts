import { IdGenerationStrategy } from '..'
import { RawConfig } from '@graphql-codegen/visitor-plugin-common'

export interface TypeScriptTypettaPluginConfig extends RawConfig {
  generationOutput?: 'dao' | 'inputs' | 'resolvers'

  /**
   * @name tsTypesImport
   * @type string
   * @default ./types
   * @description Customize the import of Typescript types generated with @graphql-codegen/typescript.
   *
   */

  tsTypesImport?: string
  /**
   * @name typettaImport
   * @type string
   * @default @twinlogix/typetta
   * @description Customize the import of Typetta, useful for Typetta tests.
   *
   */
  typettaImport?: string

  /**
   * @name defaultIdGenerationStrategy
   * @type string
   * @default generator
   * @description Customize the default id generation strategy
   *
   */
  defaultIdGenerationStrategy?: IdGenerationStrategy

  /**
   * @name daoContextPath
   * @type string
   * @default context
   * @description Customize path to access the DAOContext from resolver context. Needed for resolvers generation.
   *
   */
  daoContextPath?: string

  /**
   * @name daoContextPath
   * @type string
   * @default undefined
   * @description Customize the import DAOContext. Needed for resolvers generation.
   *
   */
  daoImport?: string
}
