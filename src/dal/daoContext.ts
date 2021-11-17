import { DAO } from './dao'

export abstract class AbstractDAOContext {
  public dao(daoName: string): DAO<any, any, any, any, any, any, any, any, never> {
    return (this as any)[daoName]
  }
}
