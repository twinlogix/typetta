/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractScalars, AbstractSyntaxTree, CachedTypes } from '../../../..'
import { DAOGenerics, DAOParams } from '../../../dao/dao.types'
import { AbstractEntityManager } from '../../../entity-manager'
import { DefaultModelScalars } from '../../drivers.types'
import { Knex } from 'knex'

export type KnexJsDAOGenerics<
  Entity extends string = any,
  AST extends AbstractSyntaxTree = any,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = any,
  Types extends CachedTypes = any,
  MetadataType = any,
  OperationMetadataType = any,
  EntityManager extends AbstractEntityManager<string, string, Scalars, MetadataType> = AbstractEntityManager<string, string, Scalars, MetadataType>,
> = DAOGenerics<
  Entity,
  AST,
  Scalars,
  Types,
  MetadataType,
  OperationMetadataType,
  {
    tableName: string
    knex: Knex<any, unknown[]>
  },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  { trx?: Knex.Transaction },
  EntityManager
>

export type KnexJsDAOParams<T extends KnexJsDAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  tableName: string
  knex: Knex<any, unknown[]>
}
