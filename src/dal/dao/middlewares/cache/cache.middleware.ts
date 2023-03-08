import { toFirstLower, transformObject } from '../../../../generation/utils'
import { TypettaCache } from '../../cache/cache.types'
import { DAOGenerics, FindParams } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'
import { buildMiddleware } from '../utils/builder'
import objectHash from 'object-hash'

export function cache<T extends DAOGenerics>(cache: TypettaCache, entities: Record<string, true | { ms: number }>): DAOMiddleware<T> {
  return buildMiddleware({
    name: 'Typetta - Cache',
    beforeFind: async (params, context) => {
      const settings = entities[toFirstLower(context.daoName)]
      if (!settings) return
      const key = findKey(params, context.specificOperation, context.daoName)
      const result = await cache.get(key)
      if (result != null) {
        const parsed = JSON.parse(result.toString())
        const parsedRecords = await Promise.all(parsed.records.map((r: T['model']) => transformObject(context.entityManager.adapters.cache, 'dbToModel', r, context.schema)))
        return { continue: false, records: parsedRecords, totalCount: parsed.totalCount, params }
      }
      return { continue: true, params: { ...params, metadata: { ...params.metadata, __cache_key__: key } } }
    },
    afterFind: async (params, records, totalCount, context) => {
      const settings = entities[toFirstLower(context.daoName)]
      if (!settings) return
      const key = params.metadata?.__cache_key__
      if (key) {
        const stringifiedRecords = await Promise.all(records.map((r) => transformObject(context.entityManager.adapters.cache, 'modelToDB', r, context.schema)))
        cache.set(key, Buffer.from(JSON.stringify({ records: stringifiedRecords, totalCount })), typeof settings === 'object' && 'ms' in settings ? settings.ms : undefined)
      }
    },
  })
}

function findKey<T extends DAOGenerics>(params: FindParams<T>, specificOperation: string, dao: string): string {
  const hash = objectHash({
    projection: params.projection,
    filter: params.filter,
    sorts: params.sorts,
    skip: params.skip,
    limit: params.limit,
  })
  const key = `${specificOperation.toLocaleLowerCase()}:${dao}:${params.relationParents?.length ?? 0}:${hash}`
  return key
}
