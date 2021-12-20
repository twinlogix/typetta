import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy, DAOGenerics } from '../dao.types'
import { PartialDeep } from 'type-fest'

export type DAOMiddleware<T extends DAOGenerics> = {
  beforeFind?: (params: FindParams<T>, context: MiddlewareContext<T>) => Promise<FindParams<T>>
  afterFind?: (params: FindParams<T>, records: PartialDeep<T['modelType']>[], context: MiddlewareContext<T>) => Promise<PartialDeep<T['modelType']>[]>
  beforeInsert?: (params: InsertParams<T>, context: MiddlewareContext<T>) => Promise<InsertParams<T>>
  afterInsert?: (params: InsertParams<T>, record: T['insertType'], context: MiddlewareContext<T>) => Promise<T['insertType']>
  beforeUpdate?: (params: UpdateParams<T>, context: MiddlewareContext<T>) => Promise<UpdateParams<T>>
  afterUpdate?: (params: UpdateParams<T>, context: MiddlewareContext<T>) => Promise<void>
  beforeReplace?: (params: ReplaceParams<T>, context: MiddlewareContext<T>) => Promise<ReplaceParams<T>>
  afterReplace?: (params: ReplaceParams<T>, context: MiddlewareContext<T>) => Promise<void>
  beforeDelete?: (params: DeleteParams<T>, context: MiddlewareContext<T>) => Promise<DeleteParams<T>>
  afterDelete?: (params: DeleteParams<T>, context: MiddlewareContext<T>) => Promise<void>
}
