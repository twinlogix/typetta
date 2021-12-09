import { PartialDeep } from 'type-fest'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersected, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<
  ModelType extends object,
  P1 extends PartialDeep<ProjectionType>,
  P2 extends PartialDeep<ProjectionType>,
  ProjectionType extends object,
  IDKey extends Exclude<keyof ModelType, ExcludedFields>,
  ExcludedFields extends keyof ModelType
>(args: {
  fieldsProjection: P2
  requiredProjection: P1
}): DAOMiddleware<ModelType, IDKey, any, any, AnyProjection<ProjectionType>, any, ExcludedFields, any, any, any> {
  return {
    beforeFind: async (findParams) => {
      if (isProjectionIntersected(findParams.projection ? (findParams.projection as GenericProjection) : true, args.fieldsProjection ? (args.fieldsProjection as GenericProjection) : true)) {
        return {
          ...findParams,
          projection: mergeProjections((findParams.projection || true) as GenericProjection, args.requiredProjection as GenericProjection) as ProjectionType,
        }
      }
      return findParams
    },
  }
}
