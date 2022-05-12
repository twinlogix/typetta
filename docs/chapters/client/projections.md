# Projections

A **projection** is a subset of the fields in a model entity that are requested by a query, whether they are from the parent entity, an embedded entity, or a linked entity. Typetta leverages the projection mechanism to ensure **efficient** and **type-safe** data access.

  - [Default projections](#default-projections)
  - [Explicit projections](#explicit-projections)
  - [Projections and relationships](#projections-and-relationships)
  - [The importance of projections](#the-importance-of-projections)
    - [Projections and GraphQL](#projections-and-graphql)
    - [Typing](#typing)

## Default projections

In each query that returns a list of records, the results include by default:
- **All** scalars and embedded entities with their scalars
- **None** of the relationships

This basic behaviour is justified by the fact that the system retrieves by default all the information contained in the entity table/collection in a single query and does not execute further queries to retrieve the linked entity information unless explicitly requested.

Taking the following application model as an example:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  address: Address
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}

type Address {
  street: String
  city: String
  district: String
  zipcode: String
  country: String
}
```

A query that does not specify any explicit projections such as the following:

```typescript
const users = await entityManager.user.findOne({ filter: { firstName: "Mattia" } });
```

Returns an object of the type:

```typescript
{
  id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    street: "Via Piave 48",
    city: "Milan",
    district: "MI",
    zipcode: "20019"
    country: "Italy"
  }
}
```


## Explicit projections

All the operations that return records also include the possibility of making a projection explicit, that is, a list of the requested fields. To do so, each API allowing for this provides an optional parameter called `projection`.

Below is a search query for a user who requires only their first and last name:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    firstName: "Mattia"
  },
  projection: {
    firstName: true,
    lastName: true
  }
});
```

The previous query will return an object such as the following:
```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
}
```

Similarly, you can select the fields of an embedded entity, e.g. the following query:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    firstName: "Mattia"
  },
  projection: {
    firstName: true,
    lastName: true,
    address: {
      city: true
    }
  }
});
```

The following result will be returned:

```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    city: "Milan"
  }
}
```

Although it is good practice to always specify the complete list of required fields, both for reasons of efficiency and correctness, for embedded entities it is also possible to select the entire entity in a projection with the following syntax:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    firstName: "Mattia"
  },
  projection: {
    firstName: true,
    lastName: true,
    address: true
  }
});
```

In this case the result will be:

```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    street: "Via Piave 48",
    city: "Milan",
    district: "MI",
    zipcode: "20019"
    country: "Italy"
  }
}
```

## Projections and relationships

By specifying an explicit projection, the user can decide to select the relationships they want to load. From the point of view of projections, relationships are managed exactly like embedded entities.

Given the previous application model, it is therefore possible to select a user with their posts:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true
    }
  }
});
```

The system supports the possibility of requesting fields with a desired depth; it is therefore possible to load, for example, a user, their posts and, for each post, once again the user:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      user: {
        firstName: true,
        lastName: true
      },
      content: true
    }
  }
});
```

Obviously requesting a relationship has a very different effect on the interaction with the underlying database. Indeed, the system will have to support all the queries necessary to load the data, on all the tables/collections involved. However, Typetta takes care of making this complexity completely transparent to the user.

## The importance of projections

As mentioned above, the correct use of projections is important both for efficient access to the data and for the correct management of return types.

### Projections and GraphQL
The GraphQL philosophy, from which Typetta is strongly inspired, requires that each request explicitly and precisely defines the necessary fields. This allows you to perform the minimum number of queries required to retrieve the data that is always loaded in *eager* mode.

To facilitate Typetta's integration with GraphQL backends, each data retrieval API can receive a ``GraphQLResolveInfo`` object that contains the AST of a GraphQL request instead of an explicit projection. It is therefore the system that automatically transforms user input into a Typetta projection.

Here is an example of a GraphQL resolver implemented using an EntityManager:

```typescript
Query: {
  user: async (parent: never, args: never, ctx: GraphQLContext, info: GraphQLResolveInfo) => {
      return await ctx.entityManager.user.findOne({
        filter: {
          id: ctx.user.id
        },
        projection: info,
      })
    }
  }
}
```

### Typing
In most programming languages, access to data through DAO involves creating objects called data transfer objects (DTOs), which are objects that define which portion or composition of the historicized data is returned by an API. Defining DTOs is an expensive process in terms of both development and maintenance.

The TypeScript language, thanks to its advanced *type* concept and its capacity for manipulation, offers us the opportunity to outdo the DTO design pattern and offer the developer a tool capable of reconciling productivity and type-safety.

Specifically, each Typetta API returns a type of data that depends on the projection set as input, both in terms of the set of fields and their related options.

Taking the above application model as an example, with the following API call:

```typescript
const user = await ctx.entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true
    }
  }
})
```

The `user` constant will have as its type:

```typescript
type GeneratedUserType = {
  firstName?: string,
  lastName?: string,
  posts?: {
    id: string,
    content: string
  }[]
} | null
```

This means that at the compiler (and IDE controls/hints) level, you can access, for example, the `firstName` and `lastName` fields of the result, but not the `address` field, and all of this without the need to explicitly define a DTO and keep it aligned with the application model.
