import { DAOGenerics, DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof Omit<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  FilterType = any,
  ProjectionType extends object = any,
  SortType = any,
  InsertType extends object = any,
  UpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  OptionsType extends object = any,
  DriverContext = any,
  ScalarsType extends DefaultModelScalars = any,
> = Omit<
  DAOGenerics<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, SortType, InsertType, UpdateType, ExcludedFields, OptionsType, DriverContext, ScalarsType>,
  'driverContext'
> & { driverContext: { knex: Knex } }

export type KnexJsDAOParams<T extends KnexJsDAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
