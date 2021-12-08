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
}