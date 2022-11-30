import { defaultValueMiddleware, mock } from '../../src'
import { EntityManager } from './dao.mock'
import BigNumber from 'bignumber.js'
import sha256 from 'sha256'
import { v4 as uuidv4 } from 'uuid'

jest.setTimeout(20000)

let dao: EntityManager
mock.compare = (l, r) => {
  if (l instanceof Date && r instanceof Date) {
    return l.getTime() - r.getTime()
  }
  if (l instanceof BigNumber && r instanceof BigNumber) {
    return l.comparedTo(r)
  }
}

beforeEach(async () => {
  mock.clearMemory()
  dao = new EntityManager({
    scalars: {
      ID: {
        generate: () => uuidv4(),
      },
      Password: {
        dbToModel: (o: unknown) => o as string,
        modelToDB: (o: string) => sha256(o),
        validate: (o: string) => {
          if (o.length < 3) {
            return new Error('Password must be 3 character or more.')
          }
          return true
        },
      },
    },
  })
})

// ------------------------------------------------------------------------
// ---------------------------- FIND --------------------------------------
// ------------------------------------------------------------------------
test('empty find', async () => {
  const users = await dao.user.findAll({})
  expect(users.length).toBe(0)

  const user = await dao.user.findOne({})
  expect(user).toBeNull()
})

test('simple findAll', async () => {
  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true, credentials: [{ username: 'user', password: '123456' }] } })

  const users = await dao.user.findAll({})
  expect(users.length).toBe(1)
  expect(users[0].firstName).toBe('FirstName')
  expect(users[0].lastName).toBe('LastName')

  const users1 = await dao.user.findAll({ filter: { firstName: undefined } })
  expect(users1.length).toBe(1)
  expect(users1[0].firstName).toBe('FirstName')
  expect(users1[0].lastName).toBe('LastName')

  const users2 = await dao.user.findAll({ filter: { id: { exists: true } } })
  expect(users2.length).toBe(1)
  expect(users2[0].firstName).toBe('FirstName')
  expect(users2[0].lastName).toBe('LastName')
})

test('nulls find', async () => {
  await dao.user.insertOne({ record: { live: true, firstName: '' } })
  await dao.user.insertOne({ record: { live: true, firstName: null } })
  await dao.user.insertOne({ record: { live: true } })

  const users1 = await dao.user.findAll({ filter: { firstName: null } })
  const users2 = await dao.user.findAll({ filter: { firstName: { eq: null } } })
  const users3 = await dao.user.findAll({ filter: { firstName: { exists: false } } })
  const users4 = await dao.user.findAll({ filter: { firstName: { exists: true } } })
  const users5 = await dao.user.findAll({ filter: { firstName: undefined } })

  expect(users1.length).toBe(1)
  expect(users1[0].firstName).toBe(null)
  expect(users2.length).toBe(1)
  expect(users2[0].firstName).toBe(null)
  expect(users3.length).toBe(2)
  expect(users3.find((v) => v.firstName === null)?.firstName).toBe(null)
  expect(users3.find((v) => v.firstName === undefined)?.firstName).toBe(undefined)
  expect(users4.length).toBe(1)
  expect(users4[0].firstName).toBe('')
  expect(users5.length).toBe(3)
})

test('unlimited', async () => {
  for (let i = 0; i < 1000; i++) {
    await dao.user.insertOne({ record: { live: true, firstName: i.toString() } })
  }
  const users = await dao.user.findAll({ limit: 'unlimited' })
  expect(users.length).toBe(1000)
})

test('simple findOne', async () => {
  const u = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.user.insertOne({ record: { firstName: 'FirstName1', lastName: 'LastName', live: true } })
  await dao.user.insertOne({ record: { firstName: '1FirstName', lastName: 'LastName', live: true } })

  const user = await dao.user.findOne({ filter: { id: u.id } })
  expect(user).toBeDefined()
  expect(user?.firstName).toBe('FirstName')
  expect(user?.lastName).toBe('LastName')

  const user2 = await dao.user.findOne({ filter: { firstName: { eq: 'firstname' } } })
  expect(user2).toBe(null)
  const user3 = await dao.user.findOne({ filter: { firstName: { eq: 'firstname', mode: 'insensitive' } } })
  expect(user3).toBeDefined()
  expect(user3?.firstName).toBe('FirstName')
  expect(user3?.lastName).toBe('LastName')
})

test('simple findOne multiple filter', async () => {
  await dao.user.insertOne({ record: { firstName: '1', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '2', live: true } })
  await dao.user.insertOne({ record: { firstName: '2', lastName: '1', live: true, amount: undefined } })

  const users = await dao.user.findAll({ filter: { $and: [{ lastName: '2' }, { firstName: '2' }] } })
  expect(users.length).toBe(1)
  expect(users[0].lastName).toBe('2')
})

