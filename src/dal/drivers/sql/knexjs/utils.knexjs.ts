import { findSchemaField, MONGODB_QUERY_PREFIXS } from '../../../../utils/utils'
import { EqualityOperators, QuantityOperators, ElementOperators, StringOperators, LogicalOperators } from '../../../dao/filters/filters.types'
import { GenericProjection } from '../../../dao/projections/projections.types'
import { Schema, SchemaField } from '../../../dao/schemas/schemas.types'
import { SortDirection } from '../../../dao/sorts/sorts.types'
import { DefaultModelScalars } from '../../drivers.types'
import { KnexJSDataTypeAdapterMap } from './adapters.knexjs'
import { Knex } from 'knex'

export type AbstractFilter = {
  [key: string]: unknown | null | EqualityOperators<unknown> | QuantityOperators<unknown> | ElementOperators | StringOperators
} & LogicalOperators<unknown>

export type AbstractSort = { [key: string]: SortDirection }

// TODO: array fitlering not supported
export function buildWhereConditions<TRecord, TResult, ScalarsType extends DefaultModelScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  filter: AbstractFilter,
  schema: Schema<ScalarsType>,
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>,
): Knex.QueryBuilder<TRecord, TResult> {
  Object.entries(filter).forEach(([k, v]) => {
    const schemaField = findSchemaField(k, schema)
    if (schemaField) {
      if (schemaField.array) {
        throw new Error(`Array filtering not supported on sql entity yet. (field: ${k})`)
      }
      const columnName = k.split('.').join('_')
      if ('scalar' in schemaField) {
        if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
          const adapter = adapters[schemaField.scalar]
          if (!adapter) {
            throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
          }
          Object.entries(v).forEach(([fk, fv]) => {
            const av = () => adapter.modelToDB(fv) as any
            const avs = () => (fv as any[]).map((fve) => adapter.modelToDB(fve) as any)
            // prettier-ignore
            switch (fk) { // TODO: text search
              case '$exists': fv ? builder.whereNotNull(columnName) : builder.whereNull(columnName); break
              case '$eq': builder.where(columnName, av()); break
              case '$gte': builder.where(columnName, '>=', av()); break
              case '$gt': builder.where(columnName, '>', av()); break
              case '$lte': builder.where(columnName, '<=', av()); break
              case '$lt': builder.where(columnName, '<', av()); break
              case '$ne': builder.not.where(columnName, av()); break
              case '$in': builder.whereIn(columnName, avs()); break
              case '$nin': builder.not.whereIn(columnName, avs()); break
              default: throw new Error(`${fk} query is not supported on sql entity yet.`)
            }
          })
        } else {
          if (v === null) {
            builder.whereNull(columnName)
          } else if (v !== undefined) {
            const adapter = adapters[schemaField.scalar]
            builder.where(columnName, adapter.modelToDB(v as any) as any)
          }
        }
      } else {
        throw new Error('Filtering on embedded types is not supported.')
      }
    } else if (k === '$or') {
      builder.orWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((f) => buildWhereConditions(qb.or, f, schema, adapters))
      })
    } else if (k === '$and') {
      builder.andWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((f) => buildWhereConditions(qb, f, schema, adapters))
      })
    } else if (k === '$nor') {
      builder.not.orWhere((qb) => {
        ;(v as AbstractFilter[]).forEach((f) => buildWhereConditions(qb.or, f, schema, adapters))
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

function embeddedColumns<ScalarsType>(prefix: string, schema: Schema<ScalarsType>, projection: GenericProjection): string[] {
  return Object.entries(schema).flatMap(([k, v]) => {
    if (projection === true || (typeof projection === 'object' && k in projection)) {
      if ('embedded' in v) {
        return embeddedColumns(concatEmbeddedNames(prefix, k), v.embedded, projection === true ? projection : projection[k])
      }
      return concatEmbeddedNames(prefix, k)
    }
    return []
  })
}

// TODO: array not supported
export function buildSelect<TRecord, TResult, ScalarsType>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  projection: GenericProjection,
  schema: Schema<ScalarsType>,
): Knex.QueryBuilder<TRecord, TResult> {
  if (projection === false) {
    builder.select([])
  } else if (projection === true) {
    builder.select()
  } else {
    builder.select(
      Object.entries(projection).flatMap(([k, v]) => {
        if (k in schema) {
          const schemaField = schema[k]
          if ('embedded' in schemaField) {
            return embeddedColumns(k, schemaField.embedded, v)
          } else {
            return [k]
          }
        } else {
          return []
        }
      }),
    )
  }
  return builder
}

export function buildSort<TRecord, TResult>(builder: Knex.QueryBuilder<TRecord, TResult>, sorts: AbstractSort[]): Knex.QueryBuilder<TRecord, TResult> {
  sorts.forEach((s) => {
    const [sortKey, sortDirection] = Object.entries(s)[0]
    builder.orderBy(sortKey.split('.').join('_'), sortDirection === SortDirection.ASC ? 'asc' : 'desc')
  })
  return builder
}

export function flat<ScalarsType>(prefix: string, schemaFiled: { embedded: Schema<ScalarsType> }, value: object): object {
  return Object.entries(value).reduce((result, [k, v]) => {
    const subSchemaField = schemaFiled.embedded[k]
    const name = concatEmbeddedNames(prefix, k)
    if ('embedded' in subSchemaField) {
      return { ...result, ...flat(name, subSchemaField, v) }
    } else {
      return { ...result, [name]: v }
    }
  }, {})
}

export function unflat<ScalarsType>(prefix: string, schemaFiled: { embedded: Schema<ScalarsType> }, value: { [key: string]: unknown }, toDelete: string[] = []): [object, string[]] {
  const res = Object.entries(schemaFiled.embedded).reduce(
    (t, [k, v]) => {
      const name = concatEmbeddedNames(prefix, k)
      if ('embedded' in v) {
        const [obj, newToDelete] = unflat(name, v, value, t[1])
        return [{ ...t[0], [k]: obj }, newToDelete] as [object, string[]]
      } else if (name in value) {
        return [{ ...t[0], [k]: value[name] }, [...t[1], name]] as [object, string[]]
      }
      return t
    },
    [{}, toDelete] as [object, string[]],
  )
  return res
}

export function concatEmbeddedNames(prefix: string, name: string) {
  return prefix + '_' + name
}
