import { hasKeys, intersection } from '../../../../utils/utils'
import { equals } from '../../../drivers/in-memory/utils.memory'
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
                            return domainMap[key] != null ? [[domainMap[key], v]] : []
                          }),
                        )
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
                    return domainMap[key] != null ? [[domainMap[key], v]] : []
                  }),
                ),
              )
              return mappedSecurityDomains
            },
            domainMap: domainMap as
              | {
                  [x: string]: keyof DAOGenericsMap[keyof DAOGenericsMap]['model'] | null
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
      })
    : undefined
  return { middlewares, others }
}

export function intersectSecurityDomains(domainKeys: string[], securityDomains: Record<string, unknown[]>[]): Record<string, unknown[]> {
  const result = domainKeys.flatMap((key) => {
    if (!key) {
      return []
    }
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

export function inferOperationSecurityDomain(domainKeys: string[], filter: unknown): Record<string, unknown[]>[] {
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
    if (typeof filterElement === 'object') {
      return []
    } else {
      return [filterElement]
    }
  }
  function extractFromPlain(filter: Record<string, unknown>): [string, unknown[]][] {
    return domainKeys.flatMap((key) => {
      if (!key) {
        return []
      }
      const result: [string, unknown[]] = [key, extractValue(filter[key])]
      if (result[1].length === 0) {
        return []
      }
      return [result]
    })
  }

  const result = extractFromPlain(filter as Record<string, unknown>)
  let securityDomain = Object.fromEntries(result)
  if (hasKeys(filter, ['$and', '$or'])) {
    const f = filter as LogicalOperators<unknown>
    if (f.$and) {
      const andSecurityDomain = f.$and.flatMap((af) => inferOperationSecurityDomain(domainKeys, af))
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
