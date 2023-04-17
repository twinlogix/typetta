import {
  GenericProjection,
  MergeGenericProjection,
  getProjection,
  isFieldsContainedInProjection,
  isProjectionContained,
  isProjectionIntersected,
  mergeProjections,
  projection,
  IntersectGenericProjection,
  intersectProjections,
  isEmptyProjection,
  setTraversing,
  Projection,
  compare,
} from '../src'
import { AST } from './mongodb/dao.mock'

type Pass = 'pass'
export type Test<T, U> = [T] extends [U] ? ([U] extends [T] ? Pass : { actual: T; expected: U }) : { actual: T; expected: U }

export function typeAssert<T extends Pass>(param?: T): T | undefined {
  return param
}

test('isProjectionIntersected test', () => {
  expect(isProjectionIntersected(true, true)).toBe(true)
  expect(isProjectionIntersected(true, false)).toBe(false)
  expect(isProjectionIntersected(true, { a: true })).toBe(true)
  expect(isProjectionIntersected(false, { a: true })).toBe(false)
  expect(isProjectionIntersected({ a: true }, { a: true })).toBe(true)
  expect(isProjectionIntersected({ a: false }, { a: true })).toBe(false)
  expect(isProjectionIntersected({ a: true }, { a: { a: true } })).toBe(true)
  expect(isProjectionIntersected({ a: true }, { a: { a: false } })).toBe(true)
  expect(isProjectionIntersected({ a: false }, { a: { a: true } })).toBe(false)
  expect(isProjectionIntersected({ b: true }, { a: true })).toBe(false)
  expect(isProjectionIntersected({ b: true }, { a: { a: true } })).toBe(false)
  expect(isProjectionIntersected({ b: true }, { a: { a: false } })).toBe(false)
  expect(isProjectionIntersected({ b: true }, { a: { a: false }, b: true })).toBe(true)
  expect(isProjectionIntersected({ b: { b: true } }, { a: { a: false }, b: true })).toBe(true)
  expect(isProjectionIntersected({ b: { b: true } }, { b: { a: true } })).toBe(false)
  expect(isProjectionIntersected({ b: { b: true } }, { b: { a: true, b: true } }, ['b.b'], true)).toBe(false)
  expect(isProjectionIntersected({ b: { b: true } }, { b: { a: true, b: true } }, ['c.b'], true)).toBe(true)
})

test('isChangesContainedInProjection test', () => {
  expect(isFieldsContainedInProjection(true, {})).toBe(true)
  expect(isFieldsContainedInProjection(false, {})).toBe(false)
  expect(isFieldsContainedInProjection({ a: true }, { b: 2 })).toBe(false)
  expect(isFieldsContainedInProjection({ a: true }, { a: 3 })).toBe(true)
  expect(isFieldsContainedInProjection({ a: { b: true } }, { a: { b: { c: 4 } } })).toBe(true)
})

test('getProjection test', () => {
  expect(getProjection(true, '')).toBe(true)
  expect(getProjection(false, '')).toBe(false)
  expect(getProjection(true, 'a')).toBe(false)
  expect(getProjection({ a: true }, '')).toStrictEqual({ a: true })
  expect(getProjection({ a: true }, 'a')).toBe(true)
  expect(getProjection({ a: true }, 'b')).toBe(false)
  expect(getProjection({ a: true }, 'a.b')).toBe(false)
  expect(getProjection({ a: { b: { c: true } } }, '')).toStrictEqual({ a: { b: { c: true } } })
  expect(getProjection({ a: { b: { c: true } } }, 'a')).toStrictEqual({ b: { c: true } })
  expect(getProjection({ a: { b: { c: true } } }, 'a.b')).toStrictEqual({ c: true })
  expect(getProjection({ a: { b: { c: true } } }, 'a.b.c')).toStrictEqual(true)
})

