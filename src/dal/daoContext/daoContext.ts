import { AbstractDAO } from '../dao/dao'

export abstract class AbstractDAOContext {
  public dao(daoName: string): AbstractDAO<any, any, any, any, any, any, never, any> {
    return (this as any)[daoName]
  }
}
