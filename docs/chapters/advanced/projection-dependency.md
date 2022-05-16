# Projection Dependency

The concept of **projection dependency** consists of having some fields of an entity linked to others by a dependency so, when the first are selected in a projection, the system must always and automatically select the second ones.

Typetta offers the possibility to create a middleware that allows you to easily define a projection dependency. Here is an example in which, when the ``fullName`` field is requested, the middleware forces the ``firstName`` and ``lastName`` fields to be added to the projection:

```typescript
const entityManager = new EntityManager({
  overrides: {
    user: {
      middlewares: [
        projectionDependency({
          fieldsProjection: {
            fullName: true,
          },
          requiredProjection: {
            firstName: true,
            lastName: true,
          },
        }),
      ],
    },
  }
}
```

The use of this middleware is not particularly frequent in and of itself, but it is extremely useful in the creation of other middleware. For example, it allows you to construct [computed middleware fields](./computed-fields), allowing for the definition of virtual fields that are the result of the processing of one or more fields of the historicised entity.
