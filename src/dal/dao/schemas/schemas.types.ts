import { IdGenerationStrategy } from '../dao.types'

type Decorators = {
  isList?: boolean
  required?: boolean
  isListElementRequired?: boolean
  alias?: string
  metadata?: Record<string, string>
  isEnum?: boolean
} & (
  | {
      isId: true
      generationStrategy: IdGenerationStrategy
    }
  | { isId?: false; generationStrategy?: 'middleware' | 'generator' }
)
export type SchemaField<ScalarsType> = Readonly<
  (
    | { type: 'scalar'; scalar: keyof ScalarsType }
    | { type: 'embedded'; schema: () => Schema<ScalarsType> }
    | (
        | { type: 'relation'; relation: 'inner'; schema: () => Schema<ScalarsType>; refFrom: string; refTo: string; dao: string }
        | { type: 'relation'; relation: 'foreign'; schema: () => Schema<ScalarsType>; refFrom: string; refTo: string; dao: string }
        | {
            type: 'relation'
            relation: 'relationEntity'
            schema: () => Schema<ScalarsType>
            relationEntity: {
              schema: () => Schema<ScalarsType>
              dao: string
            }
            refThis: {
              refFrom: string
              refTo: string
            }
            refOther: {
              refFrom: string
              refTo: string
              dao: string
            }
          }
      )
  ) &
    Decorators
>

export type Schema<ScalarsType> = Readonly<{ [key: string]: SchemaField<ScalarsType> }>

export type AbstractASTElement<Entities extends string, Scalars extends string> = {
  [K in string]: ({ type: 'relation'; relation: 'foreign' | 'inner' | 'relationEntity'; astName: Entities } | { type: 'scalar'; astName: Scalars } | { type: 'embedded'; astName: Entities }) & {
    isList: boolean
    isRequired: boolean
    isListElementRequired: boolean
    isExcluded: boolean
  } & ({ isId: false; generationStrategy: 'undefined' | 'middleware' | 'generator' } | { isId: true; generationStrategy: 'undefined' | 'user' | 'db' | 'generator' })
}

export type AbstractAST<Entities extends string, Scalars extends string> = {
  [K in Entities]: AbstractASTElement<Entities, Scalars>
}

export type EmbeddedFields<Entity extends string, AST extends AbstractAST<string, string>> = {
  [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends 'embedded' ? Field : never
}[keyof AST[Entity]]