// ------------------------------------------------------------------------
// -------------------------- ASSOCIATIONS --------------------------------
// ------------------------------------------------------------------------
test('findOne simple inner association', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const dog = await dao.dog.findOne({ projection: { owner: { firstName: true } } })
  expect(dog?.owner).toBeDefined()
  expect(dog?.owner?.firstName).toBe('FirstName')
})

test('findOne simple foreignRef association 1', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })
  await dao.dog.insertOne({ record: { name: 'Pippo', ownerId: user.id } })

  const foundUser = await dao.user.findOne({ projection: { id: true, dogs: { name: true, ownerId: true } }, relations: { dogs: { filter: { name: 'Charlie' } } } })
  expect(foundUser?.dogs).toBeDefined()
  expect(foundUser?.dogs?.length).toBe(1)
  expect((foundUser?.dogs ?? [])[0].name).toBe('Charlie')
})

test('findOne simple foreignRef association 2', async () => {
  const user1 = await dao.user.insertOne({ record: { firstName: 'FirstName1', lastName: 'LastName1', live: true } })
  const user2 = await dao.user.insertOne({ record: { firstName: 'FirstName2', lastName: 'LastName2', live: true } })
  await dao.dog.insertOne({ record: { name: 'Dog 1', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 2', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 3', ownerId: user1.id } })
  await dao.dog.insertOne({ record: { name: 'Dog 4', ownerId: user2.id } })

  const users = await dao.user.findAll({
    projection: { dogs: { name: true } },
    relations: {
      dogs: {
        limit: 1,
      },
    },
  })

  expect(users[0].dogs?.length).toBe(1)
  expect(users[1].dogs?.length).toBe(1)
})

test('findOne self innerRef association', async () => {
  for (let i = 0; i < 100; i++) {
    await dao.user.insertOne({ record: { id: `u_${i}`, firstName: `FirstName${i}`, lastName: `LastName${i}`, live: true } })
  }
  await dao.user.insertOne({ record: { firstName: 'FirstName100', lastName: 'LastName100', friendsId: ['u_0', ...Array.from(Array(100).keys()).map((i) => `u_${i}`)], live: true } })

  const foundUser = await dao.user.findOne({ filter: { firstName: 'FirstName100' }, projection: { friends: { firstName: true } } })
  expect(foundUser?.friends).toBeDefined()
  expect(foundUser?.friends?.length).toBe(101)
  expect((foundUser?.friends ?? [])[0].firstName).toBe('FirstName0')
  expect((foundUser?.friends ?? [])[1].firstName).toBe('FirstName0')
  expect((foundUser?.friends ?? [])[2].firstName).toBe('FirstName1')
  expect((foundUser?.friends ?? [])[100].firstName).toBe('FirstName99')
})

test('findOne foreignRef without from and to fields in projection', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  await dao.dog.insertOne({ record: { name: 'Charlie', ownerId: user.id } })

  const foundUser = await dao.user.findOne({ projection: { dogs: { name: true } } })
  expect(foundUser?.dogs).toBeDefined()
  expect(foundUser?.dogs?.length).toBe(1)
  expect((foundUser?.dogs ?? [])[0].name).toBe('Charlie')
})

test('find nested foreignRef association', async () => {
  await dao.address.insertOne({ record: { id: 'address1' } })
  await dao.organization.insertOne({ record: { id: 'organization1', name: 'Organization 1', address: { id: 'address1' } } })
  await dao.city.insertOne({ record: { id: 'city1', name: 'City 1', addressId: 'address1' } })
  await dao.city.insertOne({ record: { id: 'city2', name: 'City 2', addressId: 'address1' } })

  const response = await dao.organization.findAll({ projection: { id: true, address: { id: true, cities: { id: true, name: true } } } })
  expect(response.length).toBe(1)
  expect(response[0].address?.cities?.length).toBe(2)
  if (response[0].address?.cities) {
    expect(response[0].address.cities[0].name).toBe('City 1')
    expect(response[0].address.cities[1].name).toBe('City 2')
  }
})

// ------------------------------------------------------------------------
// ------------------------------ FILTERS ---------------------------------
// ------------------------------------------------------------------------
test('find with no filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll()
  expect(response1.length).toBe(10)
  const response2 = await dao.user.findAll({})
  expect(response2.length).toBe(10)
  const response3 = await dao.user.findAll({ projection: { id: true } })
  expect(response3.length).toBe(10)
  const response4 = await dao.user.findOne()
  expect(response4).toBeDefined()
  const response5 = await dao.user.findOne({})
  expect(response5).toBeDefined()
  const response6 = await dao.user.findOne({ projection: { id: true } })
  expect(response6).toBeDefined()
  const response7 = await dao.user.findPage()
  expect(response7.records.length).toBe(10)
  const response8 = await dao.user.findPage({})
  expect(response8.records.length).toBe(10)
  const response9 = await dao.user.findPage({ projection: { id: true } })
  expect(response9.records.length).toBe(10)
})

