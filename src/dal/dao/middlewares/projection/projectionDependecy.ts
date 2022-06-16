import { DAOGenerics } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersected, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<T extends DAOGenerics>(options: { fieldsProjection: AnyProjection<T['projection']>; requiredProjection: AnyProjection<T['projection']> }): DAOMiddleware<T> {
  return {
    name: 'Typetta - Projection dependency',
    before: async (args) => {
      if (args.operation === 'find') {
        if (isProjectionIntersected(args.params.projection ? (args.params.projection as GenericProjection) : true, options.fieldsProjection ? (options.fieldsProjection as GenericProjection) : true)) {
          return {
            operation: 'find',
            continue: true,
            params: {
              ...args.params,
              projection: mergeProjections((args.params.projection ?? true) as GenericProjection, options.requiredProjection as GenericProjection) as T['projection'],
            },
          }
        }
      }
    },
  }
}
