/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractDAOContext, DAOGenerics, DAOParams, OmitIfKnown } from '../../..'
import { DefaultModelScalars } from '../drivers.types'

export type InMemoryDAOGenerics<
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
  MetadataType = any,
  OperationMetadataType = any,
  ScalarsType extends DefaultModelScalars = any,
  NameType extends string = any,
  DAOContext extends AbstractDAOContext<string, string, ScalarsType, MetadataType> = AbstractDAOContext<string, string, ScalarsType, MetadataType>,
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
  MetadataType,
  OperationMetadataType,
  Record<never, never>,
  ScalarsType,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  NameType,
  DAOContext
>

export type InMemoryDAOParams<T extends DAOGenerics> = Omit<DAOParams<T>, 'driverContext'>
