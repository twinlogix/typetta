import { deepMerge } from '../../../../utils/utils'
import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'
import { PartialDeep } from 'type-fest'

export function audit<T extends DAOGenerics>(input: (metadata?: T['metadata']) => { changes: T['update']; insert: PartialDeep<T['insert']> }): DAOMiddleware<T> {
  return buildMiddleware({
    beforeInsert: async (params, context) => {
      return {
        continue: true,
        params: { ...params, record: deepMerge(input(context.metadata).insert, params.record) },
      }
    },
    beforeReplace: async (params, context) => {
      return {
        continue: true,
        params: { ...params, replace: deepMerge(input(context.metadata).insert, params.replace) },
      }
    },
    beforeUpdate: async (params, context) => {
      return {
        continue: true,
        params: { ...params, changes: deepMerge(input(context.metadata).changes, params.changes) },
      }
    },
  })
}
