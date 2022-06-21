# Relationships

One of the main features of Typetta is the ability to define [relationships](../data-model/relationships) between entities.

  - [Lightweight linked entities](#lightweight-linked-entities)
  - [Filtering linked entities](#filtering-linked-entities)
  - [Filtering by linked entity fields](#filtering-by-linked-entity-fields-soon-available)

## Lightweight linked entities

When an application model contains entities linked to each other, all the reading APIs support the specification of [projections](projections) that allow you to navigate the graph of the relationships however you choose.

Taking the following application model as an example:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
  categoriesId: [ID!]!
  categories: [Category!]! @innerRef
}

type Category @entity @mongodb {
  id: ID! @id
  name: String!
}
```

You can therefore run a user's read API, including its posts and, for each post, its categories:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  }
});
```

The result of such a query will be as follows:
```typescript
{
  id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  firstName: "Minotti",
  lastName: "Mattia",
  posts: [
    {
      id: "ddc4d722-dc86-4648-ba18-06e37423624c",
      content: "Today is a fantastic day!",
      categories: [{
        id: "b169110c-f620-404f-84c7-a1b594dc36bfe",
        name: "mood"
      }]
    },
    {
      id: "19f0bc5f-93f3-45f1-85be-8050db5338c9",
      content: "Well done, my friend.",
      categories: [{
        id: "de81b41f-544d-481b-b8be-eeba4e02cda2",
        name: "social"
      }]
    }
  ]
}
```

## Filtering linked entities

When you select a linked entity through the specification of a projection, by default, the system returns all linked entities. The above example loads all posts for each user, regardless of their number.

It often happens that for performance or application reasons, it is also necessary to limit or filter the linked entities. Typetta offers this possibility through the `relations` parameter present in each read API. `relations` is a key-value map that allows you to express, for each relationship, the parameters of `skip` reading, `limit`, `filter`, `sort` and, recursively, `relations`. In practice, it allows you to customise the request for recovery of the linked entities as could be done with a new reading.

Note that the possibility of specific `projection` is not given as the projections are already defined having been inserted into the API call.

Below is an example in which, compared to the previous reading, only one post is requested for each user:

```typescript
const user = await entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  },
  relations: {
    posts: { limit: 1 }
  }
});
```

Below is a more complex example in which, for each user, only posts containing the word ``friend`` are requested and, for each post, only the categories in alphabetical order.

```typescript
const user = await entityManager.user.findOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  },
  relations: {
    posts: {
      filter: {
        content: { contains: "friend" }
      },
      relations: {
        categories: {
          sorts: [{ name: 'asc' }]
        }
      }
    }
  }
});
```

## Filtering by linked entity fields *[soon available]*

This feature is not yet available and is currently being designed.