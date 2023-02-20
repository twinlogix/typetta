import { hasKeys, intersection, MONGODB_QUERY_PREFIXS } from '../../../../utils/utils'
import { AbstractFilterFields, equals } from '../../../drivers/in-memory/utils.memory'
import { DAOGenerics } from '../../dao.types'
import { EqualityOperators, LogicalOperators } from '../../filters/filters.types'
import { DAOMiddleware } from '../middlewares.types'
import { securityPolicy } from './security.middleware'
import { EntityManagerSecurtyPolicy } from './security.types'

export function createSecurityPolicyMiddlewares<
  DAOGenericsMap extends { [K in string]: DAOGenerics },
  OperationMetadataType,
  Permissions extends string,
  SecurityDomain extends Record<string, unknown>,
>(
  contextPolicy: EntityManagerSecurtyPolicy<DAOGenericsMap, OperationMetadataType, Permissions, SecurityDomain>,
): { middlewares: { [K in keyof DAOGenericsMap]?: DAOMiddleware<DAOGenericsMap[K]> }; others?: DAOMiddleware<DAOGenericsMap[keyof DAOGenericsMap]> } {
  const context = contextPolicy.context
    ? Array.isArray(contextPolicy.context)
      ? Object.fromEntries(contextPolicy.context.map((permission) => [permission, true]))
      : contextPolicy.context.permissions
    : {}
  const policies = contextPolicy.policies
  const contextDefaultPermission = contextPolicy.defaultPermission
  const result = policies
    ? Object.keys(policies ?? {}).map((daoName) => {
        const policy = policies[daoName]
        const permissions = policy?.permissions ?? {}
        const defaultPermission = policy?.defaultPermissions ?? contextDefaultPermission
        const domainMap = policy && 'domain' in policy ? policy.domain : undefined
        const mappedContext = domainMap
          ? Object.fromEntries(
              Object.entries(context).flatMap(([permission, securityDomains]) => {
                const mappedSecurityDomains =
                  securityDomains === true
                    ? true
                    : (securityDomains as SecurityDomain[]).flatMap((atom) => {
                        const mappedAtom = Object.fromEntries(
                          Object.entries(atom).flatMap(([k, v]) => {
                            const key = k as keyof SecurityDomain
                            const domainM = domainMap[key] as string | null | { or: string[] } | { and: string[] }
                            if (domainM && typeof domainM === 'object' && 'or' in domainM) {
                              return [[`__or__${key}`, domainM.or.map((domain) => [domain, v])]]
                            }
                            if (domainM && typeof domainM === 'object' && 'and' in domainM) {
                              return domainM.and.map((domain) => [domain, v])
                            }
                            return domainMap[key] != null ? [[domainMap[key], v]] : []
                          }),
                        )
                        const ors = Object.entries(mappedAtom).filter((v) => v[0].startsWith('__or__'))
                        if (ors.length > 0) {
                          const copy = Object.fromEntries(Object.entries(mappedAtom).filter((v) => !v[0].startsWith('__or__')))
                          const mappedAtoms = ors.reduce(
                            (p, c) => {
                              return (c[1] as [string, unknown][]).flatMap(([k, v]) => p.map((cop) => ({ ...cop, [k]: v })))
                            },
                            [copy],
                          )
                          return mappedAtoms
                        }
                        return Object.keys(mappedAtom).length > 0 ? [mappedAtom] : []
                      })
                return mappedSecurityDomains === true || mappedSecurityDomains.length > 0 ? [[permission, mappedSecurityDomains]] : []
              }),
            )
          : context
        return [
          daoName,
          securityPolicy({
            permissions,
            securityContext: () => mappedContext as { [Kp in Permissions]?: SecurityDomain[] | undefined },
            securityDomains: (metadata) => {
              const securityDomains = 'operationDomain' in contextPolicy && contextPolicy.operationDomain ? contextPolicy.operationDomain(metadata) : undefined
              if (securityDomains == undefined || !domainMap) {
                return securityDomains
              }
              const mappedSecurityDomains = securityDomains.map((securityDomain) =>
                Object.fromEntries(
                  Object.entries(securityDomain).flatMap(([k, v]) => {
                    const key = k as keyof SecurityDomain
                    const domain = domainMap[key] as string | { or: string[] } | { and: string[] }
                    if (typeof domain === 'object' && 'or' in domain) {
                      return domain.or.map((k) => [k, v])
                    } else if (typeof domain === 'object' && 'and' in domain) {
                      return domain.and.map((k) => [k, v])
                    }
                    return domain != null ? [[domain, v]] : []
                  }),
                ),
              )
              return mappedSecurityDomains
            },
            securityDomainsInjector: (operationDomains, metadata) => {
              if (!('injectOperationDomain' in contextPolicy) || !contextPolicy.injectOperationDomain) return metadata
              if (!domainMap) return contextPolicy.injectOperationDomain(operationDomains as any, metadata)
              const mappedOperationDomains = operationDomains.map((operationDomain) => {
                const andMap = new Map<string, Set<DAOGenericsMap[keyof DAOGenericsMap]['plainModel'][string]>>()
                const mappedOperationDomain = Object.fromEntries(
                  Object.entries(operationDomain).flatMap(([key, value]) => {
                    if (!value) return []
                    for (const [k, v] of Object.entries(domainMap)) {
                      if (typeof v === 'string') {
                        if (v === key) return [[k, value]]
                      } else if (typeof v === 'object' && v && 'or' in v) {
                        if (v.or.includes(key)) return [[k, value]]
                      } else if (typeof v === 'object' && v && 'and' in v) {
                        if (v.and.includes(key)) {
                          const set = andMap.get(k) ?? new Set<DAOGenericsMap[keyof DAOGenericsMap]['plainModel'][string]>()
                          for (const e of value) set.add(e)
                          andMap.set(k, set)
                          return [[k, [...set.values()]]]
                        }
                      }
                    }
                    return []
                  }),
                )
                return mappedOperationDomain
              })
              const result = contextPolicy.injectOperationDomain(mappedOperationDomains as any, metadata)
              return result
            },
            domainMap: domainMap as
              | {
                  [x: string]:
                    | keyof DAOGenericsMap[keyof DAOGenericsMap]['model']
                    | { or: (keyof DAOGenericsMap[keyof DAOGenericsMap]['model'])[] }
                    | { and: (keyof DAOGenericsMap[keyof DAOGenericsMap]['model'])[] }
                    | null
                }
              | undefined,
            defaultPermission,
          }),
        ] as const
      })
    : []

  const middlewares = Object.fromEntries(result) as unknown as { [K in keyof DAOGenericsMap]?: DAOMiddleware<DAOGenericsMap[K]> }
  const others = contextDefaultPermission
    ? securityPolicy({
        permissions: {},
        defaultPermission: contextDefaultPermission,
        securityContext: () => ({}),
        securityDomains: () => undefined,
        securityDomainsInjector: undefined,
      })
    : undefined
  return { middlewares, others }
}

