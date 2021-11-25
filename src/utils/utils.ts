import { ComparisonOperators, ElementOperators, EvaluationOperators } from '../dal/dao/filters/filters.types'
import { Projection } from '../dal/dao/projections/projections.types'
import { SortDirection } from '../dal/dao/sorts/sorts.types'
import _ from 'lodash'

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

export function hasIdFilter<IDType, Filter extends { id?: IDType | null | ComparisonOperators<IDType> | ElementOperators<IDType> | EvaluationOperators<IDType> }>(
  conditions: Filter,
  id: IDType | null,
): boolean {
  return hasFieldFilter<IDType, 'id', Filter>(conditions, 'id', id)
}

export function hasFieldFilter<
  FieldType,
  FieldName extends string,
  Filter extends { [P in FieldName]?: FieldType | null | ComparisonOperators<FieldType> | ElementOperators<FieldType> | EvaluationOperators<FieldType> },
>(conditions: Filter, fieldName: FieldName, id: FieldType | null): boolean {
  return (
    (id &&
      conditions[fieldName] &&
      (conditions[fieldName] === id ||
        (typeof conditions[fieldName] === 'object' &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in!.length === 1 &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in![0] === id) ||
        (typeof conditions[fieldName] === 'object' && (conditions[fieldName] as ComparisonOperators<FieldType>).$eq && (conditions[fieldName] as ComparisonOperators<FieldType>).$eq! === id))) ||
    false
  )
}

export const MONGODB_LOGIC_QUERY_PREFIXS = new Set(['$or', '$and', '$not', '$nor'])
export const MONGODB_SINGLE_VALUE_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne'])
export const MONGODB_ARRAY_VALUE_QUERY_PREFIXS = new Set(['$in', '$nin', '$all'])
export const MONGODB_QUERY_PREFIXS = new Set(['$eq', '$gte', '$gt', '$lte', '$lt', '$ne', '$in', '$nin', '$all', '$size', '$text', '$near', '$nearSphere'])
