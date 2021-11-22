
export type SchemaField<ScalarsType> = (
  { scalar: keyof ScalarsType } |
  { embedded: Schema<ScalarsType> }
) & { array?: boolean, required?: boolean }

export type Schema<ScalarsType> = { [key: string]: SchemaField<ScalarsType> };

export type DataTypeAdapter<ScalarsType, Scalar extends keyof ScalarsType, DBType> = {
  scalar: Scalar,
  modelToDB: (data: ScalarsType[Scalar]) => DBType
  dbToModel: (data: DBType) => ScalarsType[Scalar]
}