test('find with simple filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ filter: { firstName: '1' } })
  expect(response1.length).toBe(1)
  expect(response1[0].firstName).toBe('1')
  const response2 = await dao.user.findOne({ filter: { firstName: '1' } })
  expect(response2).toBeDefined()
  expect(response2?.firstName).toBe('1')
  const response3 = await dao.user.findPage({ filter: { firstName: '1' } })
  expect(response3.records.length).toBe(1)
  expect(response3.records[0].firstName).toBe('1')
})

test('find with in filter', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ filter: { firstName: { in: ['1'] } } })
  expect(response1.length).toBe(1)
  expect(response1[0].firstName).toBe('1')
  const response2 = await dao.user.findAll({ filter: { firstName: { in: ['1', '2'] } } })
  expect(response2.length).toBe(2)
  const response3 = await dao.user.findAll({ filter: { firstName: { in: ['1', 'a'] } } })
  expect(response3.length).toBe(1)
  const response4 = await dao.user.findAll({ filter: { firstName: { in: [] } } })
  expect(response4.length).toBe(0)
  const response5 = await dao.user.findAll({ filter: { firstName: { in: ['a'] } } })
  expect(response5.length).toBe(0)
})

// ------------------------------------------------------------------------
// -------------------------- PAGINATION ----------------------------------
// ------------------------------------------------------------------------
test('find with start', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ skip: 0 })
  expect(response1.length).toBe(10)
  expect(response1[0].firstName).toBe('0')
  expect(response1[1].firstName).toBe('1')
  const response2 = await dao.user.findAll({ skip: 5 })
  expect(response2.length).toBe(5)
  expect(response2[0].firstName).toBe('5')
  expect(response2[1].firstName).toBe('6')
  const response3 = await dao.user.findAll({ skip: 10 })
  expect(response3.length).toBe(0)
  const response4 = await dao.user.findAll({ skip: 20 })
  expect(response4.length).toBe(0)
})

test('find with limit', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ limit: 0 })
  expect(response1.length).toBe(0)
  const response2 = await dao.user.findAll({ limit: 1 })
  expect(response2.length).toBe(1)
  expect(response2[0].firstName).toBe('0')
  const response3 = await dao.user.findAll({ limit: 2 })
  expect(response3.length).toBe(2)
  expect(response3[0].firstName).toBe('0')
  expect(response3[1].firstName).toBe('1')
  const response4 = await dao.user.findAll({ limit: 10 })
  expect(response4.length).toBe(10)
  const response5 = await dao.user.findAll({ limit: 100 })
  expect(response5.length).toBe(10)
})

test('find with simple sorts', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response1[0].firstName).toBe('9')
  expect(response1[1].firstName).toBe('8')
  const response2 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response2[0].firstName).toBe('9')
  const response3 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }] })
  expect(response3[0].firstName).toBe('9')
  const response4 = await dao.user.findAll({ sorts: [{ firstName: 'asc' }] })
  expect(response4[0].firstName).toBe('0')
  expect(response4[1].firstName).toBe('1')
})

test('find with multiple sorts', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '1', lastName: '' + (9 - i), live: true } })
  }
  const response1 = await dao.user.findAll({ sorts: [{ firstName: 'desc' }, { lastName: 'desc' }] })
  expect(response1[0].lastName).toBe('9')
  expect(response1[1].lastName).toBe('8')
})

test('find with start and limit', async () => {
  for (let i = 0; i < 10; i++) {
    await dao.user.insertOne({ record: { firstName: '' + i, live: true } })
  }
  const response1 = await dao.user.findAll({ skip: 0, limit: 0 })
  expect(response1.length).toBe(0)
  const response2 = await dao.user.findAll({ skip: 1, limit: 1 })
  expect(response2.length).toBe(1)
  expect(response2[0].firstName).toBe('1')
  const response3 = await dao.user.findAll({ skip: 1, limit: 0 })
  expect(response3.length).toBe(0)
  const response4 = await dao.user.findAll({ skip: 2, limit: 2 })
  expect(response4.length).toBe(2)
  expect(response4[0].firstName).toBe('2')
  expect(response4[1].firstName).toBe('3')
  const response5 = await dao.user.findAll({ skip: 8, limit: 10 })
  expect(response5.length).toBe(2)
  expect(response5[0].firstName).toBe('8')
  expect(response5[1].firstName).toBe('9')
})

// ------------------------------------------------------------------------
// -------------------------- INSERT --------------------------------------
// ------------------------------------------------------------------------
test('simple insert', async () => {
  let response

  response = await dao.user.findAll({})
  expect(response.length).toBe(0)

  await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  response = await dao.user.findAll({})
  expect(response.length).toBe(1)
})

test('ID auto-generation and find by id', async () => {
  const { id } = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true } })
  expect(id).toBeDefined()
  const response1 = await dao.user.findAll({ filter: { id } })
  expect(response1.length).toBe(1)
})

