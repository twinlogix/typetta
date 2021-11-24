import { DAOParams } from '../../../dao/dao.types';
import { Projection } from '../../../dao/projections/projections.types';
import { Knex } from 'knex';

export type KnexJsDAOParams<
  ModelType,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDAutogenerated extends boolean,
  FilterType,
  ProjectionType extends Projection<ModelType>,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  ScalarsType
  >
  =
  DAOParams<
    ModelType,
    IDKey,
    IDAutogenerated,
    FilterType,
    ProjectionType,
    UpdateType,
    ExcludedFields,
    SortType,
    OptionsType,
    ScalarsType
  > &
  {
    tableName: string;
    knex: Knex<any, unknown[]>
  }