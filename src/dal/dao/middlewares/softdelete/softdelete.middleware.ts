import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

export function softDelete<T extends DAOGenerics>(input: (metadata: T['metadata']) => { filter: T['filter']; changes: T['update'] }): DAOMiddleware<T> {
  return buildMiddleware({
    beforeDelete: async (params, context) => {
      const i = input(context.metadata)
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
      const i = input(context.metadata)
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
    beforeAggregate: async (params, args, context) => {
      const i = input(context.metadata)
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
        args,
      }
    },
    beforeReplace: async (params, context) => {
      const i = input(context.metadata)
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
    beforeUpdate: async (params, context) => {
      const i = input(context.metadata)
      return {
        continue: true,
        params: { ...params, filter: params.filter ? { $and: [i.filter, params.filter] } : i.filter },
      }
    },
  })
}
