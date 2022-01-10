import { DataTypeAdapter, DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'

export type DefaultKnexJsScalars = {
  String: string
  Boolean: number
  Int: number
  Float: number
}

export type KnexJSDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = DataTypeAdapterMap<ModelScalars, DefaultKnexJsScalars>

export const knexJsAdapters: KnexJSDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter,
  Boolean: {
    dbToModel: (o: number) => (o ? true : false),
    modelToDB: (o: boolean) => (o ? 1 : 0),
  },
  Int: identityAdapter,
  Float: identityAdapter,
}