test('insert and find embedded entity', async () => {
  await dao.user.insertOne({ record: { usernamePasswordCredentials: { username: 'username', password: 'password' }, live: true } })
  const response = await dao.user.findAll({})
  expect(response.length).toBe(1)
  expect(response[0].usernamePasswordCredentials).toBeDefined()
  expect(response[0].usernamePasswordCredentials?.username).toBe('username')
  expect(response[0].usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('set embedded to null', async () => {
  await dao.post.insertOne({ record: { authorId: '123', title: 'T', views: 1, metadata: { region: 'it', visible: true } } })
  const p1 = await dao.post.findOne({})
  expect(p1?.metadata?.visible).toBe(true)
  await dao.post.updateAll({ filter: {}, changes: { metadata: null } })
  const p2 = await dao.post.findOne({})
  expect(p2?.metadata).toBe(null)
})

test('insert generic test 1', async () => {
  const ins = await dao.user.insertOne({
    record: {
      live: true,
      localization: { latitude: 1.1, longitude: 2.2 },
      amount: new BigNumber(11.11),
      amounts: [new BigNumber(11.11), new BigNumber(12.11)],
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  expect(ins.usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
  const all = await dao.user.findAll({ filter: { id: ins.id }, projection: true })
  expect(all.length).toBe(1)
  expect(all[0].live).toBe(true)
  expect(all[0].localization?.latitude).toBe(1.1)
  expect(all[0].localization?.longitude).toBe(2.2)
  expect(all[0].amount?.toNumber()).toBe(11.11)
  expect((all[0].amounts ?? [])[0].toNumber()).toBe(11.11)
  expect((all[0].amounts ?? [])[1].toNumber()).toBe(12.11)
  expect(all[0].usernamePasswordCredentials?.username).toBe('user')
  expect(all[0].usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
})

test('insert validation fails', async () => {
  try {
    await dao.user.insertOne({
      record: {
        live: true,
        usernamePasswordCredentials: {
          username: 'user',
          password: 'p',
        },
      },
    })
    fail()
  } catch (error: unknown) {
    expect((error as Error).message).toBe('Password must be 3 character or more.')
  }
})

test('Insert default', async () => {
  try {
    await dao.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1' } })
    fail()
  } catch (error: unknown) {
    expect(((error as Error).message as string).startsWith('Generator for scalar Live is needed for generate default fields live')).toBe(true)
  }

  const entityManager1 = new EntityManager({
    scalars: {
      Live: {
        generate: () => true,
      },
    },
  })

  try {
    await entityManager1.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1' } })
    fail()
  } catch (error: unknown) {
    expect(((error as Error).message as string).startsWith('Fields creationDate should have been generated from a middleware but it is undefined')).toBe(true)
  }

  const e1 = await entityManager1.defaultFieldsEntity.insertOne({ record: { id: 'id1', name: 'n1', creationDate: 123 } })
  expect(e1.live).toBe(true)

  const entityManager2 = new EntityManager({
    scalars: {
      Live: {
        generate: () => true,
      },
    },
    overrides: {
      defaultFieldsEntity: {
        middlewares: [defaultValueMiddleware('creationDate', () => 1234)],
      },
    },
  })

  const e2 = await entityManager2.defaultFieldsEntity.insertOne({ record: { id: 'id2', name: 'n1' } })
  expect(e2.live).toBe(true)
  expect(e2.creationDate).toBe(1234)
  expect(e2.opt1).toBe(undefined)
  expect(e2.opt2).toBe(true)

  const e3 = await entityManager2.defaultFieldsEntity.insertOne({ record: { id: 'id3', name: 'n1', opt1: undefined } })
  expect(e3.opt1).toBe(undefined)
})

test('update validation fails', async () => {
  await dao.user.insertOne({
    record: {
      live: true,
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  try {
    await dao.user.updateAll({
      filter: {},
      changes: { 'usernamePasswordCredentials.password': 'p' },
    })
    fail()
  } catch (error: unknown) {
    expect((error as Error).message).toBe('Password must be 3 character or more.')
  }
})

test('replace validation fails', async () => {
  await dao.user.insertOne({
    record: {
      live: true,
      usernamePasswordCredentials: {
        username: 'user',
        password: 'password',
      },
    },
  })
  try {
    await dao.user.replaceOne({
      filter: {},
      replace: {
        live: true,
        usernamePasswordCredentials: {
          username: 'user',
          password: 'p',
        },
      },
    })
    fail()
  } catch (error: unknown) {
    expect((error as Error).message).toBe('Password must be 3 character or more.')
  }
})

// ------------------------------------------------------------------------
// ------------------------------ UPDATE ----------------------------------
// ------------------------------------------------------------------------
test('simple update', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateOne({ filter: { id: user.id }, changes: { lastName: 'LastName' } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2?.firstName).toBe(user.firstName)
  expect(user2?.lastName).toBe('LastName')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { firstName: 'NewFirstName' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3?.firstName).toBe('NewFirstName')
  expect(user3?.lastName).toBe(user3?.lastName)
})

test('update embedded entity', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  await dao.user.updateOne({ filter: { id: user.id }, changes: { usernamePasswordCredentials: { username: 'username', password: 'password' } } })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user2?.usernamePasswordCredentials).toBeDefined()
  expect(user2?.usernamePasswordCredentials?.username).toBe('username')
  expect(user2?.usernamePasswordCredentials?.password).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { usernamePasswordCredentials: { username: 'newUsername', password: 'newPassword' } } })
  const user3 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user3?.usernamePasswordCredentials).toBeDefined()
  expect(user3?.usernamePasswordCredentials?.username).toBe('newUsername')
  expect(user3?.usernamePasswordCredentials?.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')

  await dao.user.updateOne({ filter: { id: user.id }, changes: { 'usernamePasswordCredentials.username': 'newUsername_2' } })
  const user4 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user4?.usernamePasswordCredentials).toBeDefined()
  expect(user4?.usernamePasswordCredentials?.username).toBe('newUsername_2')
  expect(user4?.usernamePasswordCredentials?.password).toBe('5c29a959abce4eda5f0e7a4e7ea53dce4fa0f0abbe8eaa63717e2fed5f193d31')
})

test('update with undefined', async () => {
  const user = await dao.user.insertOne({
    record: {
      id: 'u1',
      firstName: 'FirstName',
      lastName: 'LastName',
      live: true,
    },
  })
  await dao.user.updateOne({ filter: { id: user.id }, changes: { live: undefined } })
  const user2 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user2?.live).toBe(true)
  await dao.user.updateAll({ filter: { id: user.id }, changes: { live: undefined, firstName: 'Mario' } })
  const user3 = await dao.user.findOne({ filter: { id: user.id }, projection: { live: true, id: true } })
  expect(user3?.live).toBe(true)
})

test('update array embedded', async () => {
  const user = await dao.user.insertOne({
    record: {
      id: 'u1',
      firstName: 'FirstName',
      lastName: 'LastName',
      live: true,
      credentials: [
        { password: 'asd1', username: 'asd1' },
        { password: 'asd2', username: 'asd2' },
      ],
    },
  })
  expect((user.credentials ?? [])[0]?.username).toBe('asd1')
  expect((user.credentials ?? [])[1]?.username).toBe('asd2')
  await dao.user.updateOne({
    filter: { id: user.id },
    changes: {
      credentials: [
        { password: 'asd3', username: 'asd3' },
        { password: 'asd4', username: 'asd4' },
      ],
    },
  })
  const user2 = await dao.user.findOne({ filter: { id: user.id } })
  expect((user2?.credentials ?? [])[0]?.username).toBe('asd3')
  expect((user2?.credentials ?? [])[1]?.username).toBe('asd4')

  const user3 = await dao.user.insertOne({
    record: {
      id: 'u1',
      firstName: 'FirstName',
      lastName: 'LastName',
      live: true,
      credentials: [null, { password: 'asd1', username: 'asd1' }],
    },
  })
  expect((user3?.credentials ?? [])[0]).toBe(null)
  expect((user3?.credentials ?? [])[1]?.username).toBe('asd1')

  await dao.user.updateOne({ filter: { id: user3.id }, changes: { credentials: [null, { password: 'asd2', username: 'asd2' }, null] } })

  const user4 = await dao.user.findOne({ filter: { id: user3.id } })
  expect((user4?.credentials ?? [])[0]).toBe(null)
  expect((user4?.credentials ?? [])[1]?.username).toBe('asd2')
  expect((user4?.credentials ?? [])[2]).toBe(null)
})

test('insert embedded with inner refs', async () => {
  const iuser = await dao.user.insertOne({
    record: {
      id: '123',
      firstName: 'FirstName',
      embeddedPost: {
        authorId: '123',
        id: '1234',
        title: 'title',
        views: 1,
      },
      live: true,
    },
  })
  const user1 = await dao.user.findOne({ projection: { embeddedPost: { author: { firstName: true } } } })
  expect(user1?.embeddedPost?.author.firstName).toBe('FirstName')
  await dao.user.updateOne({
    filter: { id: iuser.id },
    changes: {
      firstName: 'FirstName2',
      embeddedPost: {
        authorId: '123',
        id: '1234',
        title: 'title',
        views: 1,
      },
    },
  })
  const user2 = await dao.user.findOne({ projection: { firstName: true, embeddedPost: { author: { firstName: true } } } })
  expect(user2?.embeddedPost?.author.firstName).toBe('FirstName2')
})

// ------------------------------------------------------------------------
// ------------------------------ REPLACE ---------------------------------
// ------------------------------------------------------------------------
test('simple replace', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })
  await dao.user.replaceOne({ filter: { id: user.id }, replace: { id: user.id, firstName: 'FirstName 1', live: true } })
  const user1 = await dao.user.findOne({ filter: { id: user.id } })

  expect(user1).toBeDefined()
  expect(user1?.firstName).toBe('FirstName 1')
})

// ------------------------------------------------------------------------
// ------------------------------ DELETE ----------------------------------
// ------------------------------------------------------------------------
test('simple delete', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })

  const user1 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user1).toBeDefined()

  await dao.user.deleteOne({ filter: { id: user.id } })

  const user2 = await dao.user.findOne({ filter: { id: user.id } })
  expect(user2).toBeNull()
})

