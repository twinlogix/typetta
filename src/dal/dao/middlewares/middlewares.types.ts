import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams, IdGenerationStrategy } from '../dao.types'
import { PartialDeep } from 'type-fest'

export type DAOMiddleware<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType,
  InsertType extends object,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  ScalarsType,
> = {
  beforeFind?: (
    params: FindParams<FilterType, ProjectionType, SortType, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<FindParams<FilterType, ProjectionType, SortType, OptionsType>>
  afterFind?: (
    params: FindParams<FilterType, ProjectionType, SortType, OptionsType>,
    records: PartialDeep<ModelType>[],
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<PartialDeep<ModelType>[]>
  beforeInsert?: (
    params: InsertParams<InsertType, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<InsertParams<InsertType, OptionsType>>
  afterInsert?: (
    params: InsertParams<InsertType, OptionsType>,
    record: Omit<ModelType, ExcludedFields>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<Omit<ModelType, ExcludedFields>>
  beforeUpdate?: (params: UpdateParams<FilterType, UpdateType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<UpdateParams<FilterType, UpdateType, OptionsType>>
  afterUpdate?: (params: UpdateParams<FilterType, UpdateType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
  beforeReplace?: (
    params: ReplaceParams<FilterType, InsertType, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<ReplaceParams<FilterType, InsertType, OptionsType>>
  afterReplace?: (params: ReplaceParams<FilterType, InsertType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
  beforeDelete?: (params: DeleteParams<FilterType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<DeleteParams<FilterType, OptionsType>>
  afterDelete?: (params: DeleteParams<FilterType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
}
