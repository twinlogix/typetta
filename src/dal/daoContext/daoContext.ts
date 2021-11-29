import { AbstractDAO } from '../dao/dao'
import { DefaultModelScalars, DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import { mongoDbAdapters, MongoDBDataTypeAdapterMap } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters, KnexJSDataTypeAdapterMap } from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars> {
  public adapters: DriverDataTypeAdapterMap<any>

  public constructor(adapters?: { knexjs?: KnexJSDataTypeAdapterMap<ScalarsType>; mongodb?: MongoDBDataTypeAdapterMap<ScalarsType> }) {
    this.adapters = {
      knexjs: adapters?.knexjs || knexJsAdapters,
      mongodb: adapters?.mongodb || mongoDbAdapters,
    }
  }

  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, any, never, any, any> {
    return (this as any)[daoName]
  }
}
