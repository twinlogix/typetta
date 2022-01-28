import { DefaultModelScalars } from '../../../..'
import { DAOGenerics, IdGenerationStrategy } from '../../dao.types'
import { GenericProjection } from '../../projections/projections.types'
import { isFieldsContainedInProjection, isProjectionContained, mergeProjections } from '../../projections/projections.utils'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'

export type Permission<T extends DAOGenerics> =
  | {
      read?: boolean | T['projection']
      update?: boolean
      insert?: boolean
      replace?: boolean
      aggregate?: boolean
    }
  | boolean

export type AsdDAOGenerics<
  RoleType extends string,
  K extends keyof ModelType,
  ModelType extends object = any,
  IDKey extends keyof Omit<ModelType, ExcludedFields> = any,
  IDScalar extends keyof ScalarsType = any,
  IdGeneration extends IdGenerationStrategy = any,
  PureFilterType = any,
  RawFilterType = any,
  RelationsType = any,
  ProjectionType extends object = any,
  PureSortType = any,
  RawSortType = any,
  InsertType extends object = any,
  PureUpdateType = any,
  RawUpdateType = any,
  ExcludedFields extends keyof ModelType = any,
  RelationsFields extends keyof ModelType = any,
  MetadataType extends { roles: ({ [C in K]: ModelType[K] } & { role: RoleType })[] } = { roles: ({ [C in K]: ModelType[K] } & { role: RoleType })[] },
  OperationMetadataType = any,
  DriverContextType = any,
  ScalarsType extends DefaultModelScalars = any,
  DriverFilterOptions = any,
  DriverFindOptions = any,
  DriverInsertOptions = any,
  DriverUpdateOptions = any,
  DriverReplaceOptions = any,
  DriverDeleteOptions = any,
  NameType extends string = any,
> = DAOGenerics<
  ModelType,
  IDKey,
  IDScalar,
  IdGeneration,
  PureFilterType,
  RawFilterType,
  RelationsType,
  ProjectionType,
  PureSortType,
  RawSortType,
  InsertType,
  PureUpdateType,
  RawUpdateType,
  ExcludedFields,
  RelationsFields,
  MetadataType,
  OperationMetadataType,
  DriverContextType,
  ScalarsType,
  DriverFilterOptions,
  DriverFindOptions,
  DriverInsertOptions,
  DriverUpdateOptions,
  DriverReplaceOptions,
  DriverDeleteOptions,
  NameType
>

export function roleSecurityPolicy<K extends keyof T['model'], RoleType extends string, T extends AsdDAOGenerics<RoleType, K>>(
  key: K,
  permissions: Partial<Record<RoleType, Permission<T>>>,
): DAOMiddleware<T> {
  return buildMiddleware({
    beforeFind: async (params, context) => {
      if (!context.metadata) return
      const baseFilter: T['filter'] = {
        [key]: {
          $in: context.metadata.roles.flatMap((role) => {
            const permission = permissions[role.role]
            if (permission && (permission === true || permission.read)) {
              return [role[key]]
            }
            return []
          }),
        },
      }
      const largerProjection = context.metadata.roles.reduce<GenericProjection>((proj, role) => {
        const permission = permissions[role.role]
        if (permission) {
          return mergeProjections(proj, permission as GenericProjection)
        }
        return proj
      }, false)
      if (params.projection) {
        const [contained, invalidFields] = isProjectionContained(largerProjection, params.projection)
        if (!contained) {
          throw new Error(`Access to restricted fields: ${JSON.stringify(invalidFields)}`)
        }
      }
      if (params.filter && typeof params.filter === 'function') {
        return // TODO
      }
      return {
        continue: true,
        params: {
          ...params,
          filter: params.filter ? { $and: [params.filter, baseFilter] } : baseFilter,
        },
      }
    },
    afterFind: async (params, records, totalCount, context) => {
      if (!context.metadata) return
      for (const record of records) {
        const role = context.metadata.roles.find((r) => r[key] === record[key])
        if (role) {
          const permission = permissions[role.role]
          const proj = typeof permission === 'boolean' ? permission : permission?.read ?? false
          if (!isFieldsContainedInProjection(proj, record)) {
            // TODO: add not valid fields
            throw new Error(`Access to restricted fields: `)
          }
        }
      }
    },
  })
}
