import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy, DAOGenerics } from '../dao.types'
import { PartialDeep } from 'type-fest'

type FindAllMiddlewareInput<T extends DAOGenerics> = { operation: 'findAll'; params: FindParams<T> }
type InsertOneMiddlewareInput<T extends DAOGenerics> = { operation: 'insertOne'; params: InsertParams<T> }
type UpdateOneMiddlewareInput<T extends DAOGenerics> = { operation: 'updateOne'; params: UpdateParams<T> }
type UpdateAllMiddlewareInput<T extends DAOGenerics> = { operation: 'updateAll'; params: UpdateParams<T> }
type ReplaceOneMiddlewareInput<T extends DAOGenerics> = { operation: 'replaceOne'; params: ReplaceParams<T> }
type DeleteOneMiddlewareInput<T extends DAOGenerics> = { operation: 'deleteOne'; params: DeleteParams<T> }
type DeleteAllMiddlewareInput<T extends DAOGenerics> = { operation: 'deleteAll'; params: DeleteParams<T> }
export type MiddlewareInput<T extends DAOGenerics> =
  | FindAllMiddlewareInput<T>
  | InsertOneMiddlewareInput<T>
  | UpdateOneMiddlewareInput<T>
  | UpdateAllMiddlewareInput<T>
  | ReplaceOneMiddlewareInput<T>
  | DeleteOneMiddlewareInput<T>
  | DeleteAllMiddlewareInput<T>

type FindAllMiddlewareOutput<T extends DAOGenerics> = { operation: 'findAll'; params: FindParams<T>; records: PartialDeep<T['model']>[]; totalCount?: number }
type InsertOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'insertOne'; params: InsertParams<T>; record: T['insert'] }
type UpdateOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'updateOne'; params: UpdateParams<T> }
type UpdateAllMiddlewareOutput<T extends DAOGenerics> = { operation: 'updateAll'; params: UpdateParams<T> }
type ReplaceOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'replaceOne'; params: ReplaceParams<T> }
type DeleteOneMiddlewareOutput<T extends DAOGenerics> = { operation: 'deleteOne'; params: DeleteParams<T> }
type DeleteAllMiddlewareOutput<T extends DAOGenerics> = { operation: 'deleteAll'; params: DeleteParams<T> }
export type MiddlewareOutput<T extends DAOGenerics> =
  | FindAllMiddlewareOutput<T>
  | InsertOneMiddlewareOutput<T>
  | UpdateOneMiddlewareOutput<T>
  | UpdateAllMiddlewareOutput<T>
  | ReplaceOneMiddlewareOutput<T>
  | DeleteOneMiddlewareOutput<T>
  | DeleteAllMiddlewareOutput<T>

export type SelectBeforeMiddlewareOutputType<T extends DAOGenerics, I extends MiddlewareInput<T>> = I['operation'] extends 'findAll'
  ? (FindAllMiddlewareInput<T> & { continue: true }) | (FindAllMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'insertOne'
  ? (InsertOneMiddlewareInput<T> & { continue: true }) | (InsertOneMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'updateOne'
  ? (UpdateOneMiddlewareInput<T> & { continue: true }) | (UpdateOneMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'updateAll'
  ? (UpdateAllMiddlewareInput<T> & { continue: true }) | (UpdateAllMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'replaceOne'
  ? (ReplaceOneMiddlewareInput<T> & { continue: true }) | (ReplaceOneMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'deleteOne'
  ? (DeleteOneMiddlewareInput<T> & { continue: true }) | (DeleteOneMiddlewareOutput<T> & { continue: false })
  : I['operation'] extends 'deleteAll'
  ? (DeleteAllMiddlewareInput<T> & { continue: true }) | (DeleteAllMiddlewareOutput<T> & { continue: false })
  : never

export type SelectAfterMiddlewareOutputType<T extends DAOGenerics, I extends MiddlewareInput<T>> = I['operation'] extends 'findAll'
  ? FindAllMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'insertOne'
  ? InsertOneMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'updateOne'
  ? UpdateOneMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'updateAll'
  ? UpdateAllMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'replaceOne'
  ? ReplaceOneMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'deleteOne'
  ? DeleteOneMiddlewareOutput<T> & { continue: boolean }
  : I['operation'] extends 'deleteAll'
  ? DeleteAllMiddlewareOutput<T> & { continue: boolean }
  : never

type BeforeMiddlewareResult<T extends DAOGenerics> = (MiddlewareInput<T> & { continue: true }) | (MiddlewareOutput<T> & { continue: false })
type AfterMiddlewareResult<T extends DAOGenerics> = { continue: boolean } & MiddlewareOutput<T>

export type DAOMiddleware<T extends DAOGenerics> = {
  before?: <G extends MiddlewareInput<T>>(args: G, context: MiddlewareContext<T>) => Promise<BeforeMiddlewareResult<T> | void>
  after?: (args: MiddlewareOutput<T>, context: MiddlewareContext<T>) => Promise<AfterMiddlewareResult<T> | void>
}
