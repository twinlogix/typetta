import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../drivers.types'
import { Double, Int32 } from 'bson'

export type DefaultInMemoryScalars = {
  String: string
  Boolean: boolean
  Int: Int32
  Float: Double
}

export type InMemoryDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = DataTypeAdapterMap<ModelScalars, DefaultInMemoryScalars>

export const inMemoryAdapters: InMemoryDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter,
  Boolean: identityAdapter,
  Int: identityAdapter,
  Float: identityAdapter,
}
