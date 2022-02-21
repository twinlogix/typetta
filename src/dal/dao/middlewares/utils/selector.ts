import { DAOGenerics, MiddlewareContext } from '../../dao.types'
import { DAOMiddleware, MiddlewareInput } from '../middlewares.types'

export function selectMiddleware<T extends DAOGenerics>(selector: (args: MiddlewareInput<T>, context: MiddlewareContext<T>) => DAOMiddleware<T> | void): DAOMiddleware<T> {
  return {
    before: async (args, context) => {
      const middleware = selector(args, context)
      if (middleware && middleware.before) {
        return middleware.before(args, context)
      }
    },
    after: async (args, context) => {
      const middleware = selector(args, context)
      if (middleware && middleware.after) {
        return middleware.after(args, context)
      }
    },
  }
}
