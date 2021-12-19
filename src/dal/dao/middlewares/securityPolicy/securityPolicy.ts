import { IdGenerationStrategy } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { PartialDeep } from 'type-fest'

export function securityPolicy<
  SecurityContext,
  ModelType extends object,
  IDKey extends keyof Omit<ModelType, ExcludedFields>,
  IdGeneration extends IdGenerationStrategy,
  FilterType,
  ProjectionType extends object,
  InsertType extends object,
  UpdateType,
  ExcludedFields extends keyof ModelType,
  OptionsType extends { securityContext: SecurityContext },
>(args: {
  secureFilters?: (filter?: FilterType, securityContext?: SecurityContext) => Promise<FilterType | undefined>
  secureProjections?: (filter?: FilterType, projections?: ProjectionType, securityContext?: SecurityContext) => Promise<ProjectionType | undefined>
  secureReturnedRecords?: (records: PartialDeep<ModelType>[], filter?: FilterType, projections?: ProjectionType, securityContext?: SecurityContext) => Promise<PartialDeep<ModelType>[]>
  secureNewRecord?: <T extends InsertType>(record: T, securityContext?: SecurityContext) => Promise<T>
  secureChanges?: (changes: UpdateType, filter?: FilterType, securityContext?: SecurityContext) => Promise<UpdateType>
}): DAOMiddleware<ModelType, IDKey, IdGeneration, FilterType, ProjectionType, InsertType, UpdateType, ExcludedFields, any, OptionsType, any> {
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
