import { Expand, OmitUndefinedAndNeverKeys } from '../../../utils/utils.types'
import { PartialDeep, Primitive } from 'type-fest'
import { PartialObjectDeep } from 'type-fest/source/partial-deep'

export type AnyProjection<ProjectionType extends object> = true | undefined | PartialObjectDeep<ProjectionType>

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
      [K in keyof T1 | keyof T2]: T1 extends Record<K, any> ? (T2 extends Record<K, any> ? MergeGenericProjection<T1[K], T2[K]> : T1[K]) : T2 extends Record<K, any> ? T2[K] : never
    }>

type Selector<ProjectionType extends object, P extends AnyProjection<ProjectionType>> = {} extends Required<P>
  ? 'empty'
  : [true] extends [P]
  ? 'all'
  : P extends undefined
  ? 'all'
  : [ProjectionType] extends [P]
  ? 'unknown'
  : 'specific'

/**
 * Given a model M and a projection P returns the mapepd model to the projection.
 * If a StaticProjection was given the projection information is carried at compilation time by this type.
 * It is used as return type in all the finds operations.
 */
export type ModelProjection<ModelType extends object, ProjectionType extends object, P extends AnyProjection<ProjectionType>> = Selector<ProjectionType, P> extends infer S
  ? S extends 'all'
    ? ModelType & { __projection: 'all' }
    : S extends 'specific'
    ? P extends ProjectionType
      ? Expand<StaticModelProjection<ModelType, ProjectionType, P>>
      : never
    : S extends 'unknown'
    ? PartialDeep<ModelType> & { __projection: 'unknown' }
    : { __projection: 'empty' }
  : never

/**
 * Given a model M and a StaticProjection P returns the mapepd model to the projection.
 * It should be used as projector in function parameters.
 */
export type ParamProjection<ModelType extends object, ProjectionType extends object, P extends ProjectionType> = Expand<StaticModelProjectionParam<ModelType, ProjectionType, P>>

/**
 * Given a model M and a StaticProjection with an explicit type (eg. const p1: {a: true} = ...)
 * returns the mapped model to the projection. This carry the information about the projection at compilation time.
 */
type StaticModelProjection<ModelType, ProjectionType, P extends ProjectionType> = ModelType extends null
  ? null
  : ModelType extends undefined
  ? undefined
  : ModelType extends Primitive
  ? never
  : ModelType extends (infer U)[]
  ? StaticModelProjection<U, ProjectionType, P>[]
  : ModelType extends object
  ? Expand<
      OmitUndefinedAndNeverKeys<{
        [K in keyof ModelType]: P extends Record<K, true>
          ? ModelType[K]
          : P extends Record<K, false>
          ? never
          : P extends Record<K, boolean>
          ? ModelType[K] | undefined
          : Required<Exclude<ProjectionType, boolean>> extends Record<K, infer SubProjectinoType>
          ? P extends Record<K, SubProjectinoType>
            ? StaticModelProjection<ModelType[K], SubProjectinoType, P[K]>
            : never
          : never
      }>
    > & { __projection: P }
  : never

/**
 * Given a model M and a StaticProjection with an explicit type (eg. const p1: {a: true} = ...)
 * returns the mapped model to the projection. This carry the information about the potentially required projection at compilation time.
 */
type StaticModelProjectionParam<ModelType, ProjectionType, P extends ProjectionType> = ModelType extends null
  ? null
  : ModelType extends undefined
  ? undefined
  : ModelType extends Primitive
  ? never
  : ModelType extends (infer U)[]
  ? StaticModelProjection<U, ProjectionType, P>[]
  : ModelType extends object
  ? Expand<
      OmitUndefinedAndNeverKeys<{
        [K in keyof ModelType]: P extends Record<K, true>
          ? ModelType[K]
          : P extends Record<K, false>
          ? never
          : P extends Record<K, boolean>
          ? ModelType[K] | undefined
          : Required<Exclude<ProjectionType, boolean>> extends Record<K, infer SubProjectinoType>
          ? P extends Record<K, SubProjectinoType>
            ? StaticModelProjection<ModelType[K], SubProjectinoType, P[K]>
            : never
          : never
      }>
    > & { __projection?: P }
  : never

type MP<ModelType extends object, P extends PartialObjectDeep<any>> = Expand<{
  [K in keyof P]: P[K] extends true // true: T
    ? ModelType extends Partial<Record<K, any>>
      ? ModelType[K]
      : never
    : P[K] extends false // false: never
    ? never
    : P[K] extends boolean // boolean: T | undefined
    ? ModelType extends Partial<Record<K, any>>
      ? ModelType[K] | undefined
      : never
    : P[K] extends object // object:
    ? ModelType extends Record<K, infer A> // not optional field
      ? MPS<A, P, K>
      : ModelType extends Partial<Record<K, infer B>> // optional field
      ? MPS<B, P, K> | undefined
      : never
    : never
} & { __projection: P }>

type MPS<T, P extends object, K extends keyof P> = T extends (infer O)[] ? MPS<O, P, K>[] : T extends object ? MP<T, P[K]> : never
