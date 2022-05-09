# Soft-Delete

In many systems, the **deletion** of data, as a requirement, must not be physical but **logical**. This means that each entity must have a field that identifies its deleted/undeleted status and that the delete operation acts on this field rather than deleting the record from the data source. As a result, each read operation must filter all deleted records automatically.

The mechanism described above is commonly called **soft-delete** and is used to:

- Keep the data for a certain period of time even after their deletion by the user.

- Build a "Trash" feature and allow the user to restore previously deleted data.


## Middleware

Typetta offers the developer middleware that makes implementing the soft-delete mechanism much easier. All you have to do is specify a function that returns an object with two fields:

- `changes`: changes to be applied to the record instead of physical deletion.

- `filter`: the filter to be applied to all readings to exclude deleted records.

Take, for example, the following data model:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  live: Boolean!
  deletedOn: Date
}
```

You can implement soft-delete behaviour for the `User` entity using this middleware as follows:
```typescript
const entityManager = new EntityManager({
  overrides: {
    user: {
      middlewares: [
        softDelete(() => ({
          changes: { live: false, deletedOne: new Date() },
          filter: { live: true }
        })),
      ]
    }
  }
)
```
