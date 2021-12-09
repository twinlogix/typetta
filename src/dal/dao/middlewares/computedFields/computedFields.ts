import { AnyProjection, GenericProjection, ModelProjection } from '../../projections/projections.types'
import { isProjectionIntersected } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { projectionDependency } from '../projectionDependency/projectionDependecy'
import { deepMerge } from '@twinlogix/tl-commons'
import { PartialDeep } from 'type-fest'

export function computedField<
  ModelType extends object,
  P1 extends PartialDeep<ProjectionType>,
  P2 extends PartialDeep<ProjectionType>,
  ProjectionType extends object,
  IDKey extends Exclude<keyof ModelType, ExcludedFields>,
  ExcludedFields extends keyof ModelType
>(args: {
  fieldsProjection: P2
  requiredProjection: P1
  compute: (record: ModelProjection<ModelType, ProjectionType, P1>) => Promise<PartialDeep<ModelType>>
}): DAOMiddleware<ModelType, IDKey, any, any, AnyProjection<ProjectionType>, any, ExcludedFields, any, any, any> {

  return {
    beforeFind: projectionDependency<ModelType, P1, P2, ProjectionType, IDKey, ExcludedFields>(args).beforeFind,
    afterFind: async (findParams, result) => {
      if (result && isProjectionIntersected(findParams.projection ? (findParams.projection as GenericProjection) : true, args.fieldsProjection ? (args.fieldsProjection as GenericProjection) : true)) {
        return deepMerge(result, await args.compute(result as ModelProjection<ModelType, ProjectionType, P1>))
      }
      return result
    },
  }

}
