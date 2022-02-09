import { DAOGenerics } from '../../dao.types'
import { isProjectionContained, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

type SecurityContext<T extends DAOGenerics, Permissions extends string> = {
  [Kp in Permissions]?: {
    [K in keyof T['model']]?: T['model'][K][]
  }
}

type SecurityPolicy<T extends DAOGenerics, Permissions extends string> = {
  [Key in Permissions]?: CRUDSecurityPolicy<T>
}
export type CRUDSecurityPolicy<T extends DAOGenerics> =
  | {
      insert?: boolean
      read?: boolean | T['projection']
      update?: boolean
      replace?: boolean
      aggregate?: boolean
    }
  | boolean

const ERROR_PREFIX = '[Role Middleware] '
export function roleSecurityPolicy<Permissions extends string, T extends DAOGenerics>(args: {
  securityPolicy: SecurityPolicy<T, Permissions>
  securityContext: (metadata: T['metadata']) => SecurityContext<T, Permissions>
}): DAOMiddleware<T> {
  /*function getBaseFilter(roles: Role<T, K, RoleType>[]): T['filter'] {
    return roles.find((role) => role.values == null)
      ? {}
      : {
          [args.key]: {
            $in: roles.flatMap((role) => {
              const permission = args.securityPolicy[role.role]
              if (permission && (permission === true || permission.read)) {
                return role.values
              }
              return []
            }),
          },
        }
  }
*/

  function getProjection(crud: CRUDSecurityPolicy<T>): T['projection'] | boolean {
    return crud === true ? true : crud === false ? false : crud.read
  }
  return buildMiddleware({
    /* beforeInsert: async (params, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      const value = params.record[args.key]
      if (!value) {
        throw new Error(`${ERROR_PREFIX}Invalid insert: missing ${args.key} field on ${context.daoName} entity`)
      }
      const canInsert = roles.some((role) => {
        if (role.values == null || role.values.includes(value)) {
          const permission = args.securityPolicy[role.role]
          if (permission === true || (typeof permission === 'object' && permission.insert)) {
            return true
          }
        }
        return false
      })
      if (!canInsert) {
        throw new Error(`${ERROR_PREFIX}Invalid insert: roles [${roles.map((role) => role.role).join(',')}] does not have permission to insert ${context.daoName} entities`)
      }
    },*/
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const securityContext = args.securityContext(context.metadata)
      const policies = Object.entries(args.securityPolicy).flatMap(([k, v]) => {
        const permission = k as Permissions
        const crud = v as CRUDSecurityPolicy<T>
        const projection = getProjection(crud)
        if (securityContext[permission] && projection) {
          const domain = securityContext[permission]
          return [{ domain, projection, permission }]
        }
        return []
      })
      //TODO: we can exclude some policies based on filter
      const widestProjection = policies.reduce<true | T['projection']>((proj, policy) => mergeProjections(policy.projection, proj), false)
      const [contained, invalidFields] = isProjectionContained(widestProjection, params.projection ?? true)
      if (!contained) {
        throw new Error(
          `${ERROR_PREFIX}Access to restricted fields: permissions [${policies.map((policy) => policy.permission).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${
            context.daoName
          } entities`,
        )
      }
      const domains = policies.reduce<{ [K in keyof T['model']]?: T['model'][K][] }>((sum, policy) => {
        if (policy.domain) {
          return Object.entries(policy.domain).reduce<{ [K in keyof T['model']]?: T['model'][K][] }>((partialSum, [key, domainValues]) => {
            const summedDomainValues = partialSum[key]
            if (summedDomainValues) {
              const set = new Set([...summedDomainValues, ...domainValues])
              return { ...partialSum, [key]: [...set] }
            } else {
              return { ...partialSum, [key]: domainValues }
            }
          }, sum)
        }
        return sum
      }, {})
      const domainFilters = { $or: Object.entries(domains).map(([k, v]) => ({ [k]: { $in: v } })) }
      return { continue: true, params: { ...params, filter: params.filter ? { $and: [params.filter, domainFilters] } : domainFilters } }
    },
    /*beforeUpdate: async (params, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
    },
    afterFind: async (params, records, totalCount, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      for (const record of records) {
        const applicableRoles = roles.filter((r) => r.values == null || r.values.includes(record[args.key]))
        if (applicableRoles.length > 0) {
          const largerProjection = applicableRoles.reduce(
            (proj, role) => {
              const permission = args.securityPolicy[role.role]
              return mergeProjections(typeof permission === 'boolean' ? permission : permission?.read ?? false, proj)
            },
            { [args.key]: true } as GenericProjection,
          )
          const [contained, invalidFields] = isProjectionContained(largerProjection, params.projection ?? true)
          if (!contained) {
            throw new Error(
              `${ERROR_PREFIX}Access to restricted fields: roles [${applicableRoles.map((role) => role.role).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${
                context.daoName
              } entities`,
            )
          }
        }
      }
    },*/
  })
}
