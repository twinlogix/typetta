import { MONGODB_QUERY_PREFIXS } from '../../../../utils/utils'
import { ComparisonOperators, ElementOperators, EvaluationOperators, LogicalOperators } from '../../../dao/filters/filters.types'
import { GenericProjection } from '../../../dao/projections/projections.types'
import { Schema } from '../../../dao/schemas/schemas.types'
import { SortDirection } from '../../../dao/sorts/sorts.types'
import { DefaultModelScalars } from '../../drivers.types'
import { KnexJSDataTypeAdapterMap } from './adapters.knexjs'
import { Knex } from 'knex'

export type AbstractFilter = {
  [key: string]: unknown | null | ComparisonOperators<unknown> | ElementOperators<unknown> | EvaluationOperators<unknown>
} & LogicalOperators<unknown>

export type AbstractSort = { [key: string]: SortDirection }

//TODO: array fitlering not supported
export function buildWhereConditions<TRecord, TResult, ScalarsType extends DefaultModelScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  filter: AbstractFilter,
  schema: Schema<ScalarsType>,
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>,
): Knex.QueryBuilder<TRecord, TResult> {
  Object.entries(filter).forEach(([k, v]) => {
    if (k in schema) {
      const schemaField = schema[k]
      if (schemaField.array) {
        throw new Error(`Array filtering not supported on sql entity yet. (field: ${k})`)
      }
      if ('scalar' in schemaField) {
        if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
          const adapter = adapters[schemaField.scalar]
          Object.entries(v).forEach(([fk, fv]) => {
            const av = () => (adapter ? adapter.modelToDB(fv) : fv)
            const avs = () => (adapter ? (fv as Array<any>).map((fve) => adapter.modelToDB(fve)) : fv)
            // prettier-ignore
            switch (fk) { // TODO: text search
              case '$exists': fv ? builder.whereNotNull(k) : builder.whereNull(k); break
              case '$eq': builder.where(k, av()); break
              case '$gte': builder.where(k, '>=', av()); break
              case '$gt': builder.where(k, '>', av()); break
              case '$lte': builder.where(k, '<=', av()); break
              case '$lt': builder.where(k, '<', av()); break
              case '$ne': builder.not.where(k, av()); break
              case '$in': builder.whereIn(k, avs()); break
              case '$nin': builder.not.whereIn(k, avs()); break
              default: throw new Error(`${fk} query is not supported on sql entity yet.`)
            }
          })
        } else {
          if (v === null) {
            builder.whereNull(k)
          } else if (v !== undefined) {
            const adapter = adapters[schemaField.scalar]
            const av = adapter ? adapter.modelToDB(v as any) : v
            builder.where(k, av as any)
          }
        }
      } else {
        throw new Error('Filtering on embedded types is not supported.')
      }
    } else if (k === '$or') {
      builder.orWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb.or, filter, schema, adapters))
      })
    } else if (k === '$and') {
      builder.andWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb, filter, schema, adapters))
      })
    } else if (k === '$nor') {
      builder.not.orWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((filter) => buildWhereConditions(qb.or, filter, schema, adapters))
      })
    } else if (k === '$not') {
      builder.whereNot((qb) => {
        buildWhereConditions(qb, v as AbstractFilter, schema, adapters)
      })
    } else {
      throw new Error(`${k} is not a scalar in the schema. (Filtering on embedded types is not supported.)`)
    }
  })
  return builder
}

//TODO: array not supported
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
