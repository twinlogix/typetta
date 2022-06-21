# The Data API

Typetta is the only open-source library that allows you to **expose your database via a fully auto-generated GraphQL API**. 

Unlike other services that have the same goal, being just a small and light package you can use Typetta on your preffered NodeJS stack and with your own infrastructure.

There are several ways a GraphQL API of your data can be useful for your organization:

- As a POC back-end, for systems that only needs CRUD API over a simple data model.

- As a private API to access your data machine-to-machine, with a standard query language that is completely agnostic about the underlying database technology.

- As a flexible and extensible starting point to build your custom GraphQL back-end.

Having such an auto-generated  with just a few lines of code allows you to focus on your business. 

## Start your GraphQL server less then a minute

Typetta provide ready-to-use typedefs and resolvers that you can easily use to create a GraphQL Endpoint with all the CRUD operations to manage the entities of your data model. The Typetta solution is fully compatible with all GraphQL servers on NodeJS (GraphQL Yoga, Apollo Server, Mercurius, express-graphql).

Following an example using Apollo Server and generated code from the default `src/generated` directory:

```typescript
import { ApolloServer } from 'apollo-server'
import { resolvers } from './generated/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from './generated/operations'
import schemaTypeDefs from './user.typedefs'
import { typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import { EntityManager } from './generated/typetta'

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    inputTypeDefs,
    schemaTypeDefs,
    typettaDirectivesTypeDefs,
  ]),
  resolvers,
  context: () => ({ entityManager: new EntityManager() }),
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
```

Typedefs and resolvers are pretty standard components of a GraphQL Schema. You can pass them directly to your server and start a GraphQL Endpoint with default CRUD operations, but you can also compose them in a more custom implementation, using partially generated code and overring what you need. 

This gives you maximum flexibility in the implementation of your backend. Adding some kind of authentication as a middleware, you will have a ready to use GraphQL back-end with nearly zero custom implementations.