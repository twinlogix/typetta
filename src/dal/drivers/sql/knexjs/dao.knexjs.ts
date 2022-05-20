/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmptyProjection, LogArgs } from '../../../..'
import { transformObject } from '../../../../generation/utils'
import { filterNullFields, filterUndefiendFields, mapObject } from '../../../../utils/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../../dao/dao.types'
import { EqualityOperators, QuantityOperators, ElementOperators } from '../../../dao/filters/filters.types'
import { AnyProjection, GenericProjection } from '../../../dao/projections/projections.types'
import { KnexJsDAOGenerics, KnexJsDAOParams } from './dao.knexjs.types'
import {
  AbstractSort,
  adaptUpdate,
  buildHavingConditions,
  buildSelect,
  buildSort,
  buildWhereConditions,
  embeddedScalars,
  flatEmbdeddedFields,
  modelNameToDbName,
  unflatEmbdeddedFields,
} from './utils.knexjs'
import { Knex } from 'knex'
import { PartialDeep } from 'type-fest'

type AbstractFilter = {
  [key: string]: any | null | EqualityOperators<any> | QuantityOperators<any> | ElementOperators
}

export class AbstractKnexJsDAO<T extends KnexJsDAOGenerics> extends AbstractDAO<T> {
  private tableName: string
  private knex: Knex<any, unknown[]>

  protected constructor({ tableName, knex, idGenerator, ...params }: KnexJsDAOParams<T>) {
    super({ ...params, driverContext: { tableName, knex }, idGenerator: idGenerator ?? params.entityManager.adapters.knex[params.idScalar]?.generate })
    this.tableName = tableName
    this.knex = knex
  }

  private qb(): Knex.QueryBuilder<any, any> {
    return this.knex(this.tableName)
  }

  private dbsToModels(objects: any[]): PartialDeep<T['model']>[] {
    return objects.map((o) => this.dbToModel(o))
  }

  private dbToModel(object: any): PartialDeep<T['model']> {
    const unflatted = unflatEmbdeddedFields(this.schema, object)
    //Remove null fields
    for (const key of Object.keys(this.schema)) {
      const schemaField = this.schema[key]
      const value = unflatted[schemaField.alias ?? key]
      if (!schemaField.required && value === null) {
        delete unflatted[schemaField.alias ?? key]
      }
    }
    return transformObject(this.entityManager.adapters.knex, 'dbToModel', unflatted, this.schema)
  }

  private modelToDb(object: PartialDeep<T['model']>): any {
    const transformed = transformObject(this.entityManager.adapters.knex, 'modelToDB', object, this.schema)
    return flatEmbdeddedFields(this.schema, transformed)
  }

  private buildSelect<P extends AnyProjection<T['projection']>>(projection?: P, qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return projection ? buildSelect(qb || this.qb(), projection as GenericProjection, this.schema) : qb || this.qb()
  }

  private buildWhere(filter?: T['filter'], qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return filter ? buildWhereConditions(qb || this.qb(), filter as AbstractFilter, this.schema, this.entityManager.adapters.knex) : qb || this.qb()
  }

  private buildSort(sort?: T['sort'], qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    if (typeof sort === 'function') {
      return sort(qb || this.qb())
    }
    return buildSort(qb || this.qb(), (sort || []) as unknown as AbstractSort[], this.schema)
  }

  private buildTransaction(options?: Pick<T['driverFilterOptions'], 'trx'>, qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return options?.trx ? (qb || this.qb()).transacting(options.trx) : qb || this.qb()
  }

