import { DAOGenerics } from '../../dao.types'
import { BeforeMiddlewareResult, DAOMiddleware, MiddlewareInput, MiddlewareOutput } from '../middlewares.types'

type RoleAsdType<T extends DAOGenerics> = {
  filter: (metadata: T['metadata']) => T['filter'] | undefined
}
export function roleSecurityPolicy<T extends DAOGenerics>(filter: (metadata: T['metadata']) => T['filter'] | undefined): DAOMiddleware<T> {
  return {
    before: async (args, context) => {
      if (args.operation === 'aggregate') {
        return
      } else if (args.operation === 'insert') {
        return
      } else {
        return {
          continue: true,
          ...args,
          params: {
            ...args.params,
            filter: args.params.filter ? { $and: [args.params.filter, filter(context.metadata)] } : filter(context.metadata),
          },
        } as BeforeMiddlewareResult<T>
      }
    },
  }
}
