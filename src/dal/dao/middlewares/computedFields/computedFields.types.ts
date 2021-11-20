import { PartialDeep } from 'type-fest';
import { ModelProjection, Projection, StaticProjection } from '../../projections/projections.types';

export type DAOComputedFields<ModelType, P extends true | StaticProjection<ModelType> | undefined | Projection<ModelType>> = {
  fieldsProjection: Projection<ModelType>
  requiredProjection: P
  compute: (record: ModelProjection<ModelType, P>) => Promise<PartialDeep<ModelType>>
}
