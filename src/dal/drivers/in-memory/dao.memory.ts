import { AbstractDAO, AnyProjection, filterEntity, iteratorLength, LogArgs, Schema, setTraversing, sort } from '../../..'
import { FindParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../dao/dao.types'
import { InMemoryDAOGenerics, InMemoryDAOParams } from './dao.memory.types'
import { compare, getByPath } from './utils.memory'
import { PartialDeep } from 'type-fest'
import { v4 as uuidv4 } from 'uuid'

export class AbstractInMemoryDAO<T extends InMemoryDAOGenerics> extends AbstractDAO<T> {
  private idIndex: Map<T['idType'], number>
  private emptyIndexes: number[]
  private memory: (T['model'] | null)[]

  protected constructor({ idGenerator, ...params }: InMemoryDAOParams<T>) {
    super({ ...params, idGenerator: idGenerator ?? params.daoContext.adapters.mongo[params.idScalar]?.generate, driverContext: {} })
    this.memory = []
    this.emptyIndexes = [0]
    this.idIndex = new Map()
  }

  protected async _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    const unorderedResults = [...this.entities(params.filter)].map((v) => v.record)
    return (params.sorts ? sort(unorderedResults, params.sorts) : unorderedResults).slice(params.skip ?? 0, (params.skip ?? 0) + (params.limit ?? this.memory.length))
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
            return { ...p, [k]: records.map((v) => getByPath(v, aggregation.field as string) as number).reduce((p, c) => p + c, 0) }
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

    const sorted = args?.sorts ? sort(unorderedResults, args.sorts) : unorderedResults
    const result = sorted.slice(params.skip ?? 0, (params.skip ?? 0) + (params.limit ?? this.memory.length))
    return (params.by ? result : result[0]) as AggregateResults<T, A>
  }

  private recursiveSpreadCopy<O extends { [K in string]: unknown }>(record: O, schema: Schema<T['scalars']> = this.schema): O {
    const copy: { [K in string]: unknown } = { ...record }
    Object.entries(schema).forEach(([name, schemaField]) => {
      if ('embedded' in schemaField && copy[name]) {
        copy[name] = this.recursiveSpreadCopy(copy[name] as { [K in string]: unknown }, schemaField.embedded)
      }
    })
    return copy as O
  }

  protected _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>> {
    const record = this.recursiveSpreadCopy(params.record)
    if (this.idGeneration === 'db') {
      record[this.idField] = uuidv4()
    }
    const index = this.emptyIndexes.pop()
    if (index != null) {
      this.idIndex.set(record[this.idField], index)
      this.memory[index] = record
    } else {
      const index = this.memory.length
      const sizeIncrement = this.memory.length > 512 ? 1024 : this.memory.length * 2
      this.emptyIndexes = this.allocMemory(sizeIncrement - 1)
        .map((v, i) => this.memory.length + 1 + i)
        .reverse()
      this.idIndex.set(record[this.idField], index)
      this.memory[index] = record
    }
    return record
  }

  protected async _updateOne(params: UpdateParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter)) {
      const copy = this.recursiveSpreadCopy(record)
      Object.entries(params.changes).forEach(([k, v]) => setTraversing(copy, k, v))
      this.memory[index] = copy
      return
    }
  }

  protected async _updateAll(params: UpdateParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter)) {
      const copy = this.recursiveSpreadCopy(record)
      Object.entries(params.changes).forEach(([k, v]) => setTraversing(copy, k, v))
      this.memory[index] = copy
    }
  }

  protected async _replaceOne(params: ReplaceParams<T>): Promise<void> {
    for (const { record, index } of this.entities(filterEntity)) {
      this.memory[index] = this.recursiveSpreadCopy(params.replace, this.schema)
      this.idIndex.delete(record[this.idField])
      this.idIndex.set(params.replace[this.idField], index)
      break
    }
  }

  protected async _deleteOne(params: DeleteParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter)) {
      this.memory[index] = null
      this.idIndex.delete(record[this.idField])
      this.emptyIndexes.push(index)
      break
    }
  }

  protected async _deleteAll(params: DeleteParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter)) {
      this.memory[index] = null
      this.idIndex.delete(record[this.idField])
      this.emptyIndexes.push(index)
    }
  }

  protected _driver(): Exclude<LogArgs<string>['driver'], undefined> {
    return 'memory'
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
          const indexes = (idFilter['in'] as T['idType'][]).map((id) => this.idIndex.get(id)).flatMap((i) => (i === undefined ? [] : [i]))
          return [...new Set(indexes)]
        } else if (typeof idFilter === 'object' && idFilterKeys.includes('eq')) {
          const index = this.idIndex.get(idFilter['eq'])
          if (index !== undefined) {
            return [index]
          }
          return []
        } else if (typeof idFilter !== 'object' || idFilterKeys.every((k) => !k.startsWith('$'))) {
          const index = this.idIndex.get(idFilter)
          if (index !== undefined) {
            return [index]
          }
          return []
        }
      }
    }
    return null
  }
  private *entities(filter: T['filter'] = undefined): Iterable<{ record: T['model']; index: number }> {
    const indexes = this.getIndexes(filter)
    if (indexes) {
      for (const index of indexes) {
        if (this.memory[index] !== null && filterEntity(this.memory[index], filter)) {
          yield { record: this.memory[index], index }
        }
      }
      return
    }
    for (let i = 0; i < this.memory.length; i++) {
      if (this.memory[i] !== null && filterEntity(this.memory[i], filter)) {
        yield { record: this.memory[i], index: i }
      }
    }
  }

  private allocMemory(n: number): (T['model'] | null)[] {
    return Array(n).fill(null)
  }
}
