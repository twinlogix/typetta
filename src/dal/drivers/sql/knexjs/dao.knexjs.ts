/* eslint-disable @typescript-eslint/no-explicit-any */
import { idInfoFromSchema, isEmptyProjection, LogArgs } from '../../../..'
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

  protected constructor({ tableName, knex, idGenerator, schema, ...params }: KnexJsDAOParams<T>) {
    super({ ...params, driverContext: { tableName, knex }, schema, idGenerator: idGenerator ?? params.entityManager.adapters.knex[idInfoFromSchema(schema).idScalar]?.generate })
    this.tableName = tableName
    this.knex = knex
  }

  private qb(): Knex.QueryBuilder<any, any> {
    return this.knex(this.tableName)
  }

  private dbsToModels(objects: any[]): Promise<PartialDeep<T['model']>[]> {
    return Promise.all(objects.map((o) => this.dbToModel(o)))
  }

  private async dbToModel(object: any): Promise<PartialDeep<T['model']>> {
    const unflatted = unflatEmbdeddedFields(this.schema, object)
    //Remove null fields
    for (const key of Object.keys(this.schema)) {
      const schemaField = this.schema[key]
      const value = unflatted[schemaField.alias ?? key]
      if (!schemaField.required && value === null) {
        delete unflatted[schemaField.alias ?? key]
      }
    }
    const result = await transformObject(this.entityManager.adapters.knex, 'dbToModel', unflatted, this.schema)
    return result as PartialDeep<T['model']>
  }

  private async modelToDb(object: PartialDeep<T['model']>): Promise<any> {
    const transformed = await transformObject(this.entityManager.adapters.knex, 'modelToDB', object, this.schema)
    return flatEmbdeddedFields(this.schema, transformed)
  }

  private async buildSelect<P extends AnyProjection<T['projection']>>(projection?: P, qb?: Knex.QueryBuilder<any, any>): Promise<{ builder: Knex.QueryBuilder<any, any> }> {
    return projection ? buildSelect(qb || this.qb(), projection as GenericProjection, this.schema) : { builder: qb || this.qb() }
  }

  private async buildWhere(filter?: T['filter'], qb?: Knex.QueryBuilder<any, any>): Promise<{ builder: Knex.QueryBuilder<any, any> }> {
    return filter ? buildWhereConditions(qb || this.qb(), filter as AbstractFilter, this.schema, this.entityManager.adapters.knex) : { builder: qb || this.qb() }
  }

  private async buildSort(sort?: T['sort'], qb?: Knex.QueryBuilder<any, any>): Promise<{ builder: Knex.QueryBuilder<any, any> }> {
    if (typeof sort === 'function') {
      return { builder: sort(qb || this.qb()) }
    }
    return buildSort(qb || this.qb(), (sort || []) as unknown as AbstractSort[], this.schema)
  }

  private buildTransaction(options?: Pick<T['driverFilterOptions'], 'trx'>, qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return options?.trx ? (qb || this.qb()).transacting(options.trx) : qb || this.qb()
  }

  private async buildUpdate(changes: T['update'], qb?: Knex.QueryBuilder<any, any>): Promise<{ builder: Knex.QueryBuilder<any, any> } | null> {
    if (typeof changes === 'function') {
      return { builder: changes(qb || this.qb()) }
    }
    const updates = await this.adaptUpdate(changes)
    if (Object.keys(updates).length === 0) {
      return null
    }
    return { builder: (qb || this.qb()).update(updates) }
  }

  private adaptUpdate(changes: T['update']): Promise<object> {
    return adaptUpdate({ update: changes, schema: this.schema, adapters: this.entityManager.adapters.knex })
  }

  private async getRecords<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    return this.runQuery(
      'findAll',
      async () => {
        if (params.limit === 0) {
          return { skipReason: 'Limit is 0. Skip.' }
        }

        const select = isEmptyProjection(params.projection) ? { builder: this.qb().select([this.schema[this.idField].alias ?? this.idField]) } : await this.buildSelect(params.projection)
        const where = await this.buildWhere(params.filter, select.builder)
        const sort = await this.buildSort(params.sorts, where.builder)
        return {
          builder: this.buildTransaction(params.options, sort.builder)
            .limit(params.limit ?? this.pageSize)
            .offset(params.skip ?? 0),
        }
      },
      (results) => this.dbsToModels(results),
      [],
    )
  }

  protected _findAll<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
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
      async () => {
        const count = this.qb().count(this.idField, { as: 'all' })
        const where = await this.buildWhere(params.filter, count)
        return { builder: this.buildTransaction(params.options, where.builder) }
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
      async () => {
        if (params.by && Object.keys(params.by).length === 0) {
          throw new Error("'by' params must contains at least one key.")
        }
        const byColumns = Object.keys(params.by || {}).map((v) => modelNameToDbName(v, this.schema))
        const aggregations = Object.entries(params.aggregations).map(([k, v]) => {
          return this.knex.raw(`${v.operation.toUpperCase()}(${v.field == null ? '*' : modelNameToDbName(v.field as string, this.schema)}) as ${k}`)
        })
        const where = await this.buildWhere(params.filter)
        const sort = await this.buildSort(args?.sorts, where.builder)
        const select = sort.builder.select([...byColumns, ...aggregations])
        const groupBy = byColumns.length > 0 ? select.groupBy(byColumns) : select.groupByRaw('(SELECT 1)')
        const having = args?.having ? await buildHavingConditions(groupBy, args.having) : { builder: groupBy }
        return {
          builder: this.buildTransaction(params.options, having.builder)
            .limit(params.limit ?? this.pageSize)
            .offset(params.skip ?? 0),
        }
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

  protected _insertOne(params: InsertParams<T>): Promise<T['plainModel']> {
    return this.runQuery(
      'insertOne',
      async () => {
        const r = filterNullFields<PartialDeep<T['plainModel']>>(filterUndefiendFields<PartialDeep<T['plainModel']>>(params.record))
        const record = await this.modelToDb(r)
        const query = this.qb().insert(record, '*')
        return { builder: this.buildTransaction(params.options, query) }
      },
      async (records) => {
        const inserted = records[0]
        if (typeof inserted === 'number') {
          const insertedRetrieved = await this._findAll({ filter: { [this.idField]: (params.record as any)[this.idField] ?? inserted } as T['filter'], options: params.options, limit: 1 })
          return insertedRetrieved[0]
        }
        return this.dbToModel(inserted)
      },
    )
  }

  protected _updateOne(params: UpdateParams<T>): Promise<void> {
    return this.runQuery('updateOne', async () => {
      throw new Error(`Operation not supported. Use updateAll specifying the primary key field (${this.idField}) in order to update only one row.`)
    })
  }

  protected _updateAll(params: UpdateParams<T>): Promise<void> {
    return this.runQuery('updateAll', async () => {
      const update = await this.buildUpdate(params.changes)
      if (update === null) {
        return { skipReason: 'No changes. Skip.' }
      }
      const where = await this.buildWhere(params.filter, update.builder)
      return { builder: this.buildTransaction(params.options, where.builder) }
    })
  }

  protected _replaceOne(params: ReplaceParams<T>): Promise<void> {
    return this.runQuery('replaceOne', async () => {
      throw new Error(`Operation not supported.`)
    })
  }

  protected _deleteOne(params: DeleteParams<T>): Promise<void> {
    return this.runQuery('deleteOne', async () => {
      throw new Error(`Operation not supported. Use deleteAll specifying the primary key field (${this.idField}) in order to delete only one row.`)
    })
  }

  protected _deleteAll(params: DeleteParams<T>): Promise<void> {
    return this.runQuery('deleteAll', async () => {
      const deleteQ = this.qb().delete()
      const where = await this.buildWhere(params.filter, deleteQ)
      return { builder: this.buildTransaction(params.options, where.builder) }
    })
  }

  public async createTable(typeMap: Partial<Record<keyof T['scalars'], { singleType: string; arrayType?: string }>>, defaultType: { singleType: string; arrayType?: string }): Promise<void> {
    await this.knex.schema.createTable(this.tableName, (table) => {
      Object.entries(this.schema).forEach(([key, schemaField]) => {
        if (schemaField.type === 'scalar') {
          const specificType = typeMap[schemaField.scalar] ?? defaultType
          const cb = table.specificType(schemaField.alias || key, schemaField.isList ? specificType.arrayType ?? specificType.singleType : specificType.singleType)
          if (!schemaField.required) {
            cb.nullable()
          }
        } else if (schemaField.type === 'embedded') {
          embeddedScalars(schemaField.alias || key, schemaField.schema()).forEach(([subKey, subSchemaField]) => {
            const specificType = typeMap[subSchemaField.scalar] ?? defaultType
            const cb = table.specificType(subKey, schemaField.isList ? specificType.arrayType ?? specificType.singleType : specificType.singleType)
            if (!subSchemaField.required) {
              cb.nullable()
            }
          })
        }
      })
    })
  }

  private async runQuery<R = undefined>(
    operation: LogArgs<T['entity']>['operation'],
    queryBuilder: () => Promise<{ builder: Knex.QueryBuilder<any, any> } | { skipReason: string }>,
    transform?: (result: any) => R,
    skipDefault?: Awaited<R>,
  ): Promise<Awaited<R>> {
    const start = new Date()
    let query: { builder: Knex.QueryBuilder<any, any> } | { skipReason: string } = { skipReason: 'Failure in query builder' }
    try {
      query = await queryBuilder()
      if ('skipReason' in query) {
        await this.knexLog({ duration: 0, operation, level: 'query', query: query.skipReason, date: start })
        return skipDefault as Awaited<R>
      }
      const result = await query.builder
      const records = transform ? await transform(result) : undefined
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      await this.knexLog({ duration, operation, level: 'query', query: query.builder, date: finish })
      return records as Awaited<R>
    } catch (error: unknown) {
      const finish = new Date()
      const duration = finish.getTime() - start.getTime()
      await this.knexLog({ error, duration, operation, level: 'error', query: query && !('skipReason' in query) ? query.builder : undefined, date: finish })
      throw error
    }
  }

  private async knexLog(args: Pick<LogArgs<T['entity']>, 'duration' | 'error' | 'operation' | 'level' | 'date'> & { query?: Knex.QueryBuilder<any, any> | string }): Promise<void> {
    await this.log(() => this.createLog({ ...args, driver: 'knex', query: args.query ? (typeof args.query === 'string' ? args.query : args.query.toQuery().toString()) : undefined }))
  }

  protected _driver(): Exclude<LogArgs<string>['driver'], undefined> {
    return 'knex'
  }
}
