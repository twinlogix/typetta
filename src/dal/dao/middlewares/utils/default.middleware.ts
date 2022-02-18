import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from './builder'

export function defaultValueMiddleware<T extends DAOGenerics, K extends keyof T['model']>(field: K, value: (metadata: T['metadata'] | undefined) => T['model'][K]): DAOMiddleware<T> {
  return buildMiddleware({
    beforeInsert: async (params, context) => {
      if (params.record[field] === undefined) {
        return { continue: true, params: { ...params, record: { ...params.record, [field]: value(context.metadata) } } }
      }
    },
  })
}
