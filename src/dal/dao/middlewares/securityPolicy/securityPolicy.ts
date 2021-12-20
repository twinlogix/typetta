import { DefaultModelScalars } from '../../../drivers/drivers.types'
import { DAOGenerics, IdGenerationStrategy } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { PartialDeep } from 'type-fest'

export type SecurityPolicyDAOGenerics<
  SecurityContext = any,
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
  OptionsType extends { securityContext: SecurityContext } = any,
  DriverOptionType = any,
  ScalarsType extends DefaultModelScalars = any,
> = DAOGenerics<ModelType, IDKey, IDScalar, IdGeneration, FilterType, ProjectionType, SortType, InsertType, UpdateType, ExcludedFields, OptionsType, DriverOptionType, ScalarsType> & {
  securityContext: SecurityContext
}

export function securityPolicy<T extends SecurityPolicyDAOGenerics>(args: {
  secureFilters?: (filter?: T['filterType'], securityContext?: T['securityContext']) => Promise<T['filterType'] | undefined>
  secureProjections?: (filter?: T['filterType'], projections?: T['projectionType'], securityContext?: T['securityContext']) => Promise<T['projectionType'] | undefined>
  secureReturnedRecords?: (
    records: PartialDeep<T['modelType']>[],
    filter?: T['filterType'],
    projections?: T['projectionType'],
    securityContext?: T['securityContext'],
  ) => Promise<PartialDeep<T['modelType']>[]>
  secureNewRecord?: (record: T['insertType'], securityContext?: T['securityContext']) => Promise<T>
  secureChanges?: (changes: T['updateType'], filter?: T['filterType'], securityContext?: T['securityContext']) => Promise<T['updateType']>
}): DAOMiddleware<T> {
  return {
    beforeFind: async (params) => {
      return {
        ...params,
        filter: args.secureFilters ? await args.secureFilters(params.filter, params.options?.securityContext) : params.filter,
        projection: args.secureProjections ? await args.secureProjections(params.filter, params.projection, params.options?.securityContext) : params.projection,
      }
    },
    afterFind: async (params, records) => {
      return args.secureReturnedRecords ? await args.secureReturnedRecords(records, params.filter, params.projection, params.options?.securityContext) : records
    },
    beforeInsert: async (params) => {
      return {
        ...params,
        record: args.secureNewRecord ? await args.secureNewRecord(params.record, params.options?.securityContext) : params.record,
      }
    },
    beforeUpdate: async (params) => {
      return {
        ...params,
        filter: args.secureFilters ? (await args.secureFilters(params.filter, params.options?.securityContext)) || params.filter : params.filter,
        changes: args.secureChanges ? await args.secureChanges(params.changes, params.filter, params.options?.securityContext) : params.changes,
      }
    },
    beforeReplace: async (params) => {
      return {
        ...params,
        filter: args.secureFilters ? (await args.secureFilters(params.filter, params.options?.securityContext)) || params.filter : params.filter,
        replace: args.secureNewRecord ? await args.secureNewRecord(params.replace, params.options?.securityContext) : params.replace,
      }
    },
    beforeDelete: async (params) => {
      return {
        ...params,
        filter: args.secureFilters ? (await args.secureFilters(params.filter, params.options?.securityContext)) || params.filter : params.filter,
      }
    },
  }
}
