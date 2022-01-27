import { DefaultModelScalars } from '../../../drivers/drivers.types'
import { DAOGenerics, IdGenerationStrategy, MiddlewareContext } from '../../dao.types'
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

const ERROR_PREFIX = '[Tenant Middleware] '
export function tenantSecurityPolicy<T extends MultiTenantDAOGenerics, TenantIdKey extends keyof T['model'] & keyof T['metadata']>(args: {
  tenantKey: TenantIdKey
  rawOperations?: 'forbidden' | 'warning' | 'allowed'
}): DAOMiddleware<T> {
  const rawOpPolicy = args.rawOperations ?? 'forbidden'
  const key = args.tenantKey

  function getTenantId(context: MiddlewareContext<T>): T['metadata'][TenantIdKey] | null {
    if (!context.metadata) {
      return null
    }
    return context.metadata[key]
  }
  function elabFilter(filter: T['filter'] | undefined, tenantId: T['metadata'][TenantIdKey]): T['filter'] {
    if (!filter) {
      return { [key]: tenantId }
    }
    if (typeof filter === 'function') {
      if (rawOpPolicy === 'forbidden') {
        throw new Error(`${ERROR_PREFIX}Raw filter is disabled. To enable it set "rawOperation: 'warning'" in 'tenantSecurityPolicy' middleware params.`)
      }
      if (rawOpPolicy === 'warning') {
        // TODO: log warning
      }
      return filter
    } else {
      if (filter[key] && filter[key] !== tenantId) {
        throw new Error(`${ERROR_PREFIX}Invalid tenant ID in find. Current selected tenant ID is ${tenantId}, but received ${filter[key]} instead.`)
      }
      return { $and: [{ [key]: tenantId }, filter] }
    }
  }
  return buildMiddleware<T>({
    beforeInsert: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      if (params.record[key] == null) {
        return { continue: true, params: { ...params, record: { ...params.record, [key]: tenantId } } }
      }
      if (params.record[key] !== tenantId) {
        throw new Error(`${ERROR_PREFIX}[Tenant middleware]: Invalid tenant ID in insert. Current selected tenant ID is ${tenantId}, but received ${params.record[key]} instead.`)
      }
    },
    beforeFind: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      return { continue: true, params: { ...params, filter: elabFilter(params.filter, tenantId) } }
    },
    beforeUpdate: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      const filter = elabFilter(params.filter, tenantId)
      if (typeof params.changes === 'function') {
        if (rawOpPolicy === 'forbidden') {
          throw new Error(`${ERROR_PREFIX}Raw filter is disabled. To enable it set "rawOperation: 'warning'" in 'tenantSecurityPolicy' middleware params.`)
        }
        if (rawOpPolicy === 'warning') {
          // TODO: log warning
        }
        return { continue: true, params: { ...params, filter } }
      } else {
        if (params.changes[key] && params.changes[key] !== tenantId) {
          throw new Error(`${ERROR_PREFIX}Invalid tenant ID in update. Current selected tenant ID is ${tenantId}, but received ${params.changes[key]} instead.`)
        }
        return { continue: true, params: { ...params, filter, changes: { ...params.changes, [key]: tenantId } } }
      }
    },
    beforeReplace: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      const filter = elabFilter(params.filter, tenantId)
      if (params.replace[key] && params.replace[key] !== tenantId) {
        throw new Error(`${ERROR_PREFIX}Invalid tenant ID in replace. Current selected tenant ID is ${tenantId}, but received ${params.replace[key]} instead.`)
      }
      return { continue: true, params: { ...params, filter, replace: { ...params.replace, [key]: tenantId } } }
    },
    beforeDelete: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      return { continue: true, params: { ...params, filter: elabFilter(params.filter, tenantId) } }
    },
  })
}
