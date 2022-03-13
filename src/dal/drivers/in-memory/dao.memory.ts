import { AbstractDAO, AnyProjection, filterEntity, GenericProjection, iteratorLength, LogArgs, project, Schema, sort } from '../../..'
import { FindParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../dao/dao.types'
import { InMemoryDAOGenerics, InMemoryDAOParams } from './dao.memory.types'
import { PartialDeep } from 'type-fest'
import { v4 as uuidv4 } from 'uuid'

export class AbstractInMemoryDAO<T extends InMemoryDAOGenerics> extends AbstractDAO<T> {
  private idIndex: Map<T['model'][T['idKey']], number>
  private memory: (T['model'] | null)[]

  protected constructor({ idGenerator, ...params }: InMemoryDAOParams<T>) {
    super({ ...params, idGenerator: idGenerator ?? params.daoContext.adapters.mongo[params.idScalar]?.generate, driverContext: {} })
    this.memory = [null, null]
    this.idIndex = new Map()
  }

  protected async _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    const unorderedResults = [...this.entities(params.filter)].map((v) => v.record)
    const results = params.sorts ? sort(unorderedResults, params.sorts) : unorderedResults
    const projectedResults = params.projection ? project(results, params.projection as GenericProjection) : results
    return projectedResults.splice(params.skip ?? 0, params.limit ?? this.memory.length)
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

  protected _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    throw new Error('Not implemented')
  }

  private recursiveSpreadCopy<O extends { [K in string]: unknown }>(record: O, schema: Schema<T['scalars']>): O {
    const copy: { [K in string]: unknown } = { ...record }
    Object.entries(schema).forEach(([name, schemaField]) => {
      if ('embedded' in schemaField) {
        copy[name] = this.recursiveSpreadCopy(copy[name] as { [K in string]: unknown }, schemaField.embedded)
      }
    })
    return copy as O
  }

  protected _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>> {
    const record = this.recursiveSpreadCopy(params.record, this.schema)
    if (this.idGeneration === 'db') {
      record[this.idField] = uuidv4()
    }
    for (let i = 0; i < this.memory.length; i++) {
      if (this.memory[i] === null) {
        this.idIndex.set(record[this.idField], i)
        this.memory[i] = record
        return record
      }
    }
    this.idIndex.set(record[this.idField], this.memory.length)
    this.memory.push(record)
    return record
  }

  protected async _updateOne(params: UpdateParams<T>): Promise<void> {
    throw new Error('Not implemented')
  }

  protected async _updateAll(params: UpdateParams<T>): Promise<void> {
    throw new Error('Not implemented')
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
      break
    }
  }

  protected async _deleteAll(params: DeleteParams<T>): Promise<void> {
    for (const { record, index } of this.entities(params.filter)) {
      this.memory[index] = null
      this.idIndex.delete(record[this.idField])
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
        if (typeof idFilter === 'object' && idFilterKeys.includes('$in')) {
          const indexes = (idFilter['$in'] as T['model'][T['idKey']][]).map((id) => this.idIndex.get(id)).flatMap((i) => (i === undefined ? [] : [i]))
          return [...new Set(indexes)]
        } else if (typeof idFilter === 'object' && idFilterKeys.includes('$eq')) {
          const index = this.idIndex.get(idFilter['$eq'])
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
}
