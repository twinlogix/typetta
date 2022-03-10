import { filterEntity } from '../src'

test('filter test', async () => {
  const entity = {
    name: 'Luis',
    age: 30,
    profile: {
      likes: 123,
    },
    array: [1, 2, 3],
    image: null,
    flagT: true,
    flagF: false
  }
  

  //Other
  expect(filterEntity(entity, { flagT: { $gt: 1 } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $lt: 1 } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $lte: 1 } })).toBe(false)

  expect(filterEntity(entity, undefined)).toBe(true)

  // EqualityOperators
  expect(filterEntity(entity, { name: 1 })).toBe(false)
  expect(filterEntity(entity, { name: 'luis' })).toBe(false)
  expect(filterEntity(entity, { name: 'Luis' })).toBe(true)
  expect(filterEntity(entity, { 'profile.likes': 123 })).toBe(true)
  expect(filterEntity(entity, { 'profile.likes': 124 })).toBe(false)
  expect(filterEntity(entity, { array: 1 })).toBe(true)
  expect(filterEntity(entity, { array: 2 })).toBe(true)
  expect(filterEntity(entity, { array: [1, 2, 3] })).toBe(true)
  expect(filterEntity(entity, { array: [2, 3, 1] })).toBe(false)
  expect(filterEntity(entity, { array: [1, 2] })).toBe(false)
  expect(filterEntity(entity, { age: 30 })).toBe(true)
  expect(filterEntity(entity, { age: [30] })).toBe(false)
  expect(filterEntity(entity, { array: { $eq: 1 } })).toBe(true)
  expect(filterEntity(entity, { array: { $eq: 2 } })).toBe(true)
  expect(filterEntity(entity, { array: { $eq: [1, 2, 3] } })).toBe(true)
  expect(filterEntity(entity, { array: { $eq: [2, 3, 1] } })).toBe(false)
  expect(filterEntity(entity, { array: { $eq: [1, 2] } })).toBe(false)
  expect(filterEntity(entity, { age: { $eq: 30 } })).toBe(true)
  expect(filterEntity(entity, { age: { $eq: [30] } })).toBe(false)
  expect(filterEntity(entity, { array: { $ne: 1 } })).toBe(false)
  expect(filterEntity(entity, { array: { $ne: 2 } })).toBe(false)
  expect(filterEntity(entity, { array: { $ne: [1, 2, 3] } })).toBe(false)
  expect(filterEntity(entity, { array: { $ne: [2, 3, 1] } })).toBe(true)
  expect(filterEntity(entity, { array: { $ne: [1, 2] } })).toBe(true)
  expect(filterEntity(entity, { age: { $ne: 30 } })).toBe(false)
  expect(filterEntity(entity, { age: { $ne: [30] } })).toBe(true)
  expect(filterEntity(entity, { random: { $ne: 1 } })).toBe(true)
  expect(filterEntity(entity, { array: { $in: [4, 5, [1, 2]] } })).toBe(false)
  expect(filterEntity(entity, { array: { $in: [4, 5, [1, 2, 3]] } })).toBe(true)
  expect(filterEntity(entity, { array: { $in: [1, 5, [1, 2]] } })).toBe(true)
  expect(filterEntity(entity, { age: { $in: [31, 32, [1, 2, 3]] } })).toBe(false)
  expect(filterEntity(entity, { age: { $in: [30, 32, [1, 2, 3]] } })).toBe(true)
  expect(filterEntity(entity, { age: { $in: [31, 32, [30]] } })).toBe(false)
  expect(filterEntity(entity, { array: { $nin: [4, 5, [1, 2]] } })).toBe(true)
  expect(filterEntity(entity, { array: { $nin: [4, 5, [1, 2, 3]] } })).toBe(false)
  expect(filterEntity(entity, { array: { $nin: [1, 5, [1, 2]] } })).toBe(false)
  expect(filterEntity(entity, { age: { $nin: [31, 32, [1, 2, 3]] } })).toBe(true)
  expect(filterEntity(entity, { age: { $nin: [30, 32, [1, 2, 3]] } })).toBe(false)
  expect(filterEntity(entity, { age: { $nin: [31, 32, [30]] } })).toBe(true)

  //QuantityOperators
  expect(filterEntity(entity, { age: { $gt: 1 } })).toBe(true)
  expect(filterEntity(entity, { age: { $gt: 30 } })).toBe(false)
  expect(filterEntity(entity, { array: { $gt: 1 } })).toBe(true)
  expect(filterEntity(entity, { array: { $gt: 3 } })).toBe(false)
  expect(filterEntity(entity, { age: { $gt: [1] } })).toBe(false)
  expect(filterEntity(entity, { array: { $gt: [1] } })).toBe(false)
  expect(filterEntity(entity, { age: { $gte: 30 } })).toBe(true)
  expect(filterEntity(entity, { age: { $gte: 31 } })).toBe(false)
  expect(filterEntity(entity, { array: { $gte: 3 } })).toBe(true)
  expect(filterEntity(entity, { array: { $gte: 4 } })).toBe(false)
  expect(filterEntity(entity, { age: { $lt: 31 } })).toBe(true)
  expect(filterEntity(entity, { age: { $lt: 30 } })).toBe(false)
  expect(filterEntity(entity, { array: { $lt: 4 } })).toBe(true)
  expect(filterEntity(entity, { array: { $lt: 3 } })).toBe(false)
  expect(filterEntity(entity, { age: { $lte: 30 } })).toBe(true)
  expect(filterEntity(entity, { age: { $lte: 29 } })).toBe(false)
  expect(filterEntity(entity, { array: { $lte: 3 } })).toBe(true)
  expect(filterEntity(entity, { array: { $lte: 2 } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $gt: false } })).toBe(true)
  expect(filterEntity(entity, { flagT: { $gte: false } })).toBe(true)
  expect(filterEntity(entity, { flagT: { $lt: false } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $lte: false } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $gt: true } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $gte: true } })).toBe(true)
  expect(filterEntity(entity, { flagT: { $lt: true } })).toBe(false)
  expect(filterEntity(entity, { flagT: { $lte: true } })).toBe(true)
  expect(filterEntity(entity, { flagF: { $gt: true } })).toBe(false)
  expect(filterEntity(entity, { flagF: { $gte: true } })).toBe(false)
  expect(filterEntity(entity, { flagF: { $lt: true } })).toBe(true)
  expect(filterEntity(entity, { flagF: { $lte: true } })).toBe(true)
  expect(filterEntity(entity, { flagF: { $gt: false } })).toBe(false)
  expect(filterEntity(entity, { flagF: { $gte: false } })).toBe(true)
  expect(filterEntity(entity, { flagF: { $lt: false } })).toBe(false)
  expect(filterEntity(entity, { flagF: { $lte: false } })).toBe(true)

  //ElementOperators
  expect(filterEntity(entity, { array: { $exists: true } })).toBe(true)
  expect(filterEntity(entity, { age: { $exists: true } })).toBe(true)
  expect(filterEntity(entity, { image: { $exists: true } })).toBe(true)
  expect(filterEntity(entity, { none: { $exists: true } })).toBe(false)
  expect(filterEntity(entity, { array: { $exists: false } })).toBe(false)
  expect(filterEntity(entity, { age: { $exists: false } })).toBe(false)
  expect(filterEntity(entity, { image: { $exists: false } })).toBe(false)
  expect(filterEntity(entity, { none: { $exists: false } })).toBe(true)
  expect(filterEntity(entity, { 'profile.none': { $exists: false } })).toBe(true)
  expect(filterEntity(entity, { 'profile.none.none': { $exists: false } })).toBe(true)

  //StringOperators
  expect(filterEntity(entity, { name: { $contains: 'ui' } })).toBe(true)
  expect(filterEntity(entity, { age: { $contains: 'ui' } })).toBe(false)
  expect(filterEntity(entity, { name: { $contains: 'lui' } })).toBe(false)
  expect(filterEntity(entity, { name: { $contains: 'aui' } })).toBe(false)
  expect(filterEntity(entity, { name: { $startsWith: 'Lui' } })).toBe(true)
  expect(filterEntity(entity, { name: { $startsWith: 'lui' } })).toBe(false)
  expect(filterEntity(entity, { name: { $startsWith: 'uis' } })).toBe(false)
  expect(filterEntity(entity, { name: { $endsWith: 'uis' } })).toBe(true)
  expect(filterEntity(entity, { name: { $endsWith: 'uiS' } })).toBe(false)
  expect(filterEntity(entity, { name: { $endsWith: 'Lui' } })).toBe(false)


  
})