  private buildUpdate(changes: T['update'], qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> | null {
    if (typeof changes === 'function') {
      return changes(qb || this.qb())
    }
    const updates = this.adaptUpdate(changes)
    if (Object.keys(updates).length === 0) {
      return null
    }
    return (qb || this.qb()).update(updates)
  }

  private adaptUpdate(changes: T['update']): object {
    return adaptUpdate({ update: changes, schema: this.schema, adapters: this.entityManager.adapters.knex })
  }

  private async getRecords<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    return this.runQuery(
      'findAll',
      () => {
        if (params.limit === 0) {
          return { skipReason: 'Limit is 0. Skip.' }
        }
        const select = isEmptyProjection(params.projection) ? this.qb().select([this.schema[this.idField].alias ?? this.idField]) : this.buildSelect(params.projection)
        const where = this.buildWhere(params.filter, select)
        const sort = this.buildSort(params.sorts, where)
        return this.buildTransaction(params.options, sort)
          .limit(params.limit ?? this.pageSize)
          .offset(params.skip ?? 0)
      },
      (results) => this.dbsToModels(results),
      [],
    )
  }

  protected _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['projection']>[]> {
    return this.getRecords(params)
  }

  protected async _findPage<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<{ totalCount: number; records: PartialDeep<T['model']>[] }> {
    const totalCount = await this._count({ ...params })
    if (totalCount === 0) {
      return { totalCount, records: [] }
    }
    const records = await this.getRecords(params)
    return { totalCount, records }
  }

  protected async _exists(params: FilterParams<T>): Promise<boolean> {
    return (await this._count(params)) > 0
  }

  protected _count(params: FilterParams<T>): Promise<number> {
    return this.runQuery(
      'count',
      () => {
        const count = this.qb().count(this.idField, { as: 'all' })
        const where = this.buildWhere(params.filter, count)
        return this.buildTransaction(params.options, where)
      },
      (result) => result[0].all as number,
    )
  }

