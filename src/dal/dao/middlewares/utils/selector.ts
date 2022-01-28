import { DAOGenerics, MiddlewareContext } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'

export function selectMiddleware<T extends DAOGenerics>(selector: (context: MiddlewareContext<T>) => DAOMiddleware<T> | void): DAOMiddleware<T> {
  return {
    before: async (args, context) => {
      const middleware = selector(context)
      if (middleware && middleware.before) {
        return middleware.before(args, context)
      }
    },
    after: async (args, context) => {
      const middleware = selector(context)
      if (middleware && middleware.after) {
        return middleware.after(args, context)
      }
    },
  }
}
