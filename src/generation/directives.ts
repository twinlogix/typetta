export enum Directives {
  ID = 'id',
  MONGO_ENTITY = 'mongoEntity',
  SQL_ENTITY = 'sqlEntity',
  EMBEDDED = 'embedded',
  INNER_REF = 'innerRef',
  FOREIGN_REF = 'foreignRef',
  EXCLUDE = 'exclude',
  ALIAS = 'alias',
  GEOPOINT = 'geopoint',
}

export const DIRECTIVES = `
  directive @${Directives.ID}(auto: Boolean) on FIELD_DEFINITION
  directive @${Directives.MONGO_ENTITY}(collection: String) on OBJECT
  directive @${Directives.SQL_ENTITY}(table: String) on OBJECT
  directive @${Directives.EMBEDDED} on FIELD_DEFINITION
  directive @${Directives.INNER_REF}(refFrom: String, refTo: String) on FIELD_DEFINITION
  directive @${Directives.FOREIGN_REF}(refFrom: String!, refTo: String) on FIELD_DEFINITION
  directive @${Directives.EXCLUDE} on OBJECT | FIELD_DEFINITION
  directive @${Directives.ALIAS}(value: String!) on FIELD_DEFINITION
  directive @${Directives.GEOPOINT} on SCALAR
`