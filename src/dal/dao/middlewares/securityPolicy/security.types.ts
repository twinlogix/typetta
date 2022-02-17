import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { securityPolicy } from './security.middleware'
import { CRUDPermission } from './security.policy'

export type DAOSecurityContext<SecurityDomain extends object, Permissions extends string> = {
  permissions: {
    [Kp in Permissions]?: SecurityDomain[]
  }
}

export type DAOSecurityPolicy<T extends DAOGenerics, Permissions extends string, SecurityDomain extends object> = {
  permissions?: {
    [Key in Permissions]?: CRUDPermission<T>
  }
  defaultPermissions?: CRUDPermission<T>
} & (keyof Required<SecurityDomain> extends keyof T['model']
  ? { domain?: { [K in keyof Required<SecurityDomain>]: keyof T['model'] | null } }
  : { domain: { [K in keyof Required<SecurityDomain>]: keyof T['model'] | null } })

export type DAOContextSecurtyPolicy<DAOGenericsMap extends { [K in string]: DAOGenerics }, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
  applySecurity?: boolean
  context: DAOSecurityContext<SecurityDomain, Permissions>
  operationDomain: (metadata: Exclude<OperationMetadataType, undefined | null>) => { [K in keyof SecurityDomain]: SecurityDomain[K][] } | undefined
  policies: {
    [K in keyof DAOGenericsMap]?: DAOSecurityPolicy<DAOGenericsMap[K], Permissions, SecurityDomain>
  }
  defaultPermission?: CRUDPermission<DAOGenericsMap[keyof DAOGenericsMap]>
}

export function createSecurityPolicyMiddlewares<DAOGenericsMap extends { [K in string]: DAOGenerics }, OperationMetadataType, Permissions extends string, SecurityDomain extends object>(
  contextPolicy: DAOContextSecurtyPolicy<DAOGenericsMap, OperationMetadataType, Permissions, SecurityDomain>,
): { [K in keyof DAOGenericsMap]?: DAOMiddleware<DAOGenericsMap[K]> } {
  const context = contextPolicy.context.permissions
  const result = Object.keys(contextPolicy.policies).map((daoName) => {
    const policy = contextPolicy.policies[daoName]
    const permissions = policy?.permissions ?? {}
    const defaultPermission = policy?.defaultPermissions ?? contextPolicy.defaultPermission
    const domainMap = policy?.domain
    const mappedContext = domainMap
      ? Object.fromEntries(
          Object.entries(context).flatMap(([permission, securityDomains]) => {
            const mappedSecurityDomains = (securityDomains as SecurityDomain[]).flatMap((atom) => {
              const mappedAtom = Object.fromEntries(Object.entries(atom).flatMap(([k, v]) => ((domainMap as any)[k] !== null ? [[(domainMap as any)[k], v]] : [])))
              return Object.keys(mappedAtom).length > 0 ? [mappedAtom] : []
            })
            return mappedSecurityDomains.length > 0 ? [[permission, mappedSecurityDomains]] : []
          }),
        )
      : context
    return [
      daoName,
      securityPolicy({
        permissions,
        securityContext: () => mappedContext as { [Kp in Permissions]?: SecurityDomain[] | undefined },
        securityDomain: (metadata) => {
          const securityDomain = contextPolicy.operationDomain(metadata)
          if (securityDomain == undefined || !domainMap) {
            return securityDomain
          }
          const mappedSecurityDomain = Object.fromEntries(Object.entries(securityDomain).flatMap(([k, v]) => ((domainMap as any)[k] !== null ? [[(domainMap as any)[k], v]] : [])))
          return mappedSecurityDomain
        },
        defaultPermission,
      }),
    ] as const
  })

  return Object.fromEntries(result) as unknown as { [K in keyof DAOGenericsMap]?: DAOMiddleware<DAOGenericsMap[K]> }
}
