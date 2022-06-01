import { AbstractScalars } from '../..'
import { DataTypeAdapter, DefaultModelScalars, identityAdapter } from './drivers.types'
import { inMemoryAdapters, InMemoryDataTypeAdapterMap } from './in-memory/adapters.memory'
import { DefaultMongoDBScalars, mongoDbAdapters, MongoDBDataTypeAdapterMap } from './no-sql/mongodb/adapters.mongodb'
import { DefaultKnexJsScalars, knexJsAdapters, KnexJSDataTypeAdapterMap } from './sql/knexjs/adapters.knexjs'

type Drivers = 'both' | 'mongo' | 'knex'
export declare type UserInputDriverDataTypeAdapterMap<ModelScalars extends AbstractScalars, D extends Drivers> = Omit<
  {
    [key in keyof ModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key]['type'], unknown, unknown, D>
  },
  keyof DefaultModelScalars
> & {
  [key in keyof DefaultModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key], DefaultMongoDBScalars[key], DefaultKnexJsScalars[key], D>
}

export type DriverDataTypeAdapterMap<ModelScalars extends AbstractScalars> = {
  knex: KnexJSDataTypeAdapterMap<ModelScalars>
  mongo: MongoDBDataTypeAdapterMap<ModelScalars>
  memory: InMemoryDataTypeAdapterMap<ModelScalars>
}

export type UserInputDataTypeAdapter<ModelType, MongoDBType, KenxDBType, D extends Drivers> = Partial<DataTypeAdapter<ModelType, KenxDBType | MongoDBType>> &
  (D extends 'both'
    ? {
        knex?: Partial<DataTypeAdapter<ModelType, KenxDBType>>
        mongo?: Partial<DataTypeAdapter<ModelType, MongoDBType>>
        memory?: Partial<DataTypeAdapter<ModelType, MongoDBType>>
      }
    : unknown)

export function userInputDataTypeAdapterToDataTypeAdapter<ModelScalars extends DefaultModelScalars>(
  input: UserInputDriverDataTypeAdapterMap<ModelScalars, 'both' | 'knex' | 'mongo'>,
  scalars: string[],
): DriverDataTypeAdapterMap<ModelScalars> {
  const mappedInput = { ...scalars.reduce((p, s) => ({ ...p, [s]: {} }), {}), ...input }
  const knex = Object.entries(mappedInput).reduce<KnexJSDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown, 'both'>
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
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown, 'both'>
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
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown, 'both'>
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
  return {
    knex,
    mongo,
    memory,
  }
}
