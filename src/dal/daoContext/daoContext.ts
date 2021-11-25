import { AbstractDAO } from '../dao/dao'
import { DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import mongoDbAdapters from '../drivers/no-sql/mongodb/adapters.mongodb'
import knexJsAdapters from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext {
  public adapters: DriverDataTypeAdapterMap<any>

  public constructor(adapters?: DriverDataTypeAdapterMap<any>) {
    const defaultAdapters = {
      kenxjs: knexJsAdapters,
      mongodb: mongoDbAdapters,
    }
    if (adapters) {
      Object.entries(adapters.kenxjs).forEach(([k, v]) => {
        ;(defaultAdapters.kenxjs as any)[k] = v
      })
      Object.entries(adapters.mongodb).forEach(([k, v]) => {
        ;(defaultAdapters.mongodb as any)[k] = v
      })
    }
    this.adapters = defaultAdapters
  }

  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, never, any, any> {
    return (this as any)[daoName]
  }
}
