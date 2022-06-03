import { DAOGenerics } from '../../dao.types'
import { CRUDPermission } from './security.policy'

export type DAOSecurityContext<SecurityDomain extends Record<string, unknown>, Permissions extends string> =
  | {
      permissions: {
        [Kp in Permissions]?: SecurityDomain[] | true
      }
    }
  | Permissions[]

export type DAOSecurityPolicies<DAOGenericsMap extends { [K in string]: DAOGenerics }, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  [K in keyof DAOGenericsMap]?: DAOSecurityPolicy<DAOGenericsMap[K], Permissions, SecurityDomain>
}

export type DAOSecurityPolicy<T extends DAOGenerics, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  permissions?: {
    [Key in Permissions]?: CRUDPermission<T>
  }
  defaultPermissions?: CRUDPermission<T>
} & ([SecurityDomain] extends [never]
  ? { domain?: never }
  : keyof Required<SecurityDomain> extends keyof T['insertResult']
  ? { domain?: { [K in keyof Required<SecurityDomain>]: keyof T['insertResult'] | null } }
  : { domain: { [K in keyof Required<SecurityDomain>]?: keyof T['insertResult'] | null } })

export type EntityManagerSecurtyPolicy<DAOGenericsMap extends { [K in string]: DAOGenerics }, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  applySecurity?: boolean
  context?: DAOSecurityContext<SecurityDomain, Permissions>
  policies?: DAOSecurityPolicies<DAOGenericsMap, Permissions, SecurityDomain>
  defaultPermission?: CRUDPermission<DAOGenericsMap[keyof DAOGenericsMap]>
} & ([SecurityDomain] extends [never]
  ? { operationDomain?: never }
  : {
      operationDomain: (metadata: OperationMetadataType | undefined) => { [K in keyof SecurityDomain]: SecurityDomain[K][] } | undefined
    })
