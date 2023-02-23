import { AbstractScalars, AggregatePostProcessing } from '../../../..'
import { getSchemaFieldTraversing, mapObjectAsync, modelValueToDbValue, MONGODB_QUERY_PREFIXS } from '../../../../utils/utils'
import { AggregateParams, DAOGenerics } from '../../../dao/dao.types'
import { EqualityOperators, QuantityOperators, ElementOperators, LogicalOperators } from '../../../dao/filters/filters.types'
import { GenericProjection } from '../../../dao/projections/projections.types'
import { Schema } from '../../../dao/schemas/schemas.types'
import { SortDirection } from '../../../dao/sorts/sorts.types'
import { DefaultModelScalars, identityAdapter } from '../../drivers.types'
import { KnexJSDataTypeAdapterMap } from './adapters.knexjs'
import { Knex } from 'knex'

export type AbstractFilter = {
  [key: string]: unknown | null | EqualityOperators<unknown> | QuantityOperators<unknown> | ElementOperators
} & LogicalOperators<unknown>

export type AbstractSort = { [key: string]: SortDirection }

export function modelNameToDbName<Scalars extends AbstractScalars>(name: string, schema: Schema<Scalars>): string {
  const c = name.split('.')
  const k = c.shift() ?? name
  const schemaField = schema[k]
  const n = (schemaField && schemaField.alias) || k
  if (c.length === 0) {
    return n
  } else {
    return schemaField && schemaField.type === 'embedded' ? concatEmbeddedNames(n, modelNameToDbName(c.join('.'), schemaField.schema())) : k + '.' + c.join('.')
  }
}

export async function buildWhereConditions<TRecord extends Record<string, unknown>, TResult, ScalarsType extends DefaultModelScalars, T extends DAOGenerics>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  filter: T['filter'],
  schema: Schema<ScalarsType>,
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>,
): Promise<{ builder: Knex.QueryBuilder<TRecord, TResult> }> {
  if (typeof filter === 'function') {
    return { builder: filter(builder) }
  }
  for (const [k, v] of Object.entries(filter)) {
    const schemaField = getSchemaFieldTraversing(k, schema)
    if (schemaField) {
      if (schemaField.isList) {
        throw new Error(`Array filtering not supported on sql entity. (field: ${k})`)
      }
      const columnName = modelNameToDbName(k, schema)
      if (schemaField.type === 'scalar') {
        if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
          const adapter = adapters[schemaField.scalar]
          if (!adapter) {
            throw new Error(`Adapter for scalar ${schemaField.scalar.toString()} not found. ${Object.keys(adapters)}`)
          }
          const vr = v as Record<string, unknown>
          for (const [fk, fv] of Object.entries(v)) {
            const av = () => adapter.modelToDB(fv) as Knex.Value
            const avs = () => Promise.all((fv as any[]).map((fve) => adapter.modelToDB(fve) as Knex.Value))
            // prettier-ignore
            switch (fk) {
              case 'exists': fv == null ? null : fv ? builder.whereNotNull(columnName) : builder.whereNull(columnName); break
              case 'eq': 
                if(vr.mode && vr.mode === 'insensitive') { builder.whereILike(columnName, await av()) }
                else { builder.where(columnName, await av()) } break
              case 'gte': builder.where(columnName, '>=', await av()); break
              case 'gt': builder.where(columnName, '>', await av()); break
              case 'lte': builder.where(columnName, '<=', await av()); break
              case 'lt': builder.where(columnName, '<', await av()); break
              case 'ne': builder.not.where(columnName, await av()); break
              case 'in': builder.whereIn(columnName, await avs()); break
              case 'nin': builder.not.whereIn(columnName, await avs()); break
              case 'contains': 
                if(vr.mode && vr.mode === 'sensitive') {
                  builder.whereLike(columnName, `%${fv}%`)
                } else {
                  builder.whereILike(columnName, `%${fv}%`)
                }
                break
              case 'startsWith': 
                if(vr.mode && vr.mode === 'sensitive') {
                  builder.whereLike(columnName, `${fv}%`)
                } else {
                  builder.whereILike(columnName, `${fv}%`)
                }
                break
              case 'endsWith': 
                if(vr.mode && vr.mode === 'sensitive') {
                  builder.whereLike(columnName, `%${fv}`)
                } else {
                  builder.whereILike(columnName, `%${fv}`)
                }
                break
              case 'mode': break
              default: throw new Error(`${fk} query is not supported on sql entity.`)
            }
          }
        } else {
          if (v === null) {
            builder.whereNull(columnName)
          } else if (v !== undefined) {
            const adapter = adapters[schemaField.scalar]
            if (!adapter) {
              throw new Error(`Adapter for scalar ${schemaField.scalar.toString()} not found. ${Object.keys(adapters)}`)
            }
            builder.where(columnName, (await adapter.modelToDB(v as any)) as Knex.Value)
          }
        }
      } else {
        throw new Error('Filtering on embedded types is not supported.')
      }
    } else if (k === '$or') {
      for (const f of v as AbstractFilter[]) {
        await buildWhereConditions(builder.or, f, schema, adapters)
      }
    } else if (k === '$and') {
      for (const f of v as AbstractFilter[]) {
        await buildWhereConditions(builder, f, schema, adapters)
      }
    } else if (k === '$nor') {
      for (const f of v as AbstractFilter[]) {
        await buildWhereConditions(builder.not.or, f, schema, adapters)
      }
    } else {
      // throw new Error(`${k} is not a scalar in the schema. (Filtering on embedded types is not supported.)`)
    }
  }
  return { builder }
}