export function intersectSecurityDomains(domainKeys: string[], securityDomains: Record<string, unknown[]>[]): Record<string, unknown[]> {
  const result = domainKeys.flatMap((key) => {
    if (securityDomains.every((sd) => !sd[key])) {
      return []
    }
    const domains = securityDomains.flatMap((sd) => (sd[key] ? [sd[key]] : [])) as unknown[][]
    const reducedDomains = intersection(domains, equals)
    const res: [string, unknown[]] = [key, reducedDomains]
    return [res]
  })
  return Object.fromEntries(result)
}

export function inferOperationSecurityDomain(domainKeys: string[], filter: AbstractFilterFields): Record<string, unknown[]>[] {
  if (typeof filter === 'function') {
    return [{}]
  }
  function extractValue(filterElement: unknown): unknown[] {
    if (!filterElement) {
      return []
    }
    if (hasKeys(filterElement, ['eq', 'in'])) {
      const f = filterElement as EqualityOperators<unknown>
      if (f.eq) {
        return [f.eq]
      }
      if (f.in) {
        return f.in
      }
    }
    if (hasKeys(filterElement, [...MONGODB_QUERY_PREFIXS.values()])) {
      return []
    } else {
      return [filterElement]
    }
  }
  function extractFromPlain(filter: Record<string, unknown>): [string, unknown[]][] {
    return domainKeys.flatMap((key) => {
      const result = extractValue(filter[key])
      if (result.length === 0) {
        return []
      }
      return [[key, result]]
    })
  }

  const result = extractFromPlain(filter as Record<string, unknown>)
  let securityDomain = Object.fromEntries(result)
  if (hasKeys(filter, ['$and', '$or'])) {
    const f = filter as LogicalOperators<unknown>
    if (f.$and) {
      if (f.$and.every((af) => typeof af === 'function')) {
        return [{}]
      }
      const andSecurityDomain = f.$and.flatMap((af) => (typeof af === 'function' ? [] : inferOperationSecurityDomain(domainKeys, af)))
      const result = intersectSecurityDomains(domainKeys, [securityDomain, ...andSecurityDomain])
      securityDomain = result
    }
    if (f.$or) {
      const orSecurityDomains = f.$or.flatMap((af) => inferOperationSecurityDomain(domainKeys, af))
      const result = orSecurityDomains.map((osd) => intersectSecurityDomains(domainKeys, [osd, securityDomain]))
      const filteredResult = result.filter((sd) => !Object.values(sd).some((d) => d.length === 0))
      return filteredResult
    }
  }
  return [securityDomain]
}