test('simple delete', async () => {
  await dao.user.insertOne({ record: { firstName: 'FirstName', live: false } })
  await dao.user.insertOne({ record: { firstName: 'FirstName', live: true } })
  await dao.user.insertOne({ record: { firstName: 'FirstName', live: false } })

  const users1 = await dao.user.findAll()
  expect(users1.length).toBe(3)

  await dao.user.deleteAll({ filter: { live: false } })

  const users2 = await dao.user.findAll()
  expect(users2.length).toBe(1)

  const u1 = await dao.user.insertOne({ record: { firstName: 'FirstName', live: false } })
  const u2 = await dao.user.insertOne({ record: { firstName: 'FirstName', live: false } })

  const users3 = await dao.user.findAll()
  expect(users3.length).toBe(3)

  await dao.user.deleteAll({ filter: { id: { in: [u1.id, u2.id] } } })

  const users4 = await dao.user.findAll()
  expect(users4.length).toBe(1)
})

// ------------------------------------------------------------------------
// --------------------------- GEOJSON FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve geojson field', async () => {
  const iuser = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, localization: { latitude: 1.111, longitude: 2.222 } } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, localization: true } })
  expect(user).toBeDefined()
  expect(user?.localization?.latitude).toBe(1.111)
  expect(user?.localization?.longitude).toBe(2.222)
})

