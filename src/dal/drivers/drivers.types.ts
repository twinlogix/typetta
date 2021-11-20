export type DataTypeAdapter<ModelDataType, DBDataType> = {
  modelToDB: (data?: ModelDataType) => DBDataType | undefined
  dbToModel: (data?: DBDataType) => ModelDataType | undefined
}