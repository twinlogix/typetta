export type DataTypeAdapter<ScalarsType, Scalar extends keyof ScalarsType, DBType> = {
  scalar: Scalar,
  modelToDB: (data: ScalarsType[Scalar]) => DBType
  dbToModel: (data: DBType) => ScalarsType[Scalar]
}