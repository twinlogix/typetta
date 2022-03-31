/* eslint-disable @typescript-eslint/no-explicit-any */
import { OmitIfKnown } from '../../../../utils/utils.types'
import { DAOGenerics, DAOParams, IdGenerationStrategy } from '../../../dao/dao.types'
import { AbstractDAOContext } from '../../../daoContext/daoContext'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof OmitIfKnown<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  PureFilterType = any,
  RawFilterType = any,
  RelationsType = any,
  ProjectionType extends object = any,
  PureSortType = any,
  RawSortType = any,
  InsertType extends object = any,
  PureUpdateType = any,
  RawUpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  RelationsFields extends keyof ModelType = any,
  MetadataType = any,
  OperationMetadataType = any,
  ScalarsType extends DefaultModelScalars = any,
  NameType extends string = any,
  DAOContext extends AbstractDAOContext<ScalarsType, MetadataType> = any,
> = DAOGenerics<
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
  PureUpdateType,
  RawUpdateType,
  ExcludedFields,
  RelationsFields,
  MetadataType,
  OperationMetadataType,
  {
    tableName: string
    knex: Knex<any, unknown[]>
  },
  ScalarsType,
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  NameType,
  DAOContext
>

export type KnexJsDAOParams<T extends KnexJsDAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