export async function buildHavingConditions<TRecord extends Record<string, unknown>, TResult>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  having: Exclude<AggregatePostProcessing<DAOGenerics, AggregateParams<DAOGenerics>>['having'], undefined>,
): Promise<{ builder: Knex.QueryBuilder<TRecord, TResult> }> {
  for (const [k, v] of Object.entries(having)) {
    if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
      for (const [fk, fv] of Object.entries(v)) {
        // prettier-ignore
        switch (fk) {
          case 'exists': fv ? builder.whereNotNull(k) : builder.whereNull(k); break
          case 'eq': builder.having(k, '=', fv as number); break
          case 'gte': builder.having(k, '>=', fv as number); break
          case 'gt': builder.having(k, '>', fv as number); break
          case 'lte': builder.having(k, '<=', fv as number); break
          case 'lt': builder.having(k, '<', fv as number); break
          case 'ne': builder.not.having(k, '=', fv as number); break
          case 'in': builder.havingIn(k, fv as number[]); break
          case 'nin': builder.havingNotIn(k, fv as number[]); break
          default: throw new Error(`${fk} query is not supported on sql entity.`)
        }
      }
    } else {
      if (v === null) {
        // builder.havingNull(columnName)
      } else if (v !== undefined) {
        builder.having(k, '=', v as number)
      }
    }
  }
  return { builder }
}

export async function buildSelect<TRecord extends Record<string, unknown>, TResult, Scalars extends AbstractScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  projection: GenericProjection,
  schema: Schema<Scalars>,
): Promise<{ builder: Knex.QueryBuilder<TRecord, TResult> }> {
  function embeddedColumns(prefix: string, s: Schema<Scalars>, proj: GenericProjection): string[] {
    return Object.entries(s).flatMap(([k, v]) => {
      if (proj === true || (typeof proj === 'object' && k in proj)) {
        if (v.type === 'embedded') {
          return embeddedColumns(concatEmbeddedNames(prefix, v.alias || k), v.schema(), proj === true ? proj : proj[k])
        }
        if (v.type === 'relation') {
          return []
        }
        return concatEmbeddedNames(prefix, v.alias || k)
      }
      return []
    })
  }

  if (projection === false) {
    builder.select([])
  } else if (projection === true) {
    builder.select()
  } else {
    builder.select(
      Object.entries(projection).flatMap(([k, v]) => {
        if (k in schema) {
          const schemaField = schema[k]
          if (schemaField.type === 'embedded') {
            return embeddedColumns(schemaField.alias || k, schemaField.schema(), v)
          } else if (schemaField.type === 'scalar') {
            return [schemaField.alias || k]
          } else {
            return []
          }
        } else {
          return []
        }
      }),
    )
  }
  return { builder }
}

export async function buildSort<TRecord extends Record<string, unknown>, TResult, Scalars extends AbstractScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  sort: AbstractSort[],
  schema: Schema<Scalars>,
): Promise<{ builder: Knex.QueryBuilder<TRecord, TResult> }> {
  for (const s of sort) {
    for (const [sortKey, sortDirection] of Object.entries(s)) {
      builder.orderBy(modelNameToDbName(sortKey, schema), sortDirection)
    }
  }
  return { builder }
}

