import { setTraversing } from '../../../../utils/utils'
import { DAOGenerics } from '../../dao.types'
import { isProjectionContained } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { SecurityPolicyDeleteError, SecurityPolicyReadError, SecurityPolicyUpdateError, SecurityPolicyWriteError } from './security.error'
import { CRUD, CRUDPermission } from './security.policy'

type SecurityContext<Permissions extends string, SecurityContextPermission> = {
  [Kp in Permissions]?: SecurityContextPermission[]
}

type SecurityPolicy<T extends DAOGenerics, Permissions extends string> = {
  [Key in Permissions]?: CRUDPermission<T>
}

export function securityPolicy<
  Permissions extends string,
  T extends DAOGenerics,
  SecurityDomainKeys extends string,
  SecurityContextPermission extends { [K in SecurityDomainKeys]?: T['model'][K] },
  SecurityDomain extends { [K in SecurityDomainKeys]?: T['model'][K][] },
>(input: {
  securityPolicy: SecurityPolicy<T, Permissions>
  securityContext: (metadata: T['metadata']) => SecurityContext<Permissions, SecurityContextPermission>
  securityDomain: (metadata: T['operationMetadata']) => SecurityDomain | undefined
}): DAOMiddleware<T> {
  type RelatedSecurityContext = {
    domain: SecurityContextPermission[]
    crud: CRUDPermission<T>
    permission: Permissions
  }[]
  function getRelatedSecurityContext(context: T['driverContext']): RelatedSecurityContext {
    const securityContext = input.securityContext(context.metadata)
    return Object.entries(input.securityPolicy).flatMap(([k, v]) => {
      const permission = k as Permissions
      const crud = v as CRUDPermission<T>
      const domain: SecurityContextPermission[] | undefined = securityContext[permission]
      if (domain) {
        return [{ domain, crud, permission }]
      }
      return []
    })
  }

  function getCrudPolicy(operationSecurityDomain: SecurityDomain, relatedSecurityContext: RelatedSecurityContext) {
    const cruds = Object.entries(operationSecurityDomain).map(([k, v]) => {
      const domainKey = k as SecurityDomainKeys
      const domainValues = v as T['model'][SecurityDomainKeys][]
      const cruds = domainValues.map((domainValue) => {
        const cruds = relatedSecurityContext.flatMap((rsc) =>
          rsc.domain.some((atom) => {
            const atomKeys = Object.keys(atom) as SecurityDomainKeys[]
            if (!atomKeys.includes(domainKey)) {
              return false
            }
            return atom[domainKey] === domainValue && atomKeys.filter((atomKey) => atomKey !== domainKey).every((atomKey) => (operationSecurityDomain[atomKey] ?? []).includes(atom[atomKey] as never))
          })
            ? [rsc.crud]
            : [],
        )
        return CRUD.or(cruds)
      })
      return CRUD.and(cruds)
    })
    const crud = CRUD.or(cruds)
    return crud
  }

  function isContained(container: { [key: string]: unknown }, contained: { [key: string]: unknown }): boolean {
    return Object.entries(contained).every(([k, v]) => container[k] === v)
  }

  return {
    before: async (args, context) => {
      const relatedSecurityContext = getRelatedSecurityContext(context)

      if (args.operation === 'insert') {
        const cruds = relatedSecurityContext.flatMap((rsc) => (rsc.domain.some((atom) => isContained(args.params.record, atom)) ? [rsc.crud] : []))
        const crud = CRUD.or(cruds)
        if (!crud.write) {
          throw new SecurityPolicyWriteError({ permissions: relatedSecurityContext.map((policy) => policy.permission) })
        }
        return
      }

      const operationSecurityDomain = (args.params.metadata ? input.securityDomain(args.params.metadata) ?? {} : {}) as SecurityDomain
      const crud = getCrudPolicy(operationSecurityDomain, relatedSecurityContext)

      const domainFilters = { $or: Object.entries(operationSecurityDomain).map(([k, v]) => ({ [k]: { $in: v } })) }
      const filter = 'filter' in args.params ? { $and: [args.params.filter, domainFilters] } : domainFilters
      if (args.operation === 'find') {
        const [contained, invalidFields] = isProjectionContained(crud.read ?? false, args.params.projection ?? true)
        if (!contained) {
          throw new SecurityPolicyReadError({
            allowedProjection: crud.read ?? false,
            requestedProjection: args.params.projection ?? true,
            unauthorizedProjection: invalidFields,
            permissions: relatedSecurityContext.map((policy) => policy.permission),
            domains: operationSecurityDomain,
          })
        }

        return { continue: true, operation: 'find', params: { ...args.params, filter } }
      }

      if (args.operation === 'aggregate') {
        const fields: (T['pureSort'])[] = [...Object.keys(args.params.by ?? {}), ...Object.values(args.params.aggregations).flatMap((v) => (v.field ? [v.field] : []))]
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
            permissions: relatedSecurityContext.map((policy) => policy.permission),
            domains: operationSecurityDomain,
          })
        }
        return { continue: true, operation: 'aggregate', params: { ...args.params, filter } }
      }

      if (args.operation === 'update') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => policy.permission), domains: operationSecurityDomain })
        }
        return { continue: true, operation: 'update', params: { ...args.params, filter } }
      }

      if (args.operation === 'replace') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => policy.permission), domains: operationSecurityDomain })
        }
        return { continue: true, operation: 'replace', params: { ...args.params, filter } }
      }

      if (args.operation === 'delete') {
        if (!crud.delete) {
          throw new SecurityPolicyDeleteError({ permissions: relatedSecurityContext.map((policy) => policy.permission), domains: operationSecurityDomain })
        }
        return { continue: true, operation: 'delete', params: { ...args.params, filter } }
      }
    },
  }
}
