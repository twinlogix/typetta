import { QuantityOperators, EqualityOperators, ElementOperators, StringOperators } from '../dal/dao/filters/filters.types'
import { Schema, SchemaField } from '../dal/dao/schemas/schemas.types'
import { SortDirection } from '../dal/dao/sorts/sorts.types'
import _ from 'lodash'
import { DataTypeAdapter } from '../dal/drivers/drivers.types'

export type ConditionalPartialBy<T, K extends keyof T, Condition extends boolean> = Condition extends true ? Omit<T, K> & Partial<Pick<T, K>> : T

export type OneKey<K extends string, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O ? { [Q in keyof O]: O[Q] } : never
}[K]

export function flattenSorts<SortInput extends { [key: string]: SortDirection | null | undefined }, SortKey extends string>(
  sorts?: SortInput[],
  mappings?: { [key: string]: SortKey },
): OneKey<SortKey, SortDirection>[] | undefined {
  return sorts
    ?.map((sort) =>
      Object.keys(sort)
        .filter((key) => sort[key] !== null && sort[key] !== undefined)
        .map((key) => {
          // @ts-ignore
          const resKey: SortKey = mappings && mappings[key] ? mappings[key] : key
          return { [resKey]: sort[key] } as OneKey<SortKey, SortDirection>
        }),
    )
    .flat()
}

export function hasIdFilter<IDType, Filter extends { id?: IDType | null | QuantityOperators<IDType> | EqualityOperators<IDType> | ElementOperators | StringOperators }>(
  conditions: Filter,
  id: IDType | null,
): boolean {
  return hasFieldFilter<IDType, 'id', Filter>(conditions, 'id', id)
}

export function hasFieldFilter<
  FieldType,
  FieldName extends string,
  Filter extends { [P in FieldName]?: FieldType | null | QuantityOperators<FieldType> | EqualityOperators<FieldType> | ElementOperators | StringOperators },
>(conditions: Filter, fieldName: FieldName, id: FieldType | null): boolean {
  return (
    (id &&
      conditions[fieldName] &&
      (conditions[fieldName] === id ||
        (typeof conditions[fieldName] === 'object' &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in!.length === 1 &&
          (conditions[fieldName] as EqualityOperators<FieldType>).$in![0] === id) ||
        (typeof conditions[fieldName] === 'object' && (conditions[fieldName] as EqualityOperators<FieldType>).$eq && (conditions[fieldName] as EqualityOperators<FieldType>).$eq! === id))) ||
    false
  )
}

export function getSchemaFieldTraversing<ScalarsType>(key: string, schema: Schema<ScalarsType>): SchemaField<ScalarsType> | null {
  const c = key.split('.')
  if (c.length === 1) {
    return c[0] in schema ? schema[c[0]] : null
  } else {
    const k = c.shift()!
    const schemaField = schema[k]
    return schemaField && 'embedded' in schemaField ? getSchemaFieldTraversing(c.join('.'), schemaField.embedded) : null
  }
}

export function modelValueToDbValue<ScalarsType>(
  value: ScalarsType[keyof ScalarsType] | ScalarsType[keyof ScalarsType][],
  schemaField: SchemaField<ScalarsType>,
  adapter: DataTypeAdapter<ScalarsType[keyof ScalarsType], any>,
): unknown {
  return schemaField.array ? (value as ScalarsType[keyof ScalarsType][]).map((e) => adapter.modelToDB(e)) : adapter.modelToDB(value as ScalarsType[keyof ScalarsType])
}

export function* reversed<T>(array: T[]): Iterable<T> {
  for (let i = array.length - 1; i >= 0; i--) {
    yield array[i]
  }
}

export const MONGODB_LOGIC_QUERY_PREFIXS = new Set(['$or', '$and', '$not', '$nor'])
export const MONGODB_SINGLE_VALUE_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne'])
export const MONGODB_ARRAY_VALUE_QUERY_PREFIXS = new Set(['$in', '$nin', '$all'])
export const MONGODB_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne', '$in', '$nin', '$all', '$size', '$text', '$near', '$nearSphere'])
