import { deepMerge } from '../../../../utils/utils'
import { DAOGenerics, InsertParams, MiddlewareContext, ReplaceParams, UpdateParams } from '../../dao.types'
import { DAOMiddleware, MiddlewareInput } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'
import { PartialDeep } from 'type-fest'

export function audit<T extends DAOGenerics>(
  input: (
    metadata: T['metadata'] | undefined,
    info: { insert?: InsertParams<T>; replace?: ReplaceParams<T>; update?: UpdateParams<T>; context: MiddlewareContext<T>; args: MiddlewareInput<T> },
  ) => { changes: T['update']; insert: PartialDeep<T['insert']> },
): DAOMiddleware<T> {
  return buildMiddleware({
    name: 'Typetta - Audit',
    beforeInsert: async (params, context) => {
      const records = params.records.map((r) => deepMerge(input(context.metadata, { insert: { ...params, record: r }, context, args: { operation: 'insert', params } }).insert, r))
      return { continue: true, params: { ...params, records } }
    },
    beforeReplace: async (params, context) => {
      return {
        continue: true,
        params: { ...params, replace: deepMerge(input(context.metadata, { replace: params, context, args: { operation: 'replace', params } }).insert, params.replace) },
      }
    },
    beforeUpdate: async (params, context) => {
      return {
        continue: true,
        params: { ...params, changes: deepMerge(input(context.metadata, { update: params, context, args: { operation: 'update', params } }).changes, params.changes) },
      }
    },
  })
}
