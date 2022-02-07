export type SchemaField<ScalarsType> = ({ scalar: keyof ScalarsType } | { embedded: Schema<ScalarsType> }) & {
  array?: boolean
  required?: boolean
  alias?: string
  defaultGenerationStrategy?: 'middleware' | 'generator'
}

export type Schema<ScalarsType> = { [key: string]: SchemaField<ScalarsType> }
