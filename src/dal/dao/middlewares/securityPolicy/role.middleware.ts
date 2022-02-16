import { DAOGenerics } from '../../dao.types'
import { intersectProjections, isProjectionContained, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

type SecurityContext<Permissions extends string, SecurityContextPermission> = {
  [Kp in Permissions]?: SecurityContextPermission[]
}

type SecurityPolicy<T extends DAOGenerics, Permissions extends string> = {
  [Key in Permissions]?: CRUDPermission<T>
}

export const CRUD = {
  and: function <T extends DAOGenerics>(cruds: CRUDPermission<T>[]): CRUDPermission<T> {
    return cruds.reduce(
      (l, r) => ({
        delete: (l.delete ?? false) && (r.delete ?? false),
        read: intersectProjections(l.read ?? false, r.read ?? false),
        write: (l.write ?? false) && (r.write ?? false),
        update: (l.update ?? false) && (r.update ?? false),
      }),
      this.ALLOW,
    )
  },
  or: function <T extends DAOGenerics>(cruds: CRUDPermission<T>[]): CRUDPermission<T> {
    return cruds.reduce(
      (l, r) => ({
        delete: (l.delete ?? false) || (r.delete ?? false),
        read: mergeProjections(l.read ?? false, r.read ?? false),
        write: (l.write ?? false) || (r.write ?? false),
        update: (l.update ?? false) || (r.update ?? false),
      }),
      this.DENY,
    )
  },

  ALLOW: {
    delete: true,
    read: true,
    write: true,
    update: true,
  },
  DENY: {
    delete: false,
    read: false,
    write: false,
    update: false,
  },
}

export type CRUDPermission<T extends DAOGenerics> = {
  read?: boolean | T['projection']
  write?: boolean
  update?: boolean
  delete?: boolean
}

const ERROR_PREFIX = '[Role Middleware] '
export function roleSecurityPolicy<
  Permissions extends string,
  T extends DAOGenerics,
  SecurityDomainKeys extends string,
  SecurityContextPermission extends { [K in SecurityDomainKeys]?: T['model'][K] },
  SecurityDomain extends { [K in SecurityDomainKeys]?: T['model'][K][] },
>(args: {
  securityPolicy: SecurityPolicy<T, Permissions>
  securityContext: (metadata: T['metadata']) => SecurityContext<Permissions, SecurityContextPermission>
  securityDomain: (metadata: T['operationMetadata']) => SecurityDomain | undefined
}): DAOMiddleware<T> {
  function getRelatedSecurityContext(context: T['driverContext']): {
    domain: SecurityContextPermission[]
    crud: CRUDPermission<T>
    permission: Permissions
  }[] {
    const securityContext = args.securityContext(context.metadata)
    return Object.entries(args.securityPolicy).flatMap(([k, v]) => {
      const permission = k as Permissions
      const crud = v as CRUDPermission<T>
      const domain: SecurityContextPermission[] | undefined = securityContext[permission]
      if (domain) {
        return [{ domain, crud, permission }]
      }
      return []
    })
  }

  function getCrudPolicy(
    operationSecurityDomain: SecurityDomain,
    relatedSecurityContext: {
      domain: SecurityContextPermission[]
      crud: CRUDPermission<T>
      permission: Permissions
    }[],
  ) {
    const cruds = Object.entries(operationSecurityDomain).map(([k, v]) => {
      const domainKey = k as SecurityDomainKeys
      const domainValues = v as T['model'][SecurityDomainKeys][]
      const cruds = domainValues.map((domainValue) => {
        const cruds = relatedSecurityContext.flatMap((rsc) => (rsc.domain.some((atom) => atom[domainKey] === domainValue) ? [rsc.crud] : []))
        return CRUD.or(cruds)
      })
      return CRUD.and(cruds)
    })
    const crud = CRUD.or(cruds)
    return crud
  }

  return buildMiddleware({
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const operationSecurityDomain = (params.metadata ? args.securityDomain(params.metadata) ?? {} : {}) as SecurityDomain
      const relatedSecurityContext = getRelatedSecurityContext(context)
      const crud = getCrudPolicy(operationSecurityDomain, relatedSecurityContext)
      const [contained, invalidFields] = isProjectionContained(crud.read ?? false, params.projection ?? true)
      if (!contained) {
        throw new Error(
          `${ERROR_PREFIX}Access to restricted fields: ${
            relatedSecurityContext.length === 0
              ? `you have no permission to access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`
              : `permissions [${relatedSecurityContext.map((policy) => policy.permission).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`
          }`,
        )
      }
      const domainFilters = { $or: Object.entries(operationSecurityDomain).map(([k, v]) => ({ [k]: { $in: v } })) }
      return { continue: true, params: { ...params, filter: params.filter ? { $and: [params.filter, domainFilters] } : domainFilters } }
    },
  })
}
