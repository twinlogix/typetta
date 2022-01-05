import { DAOGenerics, DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Collection, CountOptions, DeleteOptions, FindOptions, InsertOneOptions, ReplaceOptions, UpdateOptions } from 'mongodb'

export type MongoDBDAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof Omit<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  FilterType = any,
  RelationsType = any,
  ProjectionType extends object = any,
  SortType = any,
  InsertType extends object = any,
  UpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  MetadataType = any,
  OperationMetadataType = any,
  DriverContext = any,
  ScalarsType extends DefaultModelScalars = any,
> = Omit<
  DAOGenerics<
    ModelType,
    IDKey,
    IDScalar,
    IdGeneration,
    FilterType,
    RelationsType,
    ProjectionType,
    SortType,
    InsertType,
    UpdateType,
    ExcludedFields,
    MetadataType,
    OperationMetadataType,
    DriverContext,
    ScalarsType,
    CountOptions,
    FindOptions,
    InsertOneOptions,
    UpdateOptions,
    ReplaceOptions,
    DeleteOptions
  >,
  'driverContext'
> & { driverContext: { collection: Collection } }

export type MongoDBDAOParams<T extends DAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  collection: Collection
}
