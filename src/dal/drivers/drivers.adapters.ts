import { DataTypeAdapter, DefaultModelScalars } from './drivers.types'
import { mongoDbAdapters, MongoDBDataTypeAdapterMap } from './no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters, KnexJSDataTypeAdapterMap } from './sql/knexjs/adapters.knexjs'

export declare type UserInputDriverDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = Omit<
  {
    [key in keyof ModelScalars]: UserInputDataTypeAdapter<ModelScalars[key], unknown>
  },
  keyof DefaultModelScalars
> & {
  [key in keyof DefaultModelScalars]?: UserInputDataTypeAdapter<ModelScalars[key], unknown>
}

export type DriverDataTypeAdapterMap<ModelScalars extends DefaultModelScalars> = {
  knex: KnexJSDataTypeAdapterMap<ModelScalars>
  mongo: MongoDBDataTypeAdapterMap<ModelScalars>
}

export type UserInputDataTypeAdapter<ModelType, DBType> = Partial<DataTypeAdapter<ModelType, DBType>> & {
  knex?: DataTypeAdapter<ModelType, DBType>
  mongo?: DataTypeAdapter<ModelType, DBType>
}

export function userInputDataTypeAdapterToDataTypeAdapter<ModelScalars extends DefaultModelScalars>(input: UserInputDriverDataTypeAdapterMap<ModelScalars>): DriverDataTypeAdapterMap<ModelScalars> {
  const knex = Object.entries(input).reduce<KnexJSDataTypeAdapterMap<ModelScalars>>((map, [scalarName, dta]) => {
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown>
    if (!adapter.knex && (!adapter.modelToDB || !adapter.dbToModel)) {
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
    const adapter = dta as UserInputDataTypeAdapter<unknown, unknown>
    if (!adapter.mongo && (!adapter.modelToDB || !adapter.dbToModel)) {
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