test('isProjectionContained test', () => {
  expect(isProjectionContained(true, true)).toStrictEqual([true, false])
  expect(isProjectionContained(true, false)).toStrictEqual([true, false])
  expect(isProjectionContained(false, true)).toStrictEqual([false, true])
  expect(isProjectionContained(false, false)).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true }, { a: true })).toStrictEqual([true, false])
  expect(isProjectionContained({ a: false, b: true }, { a: true })).toStrictEqual([false, { a: true }])
  expect(isProjectionContained({ a: false, b: true }, { a: { b: true } })).toStrictEqual([false, { a: { b: true } }])
  expect(isProjectionContained({ a: false, b: true }, { a: { b: false } })).toStrictEqual([false, { a: { b: false } }])
  expect(isProjectionContained({ a: false, b: true }, { a: false, b: true })).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true }, { a: true, c: true })).toStrictEqual([false, { c: true }])
  expect(isProjectionContained({ a: true, b: true }, { a: true, __typename: true }, ['__typename'])).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true }, { a: true, __typename: true })).toStrictEqual([false, { __typename: true }])
  expect(isProjectionContained({ a: true, b: true }, { a: true, c: true, __typename: true }, ['__typename'])).toStrictEqual([false, { c: true }])
  expect(isProjectionContained({ a: true, b: true }, { a: true, c: {} })).toStrictEqual([false, { c: {} }])
  expect(isProjectionContained({ a: true, b: true }, { a: true, c: { __typename: true } }, ['__typename'])).toStrictEqual([false, { c: { __typename: true } }])
  expect(isProjectionContained({ a: true, b: true, c: {} }, { a: true, c: { __typename: true } }, ['__typename'])).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true, c: { v: true } }, { a: true, c: {} })).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true, c: false }, { a: true, c: {} })).toStrictEqual([false, { c: {} }])
  expect(isProjectionContained({ a: true, b: true, c: { v: true } }, { a: true, c: { __typename: true } }, ['__typename'])).toStrictEqual([true, false])
  expect(isProjectionContained(true, { a: true })).toStrictEqual([true, false])
  expect(isProjectionContained(false, { a: true })).toStrictEqual([false, { a: true }])
  expect(isProjectionContained({ a: true, b: true }, false)).toStrictEqual([true, false])
  expect(isProjectionContained({ a: true, b: true }, true)).toStrictEqual([false, true])
  expect(isProjectionContained({ b: true }, { a: { b: true } })).toStrictEqual([false, { a: { b: true } }])
  expect(isProjectionContained({ b: { c: true } }, { b: { c: true, b: { b: true } } })).toStrictEqual([false, { b: { b: { b: true } } }])

  type A = {
    a: number
    b: {
      c: number
      d: {
        e: number
        f: number
        k: number
      }
    }
    g: {
      h: number
      i: number
    }
    j: unknown
  }
  const allowedProjection = {
    a: true,
    b: {
      c: true,
      d: {
        e: true,
        f: false,
      },
    },
    g: {
      h: true,
      i: true,
    },
  } as const
  const requiredProjection = {
    a: true,
    b: {
      d: {
        e: true,
        k: true,
      },
    },
    g: true,
    j: true,
  } as const
  const notAllowed = {
    b: {
      d: {
        k: true,
      },
    },
    g: true,
  } as const
  expect(isProjectionContained(allowedProjection, requiredProjection, ['j'])).toStrictEqual([false, notAllowed])
})

test('mergeProgections test', () => {
  function merge<P1 extends GenericProjection, P2 extends GenericProjection, E extends GenericProjection>(p1: P1, p2: P2, expected: E): Test<MergeGenericProjection<P1, P2>, E> {
    const m1 = mergeProjections(p1, p2)
    expect(m1).toStrictEqual(expected)
    const m2 = mergeProjections(p2, p1)
    expect(m2).toStrictEqual(expected)
    expect(m1).toStrictEqual(m2)
    return 'pass' as Test<MergeGenericProjection<P1, P2>, E>
  }

  const m1 = merge(true, true, true)
  typeAssert<typeof m1>()
  const m2 = merge(false, true, true)
  typeAssert<typeof m2>()
  const m3 = merge(true, false, true)
  typeAssert<typeof m3>()
  const m4 = merge(false, false, false)
  typeAssert<typeof m4>()
  const m5 = merge(false, { a: true }, { a: true })
  typeAssert<typeof m5>()
  const m6 = merge({ a: true }, false, { a: true })
  typeAssert<typeof m6>()
  const m7 = merge(true, { a: true }, true)
  typeAssert<typeof m7>()
  const m8 = merge({ a: true }, true, true)
  typeAssert<typeof m8>()
  const m9 = merge({ a: true }, {}, { a: true })
  typeAssert<typeof m9>()
  const m10 = merge({}, { a: true }, { a: true })
  typeAssert<typeof m10>()
  const m11 = merge({ a: true }, { a: true }, { a: true })
  typeAssert<typeof m11>()
  const m12 = merge({ a: false }, { a: true }, { a: true })
  typeAssert<typeof m12>()
  const m13 = merge({ a: true }, { a: { a: true } }, { a: true })
  typeAssert<typeof m13>()
  const m14 = merge({ a: true }, { a: { a: false } }, { a: true })
  typeAssert<typeof m14>()
  const m15 = merge({ a: false }, { a: { a: true } }, { a: { a: true } })
  typeAssert<typeof m15>()
  const m16 = merge({ b: true }, { a: true }, { a: true, b: true })
  typeAssert<typeof m16>()
  const m17 = merge({ b: true }, { a: { a: true } }, { b: true, a: { a: true } })
  typeAssert<typeof m17>()
  const m18 = merge({ b: true }, { a: { a: false } }, { b: true, a: { a: false } })
  typeAssert<typeof m18>()
  const m19 = merge({ b: true }, { a: { a: false }, b: true }, { b: true, a: { a: false } })
  typeAssert<typeof m19>()
  const m20 = merge({ b: { b: true } }, { a: { a: false }, b: true }, { b: true, a: { a: false } })
  typeAssert<typeof m20>()
  const m21 = merge({ b: { b: true }, a: { b: true } }, { a: { a: false }, b: true }, { b: true, a: { a: false, b: true } })
  typeAssert<typeof m21>()
  const m22 = merge({ b: { b: true } }, { b: { a: true } }, { b: { a: true, b: true } })
  typeAssert<typeof m22>()
})

