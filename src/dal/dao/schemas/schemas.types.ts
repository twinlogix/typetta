export type SchemaField<ScalarsType> = ({ scalar: keyof ScalarsType } | { embedded: Schema<ScalarsType> }) & { array?: boolean; required?: boolean }

export type Schema<ScalarsType> = { [key: string]: SchemaField<ScalarsType> }
