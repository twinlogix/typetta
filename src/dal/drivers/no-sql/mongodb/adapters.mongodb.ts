import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'
import BigNumber from 'bignumber.js'
import { Decimal128, Double, Int32 } from 'bson'

export type DefaultMongoDBScalars = {
  String: string
  Boolean: boolean
  Int: Int32
  Float: Double
  Decimal: Decimal128
}

export type MongoDBDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = DataTypeAdapterMap<ModelScalars, DefaultMongoDBScalars>

export const mongoDbAdapters: MongoDBDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter,
  Boolean: identityAdapter,
  Int: {
    dbToModel: (o: Int32) => parseInt(o.toString()),
    modelToDB: (o: number) => new Int32(o),
  },
  Float: {
    dbToModel: (o: Double) => parseInt(o.toString()),
    modelToDB: (o: number) => new Double(o),
  },
  Decimal: {
    dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
    modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
  },
  JSON: identityAdapter
}

