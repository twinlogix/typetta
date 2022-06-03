import { Expand, OmitUndefinedAndNeverKeys } from '../../../utils/utils.types'

export type AnyProjection<ProjectionType extends object> = true | undefined | ProjectionType

/**
 * Generic definition of projection.
 */
export type GenericProjection = { [key: string]: GenericProjection } | true | false

/**
 * Given two GenericProjection with an explicit type (eg. const p1: {a: true} = ...) defined at compilation time,
 * this merge the two giving an explicit type at compilation time.
 */
export type MergeGenericProjection<T1 extends GenericProjection, T2 extends GenericProjection> = T1 extends true
  ? T1
  : T2 extends true
  ? T2
  : T1 extends false
  ? T2
  : T2 extends false
  ? T1
  : Expand<{
      [K in keyof T1 | keyof T2]: T1 extends Record<K, GenericProjection>
        ? T2 extends Record<K, GenericProjection>
          ? MergeGenericProjection<T1[K], T2[K]>
          : T1[K]
        : T2 extends Record<K, GenericProjection>
        ? T2[K]
        : never
    }>

/**
 * Given two GenericProjection with an explicit type (eg. const p1: {a: true} = ...) defined at compilation time,
 * this intersect the two giving an explicit type at compilation time.
 */
export type IntersectGenericProjection<T1 extends GenericProjection, T2 extends GenericProjection> = T1 extends false
  ? T1
  : T2 extends false
  ? T2
  : T1 extends true
  ? T2
  : T2 extends true
  ? T1
  : Expand<
      OmitUndefinedAndNeverKeys<{
        [K in keyof T1 | keyof T2]: T1 extends Record<K, GenericProjection>
          ? T2 extends Record<K, GenericProjection>
            ? IntersectGenericProjection<T1[K], T2[K]>
            : never
          : T2 extends Record<K, GenericProjection>
          ? never
          : never
      }>
    >
