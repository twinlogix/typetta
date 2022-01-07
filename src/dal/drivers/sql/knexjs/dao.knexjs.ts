import { transformObject } from '../../../../generation/utils'
import { AbstractDAO } from '../../../dao/dao'
import { FindParams, FindOneParams, FilterParams, InsertParams, UpdateParams, ReplaceParams, DeleteParams, AggregateParams, AggregatePostProcessing, AggregateResults } from '../../../dao/dao.types'
import { EqualityOperators, QuantityOperators, ElementOperators, StringOperators } from '../../../dao/filters/filters.types'
import { AnyProjection, GenericProjection } from '../../../dao/projections/projections.types'
import { KnexJsDAOGenerics, KnexJsDAOParams } from './dao.knexjs.types'
import { AbstractSort, adaptUpdate, buildSelect, buildSort, buildWhereConditions, embeddedScalars, flatEmbdeddedFields, unflatEmbdeddedFields } from './utils.knexjs'
import { Knex } from 'knex'
import { PartialDeep } from 'type-fest'

type AbstractFilter = {
  [key: string]: any | null | EqualityOperators<any> | QuantityOperators<any> | ElementOperators | StringOperators
}

export class AbstractKnexJsDAO<T extends KnexJsDAOGenerics> extends AbstractDAO<T> {
  private tableName: string
  private knex: Knex<any, unknown[]>

  protected constructor({ tableName, knex, ...params }: KnexJsDAOParams<T>) {
    super({ ...params, driverContext: { knex } })
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
    return transformObject(this.daoContext.adapters.knex, 'dbToModel', unflatted, this.schema)
  }

  private modelToDb(object: PartialDeep<T['model']>): any {
    const transformed = transformObject(this.daoContext.adapters.knex, 'modelToDB', object, this.schema)
    return flatEmbdeddedFields(this.schema, transformed)
  }

  private buildSelect<P extends AnyProjection<T['projection']>>(projection?: P, qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return projection ? buildSelect(qb || this.qb(), projection as GenericProjection, this.schema) : qb || this.qb()
  }

  private buildWhere(filter?: T['filter'], qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return filter ? buildWhereConditions(qb || this.qb(), filter as AbstractFilter, this.schema, this.daoContext.adapters.knex) : qb || this.qb()
  }

  private buildSort(sorts?: T['sort'][], qb?: Knex.QueryBuilder<any, any>) {
    return buildSort(qb || this.qb(), (sorts || []) as unknown as AbstractSort[], this.schema)
  }

  private buildTransaction(options?: Pick<T['driverFilterOptions'], 'trx'>, qb?: Knex.QueryBuilder<any, any>): Knex.QueryBuilder<any, any> {
    return options?.trx ? (qb || this.qb()).transacting(options.trx) : qb || this.qb()
  }

  private adaptUpdate(changes: T['update']): object {
    return adaptUpdate(changes, this.schema, this.daoContext.adapters.knex)
  }

  private async getRecords<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['model']>[]> {
    const select = this.buildSelect(params.projection)
    const where = this.buildWhere(params.filter, select)
    const query = this.buildSort(params.sorts, where)
    const records = await this.buildTransaction(params.options, query)
      .limit(params.limit || this.pageSize)
      .offset(params.start || 0)
    return this.dbsToModels(records)
  }

  protected async _find<P extends AnyProjection<T['projection']>>(params: FindParams<T, P>): Promise<PartialDeep<T['projection']>[]> {
    return this.getRecords(params)
  }

  protected async _findOne<P extends AnyProjection<T['projection']>>(params: FindOneParams<T, P>): Promise<PartialDeep<T['model']> | null> {
    const select = this.buildSelect(params.projection)
    const where = this.buildWhere(params.filter, select)
    const record = await this.buildTransaction(params.options, where).first()
    return record ? this.dbToModel(record) : null
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

  protected async _count(params: FilterParams<T>): Promise<number> {
    const count = this.qb().count(this.idField, { as: 'all' })
    const where = this.buildWhere(params.filter, count)
    const result = await this.buildTransaction(params.options, where)
    return result[0].all as number
  }

  protected async _aggregate<A extends AggregateParams<T>>(params: A, args?: AggregatePostProcessing<T, A>): Promise<AggregateResults<T, A>> {
    throw new Error("Not implemented.")
  }

  protected async _insertOne(params: InsertParams<T>): Promise<Omit<T['model'], T['exludedFields']>> {
    const record = this.modelToDb(params.record as PartialDeep<T['model']>)
    const query = this.qb().insert(record, '*')
    const records = await this.buildTransaction(params.options, query)
    const inserted = records[0]
    if (typeof inserted === 'number') {
      return (await this._findOne({ filter: { [this.idField]: (params.record as any)[this.idField] || inserted } as T['filter'], options: params.options })) as Omit<T['model'], T['exludedFields']>
    }
    return this.dbToModel(inserted) as Omit<T['model'], T['exludedFields']>
  }

  protected _updateOne(params: UpdateParams<T>): Promise<void> {
    throw new Error(`Operation not supported. Use updateAll or apiV1.updateMany specifying the primary key field (${this.idField}) in order to update only one row.`)
  }

  protected async _updateMany(params: UpdateParams<T>): Promise<void> {
    const updateObject = this.adaptUpdate(params.changes)
    const update = this.qb().update(updateObject)
    const where = this.buildWhere(params.filter, update)
    await this.buildTransaction(params.options, where)
  }

  protected _replaceOne(params: ReplaceParams<T>): Promise<void> {
    throw new Error(`Operation not supported.`)
  }

  protected _deleteOne(params: DeleteParams<T>): Promise<void> {
    throw new Error(`Operation not supported. Use deleteAll or apiV1.delete specifying the primary key field (${this.idField}) in order to delete only one row.`)
  }

  protected async _deleteMany(params: DeleteParams<T>): Promise<void> {
    const deleteQ = this.qb().delete()
    const where = this.buildWhere(params.filter, deleteQ)
    await this.buildTransaction(params.options, where)
  }

  public async createTable(specificTypeMap: Map<keyof T['scalars'], [string, string]>, defaultSpecificType: [string, string]): Promise<void> {
    await this.knex.schema.createTable(this.tableName, (table) => {
      Object.entries(this.schema).forEach(([key, schemaField]) => {
        if ('scalar' in schemaField) {
          const specificType = specificTypeMap.get(schemaField.scalar) || defaultSpecificType
          const cb = table.specificType(schemaField.alias || key, specificType[schemaField.array ? 1 : 0])
          if (!schemaField.required) {
            cb.nullable()
          }
        } else {
          embeddedScalars(schemaField.alias || key, schemaField.embedded).forEach(([subKey, subSchemaField]) => {
            const specificType = specificTypeMap.get(subSchemaField.scalar) || defaultSpecificType
            const cb = table.specificType(subKey, specificType[subSchemaField.array ? 1 : 0])
            if (!subSchemaField.required) {
              cb.nullable()
            }
          })
        }
      })
    })
  }
}
