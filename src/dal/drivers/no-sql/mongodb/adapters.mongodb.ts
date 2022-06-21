import { AbstractScalars } from '../../../..'
import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'
import { Double, Int32 } from 'bson'

export type DefaultMongoDBScalars = {
  String: { type: string; isTextual: true; isQuantitative: false }
  Boolean: { type: boolean; isTextual: false; isQuantitative: false }
  Int: { type: Int32; isTextual: false; isQuantitative: true }
  Float: { type: Double; isTextual: false; isQuantitative: true }
}

export type MongoDBDataTypeAdapterMap<ModelScalars extends AbstractScalars> = DataTypeAdapterMap<ModelScalars, DefaultMongoDBScalars>

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
