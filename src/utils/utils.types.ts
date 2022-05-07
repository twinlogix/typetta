export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type Truetizer<P> = P extends true
  ? true
  : P extends object
  ? {
      [K in keyof P]: P[K] extends object ? Truetizer<P[K]> : never | P[K] | true
    }
  : never /* | true*/

/**
 * Expands object types recursively.
 */
export type ExpandRecursively<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T

/**
 * Expands object types one level deep
 * https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type KeyOfType<T extends object, V> = {
  [K in keyof T]: T[K] extends V ? never : K
}[keyof T]

export type KeyOfTypeStrict<T extends object, V> = {
  [K in keyof T]: V extends T[K] ? never : K
}[keyof T]

export type OmitUndefinedAndNeverKeys<T> = T extends object ? Pick<T, KeyOfType<T, undefined>> : never

export type Coordinates = {
  latitude: number
  longitude: number
}

export type TypeTraversal<T, Path extends string> = T extends null
  ? null
  : T extends undefined
  ? undefined
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer R}.${infer F}`
  ? R extends keyof T
    ? TypeTraversal<T[R], F>
    : never
  : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

export type RecursiveKeyOf<TObj extends object, DepthLimit extends number = 3> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, DepthLimit>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object, D extends number> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `.${TKey}`, Prev[D]>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string, D extends number> = [D] extends [never]
  ? never
  : TValue extends (infer O)[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue, D>}`
  : Text

export type RecursiveKeyOfLeaf<TObj extends object, DepthLimit extends number = 3> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValueLeaf<TObj[TKey], `${TKey}`, DepthLimit>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInnerLeaf<TObj extends object, D extends number> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValueLeaf<TObj[TKey], `.${TKey}`, Prev[D]>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValueLeaf<TValue, Text extends string, D extends number> = [D] extends [never]
  ? never
  : TValue extends (infer O)[]
  ? Text
  : TValue extends object
  ? `${Text}${RecursiveKeyOfInnerLeaf<TValue, D>}`
  : Text

export type OmitIfKnown<T, K extends keyof T> = [K] extends [any] ? any : Omit<T, K>

export type DeepRequired<T> = Required<{
  [K in keyof T]: Required<DeepRequired<T[K]>>
}>