test('intersectProgections test', () => {
  function intersect<P1 extends GenericProjection, P2 extends GenericProjection, E extends GenericProjection>(p1: P1, p2: P2, expected: E): Test<IntersectGenericProjection<P1, P2>, E> {
    const m1 = intersectProjections(p1, p2)
    expect(m1).toStrictEqual(expected)
    const m2 = intersectProjections(p2, p1)
    expect(m2).toStrictEqual(expected)
    expect(m1).toStrictEqual(m2)
    return 'pass' as Test<IntersectGenericProjection<P1, P2>, E>
  }

  const m1 = intersect(true, true, true)
  typeAssert<typeof m1>()
  const m2 = intersect(false, true, false)
  typeAssert<typeof m2>()
  const m3 = intersect(true, false, false)
  typeAssert<typeof m3>()
  const m4 = intersect(false, false, false)
  typeAssert<typeof m4>()
  const m5 = intersect(false, { a: true }, false)
  typeAssert<typeof m5>()
  const m6 = intersect({ a: true }, false, false)
  typeAssert<typeof m6>()
  const m7 = intersect(true, { a: true }, { a: true })
  typeAssert<typeof m7>()
  const m8 = intersect({ a: true }, true, { a: true })
  typeAssert<typeof m8>()
  const m9 = intersect({ a: true }, {}, {})
  typeAssert<typeof m9>()
  const m10 = intersect({}, { a: true }, {})
  typeAssert<typeof m10>()
  const m11 = intersect({ a: true }, { a: true }, { a: true })
  typeAssert<typeof m11>()
  const m12 = intersect({ a: false }, { a: true }, { a: false })
  typeAssert<typeof m12>()
  const m13 = intersect({ a: true }, { a: { a: true } }, { a: { a: true } })
  typeAssert<typeof m13>()
  const m14 = intersect({ a: true }, { a: { a: false } }, { a: { a: false } })
  typeAssert<typeof m14>()
  const m15 = intersect({ a: false }, { a: { a: true } }, { a: false })
  typeAssert<typeof m15>()
  const m16 = intersect({ b: true }, { a: true }, {})
  typeAssert<typeof m16>()
  const m17 = intersect({ b: true }, { a: { a: true } }, {})
  typeAssert<typeof m17>()
  const m18 = intersect({ b: true }, { a: { a: false } }, {})
  typeAssert<typeof m18>()
  const m19 = intersect({ b: true }, { a: { a: false }, b: true }, { b: true })
  typeAssert<typeof m19>()
  const m20 = intersect({ b: { b: true } }, { a: { a: false }, b: true }, { b: { b: true } })
  typeAssert<typeof m20>()
  const m21 = intersect({ b: { b: true }, a: { b: true } }, { a: { a: false }, b: true }, { b: { b: true }, a: {} })
  typeAssert<typeof m21>()
  const m22 = intersect({ b: { b: true } }, { b: { a: true } }, { b: {} })
  typeAssert<typeof m22>()
})

