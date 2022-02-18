import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { securityPolicy } from './security.middleware'
import { DAOContextSecurtyPolicy } from './security.types'

export function createSecurityPolicyMiddlewares<DAOGenericsMap extends { [K in string]: DAOGenerics }, OperationMetadataType, Permissions extends string, SecurityDomain extends object>(
  contextPolicy: DAOContextSecurtyPolicy<DAOGenericsMap, OperationMetadataType, Permissions, SecurityDomain>,
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
                            return domainMap[key] !== null ? [[domainMap[key], v]] : []
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
            securityDomain: (metadata) => {
              const securityDomain = 'operationDomain' in contextPolicy && contextPolicy.operationDomain ? contextPolicy.operationDomain(metadata) : undefined
              if (securityDomain == undefined || !domainMap) {
                return securityDomain
              }
              const mappedSecurityDomain = Object.fromEntries(
                Object.entries(securityDomain).flatMap(([k, v]) => {
                  const key = k as keyof SecurityDomain
                  return domainMap[key] !== null ? [[domainMap[key], v]] : []
                }),
              )
              return mappedSecurityDomain
            },
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
        securityDomain: () => undefined,
      })
    : undefined
  return { middlewares, others }
}
