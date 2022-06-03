import { DAOGenerics, MiddlewareContext } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

const ERROR_PREFIX = '[Tenant Middleware] '
export function tenantSecurityPolicy<T extends DAOGenerics, TenantIdKey extends keyof T['insertResult'] & keyof T['metadata']>(args: {
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
    if (typeof filter === 'object' && filter[key] && filter[key] !== tenantId) {
      throw new Error(`${ERROR_PREFIX}Invalid tenant ID in find. Current selected tenant ID is ${tenantId}, but received ${filter[key]} instead.`)
    }
    return { $and: [{ [key]: tenantId }, filter] }
  }
  return buildMiddleware<T>({
    beforeInsert: async (params, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      if (params.record[key] == null) {
        return { continue: true, params: { ...params, record: { ...params.record, [key]: tenantId } } }
      }
      if (params.record[key] !== tenantId) {
        throw new Error(`${ERROR_PREFIX}Invalid tenant ID in insert. Current selected tenant ID is ${tenantId}, but received ${params.record[key]} instead.`)
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
          throw new Error(`${ERROR_PREFIX}Raw changes is disabled. To enable it set "rawOperation: 'warning'" in 'tenantSecurityPolicy' middleware params.`)
        }
        if (rawOpPolicy === 'warning' && context.logger) {
          context.logger({
            date: new Date(),
            level: 'warning',
            dao: context.daoName,
            raw: `A raw update will be executed while using tenantSecurityPolicy middleware. Unsafe operations could occur.`,
          })
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
    beforeAggregate: async (params, args, context) => {
      const tenantId = getTenantId(context)
      if (!tenantId) return
      return { continue: true, params: { ...params, filter: elabFilter(params.filter, tenantId) }, args }
    },
  })
}
