import { isProjectionIntersectedWithSchema, mergeProjectionsWithSchema } from '../src'
import { schemas, UserProjection } from './demo/dao.generated'

const userSchema = schemas.User()
test('isProjectionOverlapped 1', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = true
  testIsProjectionOverlapped(p1, p2, true)
})

test('isProjectionOverlapped 2', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = { firstName: true }
  testIsProjectionOverlapped(p1, p2, true)
})

test('isProjectionOverlapped 3', () => {
  const p1: UserProjection | true = { firstName: true, lastName: true }
  const p2: UserProjection | true = { firstName: true }
  testIsProjectionOverlapped(p1, p2, true)
})

test('isProjectionOverlapped 4', () => {
  const p1: UserProjection | true = { lastName: true }
  const p2: UserProjection | true = { firstName: true }
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 5', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = { posts: true }
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 6', () => {
  const p1: UserProjection | true = { posts: { author: { firstName: true } } }
  const p2: UserProjection | true = { posts: true }
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 7', () => {
  const p1: UserProjection | true = { posts: { title: true } }
  const p2: UserProjection | true = { posts: true }
  testIsProjectionOverlapped(p1, p2, true)
})

test('isProjectionOverlapped 8', () => {
  const p1: UserProjection | true = { posts: { author: { posts: true } } }
  const p2: UserProjection | true = { posts: { author: true } }
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 9', () => {
  const p1: UserProjection | true = { posts: { author: { posts: true, firstName: true } } }
  const p2: UserProjection | true = { posts: { author: true } }
  testIsProjectionOverlapped(p1, p2, true)
})

test('isProjectionOverlapped 10', () => {
  const p1: UserProjection | true = {}
  const p2: UserProjection | true = true
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 11', () => {
  const p1: UserProjection | true = { credentials: {} }
  const p2: UserProjection | true = true
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 12', () => {
  const p1: UserProjection | true = { credentials: {} }
  const p2: UserProjection | true = {}
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 13', () => {
  const p1: UserProjection | true = { credentials: {} }
  const p2: UserProjection | true = { credentials: { username: true } }
  testIsProjectionOverlapped(p1, p2, false)
})

test('isProjectionOverlapped 15', () => {
  const p1: UserProjection | true = { credentials: true }
  const p2: UserProjection | true = { credentials: { username: true } }
  testIsProjectionOverlapped(p1, p2, true)
})

function testIsProjectionOverlapped(p1: UserProjection | true, p2: UserProjection | true, result: boolean) {
  const result1 = isProjectionIntersectedWithSchema(p1, p2, userSchema)
  const result2 = isProjectionIntersectedWithSchema(p2, p1, userSchema)
  expect(result1).toBe(result2)
  expect(result1).toBe(result)
}

test('overlapProjection 1', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = true
  testOverlapProjection(p1, p2, true)
})

test('overlapProjection 2', () => {
  const p1: UserProjection | true = { firstName: true }
  const p2: UserProjection | true = true
  testOverlapProjection(p1, p2, true)
})

test('overlapProjection 3', () => {
  const p1: UserProjection | true = { firstName: true }
  const p2: UserProjection | true = { lastName: true }
  testOverlapProjection(p1, p2, { firstName: true, lastName: true })
})

test('overlapProjection 4', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = { posts: true }
  testOverlapProjection(p1, p2, {
    id: true,
    credentials: true,
    createdAt: true,
    firstName: true,
    lastName: true,
    email: true,
    totalPostsViews: true,
    averageViewsPerPost: true,
    posts: true,
    attributes: true,
    cr: true,
    embeddedPost: true,
  })
})

test('overlapProjection 5', () => {
  const p1: UserProjection | true = true
  const p2: UserProjection | true = { posts: true, embeddedPost: { author: { firstName: true } } }
  testOverlapProjection(p1, p2, {
    id: true,
    credentials: true,
    createdAt: true,
    firstName: true,
    lastName: true,
    email: true,
    totalPostsViews: true,
    averageViewsPerPost: true,
    posts: true,
    attributes: true,
    cr: true,
    embeddedPost: {
      id: true,
      createdAt: true,
      title: true,
      body: true,
      views: true,
      clicks: true,
      authorId: true,
      author: { firstName: true },
      metadata: true,
    },
  })
})

function testOverlapProjection(p1: UserProjection | true, p2: UserProjection | true, result: UserProjection | true) {
  const result1 = mergeProjectionsWithSchema(p1, p2, userSchema)
  const result2 = mergeProjectionsWithSchema(p2, p1, userSchema)
  expect(result1).toStrictEqual(result2)
  expect(result1).toStrictEqual(result)
}
