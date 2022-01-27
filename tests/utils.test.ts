import {
  hasIdFilter,
  GenericProjection,
  MergeGenericProjection,
  getProjection,
  isChangesContainedInProjection,
  isProjectionContained,
  isProjectionIntersected,
  mergeProjections,
  projection,
} from '../src'
import { UserProjection } from './mongodb/dao.mock'
import { ApolloServer } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'

type Pass = 'pass'
export type Test<T, U> = [T] extends [U] ? ([U] extends [T] ? Pass : { actual: T; expected: U }) : { actual: T; expected: U }

export function typeAssert<T extends Pass>(param?: T): T | undefined {
  return param
}

test('infoToProjection test', async () => {
  const typeDefs = gql`
    interface I {
      res: String
      a: String
      b: String
      tt: TT
    }

    type TT {
      aa: Int
      bb: Float
    }

    type T implements I {
      res: String
      a: String
      b: String
      c: String
      tt: TT
      listTT: [TT!]
    }

    type Query {
      testInfoToProjection: I!
    }
  `

  const resolvers = {
    Query: {
      testInfoToProjection: async (parent: any, args: any, ctx: any, info: any) => {
        return { res: JSON.stringify(projection<any>().fromInfo(info)), __typename: 'T' }
      },
    },
  }

  const server = new ApolloServer({ typeDefs, resolvers })
  const { query } = createTestClient(server)

  let response

  response = await query({ query: `{ testInfoToProjection { res } }` })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true })

  response = await query({
    query: `
    {
        testInfoToProjection {
            res
            tt {
                aa
            }
        }
    }`,
  })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true, tt: { aa: true } })

  response = await query({
    query: `
    {
        testInfoToProjection {
            ... on T {
                res
                a
            }
        }
    }`,
  })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true, a: true })

  response = await query({
    query: `
    {
        testInfoToProjection {
            ... on T {
                res
                a
                c
            }
        }
    }`,
  })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true, a: true, t: { c: true } })

  response = await query({
    query: `
    {
        testInfoToProjection {
            res
            tt {
                ... on TT {
                    aa
                }
            }
        }
    }`,
  })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true, tt: { aa: true } })

  response = await query({
    query: `
    {
        testInfoToProjection {
            res
            ... on T {
                listTT {
                    ... on TT {
                        aa
                    }
                }
            }
        }
    }`,
  })
  expect(JSON.parse(response.data.testInfoToProjection.res)).toEqual({ res: true, t: { listTT: { aa: true } } })
})

test('union test', async () => {
  const typeDefs = gql`
    type A {
      a1: Int
      a2: Float
    }

    type B {
      b1: String
      b2: String
    }

    union AB = A | B

    type Query {
      testUnion: [AB!]
    }
  `

  const resolvers = {
    Query: {
      testUnion: async (parent: any, args: any, ctx: any, info: any) => {
        return []
      },
    },
  }

  const server = new ApolloServer({ typeDefs, resolvers })
  const { query } = createTestClient(server)

  await query({ query: `{ testUnion { ... on A { a1 } } }` })
})

test('hasIdFilter test', () => {
  const filter1 = { id: 'id1' }
  expect(hasIdFilter(filter1, 'id1')).toBe(true)
  expect(hasIdFilter(filter1, 'id2')).toBe(false)

  const filter2 = {}
  expect(hasIdFilter(filter2, 'id1')).toBe(false)
  expect(hasIdFilter(filter2, null)).toBe(false)

  const filter3 = { id: { $in: ['id1'] } }
  expect(hasIdFilter(filter3, 'id1')).toBe(true)
  expect(hasIdFilter(filter3, 'id2')).toBe(false)

  const filter4 = { id: { $in: ['id1', 'id2'] } }
  expect(hasIdFilter(filter4, 'id1')).toBe(false)
  expect(hasIdFilter(filter4, 'id2')).toBe(false)

  const filter5 = { id: { $in: [] } }
  expect(hasIdFilter(filter5, 'id1')).toBe(false)
  expect(hasIdFilter(filter5, null)).toBe(false)

  const filter6 = { id: {} }
  expect(hasIdFilter(filter6, 'id1')).toBe(false)
  expect(hasIdFilter(filter6, null)).toBe(false)

  const filter7 = { id: { $eq: 'id1' } }
  expect(hasIdFilter(filter7, 'id1')).toBe(true)
  expect(hasIdFilter(filter7, 'id2')).toBe(false)
})

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
  expect(isChangesContainedInProjection(true, {})).toBe(true)
  expect(isChangesContainedInProjection(false, {})).toBe(false)
  expect(isChangesContainedInProjection({ a: true }, { b: 2 })).toBe(false)
  expect(isChangesContainedInProjection({ a: true }, { a: 3 })).toBe(true)
  expect(isChangesContainedInProjection({ a: { b: true } }, { a: { b: { c: 4 } } })).toBe(true)
})

test('getProjection test', () => {
  expect(getProjection(true, '')).toBe(true)
  expect(getProjection(false, '')).toBe(false)
  expect(getProjection({ a: true }, '')).toStrictEqual({ a: true })
  expect(getProjection({ a: true }, 'a')).toBe(true)
  expect(getProjection({ a: true }, 'b')).toBe(false)
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
