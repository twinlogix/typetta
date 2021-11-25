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

export enum Directives {
  ID = 'id',
  MONGO_ENTITY = 'mongoEntity',
  SQL_ENTITY = 'sqlEntity',
  EMBEDDED = 'embedded',
  INNER_REF = 'innerRef',
  FOREIGN_REF = 'foreignRef',
  EXCLUDE = 'exclude',
  GEOPOINT = 'geopoint'
}