  protected _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    /**
     * In case by is omitted: maybe is safer this approach
     * SELECT count(*)
     * FROM film, (SELECT 1 x) dummy
     * WHERE 1 = 0
     * GROUP BY dummy.x;
     */
    return this.runQuery(
      'aggregate',
      () => {
        if (params.by && Object.keys(params.by).length === 0) {
          throw new Error("'by' params must contains at least one key.")
        }
        const byColumns = Object.keys(params.by || {}).map((v) => modelNameToDbName(v, this.schema))
        const aggregations = Object.entries(params.aggregations).map(([k, v]) => {
          return this.knex.raw(`${v.operation.toUpperCase()}(${v.field == null ? '*' : modelNameToDbName(v.field as string, this.schema)}) as ${k}`)
        })
        const where = this.buildWhere(params.filter)
        const sort = this.buildSort(args?.sorts, where)
        const select = sort.select([...byColumns, ...aggregations])
        const groupBy = byColumns.length > 0 ? select.groupBy(byColumns) : select.groupByRaw('(SELECT 1)')
        const having = args?.having ? buildHavingConditions(groupBy, args.having) : groupBy
        return this.buildTransaction(params.options, having)
          .limit(params.limit ?? this.pageSize)
          .offset(params.skip ?? 0)
      },
      async (results) => {
        Object.keys(params.by || {}).forEach((v) => {
          const name = modelNameToDbName(v, this.schema)
          for (const result of results) {
            const value = result[name]
            delete result[name]
            result[v] = value
          }
        })
        if (params.by) {
          return results as AggregateResults<T, A>
        } else {
          if (results.length === 0) {
            return mapObject(params.aggregations, ([k, v]) => [[k, v.operation === 'count' ? 0 : null]]) as AggregateResults<T, A>
          }
          return results[0] as AggregateResults<T, A>
        }
      },
    )
  }

  protected _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['insertExcludedFields']>> {
    return this.runQuery(
      'insertOne',
      () => {
        const r = filterNullFields<PartialDeep<T['model']>>(filterUndefiendFields<PartialDeep<T['model']>>(params.record))
        const record = this.modelToDb(r)
        const query = this.qb().insert(record, '*')
        return this.buildTransaction(params.options, query)
      },
      async (records) => {
        const inserted = records[0]
        if (typeof inserted === 'number') {
          const insertedRetrieved = await this._findAll({ filter: { [this.idField]: (params.record as any)[this.idField] ?? inserted } as T['filter'], options: params.options, limit: 1 })
          return insertedRetrieved[0] as Omit<T['model'], T['insertExcludedFields']>
        }
        return this.dbToModel(inserted) as Omit<T['model'], T['insertExcludedFields']>
      },
    )
  }

  protected _updateOne(params: UpdateParams<T>): Promise<void> {
    return this.runQuery('updateOne', () => {
      throw new Error(`Operation not supported. Use updateAll specifying the primary key field (${this.idField}) in order to update only one row.`)
    })
  }

  protected _updateAll(params: UpdateParams<T>): Promise<void> {
    return this.runQuery('updateAll', () => {
      const update = this.buildUpdate(params.changes)
      if (update === null) {
        return { skipReason: 'No changes. Skip.' }
      }
      const where = this.buildWhere(params.filter, update)
      return this.buildTransaction(params.options, where)
    })
  }

  protected _replaceOne(params: ReplaceParams<T>): Promise<void> {
    return this.runQuery('replaceOne', () => {
      throw new Error(`Operation not supported.`)
    })
  }

  protected _deleteOne(params: DeleteParams<T>): Promise<void> {
    return this.runQuery('deleteOne', () => {
      throw new Error(`Operation not supported. Use deleteAll specifying the primary key field (${this.idField}) in order to delete only one row.`)
    })
  }

  protected _deleteAll(params: DeleteParams<T>): Promise<void> {
    return this.runQuery('deleteAll', () => {
      const deleteQ = this.qb().delete()
      const where = this.buildWhere(params.filter, deleteQ)
      return this.buildTransaction(params.options, where)
    })
  }

  public async createTable(typeMap: Partial<Record<keyof T['scalars'], { singleType: string; arrayType?: string }>>, defaultType: { singleType: string; arrayType?: string }): Promise<void> {
    await this.knex.schema.createTable(this.tableName, (table) => {
      Object.entries(this.schema).forEach(([key, schemaField]) => {
        if (schemaField.type === 'scalar') {
          const specificType = typeMap[schemaField.scalar] ?? defaultType
          const cb = table.specificType(schemaField.alias || key, schemaField.array ? specificType.arrayType ?? specificType.singleType : specificType.singleType)
          if (!schemaField.required) {
            cb.nullable()
          }
        } else if (schemaField.type === 'embedded') {
          embeddedScalars(schemaField.alias || key, schemaField.schema()).forEach(([subKey, subSchemaField]) => {
            const specificType = typeMap[subSchemaField.scalar] ?? defaultType
            const cb = table.specificType(subKey, schemaField.array ? specificType.arrayType ?? specificType.singleType : specificType.singleType)
            if (!subSchemaField.required) {
              cb.nullable()
            }
          })
        }
      })
    })
  }

  private async runQuery<R = undefined>(
    operation: LogArgs<T['name']>['operation'],
    queryBuilder: () => Knex.QueryBuilder<any, any> | { skipReason: string },
    transform?: (result: any) => R,
    skipDefault?: Awaited<R>,
  ): Promise<Awaited<R>> {
    const start = new Date()
    let query: Knex.QueryBuilder<any, any> | undefined | { skipReason: string }
    try {
      query = queryBuilder()
      if ('skipReason' in query) {
        this.knexLog({ duration: 0, operation, level: 'query', query: query.skipReason, date: start })
        return skipDefault as Awaited<R>
      }
      const result = await query
      const records = transform ? await transform(result) : undefined
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      this.knexLog({ duration, operation, level: 'query', query, date: finish })
      return records as Awaited<R>
    } catch (error: unknown) {
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      this.knexLog({ error, duration, operation, level: 'error', query: query && !('skipReason' in query) ? query : undefined, date: finish })
      throw error
    }
  }

  private knexLog(args: Pick<LogArgs<T['name']>, 'duration' | 'error' | 'operation' | 'level' | 'date'> & { query?: Knex.QueryBuilder<any, any> | string }) {
    this.log(this.createLog({ ...args, driver: 'knex', query: args.query ? (typeof args.query === 'string' ? args.query : args.query.toQuery().toString()) : undefined }))
  }

  protected _driver(): Exclude<LogArgs<string>['driver'], undefined> {
    return 'knex'
  }
}
