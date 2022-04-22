# Multi-Tenancy

The management of **multi-tenancy** is an extremely common problem in modern cloud systems and consists of serving multiple users (tenants) with a single software architecture, therefore, as far as Typetta is concerned, a single data access layer.

There are three approaches to managing multi-tenancy:

- **Separate databases**: the database of each tenant is on a database dedicated to them.

- **Separate schemas**: the databases of each tenant are on different schemas of a single database.

- **Partitioning**: all tenants are on a single database and a single partitioned schema thanks to a field called discriminator.

## Partitioning

Using the middlewares mechanism, Typetta offers fully automatic management of the multi-tenancy scenario via partitioning. Here is an example of how to configure a ``DAOContext``:

```typescript
const daoContext = new DAOContext({
  metadata: {
    tenantId: 'user-tenant-id'
  },
  middlewares: [
    tenantSecurityPolicy({
      tenantKey: 'tenantId',
    }),
  ]
}
```

The ``tenantKey`` field, which in the specific example is set as ``tenantId``, identifies the name of the discriminator that each entity of the data model will have and that represents its belonging to a tenant. The ``DAOContext`` must also be initialised with the metadata of the calling user and, in particular, must contain the discriminator defined with the same ``tenantId`` key. Note that, alternatively, you can set the metadata for each operation instead of creating the ``DAOContext``.

The middleware adds the following behaviours to the data access layer:

- All operations that receive an input filter ensure that the user has entered a condition that controls an entity's belonging to its tenant. If the user does not set any filter, the middleware imposes a default filter of the type:

```typescript
{ tenantId: 'user-tentant-id' }
```

- In all write operations, the middleware ensures that the inserted or modified record belongs to the same tenant as the calling user.

This means that, by defining the ``tenantId`` attribute in all the entities of the model, the developer no longer has to worry about setting its value correctly and checking it with each operation.