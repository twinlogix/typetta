import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy, DAOGenerics } from '../dao.types'
import { PartialDeep } from 'type-fest'

export type DAOMiddleware<T extends DAOGenerics> = {
  beforeFind?: (params: FindParams<T>, context: MiddlewareContext<T>) => Promise<FindParams<T>>
  afterFind?: (params: FindParams<T>, records: PartialDeep<T['model']>[], context: MiddlewareContext<T>) => Promise<PartialDeep<T['model']>[]>
  beforeInsert?: (params: InsertParams<T>, context: MiddlewareContext<T>) => Promise<InsertParams<T>>
  afterInsert?: (params: InsertParams<T>, record: T['insert'], context: MiddlewareContext<T>) => Promise<T['insert']>
  beforeUpdate?: (params: UpdateParams<T>, context: MiddlewareContext<T>) => Promise<UpdateParams<T>>
  afterUpdate?: (params: UpdateParams<T>, context: MiddlewareContext<T>) => Promise<void>
  beforeReplace?: (params: ReplaceParams<T>, context: MiddlewareContext<T>) => Promise<ReplaceParams<T>>
  afterReplace?: (params: ReplaceParams<T>, context: MiddlewareContext<T>) => Promise<void>
  beforeDelete?: (params: DeleteParams<T>, context: MiddlewareContext<T>) => Promise<DeleteParams<T>>
  afterDelete?: (params: DeleteParams<T>, context: MiddlewareContext<T>) => Promise<void>
}

type InputParams<T extends DAOGenerics> =
  | {
      operation: 'findAll'
      params: FindParams<T>
    }
  | {
      operation: 'findOne'
      params: FindParams<T>
    }
  | {
      operation: 'insertOne'
      params: InsertParams<T>
    }
  | {
      operation: 'updateAll'
      params: UpdateParams<T>
    }
  | {
      operation: 'updateOne'
      params: UpdateParams<T>
    }
  | {
      operation: 'replaceAll'
      params: ReplaceParams<T>
    }
  | {
      operation: 'replaceOne'
      params: ReplaceParams<T>
    }
  | {
      operation: 'deleteAll'
      params: DeleteParams<T>
    }
  | {
      operation: 'deleteOne'
      params: DeleteParams<T>
    }
type OuputParams<T extends DAOGenerics> =
  | {
      operation: 'findAll'
      params: FindParams<T>
      records: PartialDeep<T['model']>[]
    }
  | {
      operation: 'findOne'
      params: FindParams<T>
      record: PartialDeep<T['model']> | null
    }
  | {
      operation: 'insertOne'
      params: InsertParams<T>
      record: T['insert']
    }
  | {
      operation: 'updateAll'
      params: UpdateParams<T>
    }
  | {
      operation: 'updateOne'
      params: UpdateParams<T>
    }
  | {
      operation: 'replaceAll'
      params: ReplaceParams<T>
    }
  | {
      operation: 'replaceOne'
      params: ReplaceParams<T>
    }
  | {
      operation: 'deleteAll'
      params: DeleteParams<T>
    }
  | {
      operation: 'deleteOne'
      params: DeleteParams<T>
    }
export type DAOMiddleware2<T extends DAOGenerics> = {
  before?: (params: InputParams<T>, context: MiddlewareContext<T>) => Promise<(InputParams<T> & ({ continue: true } | ({ continue: false } & OuputParams<T>))) | void>
  after?: (params: OuputParams<T>, context: MiddlewareContext<T>) => Promise<{ continue: boolean } & OuputParams<T>>
}

const asd: DAOMiddleware2<any> = {
  before: async (params, context) => {
    if (params.operation === 'findAll') {
      return {
        operation: 'findAll',
        params: params,
        continue: false,
        records: [],
      }
    }
    if (params.operation === 'findOne') {
      return {
        operation: 'findOne',
        params: params,
        continue: true,
      }
    }
    if (params.operation === 'deleteOne') {
      return {
        ...params,
        continue: false,
      }
    }
  },
}

function test<T extends 'a' | 'b'>(t: T): T {
  if (t === 'a') {
    // Type '"a"' is not assignable to type 'T'.
    // '"a"' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint '"a" | "b"'.ts(2322)
    return 'a' 
  }
  return t
}

const v = test('a')