import { DAOGenerics } from '../dao.types'
import { DAOMiddleware } from './middlewares.types'

export function generateId<T extends DAOGenerics>(args: {
  generator: () => T['scalarsType'][T['idScalar']]
}): DAOMiddleware<T> {
  return {
    beforeInsert: async (params, context) => {
      if (!Object.keys(params.record).includes(context.idField)) {
        return { ...params, record: { ...params.record, [context.idField]: args.generator() } }
      }
      return params
    },
  }
}