// ------------------------------------------------------------------------
// --------------------------- DECIMAL FIELD ------------------------------
// ------------------------------------------------------------------------
test('insert and retrieve decimal field', async () => {
  await dao.user.insertOne({ record: { id: 'ID1', firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

  /*const user1 = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amount: true } })
  expect(user1).toBeDefined()
  expect(user1?.amount?.comparedTo(12.12)).toBe(0)*/

  const user2 = await dao.user.findOne({ filter: { amount: new BigNumber(12.12) }, projection: { id: true, amount: true } })
  expect(user2).toBeDefined()
  expect(user2?.amount?.comparedTo(12.12)).toBe(0)
  expect(user2?.id).toBe('ID1')
})

test('insert and retrieve decimal field 2', async () => {
  await dao.user.insertOne({ record: { id: 'ID1', live: true, amounts: [new BigNumber(1.1), new BigNumber(2.2)] } })

  const user2 = await dao.user.findOne({ filter: { amounts: { in: [[new BigNumber(1.1), new BigNumber(2.2)]] } }, projection: { id: true, amounts: true } })
  expect(user2).toBeDefined()
  expect(user2?.amounts?.length).toBe(2)
  expect(user2?.id).toBe('ID1')
})

test('update and retrieve decimal field', async () => {
  const iuser = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amount: new BigNumber(12.12) } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amount: true } })
  expect(user).toBeDefined()
  expect(user?.amount?.comparedTo(12.12)).toBe(0)

  await dao.user.updateOne({ filter: { id: user?.id }, changes: { amount: new BigNumber(14.14) } })
  const user1 = await dao.user.findOne({ filter: { id: user?.id }, projection: { id: true, amount: true } })

  expect(user1).toBeDefined()
  expect(user1?.amount?.comparedTo(14.14)).toBe(0)
})

test('insert and retrieve decimal array field', async () => {
  const iuser = await dao.user.insertOne({ record: { firstName: 'FirstName', live: true, amounts: [new BigNumber(1.02), new BigNumber(2.223)] } })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, amounts: true } })
  expect(user).toBeDefined()
  expect(user?.amounts?.length).toBe(2)
  expect((user?.amounts ?? [])[0].comparedTo(1.02)).toBe(0)
  expect((user?.amounts ?? [])[1].comparedTo(2.223)).toBe(0)
})

