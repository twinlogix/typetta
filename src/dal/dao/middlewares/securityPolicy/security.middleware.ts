import { equals } from '../../../..'
import { setTraversing } from '../../../../utils/utils'
import { DAOGenerics } from '../../dao.types'
import { isProjectionContained } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { SecurityPolicyDeleteError, SecurityPolicyReadError, SecurityPolicyUpdateError, SecurityPolicyWriteError } from './security.error'
import { PERMISSION, CRUDPermission } from './security.policy'
import { inferOperationSecurityDomain } from './security.utils'

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
  SecurityContextPermission extends { [K in SecurityDomainKeys]?: T['plainModel'][K] | true },
  SecurityDomain extends { [K in SecurityDomainKeys]?: T['plainModel'][K][] },
>(input: {
  permissions: Permissions<T, Permission>
  securityContext: (metadata: T['metadata']) => SecurityContext<Permission, SecurityContextPermission>
  securityDomains: (metadata: T['operationMetadata'] | undefined) => SecurityDomain[] | undefined
  securityDomainsInjector?: (securityDomains: SecurityDomain[], metadata: T['operationMetadata'] | undefined) => T['operationMetadata'] | undefined
  defaultPermission?: CRUDPermission<T>
  domainMap?: { [K in keyof Required<SecurityDomain>]?: keyof T['model'] | { or: (keyof T['model'])[] } | { and: (keyof T['model'])[] } | null }
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

  function getCrudPolicy(operationSecurityDomains: SecurityDomain[], relatedSecurityContext: RelatedSecurityContext): CRUDPermission<T> {
    const cruds = operationSecurityDomains.map((operationSecurityDomain) => {
      const noDomainCrud = relatedSecurityContext.flatMap((rsc) => (rsc.domain === true ? [rsc.crud] : []))
      const withDomainCrud = Object.entries(operationSecurityDomain).map(([k, v]) => {
        const domainKey = k as SecurityDomainKeys
        const domainValues = v as T['plainModel'][SecurityDomainKeys][]
        const cruds = domainValues.map((domainValue) => {
          const cruds = relatedSecurityContext.flatMap((rsc) =>
            rsc.domain === true ||
            rsc.domain.some((atom) => {
              const atomKeys = Object.keys(atom) as SecurityDomainKeys[]
              if (!atomKeys.includes(domainKey)) {
                return false
              }
              return (
                equals(atom[domainKey], domainValue) &&
                atomKeys
                  .filter((atomKey) => atomKey !== domainKey)
                  .every((atomKey) => {
                    const domains: T['plainModel'][SecurityDomainKeys][] = operationSecurityDomain[atomKey] ?? []
                    return domains.some((dv) => equals(atom[atomKey], dv))
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
    })
    return PERMISSION.and(cruds)
  }

  function isContained(container: { [key: string]: unknown }, contained: { [key: string]: unknown }): boolean {
    return Object.entries(contained).every(([k, v]) =>
      v && typeof v === 'object' && 'equals' in v && typeof (v as { equals: unknown }).equals === 'function' ? (v as { equals: (i: unknown) => boolean }).equals(container[k]) : container[k] === v,
    )
  }

  return {
    name: 'Typetta - Security',
    before: async (args, context) => {
      const relatedSecurityContext = getRelatedSecurityContext(context)

      if (args.operation === 'insert') {
        for (const record of args.params.records) {
          const cruds = relatedSecurityContext.flatMap((rsc) => (rsc.domain === true || rsc.domain.some((atom) => isContained(record, atom)) ? [rsc.crud] : []))
          const crud = cruds.length > 0 ? PERMISSION.or(cruds) : input.defaultPermission ?? PERMISSION.DENY
          if (!crud.create) {
            throw new SecurityPolicyWriteError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]) })
          }
        }
        return
      }

      // infer operationSecurityDomain from filter
      let operationSecurityDomainIsInferred = false
      const inferredOperationSecurityDomain = () => {
        const result =
          input.domainMap && args.params.filter
            ? inferOperationSecurityDomain(
                Object.entries(input.domainMap)
                  .filter((v) => v[1] != null)
                  .flatMap((v) => {
                    const domain = v[1] as string | { or: string[] } | { and: string[] }
                    if (typeof domain === 'object' && 'or' in domain) {
                      return domain.or
                    } else if (typeof domain === 'object' && 'and' in domain) {
                      return domain.and
                    }
                    return [domain]
                  }),
                args.params.filter,
              )
            : [{} as SecurityDomain]
        operationSecurityDomainIsInferred = true
        return result
      }
      const givenOperationSecurityDomains = input.securityDomains(args.params.metadata)
      const operationSecurityDomains = givenOperationSecurityDomains ?? (inferredOperationSecurityDomain() as SecurityDomain[])
      const metadata = operationSecurityDomainIsInferred && input.securityDomainsInjector ? input.securityDomainsInjector(operationSecurityDomains, args.params.metadata) : args.params.metadata
      const crud = getCrudPolicy(operationSecurityDomains, relatedSecurityContext)

      const isValidFilter = givenOperationSecurityDomains ? givenOperationSecurityDomains.some((osd) => Object.keys(osd).length > 0) : false
      const domainFiltersOr = givenOperationSecurityDomains
        ? givenOperationSecurityDomains.map((osd) => {
            const ands = Object.entries(osd).map(([k, v]) => ({ [k]: { in: v } }))
            if (ands.length === 1) {
              return ands[0]
            }
            return { $and: ands }
          })
        : null
      const domainFilters = domainFiltersOr
        ? domainFiltersOr.length > 0
          ? isValidFilter
            ? domainFiltersOr.length === 1
              ? domainFiltersOr[0]
              : { $or: domainFiltersOr }
            : null
          : { [context.idField]: null }
        : null
      const filter =
        'filter' in args.params && args.params.filter != null && domainFilters
          ? { $and: [args.params.filter, domainFilters] }
          : domainFilters
            ? domainFilters
            : 'filter' in args.params
              ? args.params.filter
              : undefined
      if (args.operation === 'find') {
        if (context.specificOperation === 'exists' || context.specificOperation === 'count') {
          if (!crud.read) {
            throw new SecurityPolicyReadError({
              allowedProjection: false,
              requestedProjection: {},
              unauthorizedProjection: {},
              permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]),
              operationDomains: operationSecurityDomains,
            })
          }
        } else {
          const [contained, invalidFields] = isProjectionContained(crud.read ?? false, args.params.projection ?? true)
          if (!contained) {
            throw new SecurityPolicyReadError({
              allowedProjection: crud.read ?? false,
              requestedProjection: args.params.projection ?? true,
              unauthorizedProjection: invalidFields,
              permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]),
              operationDomains: operationSecurityDomains,
            })
          }
        }
        return { continue: true, operation: 'find', params: { ...args.params, metadata, filter } }
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
            operationDomains: operationSecurityDomains,
          })
        }
        return { continue: true, operation: 'aggregate', params: { ...args.params, metadata, filter } }
      }

      if (args.operation === 'update') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomains })
        }
        return { continue: true, operation: 'update', params: { ...args.params, metadata, filter } }
      }

      if (args.operation === 'replace') {
        if (!crud.update) {
          throw new SecurityPolicyUpdateError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomains })
        }
        return { continue: true, operation: 'replace', params: { ...args.params, metadata, filter } }
      }

      if (args.operation === 'delete') {
        if (!crud.delete) {
          throw new SecurityPolicyDeleteError({ permissions: relatedSecurityContext.map((policy) => [policy.permission, policy.domain]), operationDomains: operationSecurityDomains })
        }
        return { continue: true, operation: 'delete', params: { ...args.params, metadata, filter } }
      }
    },
  }
}
