type Decorators = {
  isId?: boolean
  array?: boolean
  required?: boolean
  arrayElementsRequired?: boolean
  alias?: string
  defaultGenerationStrategy?: 'middleware' | 'generator'
  metadata?: Record<string, string>
}
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
