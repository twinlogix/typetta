import { AbstractScalars } from '../..'

export type DefaultModelScalars = {
  String: { type: string; isTextual: true; isQuantitative: false }
  Boolean: { type: boolean; isTextual: false; isQuantitative: false }
  Int: { type: number; isTextual: false; isQuantitative: true }
  Float: { type: number; isTextual: false; isQuantitative: true }
}

export type DataTypeAdapterMap<ModelScalars extends AbstractScalars, DBScalars extends AbstractScalars> = {
  [K in keyof ModelScalars]: K extends keyof DBScalars ? DataTypeAdapter<ModelScalars[K]['type'], DBScalars[K]['type']> : DataTypeAdapter<ModelScalars[K]['type'], unknown>
}

export type DataTypeAdapter<ModelType, DBType> = {
  modelToDB: (data: ModelType) => Promise<DBType> | DBType
  dbToModel: (data: DBType) => Promise<ModelType> | ModelType
  validate?: (data: ModelType) => Promise<Error | true> | Error | true
  generate?: () => Promise<ModelType> | ModelType
}

export function identityAdapter<T>(): DataTypeAdapter<T, T> {
  return {
    dbToModel: (o: T) => o,
    modelToDB: (o: T) => o,
  }
}
