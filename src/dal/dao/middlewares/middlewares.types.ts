import { MiddlewareContext, DeleteParams, FindParams, InsertParams, ReplaceParams, UpdateParams } from '../dao.types'
import { AnyProjection, Projection } from '../projections/projections.types'
import { PartialDeep } from 'type-fest'

export type DAOMiddleware<
  ModelType,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDAutogenerated extends boolean,
  FilterType,
  ProjectionType extends Projection<ModelType>,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  ScalarsType,
> = {
  beforeFind?: <P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<FindParams<FilterType, P, SortType, OptionsType>>
  afterFind?: <P extends AnyProjection<ModelType, ProjectionType>>(
    params: FindParams<FilterType, P, SortType, OptionsType>,
    result: PartialDeep<ModelType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<PartialDeep<ModelType>>
  beforeInsert?: (
    params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>>
  afterInsert?: (
    params: InsertParams<ModelType, IDKey, ExcludedFields, IDAutogenerated, OptionsType>,
    result: Omit<ModelType, ExcludedFields>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<Omit<ModelType, ExcludedFields>>
  beforeUpdate?: (params: UpdateParams<FilterType, UpdateType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<UpdateParams<FilterType, UpdateType, OptionsType>>
  afterUpdate?: (params: UpdateParams<FilterType, UpdateType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
  beforeReplace?: (
    params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>,
    context: MiddlewareContext<ScalarsType, IDKey>,
  ) => Promise<ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>>
  afterReplace?: (params: ReplaceParams<FilterType, ModelType, ExcludedFields, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
  beforeDelete?: (params: DeleteParams<FilterType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<DeleteParams<FilterType, OptionsType>>
  afterDelete?: (params: DeleteParams<FilterType, OptionsType>, context: MiddlewareContext<ScalarsType, IDKey>) => Promise<void>
}
