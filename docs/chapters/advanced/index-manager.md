# Index Manager

Typetta offers a completely typesafe index management feature. Currently, index management is supported for MongoDB, but SQL database management is also under development.

The management is based on creating a plan, which contains all the changes that will be made to the indices on various databases. The plan does not make any modifications and is created by reading the configuration passed to Typetta and the current situation on the database.

Once the plan is validated, it can be applied through Typetta. The application returns the result, including the created indices and any errors. This operation may take some time depending on the number of indices to create and the existing data in the database.

Below is an example of a GraphQL model:

```typescript
type User @entity @mongo {
    id: ID! @id
    registrationDate: Date!
}
type Post @entity @mongo {
    id: ID! @id
    content: String!
    creationDate: Date!
    userId: ID!
}
```

Here is an example of indexes definition:

```typescript
const mongodbIndexes: EntityManagerTypes['mongodbIndexes'] = {
  User: [
    //Indexes of user
    { name: 'registration', specs: { registrationDate: 1 } },
  ],
  Post: [
    //Indexes of user
    { name: 'creation', specs: { creationDate: 1 }, opts: { expireAfterSeconds: 24 * 3600 * 365 } },
    { name: 'user', specs: { userId: 1 } },
  ],
}
```

The definition is completely typesafe, so if any field in the model changes, this definition detects it at compile-time.

To apply the indices, simply call two operations on a correctly instantiated entityManager:

```typescript
//Plan and then apply
const plan = await context.entityManager.planIndexes({ indexes: { mongodb: mongodbIndexes } })
console.table(plan)
const applied = await entityManager.applyIndexes({ plan })
console.table(applied)

//Or apply directly
const applied = await entityManager.applyIndexes({ indexes: { mongodb: mongodbIndexes } })
console.table(applied)
```
