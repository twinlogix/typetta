import { deepMerge } from '../../../../utils/utils'
import { DAOGenerics, FindParams } from '../../dao.types'
import { AnyProjection, GenericProjection, ModelProjection } from '../../projections/projections.types'
import { isProjectionIntersected } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { projectionDependency } from '../projectionDependency/projectionDependecy'
import { PartialDeep } from 'type-fest'

export function computedField<T extends DAOGenerics, P1 extends AnyProjection<T['projection']>, P2 extends AnyProjection<T['projection']>>(options: {
  fieldsProjection: P2
  requiredProjection: P1
  compute: (record: ModelProjection<T, P1>, params: FindParams<T>) => Promise<PartialDeep<T['model']>>
}): DAOMiddleware<T> {
  return {
    before: projectionDependency<T, P1, P2>(options).before,
    after: async (args) => {
      if (args.operation === 'find') {
        const computedRecords = []
        for (const record of args.records) {
          if (
            record &&
            isProjectionIntersected(args.params.projection ? (args.params.projection as GenericProjection) : true, options.fieldsProjection ? (options.fieldsProjection as GenericProjection) : true)
          ) {
            computedRecords.push(deepMerge(record, await options.compute(record as ModelProjection<T, P1>, args.params)))
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
