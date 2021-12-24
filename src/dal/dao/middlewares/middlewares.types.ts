import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy, DAOGenerics } from '../dao.types'
import { PartialDeep } from 'type-fest'

type FindMiddlewareInput<T extends DAOGenerics> = { operation: 'find'; params: FindParams<T> }
type InsertMiddlewareInput<T extends DAOGenerics> = { operation: 'insert'; params: InsertParams<T> }
type UpdateOneMiddlewareInput<T extends DAOGenerics> = { operation: 'update'; params: UpdateParams<T> }
type ReplaceMiddlewareInput<T extends DAOGenerics> = { operation: 'replace'; params: ReplaceParams<T> }
type DeleteOneMiddlewareInput<T extends DAOGenerics> = { operation: 'delete'; params: DeleteParams<T> }
export type MiddlewareInput<T extends DAOGenerics> = FindMiddlewareInput<T> | InsertMiddlewareInput<T> | UpdateOneMiddlewareInput<T> | ReplaceMiddlewareInput<T> | DeleteOneMiddlewareInput<T>

type FindAllMiddlewareOutput<T extends DAOGenerics> = { operation: 'find'; params: FindParams<T>; records: PartialDeep<T['model']>[]; totalCount?: number }
type InsertMiddlewareOutput<T extends DAOGenerics> = { operation: 'insert'; params: InsertParams<T>; record: T['insert'] }
type UpdateOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'update'; params: UpdateParams<T> }
type ReplaceMiddlewareOutput<T extends DAOGenerics> = { operation: 'replace'; params: ReplaceParams<T> }
type DeleteOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'delete'; params: DeleteParams<T> }
export type MiddlewareOutput<T extends DAOGenerics> = FindAllMiddlewareOutput<T> | InsertMiddlewareOutput<T> | UpdateOneMiddlewareOutput<T> | ReplaceMiddlewareOutput<T> | DeleteOneMiddlewareOutput<T>

export type SelectBeforeMiddlewareOutputType<T extends DAOGenerics, I extends MiddlewareInput<T>> = I['operation'] extends 'find'
  ? (FindMiddlewareInput<T> & { continue: true }) | (FindAllMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'insert'
  ? (InsertMiddlewareInput<T> & { continue: true }) | (InsertMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'update'
  ? (UpdateOneMiddlewareInput<T> & { continue: true }) | (UpdateOneMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'replace'
  ? (ReplaceMiddlewareInput<T> & { continue: true }) | (ReplaceMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'delete'
  ? (DeleteOneMiddlewareInput<T> & { continue: true }) | (DeleteOneMiddlewareOutput<T> & { continue: false })
  : never

export type SelectAfterMiddlewareOutputType<T extends DAOGenerics, I extends MiddlewareInput<T>> = I['operation'] extends 'find'
  ? FindAllMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'insert'
  ? InsertMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'update'
  ? UpdateOneMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'replace'
  ? ReplaceMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'delete'
  ? DeleteOneMiddlewareOutput<T> & { continue: boolean }
  : never

type BeforeMiddlewareResult<T extends DAOGenerics> = (MiddlewareInput<T> & { continue: true }) | (MiddlewareOutput<T> & { continue: false })
type AfterMiddlewareResult<T extends DAOGenerics> = { continue: boolean } & MiddlewareOutput<T>

export type DAOMiddleware<T extends DAOGenerics> = {
  before?: <G extends MiddlewareInput<T>>(args: G, context: MiddlewareContext<T>) => Promise<BeforeMiddlewareResult<T> | void>
  after?: (args: MiddlewareOutput<T>, context: MiddlewareContext<T>) => Promise<AfterMiddlewareResult<T> | void>
}
