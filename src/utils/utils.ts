import _ from 'lodash'
import { SortDirection } from '../dal/dao/sorts/sorts.types'
import { QuantityOperators, EqualityOperators, ElementOperators, StringOperators } from '../dal/dao/filters/filters.types'

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
