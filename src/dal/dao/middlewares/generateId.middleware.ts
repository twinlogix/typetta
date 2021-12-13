import { IdGenerationStrategy } from '../dao.types'
import { DAOMiddleware } from './middlewares.types'

export function generateId<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDScalar extends keyof ScalarsType,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  ScalarsType,
>(args: { generator: () => ScalarsType[IDScalar] }): DAOMiddleware<ModelType, IDKey, IdGeneration, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType, ScalarsType> {
  return {
    beforeInsert: async (params, context) => {
      if (!(context.idField in params.record)) {
        return { ...params, record: { ...params.record, [context.idField]: args.generator() } }
      }
      return params
    },
  }
}