type UserProjection = Projection<'User', AST>
test('mergeStaticProjection', () => {
  const proj: UserProjection = { firstName: true, live: true }
  const p1 = projection<UserProjection>().merge({ amount: true }, { live: true })
  typeAssert<Test<typeof p1, { amount: true; live: true }>>()
  const p2 = projection<UserProjection>().merge(proj, { live: true })
  typeAssert<Test<typeof p2, UserProjection>>()
  const p3 = projection<UserProjection>().merge({ lastName: true }, proj)
  typeAssert<Test<typeof p3, UserProjection>>()
  const p4 = projection<UserProjection>().merge(proj, proj)
  typeAssert<Test<typeof p4, UserProjection>>()

  type B = {
    v: number
  }
  type BProj = {
    v?: boolean
  }
  type A = {
    a: undefined | number | null
    b?: number
    c: A | B | null | undefined
    d?: A
    e: A[]
    f?: A[]
    g: A | A[] | null
    u: never
  }
  type AProj = {
    a?: boolean
    b?: boolean
    c?: boolean | BProj | AProj
    d?: boolean | AProj
    e?: boolean | AProj
    f?: boolean | AProj
    g?: boolean | AProj
    u?: boolean
  }
  const pa = {
    b: true,
    c: { b: true, v: true },
    d: { f: { a: true } },
    f: { b: true, f: { a: true } },
  } as const
  const pb = {
    a: true,
    c: { a: true },
    d: { u: true },
    f: { a: true },
    u: true,
  } as const
  const pc = projection<AProj>().merge(pa, pb)
  typeAssert<
    Test<
      typeof pc,
      {
        a: true
        b: true
        c: { a: true; b: true; v: true }
        d: { f: { a: true }; u: true }
        f: { a: true; b: true; f: { a: true } }
        u: true
      }
    >
  >()
  expect(pc).toStrictEqual({
    a: true,
    b: true,
    c: { a: true, b: true, v: true },
    d: { f: { a: true }, u: true },
    f: { a: true, b: true, f: { a: true } },
    u: true,
  })

  type LongProj = { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: { c: true } } } } } } } } } } } } } } } } } } } } } } } }
  type LongMerge = MergeGenericProjection<LongProj, LongProj>
  typeAssert<Test<LongMerge, LongProj>>()
})

test('selectProjection', () => {
  type A = {
    a: string
    b: boolean
  }
  type AProj = {
    a?: boolean
    b?: boolean
  }

  const dynamicPorjection: AProj = { b: true }
  const staticProjection = { a: true } as const

  const m1 = projection<AProj>().merge(staticProjection, dynamicPorjection)
  const m2 = projection<AProj>().merge(dynamicPorjection, staticProjection)
  const m3 = projection<AProj>().merge(staticProjection, staticProjection)
  typeAssert<Test<typeof m1, AProj>>()
  typeAssert<Test<typeof m2, AProj>>()
  typeAssert<Test<typeof m3, { a: true }>>()
})

test('is empty projection', () => {
  expect(isEmptyProjection({})).toBe(true)
  expect(isEmptyProjection(undefined)).toBe(false)
  expect(isEmptyProjection(true)).toBe(false)
  expect(isEmptyProjection(false)).toBe(false)
  expect(isEmptyProjection({ name: true })).toBe(false)
  expect(isEmptyProjection({ name: {} })).toBe(true)
  expect(isEmptyProjection({ name: {}, value: {} })).toBe(true)
  expect(isEmptyProjection({ name: true, value: {} })).toBe(false)
  expect(isEmptyProjection({ name: undefined, value: {} })).toBe(true)
  expect(isEmptyProjection({ name: false, value: {} })).toBe(false)
})

test('setTraversing', () => {
  const obj: Record<string, Record<string, unknown>> = {}
  setTraversing(obj, 'name.name', 'value')
  expect(obj.name.name).toBe('value')
  setTraversing(obj, 'name.__proto__', 'value')
  expect(obj.name.__proto__).not.toBe('value')
  setTraversing(obj, '__proto__', 'value')
  expect(obj.__proto__).not.toBe('value')
})

test('compare', () => {
  expect(compare(0, 0) === 0).toBe(true)
  expect(compare(1, 0) > 0).toBe(true)
  expect(compare(1, '1') !== 0).toBe(true)
  expect(compare({ a: 1 }, { b: 1 }) !== 0).toBe(true)
  expect(compare({ a: 1 }, { a: 1, d: 1 }) !== 0).toBe(true)
  expect(compare({ a: 1, d: 1 }, { a: 1 }) !== 0).toBe(true)
  expect(compare({ a: 1 }, { a: 2 }) !== 0).toBe(true)
  expect(compare({ a: 1 }, { a: 1 }) === 0).toBe(true)
})
