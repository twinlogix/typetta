import { AbstractScalars } from '../../..'
import { DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from '../drivers.types'

export type DefaultInMemoryScalars = {
  String: { type: string; isTextual: true; isQuantitative: false }
  Boolean: { type: boolean; isTextual: false; isQuantitative: false }
  Int: { type: number; isTextual: false; isQuantitative: true }
  Float: { type: number; isTextual: false; isQuantitative: true }
}

export type InMemoryDataTypeAdapterMap<ModelScalars extends AbstractScalars> = DataTypeAdapterMap<ModelScalars, DefaultInMemoryScalars>

export const inMemoryAdapters: InMemoryDataTypeAdapterMap<DefaultModelScalars> = {
  String: identityAdapter(),
  Boolean: identityAdapter(),
  Int: identityAdapter(),
  Float: identityAdapter(),
}
