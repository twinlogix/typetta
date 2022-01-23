# Getting Started

This tutorial allows you to explore all basic Typetta functionalities providing step by step examples starting from installation and following with the usage of this ORM on a NodeJS Typescript based project.

  - [Installation](#installation)
  - [Project structure](#project-structure)
  - [The data model](#data-model)
  - [Code generation](#code-generation)
  - [A simple application](#simple-application)

## Installation

Typetta is a small sized package that can be installed using npm on any TypeScript project. The only explicit dependency is GraphQL. Both can be very simply added to a project using npm:
```bash
npm install @twinlogix/typetta --save
```

## Project structure

Typetta does not depend on a specific project structure and therefore can be fully configurable. For our example we can think of having a TypeScript project structure like the following:
```
MyProject
 ┣ src
 ┃  ┗ index.ts 
 ┣ package.json
 ┗ tsconfig.json
```

All you need is to add a data model in GraphQL language, typically found in src directory in a file named *schema.graphql* and also a config file named *codegen.yml* in the root for code generation purposes.

The updated project structure becomes the following:
<pre>
MyProject
 ┣ src
 ┃  ┣ <b style="color: #bf1c31;">schema.graphql</b>
 ┃  ┗ index.ts 
 ┣ package.json
 ┣ tsconfig.json
 ┗ <b style="color: #bf1c31;">codegen.yml</b>
</pre>

## The data model

Inside the file *schema.graphql* you will have to insert the data model in GraphQL language. For a complete GraphQL syntax guide please refer directly to the official web site [graphql.org](https://graphql.org/learn/){:target="_blank"}.

Typetta relies on customized directives to extend the standard model definitions allowing the developer to specify very useful details in binding to the data source. For a complete guide refer to section [Cos'è un'entità?](../data-model/entities).

Here below you can see the simple definition of a User with a first and a last name.
```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
}
```

## Code generation

With Typetta, using a standard language such as GraphQL to model the application enables the developer to use many third party tools and libraries. As a consequence, the developing an application becomes a much quicker and productive experience.

Code generation in Typetta relies on [GraphQL Code Generator](https://www.graphql-code-generator.com){:target="_blank"} a very customizable and extensible library.
GraphQL Code Generator enables the developer to choose between many standard generators as well as our embedded generator that automatically provides DAO in TypeScript language.

Typetta already includes all default dependencies to use the TypeScript generator but it's also possible to add other generators following the official guide.

It's now time to configure with a minimum effort our first *codegen.yml*. This operation will enable the code generation.

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - "typescript"
  src/dao.ts:
    config:
      schemaImport: "./schema.graphql"
      tsTypesImport: "./models"
    plugins:
      - "@twinlogix/typetta"

```

To allow code generation it's also useful to edit the file *package.json* inserting the following script:
```json
{
  "scripts": {
    "generate": "graphql-codegen"
  }
}
```

Now let's do our first code generation running the following command:

```bash
npm run generate
```

Using the above setup, the code generation command will create two files: *src/models.ts* with all TypeScript types included in *schema.graphql* and another file *src/dao.ts* with DAO and DAOContext. This two files will be useful for later.

## A simple application

The following initial Typetta example writes and reads an entity on a MongoDB database (on ab SQL DB would be pretty much the same). This and other examples are available in a dedicated repository [https://github.com/twinlogix/typetta-examples](https://github.com/twinlogix/typetta-examples){:target="_blank"} .

First things first... open a connection to the MongoDB database using the official Driver:

```typescript
import { MongoClient } from 'mongodb';
import { DAOContext } from './dao';

const main = async () => {
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URL!);
  const mongoDb = mongoConnection.db(process.env.MONGODB_DATABASE_NAME);
};
main();
```

Let's do our first DAOContext, our first Typetta code generated class. This class represents the central repo for all entity of the data model.

```typescript
const daoContext = new DAOContext({
  mongo: {
    default: mongoDb
  }
});
```

It's now time do do our first CRUD simple operations on User entity.

```typescript
const user1 = await daoContext.user.insertOne({
  record: {
    firstName: "Mattia",
    lastName: "Minotti"
  }
});

const user2 = await daoContext.user.insertOne({
  record: {
    firstName: "Edoardo",
    lastName: "Barbieri"
  }
});

const users = await daoContext.user.findAll();
users.forEach(user => console.log(`${user.firstName} ${user.lastName}`));
```

Our personal version of Hello World example will print on console the following 2 names:
```
Mattia Minotti
Edoardo Barbieri
```

This is the complete source code for this initial Typetta example connected to a MongoDB:

```typescript
import { MongoClient } from 'mongodb';
import { DAOContext } from './dao';

const main = async () => {

  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URL!);
  const mongoDb = mongoConnection.db(process.env.MONGODB_DATABASE_NAME);

  const daoContext = new DAOContext({
    mongo: {
      default: mongoDb
    }
  });

  const user1 = await daoContext.user.insertOne({
    record: {
      firstName: "Mattia",
      lastName: "Minotti"
    }
  });

  const user2 = await daoContext.user.insertOne({
    record: {
      firstName: "Edoardo",
      lastName: "Barbieri"
    }
  });

  const users = await daoContext.user.findAll();
  users.forEach(user => console.log(`${user.firstName} ${user.lastName}`));

};
main();
```
