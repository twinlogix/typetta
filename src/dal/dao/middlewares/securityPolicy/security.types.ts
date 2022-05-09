import { DAOGenerics } from '../../dao.types'
import { CRUDPermission } from './security.policy'

export type DAOSecurityContext<SecurityDomain extends object, Permissions extends string> =
  | {
      permissions: {
        [Kp in Permissions]?: SecurityDomain[] | true
      }
    }
  | Permissions[]

export type DAOSecurityPolicy<T extends DAOGenerics, Permissions extends string, SecurityDomain extends object> = {
  permissions?: {
    [Key in Permissions]?: CRUDPermission<T>
  }
  defaultPermissions?: CRUDPermission<T>
} & ([SecurityDomain] extends [never]
  ? { domain?: never }
  : keyof Required<SecurityDomain> extends keyof T['model']
  ? { domain?: { [K in keyof Required<SecurityDomain>]: keyof T['model'] | null } }
  : { domain: { [K in keyof Required<SecurityDomain>]: keyof T['model'] | null } })

export type EntityManagerSecurtyPolicy<DAOGenericsMap extends { [K in string]: DAOGenerics }, OperationMetadataType, Permissions extends string, SecurityDomain extends object> = {
  applySecurity?: boolean
  context?: DAOSecurityContext<SecurityDomain, Permissions>
  policies?: {
    [K in keyof DAOGenericsMap]?: DAOSecurityPolicy<DAOGenericsMap[K], Permissions, SecurityDomain>
  }
  defaultPermission?: CRUDPermission<DAOGenericsMap[keyof DAOGenericsMap]>
} & ([SecurityDomain] extends [never]
  ? { operationDomain?: never }
  : {
      operationDomain: (metadata: Exclude<OperationMetadataType, undefined | null>) => { [K in keyof SecurityDomain]: SecurityDomain[K][] } | undefined
    })
