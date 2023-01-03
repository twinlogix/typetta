import { deepMerge } from '../../../../utils/utils'
import { DAOGenerics, FindParams, MiddlewareContext } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersectedWithSchema } from '../../projections/projections.utils'
import { Project } from '../../schemas/ast.types'
import { DAOMiddleware } from '../middlewares.types'
import { projectionDependency } from '../projection/projectionDependecy'
import { PartialDeep } from 'type-fest'

export function computedField<T extends DAOGenerics, P1 extends AnyProjection<T['projection']>, P2 extends AnyProjection<T['projection']>>(options: {
  fieldsProjection: P2
  requiredProjection: P1
  compute: (record: Project<T['entity'], T['ast'], T['scalars'], P1>, params: FindParams<T>, context: MiddlewareContext<T>) => Promise<PartialDeep<T['model']>>
}): DAOMiddleware<T> {
  return {
    name: 'Typetta - Computed field',
    before: projectionDependency<T>(options).before,
    after: async (args, context) => {
      if (args.operation === 'find') {
        const computedRecords = []
        for (const record of args.records) {
          if (
            record &&
            isProjectionIntersectedWithSchema(
              args.params.projection ? (args.params.projection as GenericProjection) : true,
              options.fieldsProjection ? (options.fieldsProjection as GenericProjection) : true,
              context.schema,
            )
          ) {
            computedRecords.push(deepMerge(record, await options.compute(record as Project<T['entity'], T['ast'], T['scalars'], P1>, args.params, context)))
          } else {
            computedRecords.push(record)
          }
        }
        return {
          operation: 'find',
          continue: true,
          records: computedRecords,
          params: args.params,
          totalCount: args.totalCount,
        }
      }
    },
  }
}
