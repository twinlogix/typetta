import { AbstractDAO } from '../dao/dao'
import { DataTypeAdapter } from '../drivers/drivers.types'

export abstract class AbstractDAOContext {
  public adapters: Map<any, DataTypeAdapter<any, any, any>>
  public constructor(adapters: Map<any, DataTypeAdapter<any, any, any>>) {
    this.adapters = adapters
  }
  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, any, never, any, any> {
    return (this as any)[daoName]
  }
}
