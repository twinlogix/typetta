import { MongoDBDataTypeAdapterMap } from './no-sql/mongodb/adapters.mongodb'
import { KnexJSDataTypeAdapterMap } from './sql/knexjs/adapters.knexjs'
import BigNumber from 'bignumber.js'

export type DefaultModelScalars = {
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Decimal: BigNumber
  JSON: any
}

export type DataTypeAdapterMap<ModelScalars extends object, DBScalars extends object> = {
  [key in keyof ModelScalars]: DBScalars extends Record<key, unknown> ? DataTypeAdapter<ModelScalars[key], DBScalars[key]> : DataTypeAdapter<ModelScalars[key], unknown>
}

export type DataTypeAdapter<ModelType, DBType> = {
  modelToDB: (data: ModelType) => DBType
  dbToModel: (data: DBType) => ModelType
}

export type DriverDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = {
  knexjs: KnexJSDataTypeAdapterMap<ModelScalars>
  mongodb: MongoDBDataTypeAdapterMap<ModelScalars>
}

export const identityAdapter: DataTypeAdapter<any, any> = {
  dbToModel: (o: unknown) => o,
  modelToDB: (o: unknown) => o,
}
