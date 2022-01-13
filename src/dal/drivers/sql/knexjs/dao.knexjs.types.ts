import { DAOGenerics, DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof Omit<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  PureFilterType = any,
  RawFilterType = any,
  RelationsType = any,
  ProjectionType extends object = any,
  PureSortType = any,
  RawSortType = any,
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
    PureFilterType,
    RawFilterType,
    RelationsType,
    ProjectionType,
    PureSortType,
    RawSortType,
    InsertType,
    UpdateType,
    ExcludedFields,
    MetadataType,
    OperationMetadataType,
    DriverContext,
    ScalarsType,
    { trx?: Knex.Transaction },
    { trx?: Knex.Transaction },
    { trx?: Knex.Transaction },
    { trx?: Knex.Transaction },
    { trx?: Knex.Transaction },
    { trx?: Knex.Transaction }
  >,
  'driverContext'
> & { driverContext: { knex: Knex } }

export type KnexJsDAOParams<T extends KnexJsDAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
