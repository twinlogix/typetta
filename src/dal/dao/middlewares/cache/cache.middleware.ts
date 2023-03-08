import { toFirstLower, transformObject } from '../../../../generation/utils'
import { TypettaCache } from '../../cache/cache.types'
import { DAOGenerics, FindParams } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'
import objectHash from 'object-hash'

export type CacheReadConfiguration = { ms: number; group?: string } | { ms?: number; group: string } | true | false
export type CacheWriteConfiguration = { groups: string[] } | true
export type CacheConfiguration<T extends Record<string, DAOGenerics>> = {
  [K in keyof T]?: { ms: number } | true
}
export const DEFAULT_CACHE_GROUP = '_'
export function cache<T extends DAOGenerics>(cache: TypettaCache, entities: Record<string, true | { ms: number }>): DAOMiddleware<T> {
  return buildMiddleware({
    name: 'Typetta - Cache',
    beforeFind: async (params, context) => {
      const settings = params.cache ?? entities[toFirstLower(context.daoName)]
      if (!settings) return
      const group = (params.cache && typeof params.cache === 'object' && 'group' in params.cache ? params.cache.group : null) ?? DEFAULT_CACHE_GROUP
      const key = findKey(params, context.specificOperation)
      const result = await cache.get(context.daoName, group, key)
      if (result != null) {
        const parsed = JSON.parse(result.toString())
        const parsedRecords = await Promise.all(parsed.records.map((r: T['model']) => transformObject(context.entityManager.adapters.cache, 'dbToModel', r, context.schema)))
        return { continue: false, records: parsedRecords, totalCount: parsed.totalCount, params }
      }
      return { continue: true, params: { ...params, metadata: { ...params.metadata, __cache__: { key, group } } } }
    },
    afterFind: async (params, records, totalCount, context) => {
      const settings = params.cache ?? entities[toFirstLower(context.daoName)]
      if (!settings) return
      const __cache__ = params.metadata?.__cache__
      if (__cache__) {
        const stringifiedRecords = await Promise.all(records.map((r) => transformObject(context.entityManager.adapters.cache, 'modelToDB', r, context.schema)))
        await cache.set(
          context.daoName,
          __cache__.group,
          __cache__.key,
          Buffer.from(JSON.stringify({ records: stringifiedRecords, totalCount })),
          typeof settings === 'object' && 'ms' in settings ? settings.ms : undefined,
        )
      }
    },
    afterInsert: async (params, records, context) => {
      if (params.cache) {
        await cache.delete(context.daoName, params.cache === true ? [DEFAULT_CACHE_GROUP] : params.cache.groups)
      }
    },
    afterUpdate: async (params, context) => {
      if (params.cache) {
        await cache.delete(context.daoName, params.cache === true ? [DEFAULT_CACHE_GROUP] : params.cache.groups)
      }
    },
    afterReplace: async (params, context) => {
      if (params.cache) {
        await cache.delete(context.daoName, params.cache === true ? [DEFAULT_CACHE_GROUP] : params.cache.groups)
      }
    },
    afterDelete: async (params, context) => {
      if (params.cache) {
        await cache.delete(context.daoName, params.cache === true ? [DEFAULT_CACHE_GROUP] : params.cache.groups)
      }
    },
  })
}

function findKey<T extends DAOGenerics>(params: FindParams<T>, specificOperation: string): string {
  const hash = objectHash({
    projection: params.projection,
    filter: params.filter,
    sorts: params.sorts,
    skip: params.skip,
    limit: params.limit,
  })
  const key = `${specificOperation.toLocaleLowerCase()}:${params.relationParents?.length ?? 0}:${hash}`
  return key
}
