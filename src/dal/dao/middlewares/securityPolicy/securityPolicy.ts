import { DefaultModelScalars } from '../../../drivers/drivers.types'
import { DAOGenerics, IdGenerationStrategy } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'
import { PartialDeep } from 'type-fest'

export type SecurityPolicyDAOGenerics<
  SecurityContext = any,
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
  PureUpdateType = any,
  RawUpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  OptionsType extends { securityContext: SecurityContext } = any,
  DriverContext = any,
  ScalarsType extends DefaultModelScalars = any,
  NameType extends string = any
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
  OptionsType,
  DriverContext,
  ScalarsType,
  any,
  any,
  any,
  any,
  any,
  NameType
> & {
  securityContext: SecurityContext
}

export function securityPolicy<T extends SecurityPolicyDAOGenerics>(args: {
  secureFilters?: (filter?: T['filter'], securityContext?: T['securityContext']) => Promise<T['filter'] | undefined>
  secureProjections?: (filter?: T['filter'], projections?: T['projection'], securityContext?: T['securityContext']) => Promise<T['projection'] | undefined>
  secureReturnedRecords?: (records: PartialDeep<T['model']>[], filter?: T['filter'], projections?: T['projection'], securityContext?: T['securityContext']) => Promise<PartialDeep<T['model']>[]>
  secureNewRecord?: (record: T['insert'], securityContext?: T['securityContext']) => Promise<T>
  secureChanges?: (changes: T['update'], filter?: T['filter'], securityContext?: T['securityContext']) => Promise<T['update']>
}): DAOMiddleware<T> {
  return buildMiddleware({
    beforeFind: async (params) => {
      return {
        continue: true,
        params: {
          ...params,
          filter: args.secureFilters ? await args.secureFilters(params.filter, params.metadata?.securityContext) : params.filter,
          projection: args.secureProjections ? await args.secureProjections(params.filter, params.projection, params.metadata?.securityContext) : params.projection,
        },
      }
    },
    afterFind: async (params, records, totalCount) => {
      return {
        continue: true,
        params,
        records: args.secureReturnedRecords ? await args.secureReturnedRecords(records, params.filter, params.projection, params.metadata?.securityContext) : records,
        totalCount,
      }
    },
    beforeInsert: async (params) => {
      return {
        continue: true,
        params: {
          ...params,
          record: args.secureNewRecord ? await args.secureNewRecord(params.record, params.metadata?.securityContext) : params.record,
        },
      }
    },
    beforeUpdate: async (params) => {
      return {
        continue: true,
        params: {
          ...params,
          filter: args.secureFilters ? (await args.secureFilters(params.filter, params.metadata?.securityContext)) || params.filter : params.filter,
          changes: args.secureChanges ? await args.secureChanges(params.changes, params.filter, params.metadata?.securityContext) : params.changes,
        },
      }
    },
    beforeReplace: async (params) => {
      return {
        continue: true,
        params: {
          ...params,
          filter: args.secureFilters ? (await args.secureFilters(params.filter, params.metadata?.securityContext)) || params.filter : params.filter,
          replace: args.secureNewRecord ? await args.secureNewRecord(params.replace, params.metadata?.securityContext) : params.replace,
        },
      }
    },
    beforeDelete: async (params) => {
      return {
        continue: true,
        params: {
          ...params,
          filter: args.secureFilters ? (await args.secureFilters(params.filter, params.metadata?.securityContext)) || params.filter : params.filter,
        },
      }
    },
  })
}
