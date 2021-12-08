import { AbstractDAO } from '../dao/dao'
import { DefaultModelScalars, DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import { mongoDbAdapters, MongoDBDataTypeAdapterMap } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters, KnexJSDataTypeAdapterMap } from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars, OptionsType = {}> {

  public adapters: DriverDataTypeAdapterMap<ScalarsType>
  public options?: OptionsType;

  public constructor(args?: { adapters?: Partial<DriverDataTypeAdapterMap<ScalarsType>>, options?: OptionsType }) {
    this.adapters = {
      knexjs: args?.adapters?.knexjs || knexJsAdapters as KnexJSDataTypeAdapterMap<ScalarsType>,
      mongoDB: args?.adapters?.mongoDB || mongoDbAdapters as MongoDBDataTypeAdapterMap<ScalarsType>,
    }
    this.options = args?.options;
  }

  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, any, never, any, any, any> {
    return (this as any)[daoName]
  }
}
