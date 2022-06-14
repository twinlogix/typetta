import { AbstractScalars } from '../../../..'
import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'

export type DefaultKnexJsScalars = {
  String: { type: string; isTextual: true; isQuantitative: false }
  Boolean: { type: number; isTextual: false; isQuantitative: false }
  Int: { type: number; isTextual: false; isQuantitative: true }
  Float: { type: number; isTextual: false; isQuantitative: true }
}

export type KnexJSDataTypeAdapterMap<ModelScalars extends AbstractScalars> = DataTypeAdapterMap<ModelScalars, DefaultKnexJsScalars>

export const knexJsAdapters: KnexJSDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter(),
  Boolean: {
    dbToModel: (o: number) => (o ? true : false),
    modelToDB: (o: boolean) => (o ? 1 : 0),
  },
  Int: identityAdapter(),
  Float: identityAdapter(),
}
