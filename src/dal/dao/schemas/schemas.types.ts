import { IdGenerationStrategy } from '../dao.types'
import { AbstractScalars } from './ast.types'

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
export type SchemaField<Scalars extends AbstractScalars> = Readonly<
  (
    | { type: 'scalar'; scalar: keyof Scalars }
    | { type: 'embedded'; schema: () => Schema<Scalars> }
    | (
        | { type: 'relation'; relation: 'inner'; schema: () => Schema<Scalars>; refFrom: string; refTo: string; dao: string }
        | { type: 'relation'; relation: 'foreign'; schema: () => Schema<Scalars>; refFrom: string; refTo: string; dao: string }
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

export type Schema<Scalars extends AbstractScalars> = Readonly<{ [key: string]: SchemaField<Scalars> }>
