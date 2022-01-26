import { DefaultModelScalars } from '../../../drivers/drivers.types'
import { DAOGenerics, IdGenerationStrategy } from '../../dao.types'
import { projection } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

export type MultiTenantDAOGenerics<
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
  RelationsFields extends keyof ModelType = any,
  MetadataType extends object = any,
  OperationMetadataType = any,
  DriverContextType = any,
  ScalarsType extends DefaultModelScalars = any,
  DriverFilterOptions = any,
  DriverFindOptions = any,
  DriverInsertOptions = any,
  DriverUpdateOptions = any,
  DriverReplaceOptions = any,
  DriverDeleteOptions = any,
  NameType extends string = any,
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
  DriverContextType,
  ScalarsType,
  DriverFilterOptions,
  DriverFindOptions,
  DriverInsertOptions,
  DriverUpdateOptions,
  DriverReplaceOptions,
  DriverDeleteOptions,
  NameType
>

export function tenantSecurityPolicy<T extends MultiTenantDAOGenerics, TenantIdKey extends keyof T['model'] & keyof T['metadata']>(args: {
  tenantIdField: TenantIdKey
  rawOperations?: 'forbidden' | 'warning' | 'allowed'
}): DAOMiddleware<T> {
  return buildMiddleware<T>({
    beforeInsert: async (params, context) => {
      if (!context.metadata) {
        return { continue: true, params }
      }
      const tenantId = context.metadata[args.tenantIdField]
      if (params.record[args.tenantIdField] == null || params.record[args.tenantIdField] !== tenantId) {
        throw new Error(`Invalid tenant ID in insert. Current selected tenant ID is ${tenantId}, but received ${params.record[args.tenantIdField]} instead.`)
      }
    },
    beforeFind: async (params, context) => {
      if (!context.metadata) {
        return { continue: true, params }
      }
      const tenantId = context.metadata[args.tenantIdField]
      if (!params.filter) {
        return { continue: true, params: { ...params, filter: { [args.tenantIdField]: tenantId } } }
      }
      if (typeof params.filter !== 'function') {
        return { continue: true, params: { ...params, filter: { $and: [{ [args.tenantIdField]: tenantId }, params.filter] } } }
      } else {
        // needed in order to check tenantId in afterFind
        return { continue: true, params: { ...params, projection: projection<any>().merge(params.projection, { [args.tenantIdField]: true }) } }
      }
    },
    afterFind: async (params, records, totalCount, context) => {
      if (!context.metadata) {
        return { continue: true, params, records, totalCount }
      }
      const tenantId = context.metadata[args.tenantIdField]
      if (records.flatMap((v) => (v[args.tenantIdField] ? [v[args.tenantIdField]] : [])).some((tId) => tId !== tenantId)) {
        throw new Error(`Invalid tenant ID in find. Current selected tenant ID is ${context.metadata?.tenantId}.`)
      }
    },
    // beforeUpdate: async (params, context) => {},
  })
}
