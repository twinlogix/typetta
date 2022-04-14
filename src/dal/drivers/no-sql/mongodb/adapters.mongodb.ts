import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'
import { Double, Int32 } from 'bson'

export type DefaultMongoDBScalars = {
  String: string
  Boolean: boolean
  Int: Int32
  Float: Double
}

export type MongoDBDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = DataTypeAdapterMap<ModelScalars, DefaultMongoDBScalars>

export const mongoDbAdapters: MongoDBDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter(),
  Boolean: identityAdapter(),
  Int: {
    dbToModel: (o: Int32) => o.valueOf(),
    modelToDB: (o: number) => new Int32(o),
  },
  Float: {
    dbToModel: (o: Double) => o.valueOf(),
    modelToDB: (o: number) => new Double(o),
  },
}
