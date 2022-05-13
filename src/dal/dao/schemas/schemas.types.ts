export type SchemaField<ScalarsType> = Readonly<
  ({ scalar: keyof ScalarsType } | { embedded: Schema<ScalarsType> }) & {
    array?: boolean
    required?: boolean
    alias?: string
    defaultGenerationStrategy?: 'middleware' | 'generator'
    metadata?: { key: string; value: string }[]
  }
>

export type Schema<ScalarsType> = Readonly<{ [key: string]: SchemaField<ScalarsType> }>
