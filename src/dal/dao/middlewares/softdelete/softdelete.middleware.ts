import { DAOGenerics, MiddlewareContext } from '../../dao.types'
import { DAOMiddleware, MiddlewareInput } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

export function softDelete<T extends DAOGenerics>(input: (args: MiddlewareInput<T>, context: MiddlewareContext<T>) => { filter?: T['filter']; changes?: T['update'] } | void): DAOMiddleware<T> {
  return buildMiddleware({
    beforeDelete: async (params, context) => {
      const i = input({ operation: 'delete', params }, context)
      if (!i || !i.changes) {
        return
      }
      if (context.specificOperation === 'deleteAll') {
        await context.dao.updateAll({ changes: i.changes, ...params, filter: params.filter })
      } else {
        await context.dao.updateOne({ changes: i.changes, ...params, filter: params.filter })
      }
      return {
        continue: false,
        params: params,
      }
    },
    beforeFind: async (params, context) => {
      const i = input({ operation: 'find', params }, context)
      if (!i || !i.filter) {
        return
      }
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
    beforeAggregate: async (params, args, context) => {
      const i = input({ operation: 'aggregate', params, args }, context)
      if (!i || !i.filter) {
        return
      }
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
        args,
      }
    },
    beforeReplace: async (params, context) => {
      const i = input({ operation: 'replace', params }, context)
      if (!i || !i.filter) {
        return
      }
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
    beforeUpdate: async (params, context) => {
      const i = input({ operation: 'update', params }, context)
      if (!i || !i.filter) {
        return
      }
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
  })
}
