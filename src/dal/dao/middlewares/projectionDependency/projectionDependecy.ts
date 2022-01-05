import { DAOGenerics } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersected, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<T extends DAOGenerics, P1 extends AnyProjection<T['projection']>, P2 extends AnyProjection<T['projection']>>(options: {
  fieldsProjection: P2
  requiredProjection: P1
}): DAOMiddleware<T> {
  return {
    before: async (args) => {
      if (args.operation === 'find') {
        if (isProjectionIntersected(args.params.projection ? (args.params.projection as GenericProjection) : true, options.fieldsProjection ? (options.fieldsProjection as GenericProjection) : true)) {
          return {
            operation: 'find',
            continue: true,
            params: {
              ...args.params,
              projection: mergeProjections((args.params.projection || true) as GenericProjection, options.requiredProjection as GenericProjection) as T['projection'],
            },
          }
        }
      }
    },
  }
}
