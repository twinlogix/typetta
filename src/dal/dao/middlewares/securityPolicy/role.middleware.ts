import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'


type SecurityContext<T extends DAOGenerics, Permissions extends string> = {
  [Kp in Permissions]?: {
    [K in keyof T['model']]?: T['model'][K][]
  }
}

type SecurityPolicy<T extends DAOGenerics, Permissions extends string> = {
  permissions: {
    [Key in Permissions]?: CRUDSecurityPolicy<T>
  }
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
  securityContext: SecurityContext<T, Permissions>
  securityPolicy: SecurityPolicy<T, Permissions>
}): DAOMiddleware<T> {

  console.log(args)
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
    },
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      const widestProjection = roles.reduce<GenericProjection>((proj, role) => {
        const permission = args.securityPolicy[role.role]
        if (permission) {
          return mergeProjections(proj, typeof permission === 'boolean' ? true : permission.read ?? false)
        }
        return proj
      }, false)
      const [contained, invalidFields] = isProjectionContained(widestProjection, params.projection ?? true)
      if (!contained) {
        throw new Error(
          `${ERROR_PREFIX}Access to restricted fields: roles [${roles.map((role) => role.role).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`,
        )
      }
      return {
        continue: true,
        params: {
          ...params,
          filter: params.filter ? { $and: [getBaseFilter(roles), params.filter] } : getBaseFilter(roles),
          projection: mergeProjections((params.projection ?? true) as GenericProjection, { [args.key]: true }) as T['projection'],
        },
      }
    },
    beforeUpdate: async (params, context) => {
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
