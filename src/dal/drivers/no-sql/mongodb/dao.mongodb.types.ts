/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractScalars, AbstractSyntaxTree } from '../../../..'
import { DAOGenerics, DAOParams } from '../../../dao/dao.types'
import { AbstractEntityManager } from '../../../entity-manager'
import { DefaultModelScalars } from '../../drivers.types'
import { Collection, CountOptions, DeleteOptions, FindOptions, InsertOneOptions, ReplaceOptions, UpdateOptions } from 'mongodb'

export type MongoDBDAOGenerics<
  Entity extends string = any,
  AST extends AbstractSyntaxTree = any,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = any,
  MetadataType = any,
  OperationMetadataType = any,
  EntityManager extends AbstractEntityManager<string, string, Scalars, MetadataType> = AbstractEntityManager<string, string, Scalars, MetadataType>,
> = DAOGenerics<
  Entity,
  AST,
  Scalars,
  MetadataType,
  OperationMetadataType,
  { collection: Collection },
  CountOptions,
  FindOptions,
  InsertOneOptions,
  UpdateOptions,
  ReplaceOptions,
  DeleteOptions,
  EntityManager
>

export type MongoDBDAOParams<T extends DAOGenerics> = Omit<DAOParams<T>, 'driverContext'> & {
  collection: Collection
}
