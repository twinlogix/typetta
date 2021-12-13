import { DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOParams<
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IDScalar extends keyof ScalarsType,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType extends object,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  SortType,
  OptionsType,
  ScalarsType extends DefaultModelScalars,
> = Omit<DAOParams<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType, { knex: Knex }, ScalarsType>, 'driverOptions'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
