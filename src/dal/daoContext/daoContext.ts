import { AbstractDAO } from '../dao/dao'
import { DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import mongoDbAdapters from '../drivers/no-sql/mongodb/adapters.mongodb'
import knexJsAdapters from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext {
  public adapters: DriverDataTypeAdapterMap<any>

  public constructor(adapters?: DriverDataTypeAdapterMap<any>) {
    //TODO: merge if present?
    this.adapters = adapters || {
      kenxjs: knexJsAdapters,
      mongodb: mongoDbAdapters,
    }
  }

  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, never, any, any> {
    return (this as any)[daoName]
  }
}
