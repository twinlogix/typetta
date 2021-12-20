import { DAOGenerics } from '../../dao.types'
import { AnyProjection, GenericProjection } from '../../projections/projections.types'
import { isProjectionIntersected, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'

export function projectionDependency<
  T extends DAOGenerics,
  P1 extends AnyProjection<T['projectionType']>,
  P2 extends AnyProjection<T['projectionType']>,
>(args: {
  fieldsProjection: P2
  requiredProjection: P1
}): DAOMiddleware<T> {
  return {
    beforeFind: async (findParams) => {
      if (isProjectionIntersected(findParams.projection ? (findParams.projection as GenericProjection) : true, args.fieldsProjection ? (args.fieldsProjection as GenericProjection) : true)) {
        return {
          ...findParams,
          projection: mergeProjections((findParams.projection || true) as GenericProjection, args.requiredProjection as GenericProjection) as T['projectionType'],
        }
      }
      return findParams
    },
  }
}
