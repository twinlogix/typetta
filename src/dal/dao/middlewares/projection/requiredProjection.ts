import { DAOGenerics } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function requiredProjection<T extends DAOGenerics>(projection: AnyProjection<T['projection']>): DAOMiddleware<T> {
  return {
    before: async (args) => {
      if (args.operation === 'find') {
        return {
          operation: 'find',
          continue: true,
          params: {
            ...args.params,
            projection: mergeProjections((args.params.projection ?? true) as GenericProjection, projection as GenericProjection) as T['projection'],
          },
        }
      }
    },
  }
}
