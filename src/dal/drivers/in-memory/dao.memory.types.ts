/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractEntityManager, AbstractScalars, AbstractSyntaxTree, DAOGenerics, DAOParams } from '../../..'
import { DefaultModelScalars } from '../drivers.types'

export type InMemoryDAOGenerics<
  Entity extends string = any,
  AST extends AbstractSyntaxTree = any,
  Scalars extends AbstractScalars<keyof DefaultModelScalars> = any,
  MetadataType = any,
  OperationMetadataType = any,
  EntityManager extends AbstractEntityManager<string, string, Scalars, MetadataType> = AbstractEntityManager<string, string, Scalars, MetadataType>,
> = DAOGenerics<Entity, AST, Scalars, MetadataType, OperationMetadataType, Record<never, never>, unknown, unknown, unknown, unknown, unknown, unknown, EntityManager>

export type InMemoryDAOParams<T extends DAOGenerics> = Omit<DAOParams<T>, 'driverContext'>
