import { setTraversing } from '../../../../utils/utils'
import { DAOGenerics } from '../../dao.types'
import { isProjectionContained } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { SecurityPolicyDeleteError, SecurityPolicyReadError, SecurityPolicyUpdateError, SecurityPolicyWriteError } from './security.error'
import { PERMISSION, CRUDPermission } from './security.policy'

type SecurityContext<Permission extends string, SecurityContextPermission> = {
  [Kp in Permission]?: SecurityContextPermission[]
}

type Permissions<T extends DAOGenerics, Permission extends string> = {
  [Key in Permission]?: CRUDPermission<T>
}

export function securityPolicy<
  Permission extends string,
  T extends DAOGenerics,
  SecurityDomainKeys extends string,
  SecurityContextPermission extends { [K in SecurityDomainKeys]?: T['model'][K] | true },
  SecurityDomain extends { [K in SecurityDomainKeys]?: T['model'][K][] },
>(input: {
  permissions: Permissions<T, Permission>
  securityContext: (metadata: T['metadata']) => SecurityContext<Permission, SecurityContextPermission>
  securityDomain: (metadata: Exclude<T['operationMetadata'], undefined | null>) => SecurityDomain | undefined
  defaultPermission?: CRUDPermission<T>
}): DAOMiddleware<T> {
  type RelatedSecurityContext = {
    domain: SecurityContextPermission[] | true
    crud: CRUDPermission<T>
    permission: Permission
  }[]
  function getRelatedSecurityContext(context: T['driverContext']): RelatedSecurityContext {
    const securityContext = input.securityContext(context.metadata)
    return Object.entries(input.permissions).flatMap(([k, v]) => {
      const permission = k as Permission
      const crud = v as CRUDPermission<T>
      const domain: SecurityContextPermission[] | undefined | true = securityContext[permission]
      if (domain) {
        return [{ domain, crud, permission }]
      }
      return []
    })
  }

  function getCrudPolicy(operationSecurityDomain: SecurityDomain, relatedSecurityContext: RelatedSecurityContext) {
    const noDomainCrud = relatedSecurityContext.flatMap((rsc) => (rsc.domain === true ? [rsc.crud] : []))
    const withDomainCrud = Object.entries(operationSecurityDomain).map(([k, v]) => {
      const domainKey = k as SecurityDomainKeys
      const domainValues = v as T['model'][SecurityDomainKeys][]
      const cruds = domainValues.map((domainValue) => {
        const cruds = relatedSecurityContext.flatMap((rsc) =>
          rsc.domain === true ||
          rsc.domain.some((atom) => {
            const atomKeys = Object.keys(atom) as SecurityDomainKeys[]
            if (!atomKeys.includes(domainKey)) {
              return false
            }
            const match = typeof domainValue === 'object' && 'equals' in domainValue && typeof domainValue.equals === 'function' ? domainValue.equals(atom[domainKey]) : atom[domainKey] === domainValue
            return (
              match &&
              atomKeys
                .filter((atomKey) => atomKey !== domainKey)
                .every((atomKey) => {
                  const domains: T['model'][SecurityDomainKeys][] = operationSecurityDomain[atomKey] ?? []
                  return domains.some((dv) => (typeof dv === 'object' && 'equals' in dv && typeof dv.equals === 'function' ? dv.equals(atom[atomKey]) : atom[atomKey] === dv))
                })
            )
          })
            ? [rsc.crud]
            : [],
        )
        return PERMISSION.or(cruds)
      })
      return PERMISSION.and(cruds)
    })
    const finalCruds = [...withDomainCrud, ...noDomainCrud, ...(input.defaultPermission ? [input.defaultPermission] : [])]
    const crud = finalCruds.length > 0 ? PERMISSION.or(finalCruds) : PERMISSION.DENY
    return crud
  }

  function isContained(container: { [key: string]: unknown }, contained: { [key: string]: unknown }): boolean {
    return Object.entries(contained).every(([k, v]) =>
      v && typeof v === 'object' && 'equals' in v && typeof (v as { equals: unknown }).equals === 'function' ? (v as { equals: (i: unknown) => boolean }).equals(container[k]) : container[k] === v,
    )
  }

  return {
    before: async (args, context) => {
      const relatedSecurityContext = getRelatedSecurityContext(context)

      if (args.operation === 'insert') {
        const cruds = relatedSecurityContext.flatMap((rsc) => (rsc.domain === true || rsc.domain.some((atom) => isContained(args.params.record, atom)) ? [rsc.crud] : []))
        const crud = cruds.length > 0 ? PERMISSION.or(cruds) : input.defaultPermission ?? PERMISSION.DENY
        if (!crud.create) {
          throw new SecurityPolicyWriteError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]) })
        }
        return
      }

      const operationSecurityDomain = (args.params.metadata ? input.securityDomain(args.params.metadata) ?? {} : {}) as SecurityDomain
      const crud = getCrudPolicy(operationSecurityDomain, relatedSecurityContext)

      const domainFilters = operationSecurityDomain && Object.keys(operationSecurityDomain).length > 0 ? { $or: Object.entries(operationSecurityDomain).map(([k, v]) => ({ [k]: { in: v } })) } : null
      const filter = 'filter' in args.params && args.params.filter != null && domainFilters ? { $and: [args.params.filter, domainFilters] } : domainFilters ? domainFilters : 'filter' in args.params ? args.params.filter : undefined
      if (args.operation === 'find') {
        const [contained, invalidFields] = isProjectionContained(crud.read ?? false, args.params.projection ?? true)
        if (!contained) {
          throw new SecurityPolicyReadError({
            allowedProjection: crud.read ?? false,
            requestedProjection: args.params.projection ?? true,
            unauthorizedProjection: invalidFields,
            permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]),
            operationDomains: operationSecurityDomain,
          })
        }

        return { continue: true, operation: 'find', params: { ...args.params, filter } }
      }

      if (args.operation === 'aggregate') {
        const fields: T['pureSort'][] = [...Object.keys(args.params.by ?? {}), ...Object.values(args.params.aggregations).flatMap((v) => (v.field ? [v.field] : []))]
        const projection = fields.reduce((proj, field) => {
          setTraversing(proj, field, true)
          return proj
        }, {})
        const [contained, invalidFields] = isProjectionContained(crud.read ?? false, projection)
        if (!contained) {
          throw new SecurityPolicyReadError({
            allowedProjection: crud.read ?? false,
            requestedProjection: projection,
            unauthorizedProjection: invalidFields,
            permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]),
            operationDomains: operationSecurityDomain,
          })
        }
        return { continue: true, operation: 'aggregate', params: { ...args.params, filter } }
      }

      if (args.operation === 'update') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomain })
        }
        return { continue: true, operation: 'update', params: { ...args.params, filter } }
      }

      if (args.operation === 'replace') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomain })
        }
        return { continue: true, operation: 'replace', params: { ...args.params, filter } }
      }

      if (args.operation === 'delete') {
        if (!crud.delete) {
          throw new SecurityPolicyDeleteError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomain })
        }
        return { continue: true, operation: 'delete', params: { ...args.params, filter } }
      }
    },
  }
}
