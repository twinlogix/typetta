import { DAOGenerics, DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Collection, CountOptions, FindOptions, InsertOneOptions } from 'mongodb'

export type MongoDBDAOGenerics<
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
  DAOGenerics<
    ModelType,
    IDKey,
    IDScalar,
    IdGeneration,
    FilterType,
    ProjectionType,
    SortType,
    InsertType,
    UpdateType,
    ExcludedFields,
    OptionsType,
    DriverContext,
    ScalarsType,
    CountOptions,
    FindOptions,
    InsertOneOptions
  >,
  'driverContext'
> & { driverContext: { collection: Collection } }

export type MongoDBDAOParams<T extends DAOGenerics> = Omit<DAOParams<T>, 'driverOptions'> & {
  collection: Collection
}
