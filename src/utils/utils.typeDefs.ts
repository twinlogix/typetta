import { Directives } from '../generation/directives'
import { gql } from 'graphql-tag'

export const typeDefs = gql`
  input RefPointer { refFrom: String, refTo: String }
  input KeyValue { key: String!, value: String! }
  directive @${Directives.ID}(from: String) on FIELD_DEFINITION
  directive @${Directives.ENTITY} on OBJECT
  directive @${Directives.MONGO}(collection: String, source: String) on OBJECT
  directive @${Directives.SQL}(table: String, source: String) on OBJECT
  directive @${Directives.MEMORY} on OBJECT
  directive @${Directives.EMBEDDED} on FIELD_DEFINITION
  directive @${Directives.INNER_REF}(refFrom: String, refTo: String) on FIELD_DEFINITION
  directive @${Directives.FOREIGN_REF}(refFrom: String, refTo: String) on FIELD_DEFINITION
  directive @${Directives.RELATION_ENTITY_REF}(entity: String!, refThis: RefPointer, refOther: RefPointer) on FIELD_DEFINITION
  directive @${Directives.EXCLUDE} on OBJECT | FIELD_DEFINITION
  directive @${Directives.ALIAS}(value: String!) on FIELD_DEFINITION
  directive @${Directives.DEFAULT}(from: String) on FIELD_DEFINITION
  directive @${Directives.QUANTITY_SCALAR} on SCALAR
  directive @${Directives.STRING_SCALAR} on SCALAR
`