// ------------------------------------------------------------------------
// ---------------------- LOCALIZED STRING FIELD --------------------------
// ------------------------------------------------------------------------
test('insert and retrieve localized string field', async () => {
  const iuser = await dao.user.insertOne({
    record: {
      firstName: 'FirstName',
      live: true,
      title: { it: 'Ciao', en: 'Hello' },
      usernamePasswordCredentials: { username: 'user', password: '123' },
      credentials: [{ username: 'user', password: '123' }],
    },
  })

  const user = await dao.user.findOne({ filter: { id: iuser.id }, projection: { id: true, title: true } })
  expect(user).toBeDefined()
  expect(user?.title?.en).toBe('Hello')
  expect(user?.title?.it).toBe('Ciao')

  const user2 = await dao.user.findOne({ filter: { 'usernamePasswordCredentials.username': 'user' }, projection: { id: true, title: true } })
  expect(user2).toBeDefined()
  expect(user2?.title?.en).toBe('Hello')
  expect(user2?.title?.it).toBe('Ciao')

  const user3 = await dao.user.findOne({ filter: { 'credentials.username': 'user' }, projection: { id: true, title: true } })
  expect(user3).toBeDefined()
  expect(user3?.title?.en).toBe('Hello')
  expect(user3?.title?.it).toBe('Ciao')

  await dao.user.updateOne({
    filter: { id: iuser.id },
    changes: {
      embeddedPost: {
        authorId: iuser.id,
        title: 'Title',
        views: 0,
        tags: ['1', '2'],
      },
    },
  })
  const user4 = await dao.user.findOne({ filter: { 'embeddedPost.tags': '1' }, projection: { id: true, title: true } })
  expect(user4).toBeDefined()
  expect(user4?.title?.en).toBe('Hello')
  expect(user4?.title?.it).toBe('Ciao')
})

// ------------------------------------------------------------------------
// --------------------------- AGGREGATIONS -------------------------------
// ------------------------------------------------------------------------

