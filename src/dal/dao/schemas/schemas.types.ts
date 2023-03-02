import { IdGenerationStrategy } from '../dao.types'
import { AbstractScalars } from './ast.types'

type Decorators = {
  isList?: boolean
  required?: boolean
  excluded?: boolean
  isListElementRequired?: boolean
  alias?: string
  directives: Record<string, Record<string, unknown>>
  isEnum?: boolean
} & (
  | {
      isId: true
      generationStrategy: IdGenerationStrategy
    }
  | { isId?: false; generationStrategy?: 'middleware' | 'generator' }
)
export type SchemaField<Scalars extends AbstractScalars> = Readonly<
  (
    | { type: 'scalar'; scalar: keyof Scalars }
    | { type: 'embedded'; astName: string; schema: () => Schema<Scalars> }
    | (
        | { type: 'relation'; astName: string; relation: 'inner'; schema: () => Schema<Scalars>; refFrom: string; refTo: string; dao: string }
        | { type: 'relation'; astName: string; relation: 'foreign'; schema: () => Schema<Scalars>; refFrom: string; refTo: string; dao: string }
        | {
            type: 'relation'
            relation: 'relationEntity'
            schema: () => Schema<Scalars>
            relationEntity: {
              schema: () => Schema<Scalars>
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

export type Schema<Scalars extends AbstractScalars = AbstractScalars> = Readonly<{ [key: string]: SchemaField<Scalars> }>
