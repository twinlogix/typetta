# Getting Started

This tutorial allows you to explore all basic Typetta functionalities providing step-by-step examples starting from installation and following with the use of this ORM on a NodeJS Typescript-based project.

  - [Installation](#installation)
  - [Setup](#setup)
  - [The data model](#the-data-model)
  - [Code generation](#code-generation)
  - [A simple application](#a-simple-application)
  - [GraphQL Endpoint](#graphql-endpoint)

## Installation

Typetta is a small-sized package that can be installed using npm on any TypeScript project. It can be very simply added to a project using npm:
```bash
npm install @twinlogix/typetta --save
```

## Setup

Typetta offers a CLI (Command Line Interface) to help you setting up your project. It does not depend on a specific project structure and therefore is fully configurable. For our example, we may consider having a TypeScript project structure like the following:
```
MyProject
 ┣ src
 ┃  ┗ index.ts
 ┣ package.json
 ┗ tsconfig.json
```
All you need is to initialize your project using the following command:
```bash
npx typetta init
```
Question by question, it will guide you through the whole process of setting up a schema, picking a destination to where your artifacts will be generated. At the end of this process all these configurations will be automatically stored in a brand new `typetta.yml` file.

The updated project structure becomes the following:
<pre>MyProject
 ┣ src
 ┃  ┗ index.ts
 ┣ package.json
 ┣ tsconfig.json
 ┗ <b style="color: #bf1c31;">typetta.yml</b></pre>

 You can also create and edit the `typetta.yml` configuration file manually. Please visit the `typetta.yml` [reference documentation](./typetta-yml) for more details. 

## The data model

By default, Typetta looks for your schema in every TypeScript file matching the pattern `**/**.typedefs.ts` and containing a [gql temaplate literals](https://github.com/apollographql/graphql-tag){:target="_blank"}. This behaviour is completely configurable during the setup of your project or editing the `typetta.yml` configuration file.

Inside a `**.typedefs.ts` file, you will have to insert the data model in GraphQL language. For a complete GraphQL syntax guide please refer directly to the official web site [graphql.org](https://graphql.org/learn/){:target="_blank"}.

Typetta relies on customised directives to extend the standard model definitions allowing the developer to specify very useful details linked to the data source. For a complete guide, refer to the section [What is an entity?](../data-model/entities).

Below, you can see the simple definition of a User entity with a first and a last name, that will be stored in a MongoDB database.
```typescript
import gql from 'graphql-tag';

export const typeDefs = gql`
  type User @entity @mongodb {
    id: ID! @id
    firstName: String
    lastName: String
  }
`
```
Adding it to your project you will have a new structure like the following:
<pre>MyProject
 ┣ src
 ┃  ┣ <b style="color: #bf1c31;">user.typedefs.ts</b>
 ┃  ┗ index.ts
 ┣ package.json
 ┣ tsconfig.json
 ┗ typetta.yml
 </pre>

## Code generation

With Typetta, using a standard language such as GraphQL to model the application enables the developer to use many third-party tools and libraries. As a consequence, developing an application becomes a much quicker and more productive experience.

Code generation in Typetta relies on [GraphQL Code Generator](https://www.graphql-code-generator.com){:target="_blank"}, a very customizable and extensible library. GraphQL Code Generator enables the developer to choose from many standard generators as well as our embedded generators that automatically provides a lot of helpers to make your data access layer powerful and completely type safe.

Typetta already includes all default GraphQL Code Generator dependencies and incapsulate it in the Typetta CLI, that gives a better developer experience hiding a lot of technicalities. Anyway, being in a standard GraphQL context, you are free to add some more plugins using GraphQL Code Generator directly.

The `typetta init` command automatically adds a new script to your `project.json` file to start the generation process. Now let's carry out our first code generation by running the following command:

```bash
npm run generate
```

Using the standard setup, the code generation command will create a new directory *src/generated* with all Typetta generated files. In the default configuration you will find five different files:

- `models.types.ts`: containing the TypeScript definition of all types of your applications, including your models and automatically generated filters, projections and sorts.
  
- `typetta.ts`: containing the entire ORM in terms of a list of DAOs and an Entity Manager to access al your data in a type safe way.
  
- `operations.ts`: an optional GraphQL definition of CRUD operations and inputs, useful to create a GraphQL Endpoint to directly espose your data layer.
  
- `resolvers.types.ts`: a TypeScript definition of all the resolvers related to the previous GraphQL schema.
  
- `resolvers.ts`: the default implementation of the standard CRUD resolvers that you can easily use to start your GraphQL server.

Your project structure will finally be the following:
Adding it to your project you will have a new structure like the following:
<pre>MyProject
 ┣ src
 ┃  ┣ <b style="color: #bf1c31;">generated</b>
 ┃  ┃  ┣ <b style="color: #bf1c31;">models.types.ts</b>
 ┃  ┃  ┣ <b style="color: #bf1c31;">typetta.ts</b>
 ┃  ┃  ┣ <b style="color: #bf1c31;">operations.ts</b>
 ┃  ┃  ┣ <b style="color: #bf1c31;">resolvers.types.ts</b>
 ┃  ┃  ┗ <b style="color: #bf1c31;">resolvers.ts</b>
 ┃  ┣ user.typedefs.ts
 ┃  ┗ index.ts
 ┣ package.json
 ┣ tsconfig.json
 ┗ typetta.yml
 </pre>

## A simple application

The following initial Typetta example writes and reads an entity on a MongoDB database (on a SQL DB it would be pretty much the same). This and other examples are available in a dedicated repository [https://github.com/twinlogix/typetta-examples](https://github.com/twinlogix/typetta-examples){:target="_blank"}.

First things first... open a connection to the MongoDB database using the official Driver:

```typescript
import { MongoClient } from 'mongodb';
import { EntityManager } from './generated/typetta';

const main = async () => {
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URL!);
  const mongoDb = mongoConnection.db(process.env.MONGODB_DATABASE_NAME);
};
main();
```

Let's create our first EntityManager, our first Typetta code-generated class. This class represents the central repository for all entities of the data model.

```typescript
const entityManager = new EntityManager({
  mongo: {
    default: mongoDb
  }
});
```

It's now time to do our first simple CRUD operations on the User entity.

```typescript
const user1 = await entityManager.user.insertOne({
  record: {
    firstName: "Mattia",
    lastName: "Minotti"
  }
});

const user2 = await entityManager.user.insertOne({
  record: {
    firstName: "Edoardo",
    lastName: "Barbieri"
  }
});

const users = await entityManager.user.findAll();
users.forEach(user => console.log(`${user.firstName} ${user.lastName}`));
```

Our personal version of the Hello World example will print the following 2 names on the console:
```
Mattia Minotti
Edoardo Barbieri
```

This is the complete source code for this initial Typetta example connected to a MongoDB:

```typescript
import { MongoClient } from 'mongodb';
import { EntityManager } from '../generated/typetta';

const main = async () => {

  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URL!);
  const mongoDb = mongoConnection.db(process.env.MONGODB_DATABASE_NAME);

  const entityManager = new EntityManager({
    mongo: {
      default: mongoDb
    }
  });

  const user1 = await entityManager.user.insertOne({
    record: {
      firstName: "Mattia",
      lastName: "Minotti"
    }
  });

  const user2 = await entityManager.user.insertOne({
    record: {
      firstName: "Edoardo",
      lastName: "Barbieri"
    }
  });

  const users = await entityManager.user.findAll();
  users.forEach(user => console.log(`${user.firstName} ${user.lastName}`));

};
main();
```
## GraphQL Endpoint

In addition to providing a completely auto-generated data access layer, in a few minutes Typetta allows you to create a fully working GraphQL Endpoint with all the CRUD operations to manage the entities of your data model.

While being extremely fast, Typetta's solution is fully compatible with all GraphQL servers on NodeJS (GraphQL Yoga, Apollo Server, Mercurius, express-graphql). What you need to do is to instance the GraphQL Server of your choice provinding the autogenerated typedefs and resolvers. 

Following an example using Apollo Server:

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

With so few lines of code you can get a GraphQL Server that provides CRUD queries and mutations for each of the entities in your model. Adding some kind of authentication as a middleware you have a ready to use GraphQL back-end with nearly zero custom implementations. Cool, isn't it?!