import { AbstractScalars } from '../..'
import { DataTypeAdapter, DataTypeAdapterMap, DefaultModelScalars, identityAdapter } from './drivers.types'
import { inMemoryAdapters, InMemoryDataTypeAdapterMap } from './in-memory/adapters.memory'
import { DefaultMongoDBScalars, mongoDbAdapters, MongoDBDataTypeAdapterMap } from './no-sql/mongodb/adapters.mongodb'
import { DefaultKnexJsScalars, knexJsAdapters, KnexJSDataTypeAdapterMap } from './sql/knexjs/adapters.knexjs'

export declare type UserInputDriverDataTypeAdapterMap<ModelScalars extends AbstractScalars> = Omit<
  {
    [key in keyof ModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key]['type'], unknown, unknown>
  },
  keyof DefaultModelScalars
> & {
  [key in keyof DefaultModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key]['type'], DefaultMongoDBScalars[key]['type'], DefaultKnexJsScalars[key]['type']>
}

export type DriverDataTypeAdapterMap<ModelScalars extends AbstractScalars> = {
  knex: KnexJSDataTypeAdapterMap<ModelScalars>
  mongo: MongoDBDataTypeAdapterMap<ModelScalars>
  memory: InMemoryDataTypeAdapterMap<ModelScalars>
  cache: DataTypeAdapterMap<ModelScalars, Record<string, never>>
}

export type UserInputDataTypeAdapter<ModelType, MongoDBType, KenxDBType> = Partial<DataTypeAdapter<ModelType, KenxDBType | MongoDBType>> & {
  knex?: Partial<DataTypeAdapter<ModelType, KenxDBType>>
  mongo?: Partial<DataTypeAdapter<ModelType, MongoDBType>>
  memory?: Partial<DataTypeAdapter<ModelType, MongoDBType>>
  cache?: Partial<DataTypeAdapter<ModelType, string>>
}

export function userInputDataTypeAdapterToDataTypeAdapter<ModelScalars extends DefaultModelScalars>(
  input: UserInputDriverDataTypeAdapterMap<ModelScalars>,
  scalars: string[],
): DriverDataTypeAdapterMap<ModelScalars> {
  const mappedInput = { ...scalars.reduce((p, s) => ({ ...p, [s]: {} }), {}), ...input }
  const knex = Object.entries(mappedInput).reduce<KnexJSDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
    const oldAdapter = map[scalarName as keyof ModelScalars]
    return {
      ...map,
      [scalarName]: {
        modelToDB: adapter.knex?.modelToDB ?? adapter.modelToDB ?? oldAdapter?.modelToDB ?? identityAdapter().modelToDB,
        dbToModel: adapter.knex?.dbToModel ?? adapter.dbToModel ?? oldAdapter?.dbToModel ?? identityAdapter().dbToModel,
        validate: adapter.knex?.validate ?? adapter.validate ?? oldAdapter?.validate ?? identityAdapter()?.validate,
        generate: adapter.knex?.generate ?? adapter.generate ?? oldAdapter?.generate ?? identityAdapter()?.generate,
      },
    } as KnexJSDataTypeAdapterMap<ModelScalars>
  }, knexJsAdapters as KnexJSDataTypeAdapterMap<ModelScalars>)
  const mongo = Object.entries(mappedInput).reduce<MongoDBDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
    const oldAdapter = map[scalarName as keyof ModelScalars]
    return {
      ...map,
      [scalarName]: {
        modelToDB: adapter.mongo?.modelToDB ?? adapter.modelToDB ?? oldAdapter?.modelToDB ?? identityAdapter().modelToDB,
        dbToModel: adapter.mongo?.dbToModel ?? adapter.dbToModel ?? oldAdapter?.dbToModel ?? identityAdapter().dbToModel,
        validate: adapter.mongo?.validate ?? adapter.validate ?? oldAdapter?.validate ?? identityAdapter()?.validate,
        generate: adapter.mongo?.generate ?? adapter.generate ?? oldAdapter?.generate ?? identityAdapter()?.generate,
      },
    } as MongoDBDataTypeAdapterMap<ModelScalars>
  }, mongoDbAdapters as MongoDBDataTypeAdapterMap<ModelScalars>)
  const memory = Object.entries(mappedInput).reduce<InMemoryDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
    const oldAdapter = map[scalarName as keyof ModelScalars]
    return {
      ...map,
      [scalarName]: {
        modelToDB: adapter.memory?.modelToDB ?? adapter.modelToDB ?? oldAdapter?.modelToDB ?? identityAdapter().modelToDB,
        dbToModel: adapter.memory?.dbToModel ?? adapter.dbToModel ?? oldAdapter?.dbToModel ?? identityAdapter().dbToModel,
        validate: adapter.memory?.validate ?? adapter.validate ?? oldAdapter?.validate ?? identityAdapter()?.validate,
        generate: adapter.memory?.generate ?? adapter.generate ?? oldAdapter?.generate ?? identityAdapter()?.generate,
      },
    } as InMemoryDataTypeAdapterMap<ModelScalars>
  }, inMemoryAdapters as InMemoryDataTypeAdapterMap<ModelScalars>)
  const cache = Object.entries(mappedInput).reduce<DataTypeAdapterMap<ModelScalars, Record<string, never>>>(
    (map, [scalarName, dta]) => {
      const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
      const oldAdapter = map[scalarName as keyof ModelScalars]
      return {
        ...map,
        [scalarName]: {
          modelToDB: adapter.cache?.modelToDB ?? adapter.modelToDB ?? oldAdapter?.modelToDB ?? identityAdapter().modelToDB,
          dbToModel: adapter.cache?.dbToModel ?? adapter.dbToModel ?? oldAdapter?.dbToModel ?? identityAdapter().dbToModel,
          validate: adapter.cache?.validate ?? adapter.validate ?? oldAdapter?.validate ?? identityAdapter()?.validate,
          generate: adapter.cache?.generate ?? adapter.generate ?? oldAdapter?.generate ?? identityAdapter()?.generate,
        },
      } as DataTypeAdapterMap<ModelScalars, Record<string, never>>
    },
    inMemoryAdapters as DataTypeAdapterMap<ModelScalars, Record<string, never>>,
  )
  return { knex, mongo, memory, cache }
}
