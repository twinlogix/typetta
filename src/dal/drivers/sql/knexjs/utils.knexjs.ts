import { AbstractScalars, AggregatePostProcessing } from '../../../..'
import { getSchemaFieldTraversing, mapObject, modelValueToDbValue, MONGODB_QUERY_PREFIXS } from '../../../../utils/utils'
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

export function buildWhereConditions<TRecord, TResult, ScalarsType extends DefaultModelScalars, T extends DAOGenerics>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  filter: T['filter'],
  schema: Schema<ScalarsType>,
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>,
): Knex.QueryBuilder<TRecord, TResult> {
  if (typeof filter === 'function') {
    return filter(builder)
  }
  Object.entries(filter).forEach(([k, v]) => {
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
            throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
          }
          const vr = v as Record<string, unknown>
          Object.entries(v).forEach(([fk, fv]) => {
            const av = () => adapter.modelToDB(fv) as any
            const avs = () => (fv as any[]).map((fve) => adapter.modelToDB(fve) as any)
            // prettier-ignore
            switch (fk) {
              case 'exists': fv == null ? null : fv ? builder.whereNotNull(columnName) : builder.whereNull(columnName); break
              case 'eq': 
                if(vr.mode && vr.mode === 'insensitive') { builder.whereILike(columnName, av()) }
                else { builder.where(columnName, av()) } break
              case 'gte': builder.where(columnName, '>=', av()); break
              case 'gt': builder.where(columnName, '>', av()); break
              case 'lte': builder.where(columnName, '<=', av()); break
              case 'lt': builder.where(columnName, '<', av()); break
              case 'ne': builder.not.where(columnName, av()); break
              case 'in': builder.whereIn(columnName, avs()); break
              case 'nin': builder.not.whereIn(columnName, avs()); break
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
          })
        } else {
          if (v === null) {
            builder.whereNull(columnName)
          } else if (v !== undefined) {
            const adapter = adapters[schemaField.scalar]
            if (!adapter) {
              throw new Error(`Adapter for scalar ${schemaField.scalar} not found. ${Object.keys(adapters)}`)
            }
            builder.where(columnName, adapter.modelToDB(v as any) as any)
          }
        }
      } else {
        throw new Error('Filtering on embedded types is not supported.')
      }
    } else if (k === '$or') {
      builder.orWhere((qb) => {
        for (const f of v as AbstractFilter[]) {
          buildWhereConditions(qb.or, f, schema, adapters)
        }
      })
    } else if (k === '$and') {
      builder.andWhere((qb) => {
        for (const f of v as AbstractFilter[]) {
          buildWhereConditions(qb, f, schema, adapters)
        }
      })
    } else if (k === '$nor') {
      builder.not.orWhere((qb) => {
        for (const f of v as AbstractFilter[]) {
          buildWhereConditions(qb.or, f, schema, adapters)
        }
      })
    } else {
      // throw new Error(`${k} is not a scalar in the schema. (Filtering on embedded types is not supported.)`)
    }
  })
  return builder
}

export function buildHavingConditions<TRecord, TResult>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  having: Exclude<AggregatePostProcessing<DAOGenerics, AggregateParams<DAOGenerics>>['having'], undefined>,
): Knex.QueryBuilder<TRecord, TResult> {
  Object.entries(having).forEach(([k, v]) => {
    if (typeof v === 'object' && v !== null && Object.keys(v).some((kv) => MONGODB_QUERY_PREFIXS.has(kv))) {
      Object.entries(v).forEach(([fk, fv]) => {
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
      })
    } else {
      if (v === null) {
        // builder.havingNull(columnName)
      } else if (v !== undefined) {
        builder.having(k, '=', v as number)
      }
    }
  })
  return builder
}

export function buildSelect<TRecord, TResult, Scalars extends AbstractScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  projection: GenericProjection,
  schema: Schema<Scalars>,
): Knex.QueryBuilder<TRecord, TResult> {
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
  return builder
}

export function buildSort<TRecord, TResult, Scalars extends AbstractScalars>(
  builder: Knex.QueryBuilder<TRecord, TResult>,
  sort: AbstractSort[],
  schema: Schema<Scalars>,
): Knex.QueryBuilder<TRecord, TResult> {
  sort.forEach((s) => {
    Object.entries(s).forEach(([sortKey, sortDirection]) => {
      builder.orderBy(modelNameToDbName(sortKey, schema), sortDirection)
    })
  })
  return builder
}

export function flatEmbdeddedFields<Scalars extends AbstractScalars>(schema: Schema<Scalars>, object: any) {
  function flat(prefix: string, schemaFiled: { schema: () => Schema<Scalars> }, value: any): [string, unknown][] {
    return Object.entries(schemaFiled.schema()).flatMap(([k, subSchemaField]) => {
      const key = subSchemaField.alias ?? k
      if (key in value) {
        const name = concatEmbeddedNames(prefix, key)
        if (subSchemaField.type === 'embedded') {
          return flat(name, subSchemaField, value[key])
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
      const flatted = { ...result, ...Object.fromEntries(flat(name, schemaFiled, object[name])) }
      delete flatted[name]
      return flatted
    }
    return result
  }, object)
}

export function unflatEmbdeddedFields<Scalars extends AbstractScalars>(schema: Schema<Scalars>, object: any) {
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

export function adaptUpdate<ScalarsType extends AbstractScalars, UpdateType>({
  update,
  schema,
  adapters,
}: {
  update: UpdateType
  schema: Schema<ScalarsType>
  adapters: KnexJSDataTypeAdapterMap<ScalarsType>
}): object {
  return mapObject(update as any, ([k, v]) => {
    if (v === undefined) return []
    const schemaField = getSchemaFieldTraversing(k, schema)
    const columnName = modelNameToDbName(k, schema)
    if (schemaField && schemaField.type === 'scalar') {
      const adapter = adapters[schemaField.scalar] ?? identityAdapter()
      return [[columnName, modelValueToDbValue(v, schemaField, adapter)]]
    } else if (schemaField && schemaField.type === 'embedded') {
      const adapted = adaptUpdate({ update: v, schema: schemaField.schema(), adapters })
      return Object.entries(adapted).map(([sk, sv]) => {
        return [concatEmbeddedNames(columnName, sk), sv]
      })
    } else {
      return []
    }
  })
}
