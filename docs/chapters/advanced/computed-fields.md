# Computed Fields

A **computed field** is a field in an entity that is not in the data source, but is the result of processing using the value of other fields. A computed field is then ignored in each insert or edit operation and is automatically populated by the system in each read operation where site is requested.

Typetta offers convenient middleware that can be used to define calculated fields. The following example shows how you can define a ``fullName`` field that is the composition of ``firstName`` and ``lastName`` of a hypothetical entity that represents a user. These last two fields are actually historicised in the data source, while ``fullName`` is in fact a virtual field.
```typescript
type User @entity @mongo {
  id: ID! @id
  firstName: String!
  lastName: String!
  fullName: String! @default(from: "middleware")
}
```
```typescript
const entityManager = new EntityManager({
  overrides: {
    user: {
      middlewares: [
        computedField({
          fieldsProjection: {
            fullName: true
          },
          requiredProjection: {
            firstName: true,
            lastName: true
          },
          compute: async (user) => {
            return {
              fullName: `${user.fisrtName} ${user.lastName}`,
            }
          }
        })
      ],
    },
  }
}
```

In the previous example, ``fieldsProjection`` represents the set of computed fields, ``requiredProjection`` represents the set of fields that are required for processing, and it ``computes`` the function that receives the fields on the data source as input and must provide the computed fields downstream of the processing as output.

Note that this middleware uses the [Projection Dependency Middleware](./projection-dependency.md) described above with a composition and reuse logic.