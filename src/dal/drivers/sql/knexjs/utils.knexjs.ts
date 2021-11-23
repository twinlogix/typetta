import { Knex } from 'knex'
import { ComparisonOperators, ElementOperators, EvaluationOperators, LogicalOperators } from '../../../dao/filters/filters.types'
import { GenericProjection } from '../../../dao/projections/projections.types'
import { Schema } from '../../../dao/schemas/schemas.types'
import { SortDirection } from '../../../dao/sorts/sorts.types'
import { DataTypeAdapter } from '../../drivers.types'

export type AbstractFilter =
  | {
    [key: string]: any | null | ComparisonOperators<any> | ElementOperators<any> | EvaluationOperators<any>
  }
  | LogicalOperators<any>

export type AbstractSort = { [key: string]: SortDirection }

export function buildWhereConditions<TRecord, TResult, ScalarsType, Scalar extends keyof ScalarsType>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  filter: AbstractFilter,
  schema: Schema<ScalarsType>,
  adapters: Map<keyof ScalarsType, DataTypeAdapter<ScalarsType, keyof ScalarsType, any>>,
): Knex.QueryBuilder<TRecord, TResult> {
  Object.entries(filter).forEach(([k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      if ('scalar' in schemaField) {
        if (typeof v === 'object' && v !== null) {
          Object.entries(v).forEach(([fk, fv]) => {
            const adapter = adapters.get(schemaField.scalar)
            const av = adapter ? (Array.isArray(fv) ? fv.map((fve) => adapter.modelToDB(fve as ScalarsType[Scalar])) : adapter.modelToDB(fv as ScalarsType[Scalar])) : fv
            // prettier-ignore
            switch (fk) { // TODO: text search
              case '$exists': fv ? builder.whereNotNull(k) : builder.whereNull(k); break
              case '$eq': builder.where(k, av); break
              case '$in': builder.whereIn(k, av as any[]); break
              case '$gte': builder.where(k, '>=', av); break
              case '$gt': builder.where(k, '>', av); break
              case '$lte': builder.where(k, '<=', av); break
              case '$lt': builder.where(k, '<', av); break
              case '$ne': builder.not.where(k, av); break
              case '$nin': builder.not.whereIn(k, av as any[]); break
            }
          })
        } else {
          if (v === null) {
            builder.whereNull(k)
          } else if (v !== undefined) {
            const adapter = adapters.get(schemaField.scalar)
            const av = adapter ? adapter.modelToDB(v as ScalarsType[Scalar]) : v
            builder.where(k, av)
          }
        }
      } else {
        throw new Error('Where conditions on embedded types are not supported yet.')
      }
    } else if (k === '$or') {
      builder.orWhere((qb) => {
        ; (v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb.or, filter, schema, adapters))
      })
    } else if (k === '$and') {
      builder.andWhere((qb) => {
        ; (v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb, filter, schema, adapters))
      })
    } else if (k === '$nor') {
      builder.not.orWhere((qb) => {
        ; (v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb.or, filter, schema, adapters))
      })
    } else if (k === '$not') {
      builder.whereNot((qb) => {
        buildWhereConditions(qb, v as AbstractFilter, schema, adapters)
      })
    }
  })
  return builder
}

export function buildSelect<TRecord, TResult>(builder: Knex.QueryBuilder<TRecord, TResult>, projection: GenericProjection): Knex.QueryBuilder<TRecord, TResult> {
  if (projection === false) {
    builder.select([])
  } else if (projection === true) {
    builder.select()
  } else {
    builder.select(
      Object.entries(projection).flatMap(([k, v]) => {
        return v ? [k] : []
      }),
    )
  }
  return builder
}

export function buildSort<TRecord, TResult>(builder: Knex.QueryBuilder<TRecord, TResult>, sorts: AbstractSort[]): Knex.QueryBuilder<TRecord, TResult> {
  sorts.forEach((s) => {
    const [sortKey, sortDirection] = Object.entries(s)[0]
    builder.orderBy(sortKey, sortDirection === SortDirection.ASC ? 'asc' : 'desc')
  })
  return builder
}
