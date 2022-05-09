# Auditiing

**Auditing** refers to the process of collecting ancillary information useful for the analysis of data access, use and modification. This is a typical need for information systems that require control information in order to facilitate support and error finding operations.

Generally, information is historicised for each entity of the data model with a homogeneous logic that can be factored, saving repetitive and costly work.

## Middleware

Typetta provides the developer with middleware that facilitates the implementation of the data auditing mechanism. It requires the specification of a function that returns an object with two fields:

- `changes`: the changes to be applied to the record with each modification.

- `insert`: the default values to be applied to the record on creation.

Take, for example, the following data model:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String

  createdOn: Date!
  createdBy: ID!
  modifiedOn: Date
  modifiedBy: ID
}
```

The `User` entity has a number of fields for auditing purposes. This is a simple example; the number and complexity of these fields could be considerably higher. In any case, thanks to the `audit` middleware, it is possible to implement this simple behaviour:
```typescript
const entityManager = new EntityManager({
  metadata: { 
    user: { 
      id: 'logged-user-id' 
    } 
  },
  overrides: {
    user: {
      middlewares: [
        audit((metadata) => ({
          changes: { modifiedBy: metadata.user.id, modifiedOn: new Date() },
          insert: { createdBy: metadata.user.id, createdOn: new Date() }
        })),
      ]
    }
  }
)
```
