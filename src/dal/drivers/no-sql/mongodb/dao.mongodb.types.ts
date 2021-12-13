import { DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Collection } from 'mongodb'

export type MongoDBDAOParams<
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
> = Omit<
  DAOParams<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, UpdateType, ExcludedFields, SortType, OptionsType, { collection: Collection }, ScalarsType>,
  'driverOptions'
> & {
  collection: Collection
}
