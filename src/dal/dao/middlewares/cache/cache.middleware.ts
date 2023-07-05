import { toFirstLower, transformObject } from '../../../../generation/utils'
import { TypettaCache } from '../../cache/cache.types'
import { DAOGenerics, FindParams } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import objectHash from 'object-hash'

export type CacheReadConfiguration = { ms: number; group?: string } | { ms?: number; group: string } | boolean
export type CacheWriteConfiguration = { groups: string[] | 'all' } | boolean
export type CacheConfiguration<T extends Record<string, DAOGenerics>> = {
  [K in keyof T]?: { ms: number } | true | 'invalidate-only'
}
export const DEFAULT_CACHE_GROUP = 'default'
export function cache<T extends DAOGenerics>(cache: TypettaCache, entities: Record<string, true | { ms: number } | 'invalidate-only'>): DAOMiddleware<T> {
  return {
    name: 'Typetta - Cache',
    before: async (args, context) => {
      if (args.operation === 'find') {
        const settings = args.params.cache ?? entities[toFirstLower(context.daoName)]
        if (!settings) return
        if (settings === 'invalidate-only') return
        const group = (args.params.cache && typeof args.params.cache === 'object' && 'group' in args.params.cache ? args.params.cache.group : null) ?? DEFAULT_CACHE_GROUP
        const key = findKey(args.params, context.specificOperation)
        const result = await cache.get(context.daoName, group, key)
        if (result != null) {
          const parsed = JSON.parse(result.toString())
          const parsedRecords = await Promise.all(parsed.records.map((r: T['model']) => transformObject(context.entityManager.adapters.cache, 'dbToModel', r, context.schema)))
          return { continue: false, records: parsedRecords, totalCount: parsed.totalCount, params: args.params, operation: 'find' }
        }
        return { continue: true, params: { ...args.params, metadata: { ...args.params.metadata, __cache__: { key, group } } }, operation: 'find' }
      }
    },
    after: async (args, context) => {
      if (args.operation === 'find') {
        const originalSettings = entities[toFirstLower(context.daoName)]
        const settings = args.params.cache ?? entities[toFirstLower(context.daoName)]
        if (!settings) return
        if (settings === 'invalidate-only') return
        const __cache__ = args.params.metadata?.__cache__
        if (__cache__) {
          const stringifiedRecords = await Promise.all(args.records.map((r) => transformObject(context.entityManager.adapters.cache, 'modelToDB', r, context.schema)))
          const expiration = typeof settings === 'object' && 'ms' in settings ? settings.ms : originalSettings && typeof originalSettings === 'object' ? originalSettings.ms : undefined
          await cache.set(context.daoName, __cache__.group, __cache__.key, Buffer.from(JSON.stringify({ records: stringifiedRecords, totalCount: args.totalCount })), expiration)
        }
      } else if (args.operation === 'delete' || args.operation === 'insert' || args.operation === 'update' || args.operation === 'replace') {
        const settings = args.params.cache ?? entities[toFirstLower(context.daoName)]
        if (!settings) return
        const groups = settings === 'invalidate-only' ? undefined : settings === true || 'ms' in settings ? [DEFAULT_CACHE_GROUP] : settings.groups === 'all' ? undefined : settings.groups
        if (context.entityManager.isTransacting()) {
          context.entityManager.addPostTransactionProcessing(() => cache.delete(context.daoName, groups))
        } else {
          await cache.delete(context.daoName, groups)
        }
      }
    },
  }
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
