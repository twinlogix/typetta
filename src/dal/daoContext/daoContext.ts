import { AbstractDAO } from '../dao/dao'
import { DefaultModelScalars, DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import { mongoDbAdapters } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters } from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars> {
  public adapters: DriverDataTypeAdapterMap<any>

  public constructor(adapters?: DriverDataTypeAdapterMap<ScalarsType>) {
    this.adapters = adapters || {
      knexjs: knexJsAdapters,
      mongodb: mongoDbAdapters,
    }
  }

  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, never, any, any> {
    return (this as any)[daoName]
  }
}
