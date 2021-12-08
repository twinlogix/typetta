export type SchemaField<ScalarsType> = ({ scalar: keyof ScalarsType } | { embedded: Schema<ScalarsType> }) & { array?: boolean; required?: boolean; alias?: string }

export type Schema<ScalarsType> = { [key: string]: SchemaField<ScalarsType> }
