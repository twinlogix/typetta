import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../../drivers.types'
import BigNumber from 'bignumber.js'

export type DefaultKnexJsScalars = {
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Decimal: string
  JSON: string
}

export type KnexJSDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = DataTypeAdapterMap<ModelScalars, DefaultKnexJsScalars>

const adapters: KnexJSDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter,
  Boolean: identityAdapter,
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

export default adapters
