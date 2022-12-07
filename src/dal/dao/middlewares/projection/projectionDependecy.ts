import { DAOGenerics } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersectedWithSchema, mergeProjectionsWithSchema } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<T extends DAOGenerics>(options: { fieldsProjection: AnyProjection<T['projection']>; requiredProjection: AnyProjection<T['projection']> }): DAOMiddleware<T> {
  return {
    name: 'Typetta - Projection dependency',
    before: async (args, context) => {
      if (args.operation === 'find') {
        if (
          isProjectionIntersectedWithSchema(
            args.params.projection ? (args.params.projection as GenericProjection) : true,
            options.fieldsProjection ? (options.fieldsProjection as GenericProjection) : true,
            context.schema,
          )
        ) {
          const projection = mergeProjectionsWithSchema((args.params.projection ?? true) as GenericProjection, options.requiredProjection as GenericProjection, context.schema) as T['projection']
          return {
            operation: 'find',
            continue: true,
            params: {
              ...args.params,
              projection,
            },
          }
        }
      }
    },
  }
}
