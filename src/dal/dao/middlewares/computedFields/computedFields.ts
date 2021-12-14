import { deepMerge } from '../../../../utils/utils'
import { AnyProjection, GenericProjection, ModelProjection } from '../../projections/projections.types'
import { isProjectionIntersected } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { projectionDependency } from '../projectionDependency/projectionDependecy'
import { PartialDeep } from 'type-fest'

export function computedField<
  ModelType extends object,
  P1 extends AnyProjection<ProjectionType>,
  P2 extends AnyProjection<ProjectionType>,
  ProjectionType extends object,
  IDKey extends Exclude<keyof ModelType, ExcludedFields>,
  ExcludedFields extends keyof ModelType,
>(args: {
  fieldsProjection: P2
  requiredProjection: P1
  compute: (record: ModelProjection<ModelType, ProjectionType, P1>) => Promise<PartialDeep<ModelType>>
}): DAOMiddleware<ModelType, IDKey, any, any, AnyProjection<ProjectionType>, any, ExcludedFields, any, any, any> {
  return {
    beforeFind: projectionDependency<ModelType, P1, P2, ProjectionType, IDKey, ExcludedFields>(args).beforeFind,
    afterFind: async (findParams, records) => {
      const computedRecords = []
      for (const record of records) {
        if (
          record &&
          isProjectionIntersected(findParams.projection ? (findParams.projection as GenericProjection) : true, args.fieldsProjection ? (args.fieldsProjection as GenericProjection) : true)
        ) {
          computedRecords.push(deepMerge(record, await args.compute(record as ModelProjection<ModelType, ProjectionType, P1>)))
        }
      }
      return computedRecords
    },
  }
}
