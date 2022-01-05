import { DAOGenerics, DeleteParams, FindParams, InsertParams, MiddlewareContext, ReplaceParams, UpdateParams } from '../../dao.types'
import {
  Continue,
  DAOMiddleware,
  DeleteMiddlewareInput,
  DeleteMiddlewareOutput,
  FindMiddlewareInput,
  FindMiddlewareOutput,
  InsertMiddlewareInput,
  InsertMiddlewareOutput,
  ReplaceMiddlewareInput,
  ReplaceMiddlewareOutput,
  UpdateMiddlewareInput,
  UpdateMiddlewareOutput,
} from '../middlewares.types'
import { PartialDeep } from 'type-fest'

export type DAOSplitedMiddleware<T extends DAOGenerics> = {
  beforeFind?: (
    params: FindParams<T>,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<FindMiddlewareInput<T>, 'operation'> & Continue<true>) | (Omit<FindMiddlewareOutput<T>, 'operation'> & Continue<false>) | void>
  afterFind?: (
    params: FindParams<T>,
    records: PartialDeep<T['model']>[],
    totalCount: number | undefined,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<FindMiddlewareOutput<T>, 'operation'> & Continue<boolean>) | void>
  beforeInsert?: (
    params: InsertParams<T>,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<InsertMiddlewareInput<T>, 'operation'> & Continue<true>) | (Omit<InsertMiddlewareOutput<T>, 'operation'> & Continue<false>) | void>
  afterInsert?: (params: InsertParams<T>, record: T['insert'], context: MiddlewareContext<T>) => Promise<(Omit<InsertMiddlewareOutput<T>, 'operation'> & Continue<boolean>) | void>
  beforeUpdate?: (
    params: UpdateParams<T>,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<UpdateMiddlewareInput<T>, 'operation'> & Continue<true>) | (Omit<UpdateMiddlewareOutput<T>, 'operation'> & Continue<false>) | void>
  afterUpdate?: (params: UpdateParams<T>, context: MiddlewareContext<T>) => Promise<(Omit<UpdateMiddlewareOutput<T>, 'operation'> & Continue<boolean>) | void>
  beforeReplace?: (
    params: ReplaceParams<T>,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<ReplaceMiddlewareInput<T>, 'operation'> & Continue<true>) | (Omit<ReplaceMiddlewareOutput<T>, 'operation'> & Continue<false>) | void>
  afterReplace?: (params: ReplaceParams<T>, context: MiddlewareContext<T>) => Promise<(Omit<ReplaceMiddlewareOutput<T>, 'operation'> & Continue<boolean>) | void>
  beforeDelete?: (
    params: DeleteParams<T>,
    context: MiddlewareContext<T>,
  ) => Promise<(Omit<DeleteMiddlewareInput<T>, 'operation'> & Continue<true>) | (Omit<DeleteMiddlewareOutput<T>, 'operation'> & Continue<false>) | void>
  afterDelete?: (params: DeleteParams<T>, context: MiddlewareContext<T>) => Promise<(Omit<DeleteMiddlewareOutput<T>, 'operation'> & Continue<boolean>) | void>
}

export function buildMiddleware<T extends DAOGenerics>(m: DAOSplitedMiddleware<T>): DAOMiddleware<T> {
  return {
    before: async (args, context) => {
      if (m.beforeFind && args.operation === 'find') {
        const result = await m.beforeFind(args.params, context)
        if (result) {
          return {
            operation: 'find',
            ...result,
          }
        }
      } else if (m.beforeInsert && args.operation === 'insert') {
        const result = await m.beforeInsert(args.params, context)
        if (result) {
          return {
            operation: 'insert',
            ...result,
          }
        }
      } else if (m.beforeUpdate && args.operation === 'update') {
        const result = await m.beforeUpdate(args.params, context)
        if (result) {
          return {
            operation: 'update',
            ...result,
          }
        }
      } else if (m.beforeReplace && args.operation === 'replace') {
        const result = await m.beforeReplace(args.params, context)
        if (result) {
          return {
            operation: 'replace',
            ...result,
          }
        }
      } else if (m.beforeDelete && args.operation === 'delete') {
        const result = await m.beforeDelete(args.params, context)
        if (result) {
          return {
            operation: 'delete',
            ...result,
          }
        }
      }
    },
    after: async (args, context) => {
      if (m.afterFind && args.operation === 'find') {
        const result = await m.afterFind(args.params, args.records, args.totalCount, context)
        if (result) {
          return {
            operation: 'find',
            ...result,
          }
        }
      } else if (m.afterInsert && args.operation === 'insert') {
        const result = await m.afterInsert(args.params, args.record, context)
        if (result) {
          return {
            operation: 'insert',
            ...result,
          }
        }
      } else if (m.afterUpdate && args.operation === 'update') {
        const result = await m.afterUpdate(args.params, context)
        if (result) {
          return {
            operation: 'update',
            ...result,
          }
        }
      } else if (m.afterReplace && args.operation === 'replace') {
        const result = await m.afterReplace(args.params, context)
        if (result) {
          return {
            operation: 'replace',
            ...result,
          }
        }
      } else if (m.afterDelete && args.operation === 'delete') {
        const result = await m.afterDelete(args.params, context)
        if (result) {
          return {
            operation: 'delete',
            ...result,
          }
        }
      }
    },
  }
}