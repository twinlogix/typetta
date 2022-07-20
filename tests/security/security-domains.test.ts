import { inferOperationSecurityDomain } from '../../src'

test('infer operation security domain', () => {
  const domainKeys = ['id', 'userId']
  const d1 = inferOperationSecurityDomain(domainKeys, {})
  expect(d1.length).toBe(1)
  expect(Object.keys(d1[0]).length).toBe(0)

  const d2 = inferOperationSecurityDomain(domainKeys, { id: { nin: [1] } })
  expect(d2.length).toBe(1)
  expect(Object.keys(d2[0]).length).toBe(0)

  const d3 = inferOperationSecurityDomain(domainKeys, { id: { eq: 1 } })
  expect(d3.length).toBe(1)
  expect(d3[0].id).toStrictEqual([1])

  const d4 = inferOperationSecurityDomain(domainKeys, { id: { eq: 1 }, $or: [{ id: 1 }] })
  expect(d4.length).toBe(1)
  expect(d4[0].id).toStrictEqual([1])

  const d5 = inferOperationSecurityDomain(domainKeys, { id: { eq: 1 }, $or: [{ id: 2 }] })
  expect(d5.length).toBe(0)

  const d6 = inferOperationSecurityDomain(domainKeys, { id: { eq: 1 }, $or: [{ userId: 1 }, { userId: 2 }] })
  expect(d6.length).toBe(2)
  expect(d6[0]).toStrictEqual({ id: [1], userId: [1] })
  expect(d6[1]).toStrictEqual({ id: [1], userId: [2] })

  const d7 = inferOperationSecurityDomain(domainKeys, { $and: [{ id: 2 }, { id: { in: [1, 2] }, userId: 2 }] })
  expect(d7.length).toBe(1)
  expect(d7[0]).toStrictEqual({ id: [2], userId: [2] })

  const d8 = inferOperationSecurityDomain(domainKeys, { id: 2, $or: [{ id: 1 }, { $and: [{ id: 2 }, { id: { in: [1, 2] }, userId: 2 }] }] })
  expect(d8.length).toBe(1)
  expect(d8[0]).toStrictEqual({ id: [2], userId: [2] })

  const d9 = inferOperationSecurityDomain(domainKeys, { $or: [{ id: 1 }, { $and: [{ id: 2 }, { id: { in: [1, 2] }, userId: 2 }] }] })
  expect(d9.length).toBe(2)
  expect(d9[0]).toStrictEqual({ id: [1] })
  expect(d9[1]).toStrictEqual({ id: [2], userId: [2] })

  const d10 = inferOperationSecurityDomain(domainKeys, { $or: [() => ({ id: 1 }), { $and: [{ id: 2 }, { id: { in: [1, 2] }, userId: 2 }] }] })
  expect(d10.length).toBe(2)
  expect(d10[0]).toStrictEqual({})
  expect(d10[1]).toStrictEqual({ id: [2], userId: [2] })
})