export function flatEmbdeddedFields<Scalars extends AbstractScalars>(schema: Schema<Scalars>, object: Record<string, unknown>) {
  function flat(prefix: string, schemaFiled: { schema: () => Schema<Scalars> }, value: Record<string, unknown>): [string, unknown][] {
    return Object.entries(schemaFiled.schema()).flatMap(([k, subSchemaField]) => {
      const key = subSchemaField.alias ?? k
      if (key in value) {
        const name = concatEmbeddedNames(prefix, key)
        if (subSchemaField.type === 'embedded') {
          return flat(name, subSchemaField, value[key] as Record<string, unknown>)
        } else {
          return [[name, value[key]]]
        }
      }
      return []
    })
  }
  return Object.entries(schema).reduce((result, [k, schemaFiled]) => {
    const name = schemaFiled.alias || k
    if (schemaFiled.type === 'embedded' && name in object) {
      const flatted = { ...result, ...Object.fromEntries(flat(name, schemaFiled, object[name] as Record<string, unknown>)) }
      delete flatted[name]
      return flatted
    }
    return result
  }, object)
}

export function unflatEmbdeddedFields<Scalars extends AbstractScalars>(schema: Schema<Scalars>, object: Record<string, unknown>) {
  function unflat(prefix: string, schemaFiled: { schema: () => Schema<Scalars> }, value: { [key: string]: unknown }, toDelete: string[] = []): [object | undefined, string[]] {
    const res = Object.entries(schemaFiled.schema()).reduce(
      ([record, oldToDelete], [k, subSchemaField]) => {
        const name = concatEmbeddedNames(prefix, subSchemaField.alias ?? k)
        const subName = subSchemaField.alias ?? k
        if (subSchemaField.type === 'embedded') {
          const [obj, newToDelete] = unflat(name, subSchemaField, value, oldToDelete)
          if (newToDelete.length > 0) {
            return [{ ...(record ?? {}), [subName]: obj }, newToDelete] as [object, string[]]
          } else {
            return [record, oldToDelete] as [object | undefined, string[]]
          }
        } else if (name in value) {
          return [{ ...(record ?? {}), [subName]: value[name] }, [...oldToDelete, name]] as [object, string[]]
        }
        return [record, oldToDelete] as [object | undefined, string[]]
      },
      [undefined, toDelete] as [object | undefined, string[]],
    )
    return res
  }
  return Object.entries(schema).reduce((result, [k, schemaFiled]) => {
    if (schemaFiled.type === 'embedded') {
      const [obj, toDelete] = unflat(schemaFiled.alias ?? k, schemaFiled, object)
      //if every key of embedded is null the emedded was not inserted
      if (toDelete.every((k) => object[k] === null) && !schemaFiled.required) {
        for (const key of toDelete) {
          delete result[key]
        }
        return result
      }
      if (obj) {
        const res = { ...result, [schemaFiled.alias ?? k]: obj }
        for (const key of toDelete) {
          delete res[key]
        }
        return res
      }
    }
    return result
  }, object)
}

function concatEmbeddedNames(prefix: string, name: string) {
  return prefix + '_' + name
}

export function embeddedScalars<Scalars extends AbstractScalars>(
  prefix: string,
  schema: Schema<Scalars>,
): [string, { scalar: keyof Scalars } & { array?: boolean; required?: boolean; alias?: string }][] {
  return Object.entries(schema).flatMap(([key, schemaField]) => {
    if (schemaField.type === 'embedded') {
      return embeddedScalars(concatEmbeddedNames(prefix, schemaField.alias || key), schemaField.schema())
    }
    if (schemaField.type === 'relation') {
      return []
    }
    return [[concatEmbeddedNames(prefix, schemaField.alias || key), schemaField]]
  })
}

export async function adaptUpdate<ScalarsType extends AbstractScalars, UpdateType extends Record<string, unknown>>({
  update,
  schema,
  adapters,
}: {
  update: UpdateType
  schema: Schema<ScalarsType>
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>
}): Promise<Record<string, unknown>> {
  return mapObjectAsync(update, async ([k, v]) => {
    if (v === undefined) return []
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField && schemaField.type === 'scalar') {
      const adapter = adapters[schemaField.scalar] ?? identityAdapter()
      return [[columnName, await modelValueToDbValue(v, schemaField, adapter)]]
    } else if (schemaField && schemaField.type === 'embedded') {
      const adapted = await adaptUpdate({ update: v as Record<string, unknown>, schema: schemaField.schema(), adapters })
      return Object.entries(adapted).map(([sk, sv]) => {
        return [concatEmbeddedNames(columnName, sk), sv]
      })
    } else {
      return []
    }
  })
}
