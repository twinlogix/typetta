import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from './builder'

export function defaultValueMiddleware<T extends DAOGenerics, K extends keyof T['plainModel']>(field: K, value: (metadata: T['metadata'] | undefined) => T['plainModel'][K]): DAOMiddleware<T> {
  return buildMiddleware({
    name: 'Typetta - Default value',
    beforeInsert: async (params, context) => {
      const records = []
      for (const record of params.records) {
        if (record[field] === undefined) {
          records.push({ ...record, [field]: value(context.metadata) })
        } else {
          records.push(record)
        }
      }
      return { continue: true, params: { ...params, records } }
    },
  })
}
