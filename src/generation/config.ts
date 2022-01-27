import { RawConfig } from '@graphql-codegen/visitor-plugin-common'

export interface TypeScriptTypettaPluginConfig extends RawConfig {
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
  typettaImport: string
}
