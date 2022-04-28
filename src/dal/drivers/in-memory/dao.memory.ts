import { AbstractDAO, AnyProjection, filterEntity, iteratorLength, LogArgs, MONGODB_QUERY_PREFIXS, setTraversing, sort } from '../../..'
import { transformObject } from '../../../generation/utils'
import { deepMerge } from '../../../utils/utils'
import { FindParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../dao/dao.types'
import { InMemoryDAOGenerics, InMemoryDAOParams } from './dao.memory.types'
import { compare, getByPath, mock, MockIdSpecification } from './utils.memory'
import _ from 'lodash'
import { PartialDeep } from 'type-fest'

export class AbstractInMemoryDAO<T extends InMemoryDAOGenerics> extends AbstractDAO<T> {
  private idIndex: Map<T['idType'] | string, number>
  private emptyIndexes: number[]
  private memory: (T['model'] | null)[]
  private mockIdSpecification: MockIdSpecification<unknown> | undefined

  protected constructor({ idGenerator, ...params }: InMemoryDAOParams<T>) {
    super({ ...params, idGenerator: idGenerator ?? params.daoContext.adapters.mongo[params.idScalar]?.generate, driverContext: {} })
    this.memory = []
    this.emptyIndexes = [0]
    this.idIndex = new Map()

    const s = this.schema[this.idField]
    if (!('scalar' in s)) {
      throw new Error('Id is an embedded field. Not supported.')
    }
    if (this.idGeneration === 'db' && (!mock.idSpecifications || !mock.idSpecifications[s.scalar as string] || !mock.idSpecifications[s.scalar as string].generate)) {
      throw new Error(`Id is generated from DB. For in-memory driver it's required to implement mock.idSpecifications.${s.scalar} in order to generate the id`)
    }
    this.mockIdSpecification = mock.idSpecifications ? mock.idSpecifications[s.scalar as string] : undefined
  }

  protected async _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    const unorderedResults = [...this.entities(params.filter)].map((v) => v.record)
    const results = (params.sorts ? sort(unorderedResults, params.sorts) : unorderedResults).slice(params.skip ?? 0, (params.skip ?? 0) + (params.limit ?? this.memory.length))
    return results.map((r) => _.cloneDeep(r))
    // projection are ignored since there is no performance advance
  }

  protected async _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }> {
    return {
      records: await this._findAll(params),
      totalCount: await this._count(params),
    }
  }

  protected async _exists(params: FilterParams<T>): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _v of this.entities(params.filter)) {
      return true
    }
    return false
  }

  protected async _count(params: FilterParams<T>): Promise<number> {
    return iteratorLength(this.entities(params.filter))
  }

  protected async _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    const groupBy = <O, K extends string>(list: O[], getKey: (item: O) => K) =>
      list.reduce((previous, currentItem) => {
        const group = getKey(currentItem)
        if (!previous[group]) previous[group] = []
        previous[group].push(currentItem)
        return previous
      }, {} as Record<K, O[]>)

    const records = [...this.entities(params.filter)]

    if (records.length === 0 && !params.by) {
      return Object.entries(params.aggregations).reduce((p, [k, aggregation]) => {
        if (aggregation.operation === 'count') {
          return { ...p, [k]: 0 }
        }
        if (aggregation.operation === 'sum') {
          return { ...p, [k]: null }
        }
        if (aggregation.operation === 'avg') {
          return { ...p, [k]: null }
        }
        if (aggregation.operation === 'max') {
          return { ...p, [k]: null }
        }
        if (aggregation.operation === 'min') {
          return { ...p, [k]: null }
        }
        return p
      }, {}) as AggregateResults<T, A>
    }

    const groupKeys = Object.keys(params.by ?? {})
    const groups = groupBy(
      records.map((r) => {
        const group = Object.fromEntries(
          groupKeys.map((k) => {
            const v = getByPath(r.record, k)
            return [k, v == null ? null : v] as [string, unknown]
          }),
        )
        return {
          groupHash: JSON.stringify(group),
          group,
          record: r.record,
        }
      }),
      (v) => v.groupHash,
    )

    const unorderedResults = Object.entries(groups).map(([, group]) => {
      const records = group.map((e) => e.record)

      return Object.entries(params.aggregations).reduce((p, [k, aggregation]) => {
        function wrap() {
          if (aggregation.operation === 'count') {
            return { ...p, [k]: records.map((v) => (aggregation.field ? getByPath(v, aggregation.field as string) : v)).filter((v) => v != null).length }
          }
          if (aggregation.operation === 'sum') {
            return { ...p, [k]: records.map((v) => getByPath(v, aggregation.field as string) as number).reduce((p, c) => p + (c ?? 0), 0) }
          }
          if (aggregation.operation === 'avg') {
            return { ...p, [k]: records.map((v) => getByPath(v, aggregation.field as string) as number).reduce((p, c) => p + c, 0) / records.length }
          }
          if (aggregation.operation === 'max') {
            return { ...p, [k]: records.map((v) => getByPath(v, aggregation.field as string)).reduce((p, c) => (compare(p, c) > 0 ? p : c), records[0]) }
          }
          if (aggregation.operation === 'min') {
            return { ...p, [k]: records.map((v) => getByPath(v, aggregation.field as string)).reduce((p, c) => (compare(p, c) < 0 ? p : c), records[0]) }
          }
          return p
        }
        const res = wrap()
        if (res[k] === undefined || Number.isNaN(res[k])) {
          res[k] = null
        }
        return res
      }, group[0].group)
    })

    const filteredResult = args?.having ? unorderedResults.filter((r) => filterEntity(r, args.having)) : unorderedResults
    const sorted = args?.sorts ? sort(filteredResult, args.sorts) : filteredResult
    const result = sorted.slice(params.skip ?? 0, (params.skip ?? 0) + (params.limit ?? this.memory.length))
    return (params.by ? result : result[0]) as AggregateResults<T, A>
  }

  protected _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>> {
    const record = deepMerge(params.record, this.generateRecordWithId())
    const t = transformObject(this.daoContext.adapters.memory, 'modelToDB', record, this.schema) as T['insert']
    const id = t[this.schema[this.idField].alias ?? this.idField]
    const index = this.emptyIndexes.pop()
    if (index != null) {
      this.setIdIndex(id, index)
      this.memory[index] = t
    } else {
      const index = this.memory.length
      const sizeIncrement = this.memory.length > 512 ? 1024 : this.memory.length * 2
      this.emptyIndexes = this.allocMemory(sizeIncrement - 1)
        .map((v, i) => this.memory.length + 1 + i)
        .reverse()
      this.setIdIndex(id, index)
      this.memory[index] = t
    }
    return _.cloneDeep(transformObject(this.daoContext.adapters.memory, 'dbToModel', t, this.schema))
  }

  protected async _updateOne(params: UpdateParams<T>): Promise<void> {
    const changesObject = {}
    Object.entries(params.changes).forEach(([k, v]) => setTraversing(changesObject, k, v))
    const changes = transformObject(this.daoContext.adapters.memory, 'modelToDB', changesObject, this.schema)
    for (const { record, index } of this.entities(params.filter, false)) {
      this.memory[index] = deepMerge(record, changes)
      return
    }
  }

  protected async _updateAll(params: UpdateParams<T>): Promise<void> {
    const changesObject = {}
    Object.entries(params.changes).forEach(([k, v]) => setTraversing(changesObject, k, v))
    const changes = transformObject(this.daoContext.adapters.memory, 'modelToDB', changesObject, this.schema)
    for (const { record, index } of this.entities(params.filter, false)) {
      this.memory[index] = deepMerge(record, changes)
    }
  }

  protected async _replaceOne(params: ReplaceParams<T>): Promise<void> {
    for (const { record, index } of this.entities(filterEntity)) {
      const t = transformObject(this.daoContext.adapters.memory, 'modelToDB', deepMerge(params.replace, { [this.idField]: record[this.idField] }), this.schema)
      this.memory[index] = t
      break
    }
  }

  protected async _deleteOne(params: DeleteParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter, false)) {
      this.memory[index] = null
      this.deleteIdIndex(record[this.schema[this.idField].alias ?? this.idField])
      this.emptyIndexes.push(index)
      break
    }
  }

  protected async _deleteAll(params: DeleteParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter, false)) {
      this.memory[index] = null
      this.deleteIdIndex(record[this.schema[this.idField].alias ?? this.idField])
      this.emptyIndexes.push(index)
    }
  }

  protected _driver(): Exclude<LogArgs<string>['driver'], undefined> {
    return 'memory'
  }

  private getIdIndex(id: unknown): number | undefined {
    if (this.mockIdSpecification?.stringify) {
      return this.idIndex.get(this.mockIdSpecification?.stringify(id))
    }
    return this.idIndex.get(id)
  }
  private setIdIndex(id: unknown, index: number): void {
    if (this.mockIdSpecification?.stringify) {
      this.idIndex.set(this.mockIdSpecification?.stringify(id), index)
    } else {
      this.idIndex.set(id, index)
    }
  }
  private deleteIdIndex(id: unknown): void {
    if (this.mockIdSpecification?.stringify) {
      this.idIndex.delete(this.mockIdSpecification?.stringify(id))
    } else {
      this.idIndex.delete(id)
    }
  }

  private getIndexes(filter: T['filter']): number[] | null {
    if (filter) {
      const idFilter = filter[this.idField]
      const filterKeys = Object.keys(filter)
      const idFilterKeys = Object.keys(idFilter ?? {})
      if (typeof idFilter === 'object' && filterKeys.includes('$and')) {
        const indexes = (filter['$and'] as T['filter'][]).map((f) => this.getIndexes(f)).flatMap((i) => (i === null ? [] : [new Set(i)]))
        if (indexes.length !== 0) {
          // instead of returned should be intersected with results from below
          return [...indexes.reduce((p, i) => new Set([...p].filter((x) => i.has(x))))] //intersection
        }
      }

      if (filterKeys.includes(this.idField)) {
        if (typeof idFilter === 'object' && idFilterKeys.includes('in')) {
          const indexes = (idFilter['in'] as T['idType'][]).map((id) => this.getIdIndex(id)).flatMap((i) => (i === undefined ? [] : [i]))
          return [...new Set(indexes)]
        } else if (typeof idFilter === 'object' && idFilterKeys.includes('eq')) {
          const index = this.getIdIndex(idFilter['eq'])
          if (index !== undefined) {
            return [index]
          }
          return []
        } else if (typeof idFilter !== 'object' || idFilterKeys.every((k) => !MONGODB_QUERY_PREFIXS.has(k))) {
          const index = this.getIdIndex(idFilter)
          if (index !== undefined) {
            return [index]
          }
          return []
        }
      }
    }
    return null
  }
  private *entities(filter: T['filter'] = undefined, transform = true): Iterable<{ record: T['model']; index: number }> {
    const indexes = this.getIndexes(filter)
    if (indexes) {
      for (const index of indexes) {
        const record = this.memory[index]
        if (record !== null) {
          const t = transformObject(this.daoContext.adapters.memory, 'dbToModel', record, this.schema)
          if (filterEntity(t, filter)) {
            yield { record: transform ? t : record, index }
          }
        }
      }
      return
    }
    for (let i = 0; i < this.memory.length; i++) {
      const record = this.memory[i]
      if (record !== null) {
        const t = transformObject(this.daoContext.adapters.memory, 'dbToModel', record, this.schema)
        if (filterEntity(t, filter)) {
          yield { record: transform ? t : record, index: i }
        }
      }
    }
  }

  private allocMemory(n: number): (T['model'] | null)[] {
    return Array(n).fill(null)
  }

  private generateRecordWithId(): Partial<Record<T['idKey'], T['model'][T['idKey']]>> {
    if (this.idGeneration === 'db') {
      if (!this.mockIdSpecification?.generate) {
        throw new Error('UNREACHABLE')
      }
      return { [this.idField]: this.mockIdSpecification.generate() }
    } else {
      return {}
    }
  }
}
