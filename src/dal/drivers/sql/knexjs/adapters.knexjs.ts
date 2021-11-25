import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'
import BigNumber from 'bignumber.js'

export type DefaultKnexJsScalars = {
  String: string
  Boolean: number
  Int: number
  Float: number
  Decimal: string
  JSON: string
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
  Decimal: {
    dbToModel: (o: string) => new BigNumber(o.toString()),
    modelToDB: (o: BigNumber) => o.toString(),
  },
  JSON: {
    dbToModel: (o: string) => JSON.parse(o),
    modelToDB: (o: any) => JSON.stringify(o),
  },
}
