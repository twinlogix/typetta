import { AnyProjection, GenericProjection, Projection, StaticProjection } from '../../projections/projections.types'
import { isProjectionIntersected, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<
  ModelType,
  P1 extends StaticProjection<ModelType>,
  P2 extends AnyProjection<ModelType, ProjectionType>,
  ProjectionType extends Projection<ModelType>,
  IDKey extends Exclude<keyof ModelType, ExcludedFields>,
  ExcludedFields extends keyof ModelType
>(args: {
  fieldsProjection: P2
  requiredProjection: P1
}): DAOMiddleware<ModelType, IDKey, any, any, ProjectionType, any, ExcludedFields, any, any, any> {
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
