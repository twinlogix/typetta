export type Directives = (typeof Directives)[keyof typeof Directives]
export const Directives = {
  ID: 'id',
  ENTITY: 'entity',
  MONGO: 'mongodb',
  SQL: 'sql',
  MEMORY: 'memory',
  EMBEDDED: 'embedded',
  INNER_REF: 'innerRef',
  FOREIGN_REF: 'foreignRef',
  RELATION_ENTITY_REF: 'relationEntityRef',
  EXCLUDE: 'exclude',
  ALIAS: 'alias',
  DEFAULT: 'default',
  QUANTITY_SCALAR: 'quantitative',
  STRING_SCALAR: 'textual',
}
