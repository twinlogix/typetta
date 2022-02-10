import { DAOGenerics } from '../../dao.types'
import { isProjectionContained, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

type SecurityContext<Permissions extends string, SecurityDomain> = {
  [Kp in Permissions]?: SecurityDomain
}

type SecurityPolicy<T extends DAOGenerics, Permissions extends string> = {
  [Key in Permissions]?: CRUDSecurityPolicy<T>
}

export type CRUDSecurityPolicy<T extends DAOGenerics> =
  | {
      read?: boolean | T['projection']
      write?: boolean
      update?: boolean
      delete?: boolean
    }
  | boolean

const ERROR_PREFIX = '[Role Middleware] '
export function roleSecurityPolicy<Permissions extends string, T extends DAOGenerics, SecurityDomain extends { [K in keyof T['model']]?: T['model'][K][] }>(args: {
  securityPolicy: SecurityPolicy<T, Permissions>
  securityContext: (metadata: T['metadata']) => SecurityContext<Permissions, SecurityDomain>
  securityDomains: (metadata: T['operationMetadata']) => SecurityDomain | undefined
}): DAOMiddleware<T> {
  function getProjection(crud: CRUDSecurityPolicy<T>): T['projection'] | boolean {
    return crud === true ? true : crud === false ? false : crud.read
  }

  return buildMiddleware({
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const securityContext = args.securityContext(context.metadata)
      const securityDomain = params.metadata ? args.securityDomains(params.metadata) : undefined
      //TODO: use security domain in order to exclude some permissions
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
      const widestProjection = policies.reduce<true | T['projection']>((proj, policy) => mergeProjections(policy.projection, proj), false)
      const [contained, invalidFields] = isProjectionContained(widestProjection, params.projection ?? true)
      if (!contained) {
        throw new Error(
          `${ERROR_PREFIX}Access to restricted fields: ${
            policies.length === 0
              ? `you have no permission to access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`
              : `permissions [${policies.map((policy) => policy.permission).join(',')}] can't access fields ${JSON.stringify(invalidFields)} of ${context.daoName} entities`
          }`,
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
  })
}
