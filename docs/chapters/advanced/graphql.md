# Working with GraphQL

GraphQL is a language that allows you to define and query an API and its data model. Exposing an API through a GraphQL endpoint allows you to develop clients that can perform **efficient**, **expressive** and **typed** queries. However, this great result comes at a price: the complexity of creating a back-end capable of satisfying these types of requests and recovering data from the various sources. Typetta comes into play here and is able to simplify the developer's work.

As a fully-typed ORM capable of supporting complex projections and filters, Typetta can be used more in the development of GraphQL resolvers of any back-end library, such as Apollo Server, NestJS, or Express.

  - [Why use Typetta with GraphQL?](#why-use-typetta-with-graphql)
    - [End-to-end type safety](#end-to-end-type-safety)
    - [A unique model](#a-unique-model)
    - [Convenient, concise and expressive](#convenient-concise-and-expressive)
    - [Optimised data access](#optimised-data-access)
    - [Safety](#safety)
  - [Anatomy of a Resolver](#anatomy-of-a-resolver)
  - [Typetta in the implementation of resolvers](#typetta-in-the-implementation-of-resolvers)

## Why use Typetta with GraphQL?
Typetta was born from many years of experience in the development of GraphQL back-ends and consequently it is most useful in combination with this technology.

### End-to-end type safety
Using both technologies, it is possible to create a completely type-safe stack, from the database to the front end. This increases system productivity by reducing errors and facilitating maintenance.

### A unique model
Typetta allows for the definition of a data model directly in GraphQL language. Unlike most other ORMs, you can then share the data model with the API model and speed up back-end development, allowing the developer to decide whether and when to split the two tiers and invest time in translation from one to the other.

### Convenient, concise and expressive
Typetta shares many of the key concepts with GraphQL and therefore allows you to implement resolvers in a clear, concise and fast way, increasing the developer's productivity.

### Optimised data access
A typical problem in loading data into a GraphQL backend is due to the performance of N+1 queries. Thanks to the use of [DataLoader](https://github.com/graphql/dataloader){:target="_blank"} technology, this is automatically resolved by Typetta and is not a critical issue.

### Safety
One of the most critical aspects in developing a GraphQL backend is creating a security layer that regulates data access no matter where graph navigation begins. To do this, the definition of security policies must necessarily be coupled to the data model. Typetta offers the possibility to define a [security](./security.md) level directly from the `DAOContext` in a very simple and meaningful way.

## Anatomy of a Resolver

A resolver is a function that populates the data of each individual field of a GraphQL request. It represents the implementation of GraphQL operations in the back-end application.

Let's assume a GraphQL endpoint with the following schema:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  posts: [Post!]
}

type Post {
  id: ID!
  userId: ID!
  content: String!
}

type Query {
  users: [User!]
}
```

The resolver of the `user` query is as follows:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      const users = //users loading
      return users
    },
  },
}
```

To ensure efficiency and correctness, the user loading operation must load from the source of all the data and only the required fields by analysing the content of the `info` parameter contained in the AST schema of the request.

Since the `User` type also contains a `posts field: [Post!]`, you must specify an additional resolver capable of loading all the posts of each user:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      const users = //users loading
      return users
    },
  },
  User: {
    posts: async (parent, args, context, info) => {
      const posts = //posts with userId == parent.id loading
      return posts
    },
  }
}
```

The implementation of the two functions above is the minimum requirement to correctly implement the GraphQL `user` query resolution logic. Note that this implementation entails some possible difficulties:

- In both resolvers, the `info` field must be interpreted to precisely determine the required fields.

- In the `posts` resolver, you must load all posts whose userId is equal to the user's id, which is present in the `parent.id` parameter.

- If the user selects the `posts` field, it is still necessary to make sure to load the `id` field of the user necessary for the resolution of the relationship.

- The `posts` resolver is invoked for each `user` resolver result, which can generally result in a high number of queries to the data source.


## Typetta in the implementation of resolvers

Using Typetta, the implementation of the aforementioned resolvers is extremely simple, as shown in the following example:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      return context.dao.user.findAll({ projection: info });
    },
  }
}
```

The code is extremely simple and concise as Typetta takes care of the complexities described above. In particular:

- The `projection` is automatically derived from the `info` parameter, including the part regarding connected entities and the fields needed to resolve all relationships.

- Connected entities are loaded automatically, so it is not necessary to implement all their resolvers (specifically `User.posts`).

- The loading of the connected entities is carried out efficiently, using the dataloaders and is therefore immune to the N+1 problem.




