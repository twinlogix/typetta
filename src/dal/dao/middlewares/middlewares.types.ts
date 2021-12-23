import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy, DAOGenerics } from '../dao.types'
import { PartialDeep } from 'type-fest'

type InputMiddlewareParams<T extends DAOGenerics> =
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
type OuputMiddlewareParams<T extends DAOGenerics> =
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

type ASD<G extends DAOGenerics, T extends 'findAll' | 'findOne' | 'insertOne' | 'updateAll' | 'updateOne' | 'replaceAll' | 'replaceOne' | 'deleteAll' | 'deleteOne'> = T extends 'findAll'
  ?
      | {
          operation: 'findAll'
          params: FindParams<G>
          continue: true
        }
      | {
          operation: 'findAll'
          params: FindParams<G>
          continue: false
          records: PartialDeep<G['model']>[]
        }
  : InputMiddlewareParams<G> & ({ continue: true } | ({ continue: false } & OuputMiddlewareParams<G>))

export type DAOMiddleware<T extends DAOGenerics> = {
  before?: <G extends InputMiddlewareParams<T>>(args: G, context: MiddlewareContext<T>) => Promise<ASD<T, G['operation']> | void>
  after?: (args: OuputMiddlewareParams<T>, context: MiddlewareContext<T>) => Promise<{ continue: boolean } & OuputMiddlewareParams<T>>
}

const asd: DAOMiddleware<any> = {
  before: async (args, cont) => {
    if (args.operation === 'findAll') {
      return {
        operation: 'findAll',
        continue: true,
        params: args.params,
      }
    }
  },
}
