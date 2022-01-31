import { DAOGenerics } from '../../dao.types'
import { GenericProjection } from '../../projections/projections.types'
import { isProjectionContained, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

export type Permission<T extends DAOGenerics> =
  | {
      insert?: boolean
      read?: boolean | T['projection']
      update?: boolean
      replace?: boolean
      aggregate?: boolean
    }
  | boolean

export function roleSecurityPolicy<K extends keyof T['model'], RoleType extends string, T extends DAOGenerics>(args: {
  key: K
  permissions: Partial<Record<RoleType, Permission<T>>>
  roles: (context: T['metadata']) => ({ values?: T['model'][K][] | null } & { role: RoleType })[]
}): DAOMiddleware<T> {
  return buildMiddleware({
    beforeInsert: async (params, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      // ...
    },
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      const baseFilter: T['filter'] = roles.find((role) => role.values == null)
        ? {}
        : {
            [args.key]: {
              $in: roles.flatMap((role) => {
                const permission = args.permissions[role.role]
                if (permission && (permission === true || permission.read)) {
                  return role.values
                }
                return []
              }),
            },
          }
      const largerProjection = roles.reduce<GenericProjection>((proj, role) => {
        const permission = args.permissions[role.role]
        if (permission) {
          return mergeProjections(proj, typeof permission === 'boolean' ? permission : permission.read ?? false)
        }
        return proj
      }, false)

      const [contained, invalidFields] = isProjectionContained(largerProjection, params.projection ?? true)
      if (!contained) {
        throw new Error(`Access to restricted fields: Roles [${roles.map((role) => role.role).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`)
      }

      if (params.filter && typeof params.filter === 'function') {
        return {
          continue: true,
          params: {
            ...params,
            filter: params.filter, // TODO
            projection: mergeProjections((params.projection ?? true) as GenericProjection, { [args.key]: true }) as T['projection'],
          },
        }
      }
      return {
        continue: true,
        params: {
          ...params,
          filter: params.filter ? { $and: [params.filter, baseFilter] } : baseFilter,
          projection: mergeProjections((params.projection ?? true) as GenericProjection, { [args.key]: true }) as T['projection'],
        },
      }
    },
    afterFind: async (params, records, totalCount, context) => {
      if (!context.metadata) return
      const roles = args.roles(context.metadata)
      for (const record of records) {
        const applicableRoles = roles.filter((r) => r.values == null || r.values.includes(record[args.key]))
        if (applicableRoles.length > 0) {
          const largerProjection = applicableRoles.reduce(
            (proj, role) => {
              const permission = args.permissions[role.role]
              return mergeProjections(typeof permission === 'boolean' ? permission : permission?.read ?? false, proj)
            },
            { [args.key]: true } as GenericProjection,
          )
          const [contained, invalidFields] = isProjectionContained(largerProjection, params.projection ?? true)
          if (!contained) {
            throw new Error(
              `Access to restricted fields: Roles [${applicableRoles.map((role) => role.role).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`,
            )
          }
        }
      }
    },
  })
}
