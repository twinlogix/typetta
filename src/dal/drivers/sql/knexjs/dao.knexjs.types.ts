/* eslint-disable @typescript-eslint/no-explicit-any */
import { OmitIfKnown } from '../../../../utils/utils.types'
import { DAOGenerics, DAOParams } from '../../../dao/dao.types'
import { AbstractEntityManager } from '../../../entity-manager'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOGenerics<
  ModelType extends object = any,
  IDKey extends keyof OmitIfKnown<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
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
  EmbeddedFields extends keyof ModelType = any,
  RetrieveAll extends object = any,
  MetadataType = any,
  OperationMetadataType = any,
  ScalarsType extends DefaultModelScalars = any,
  NameType extends string = any,
  EntityManager extends AbstractEntityManager<string, string, ScalarsType, MetadataType> = AbstractEntityManager<string, string, ScalarsType, MetadataType>,
> = DAOGenerics<
  ModelType,
  IDKey,
  IDScalar,
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
  EmbeddedFields,
  RetrieveAll,
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
  EntityManager
>

export type KnexJsDAOParams<T extends KnexJsDAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