test('Aggregate test', async () => {
  for (let i = 0; i < 100; i++) {
    await dao.post.insertOne({
      record: {
        authorId: `user_${Math.floor(i / 10)}`,
        title: 'Title ' + i,
        views: i,
        metadata: {
          region: i % 2 === 0 ? 'it' : 'en',
          visible: i % 2 === 0 || i === 99,
        },
      },
    })
  }
  const aggregation1 = await dao.post.aggregate(
    {
      by: {
        authorId: true,
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
      filter: { 'metadata.visible': true, views: { gt: 0 } },
      skip: 1,
      limit: 2,
    },
    { sorts: [{ authorId: 'desc' }, { totalAuthorViews: 'desc' }], having: { totalAuthorViews: { lt: 150 } } },
  )
  expect(aggregation1.length).toBe(2)
  // expect(aggregation1[0]).toEqual({ count: 1, totalAuthorViews: 99, authorId: 'user_9', 'metadata.region': 'en' })
  expect(aggregation1[0]).toEqual({ count: 5, totalAuthorViews: 120, authorId: 'user_2', 'metadata.region': 'it' })
  expect(aggregation1[1]).toEqual({ count: 5, totalAuthorViews: 70, authorId: 'user_1', 'metadata.region': 'it' })
  // expect(aggregation1[3]).toEqual({ count: 4, totalAuthorViews: 20, authorId: 'user_0', 'metadata.region': 'it' })

  const aggregation2 = await dao.post.aggregate({
    aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' }, avgAuthorViews: { field: 'views', operation: 'avg' } },
  })
  expect(aggregation2.avgAuthorViews).toBe(49.5)
  expect(aggregation2.avgAuthorViews).toBe((aggregation2.totalAuthorViews ?? 0) / aggregation2.count)

  const aggregation3 = await dao.post.aggregate({
    aggregations: { max: { field: 'views', operation: 'max' }, min: { field: 'views', operation: 'min' } },
  })
  expect(aggregation3.max).toBe(99)
  expect(aggregation3.min).toBe(0)

  const aggregation4 = await dao.user.aggregate({ aggregations: { max: { operation: 'max', field: 'amount' }, count: { operation: 'count' } } })
  expect(aggregation4.max).toBe(null)
  expect(aggregation4.count).toBe(0)

  const aggregation5 = await dao.post.aggregate({
    by: { authorId: true },
    aggregations: {
      max: { operation: 'max', field: 'clicks' },
      avg: { operation: 'avg', field: 'clicks' },
      sum: { operation: 'sum', field: 'clicks' },
      count: { operation: 'count' },
    },
  })
  expect(aggregation5[0].max).toBe(null)
  expect(aggregation5[0].avg).toBe(null)
  expect(aggregation5[0].sum).toBe(0)
  expect(aggregation5[0].count).toBe(10)

  const aggregation6 = await dao.post.aggregate({
    by: {
      id: true,
    },
    aggregations: { count: { operation: 'count' } },
  })
  for (const a of aggregation6) {
    expect(a.count).toBe(1)
  }
})

test('Aggregate test 2', async () => {
  for (let i = 0; i < 100; i++) {
    await dao.post.insertOne({
      record: {
        authorId: `user_${Math.floor(i / 10)}`,
        title: 'Title ' + i,
        views: i,
        metadata:
          i % 4 === 0
            ? null
            : i % 4 === 1
            ? undefined
            : {
                region: i % 4 === 2 ? 'it' : 'en',
                visible: i % 2 === 0 || i === 99,
              },
      },
    })
  }
  const aggregation1 = await dao.post.aggregate(
    {
      by: {
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
    },
    { sorts: [{ 'metadata.region': 'desc' }, { totalAuthorViews: 'desc' }] },
  )
  expect(aggregation1.length).toBe(3)
  expect(aggregation1.find((a) => a['metadata.region'] == null)?.count).toBe(50)
  expect(aggregation1.find((a) => a['metadata.region'] === 'it')?.count).toBe(25)
  expect(aggregation1.find((a) => a['metadata.region'] === 'en')?.count).toBe(25)

  const aggregation2 = await dao.post.aggregate(
    {
      by: {
        'metadata.region': true,
      },
      aggregations: { count: { operation: 'count' }, totalAuthorViews: { field: 'views', operation: 'sum' } },
      filter: { 'metadata.visible': true, views: { gt: 0 } },
    },
    { sorts: [{ 'metadata.region': 'desc' }, { totalAuthorViews: 'desc' }] },
  )
  expect(aggregation2.length).toBe(2)
  expect(aggregation2.find((a) => a['metadata.region'] === 'it')?.count).toBe(25)
  expect(aggregation2.find((a) => a['metadata.region'] === 'en')?.count).toBe(1)
})

test('Inner ref required', async () => {
  const user = await dao.user.insertOne({ record: { firstName: 'FirstName', lastName: 'LastName', live: true, amounts: [new BigNumber(1)] } })
  const post0 = await dao.post.insertOne({ record: { authorId: 'random', title: 'title', views: 1 } })
  const post1 = await dao.post.insertOne({ record: { authorId: user.id, title: 'title', views: 1 } })
  const post2 = (await dao.post.findOne({ filter: { id: post1.id } })) ?? {}
  const post3 = (await dao.post.findOne({ filter: { id: post1.id }, projection: { author: true } })) ?? {}
  const post4 = (await dao.post.findOne({ filter: { id: post1.id }, projection: { title: true } })) ?? {}

  expect('author' in post1).toBe(false)
  expect('author' in post2).toBe(false)
  expect('author' in post3).toBe(true)
  expect('author' in post4).toBe(false)
  try {
    await dao.post.findOne({ filter: { id: post0.id }, projection: { author: true } })
    fail()
  } catch (error: unknown) {
    expect(((error as Error).message as string).startsWith('dao: post'))
  }
})

/*
test('benchmark', async () => {
  const n = 50000
  const startInsert = new Date()
  for (let i = 0; i < n; i++) {
    await dao.postType.insertOne({ record: { id: i.toString(), name: i.toString() } })
  }
  console.log(`Insert avg ms: ${((new Date().getTime() - startInsert.getTime()) / n).toFixed(3)}`)
  expect((new Date().getTime() - startInsert.getTime()) / n).toBeLessThan(1)

  const readInsert = new Date()
  for (let i = 0; i < 10000; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { id: { in: ids } } })
  }
  console.log(`Read avg ms: ${((new Date().getTime() - readInsert.getTime()) / 10000).toFixed(3)}`)
  expect((new Date().getTime() - readInsert.getTime()) / 10000).toBeLessThan(1)

  const read2Insert = new Date()
  for (let i = 0; i < 2; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.findAll({ filter: { name: { in: ids } } })
  }
  console.log(`Read avg (no index) ms: ${((new Date().getTime() - read2Insert.getTime()) / 2).toFixed(3)}`)
  expect(100 - (new Date().getTime() - read2Insert.getTime()) / 2).toBeLessThan(0)

  const read3Insert = new Date()
  for (let i = 0; i < 20; i++) {
    await dao.postType.findAll({ skip: Math.floor((Math.random() * (n / 2))), limit: Math.floor((Math.random() * (n / 2))) })
  }
  console.log(`Read avg (no filter, start & limit) ms: ${((new Date().getTime() - read3Insert.getTime()) / 2).toFixed(3)}`)

  const deleteInsert = new Date()
  for (let i = 0; i < 10000; i++) {
    const ids = [(Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0), (Math.random() * (n - 1)).toFixed(0)]
    await dao.postType.deleteAll({ filter: { id: { in: ids } } })
  }
  console.log(`Delete avg ms: ${((new Date().getTime() - deleteInsert.getTime()) / 10000).toFixed(3)}`)
  expect((new Date().getTime() - deleteInsert.getTime()) / 10000).toBeLessThan(1)

  for (let i = 0; i < 20000; i++) {
    await dao.postType.insertOne({ record: { id: 'n' + i.toString(), name: i.toString() } })
  }

  for (let i = 0; i < 10000; i++) {
    const id = (Math.random() * (n - 1)).toFixed(0)
    const res = await dao.postType.findOne({ filter: { id } })
    if (res) {
      expect(res?.name).toBe(id.toString())
    }
  }
})*/
