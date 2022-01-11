import { DataTypeAdapter, DefaultModelScalars } from './drivers.types'
import { DefaultMongoDBScalars, mongoDbAdapters, MongoDBDataTypeAdapterMap } from './no-sql/mongodb/adapters.mongodb'
import { DefaultKnexJsScalars, knexJsAdapters, KnexJSDataTypeAdapterMap } from './sql/knexjs/adapters.knexjs'

export declare type UserInputDriverDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = Omit<
  {
    [key in keyof ModelScalars]: UserInputDataTypeAdapter<ModelScalars[key], unknown, unknown>
  },
  keyof DefaultModelScalars
> & {
  [key in keyof DefaultModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key], DefaultMongoDBScalars[key], DefaultKnexJsScalars[key]>
}

export type DriverDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = {
  knex: KnexJSDataTypeAdapterMap<ModelScalars>
  mongo: MongoDBDataTypeAdapterMap<ModelScalars>
}

export type UserInputDataTypeAdapter<ModelType, MongoDBType, KenxDBType> = Partial<DataTypeAdapter<ModelType, KenxDBType | MongoDBType>> & {
  knex?: DataTypeAdapter<ModelType, KenxDBType>
  mongo?: DataTypeAdapter<ModelType, MongoDBType>
}

export function userInputDataTypeAdapterToDataTypeAdapter<ModelScalars extends DefaultModelScalars>(input: UserInputDriverDataTypeAdapterMap<ModelScalars>): DriverDataTypeAdapterMap<ModelScalars> {
  const knex = Object.entries(input).reduce<KnexJSDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
    if (scalarName in map) {
      const oldAdapter = map[scalarName as keyof ModelScalars]
      return {
        ...map,
        [scalarName]: {
          modelToDB: adapter.mongo?.modelToDB ?? adapter.modelToDB ?? oldAdapter.modelToDB,
          dbToModel: adapter.mongo?.dbToModel ?? adapter.dbToModel ?? oldAdapter.dbToModel,
          validate: adapter.mongo?.validate ?? adapter.validate ?? oldAdapter.validate,
          generate: adapter.mongo?.generate ?? adapter.generate ?? oldAdapter.generate,
        },
      } as KnexJSDataTypeAdapterMap<ModelScalars>
    }
    if (!adapter.knex && (!adapter.modelToDB || !adapter.dbToModel)) {
      if (adapter.validate) {
        throw new Error("In order to define validate function you must define also 'modelToDB' and 'dbToModel' function")
      }
      if (adapter.generate) {
        throw new Error("In order to define validate function you must define also 'modelToDB' and 'dbToModel' function")
      }
      return map
    }
    return {
      ...map,
      [scalarName]: {
        modelToDB: adapter.knex?.modelToDB ?? adapter.modelToDB,
        dbToModel: adapter.knex?.dbToModel ?? adapter.dbToModel,
        validate: adapter.knex?.validate ?? adapter.validate,
        generate: adapter.knex?.generate ?? adapter.generate,
      },
    } as KnexJSDataTypeAdapterMap<ModelScalars>
  }, knexJsAdapters as KnexJSDataTypeAdapterMap<ModelScalars>)
  const mongo = Object.entries(input).reduce<MongoDBDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown, unknown>
    if (scalarName in map) {
      const oldAdapter = map[scalarName as keyof ModelScalars]
      return {
        ...map,
        [scalarName]: {
          modelToDB: adapter.mongo?.modelToDB ?? adapter.modelToDB ?? oldAdapter.modelToDB,
          dbToModel: adapter.mongo?.dbToModel ?? adapter.dbToModel ?? oldAdapter.dbToModel,
          validate: adapter.mongo?.validate ?? adapter.validate ?? oldAdapter.validate,
          generate: adapter.mongo?.generate ?? adapter.generate ?? oldAdapter.generate,
        },
      } as MongoDBDataTypeAdapterMap<ModelScalars>
    }
    if (!adapter.mongo && (!adapter.modelToDB || !adapter.dbToModel)) {
      if (adapter.validate) {
        throw new Error("In order to define validate function you must define also 'modelToDB' and 'dbToModel' function")
      }
      if (adapter.generate) {
        throw new Error("In order to define validate function you must define also 'modelToDB' and 'dbToModel' function")
      }
      return map
    }
    return {
      ...map,
      [scalarName]: {
        modelToDB: adapter.mongo?.modelToDB ?? adapter.modelToDB,
        dbToModel: adapter.mongo?.dbToModel ?? adapter.dbToModel,
        validate: adapter.mongo?.validate ?? adapter.validate,
        generate: adapter.mongo?.generate ?? adapter.generate,
      },
    } as MongoDBDataTypeAdapterMap<ModelScalars>
  }, mongoDbAdapters as MongoDBDataTypeAdapterMap<ModelScalars>)
  return {
    knex,
    mongo,
  }
}
