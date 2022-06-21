# Entity Manager

  - [How to create an Entity Manager](#how-to-create-an-entity-manager)
  - [Multi-database](#multi-database)
  - [Data Access Object (DAO)](#data-access-object-dao)


The heart of Typetta is a type-safe, self-generated query builder tailor-made to the data model. The best way to start using it is to follow our [Getting Started](../overview/getting-started) guide.

Each time the data model is modified, you can execute a supplied generator that creates and updates all TypeScript types, an EntityManager class and all the related DAOs. These objects allow you to access the data sources in a powerful and type-safe way, using the Typetta query builder.

Simply run the following command to start the generation:

```bash
npx typetta generate
```

It is also possible to run it in *watch mode* so that any change to the GraphQL Schema will automatically trigger a new generation:

```bash
npx typetta generate --watch
```

The main result of the generation process is a component we call `EntityManager`. It is a container for so-called `DAOs`, data access objects that allow you to perform all operations on the entities of the data model.

The role of the EntityManager is absolutely central because it is on it that a whole series of settings can be configured that can modify the behaviour of the entire data access system. It also represents a replicable unit, so it is possible to instantiate any number of EntityManagers, each with different settings.

## How to create an Entity Manager

Instantiating the `EntityManager` is very simple. The only mandatory configurations are the SQL and MongoDB data sources (both if you are using both databases, or just the one you need).

Note that Typetta implements two different drivers to connect to the supported databases, one is built on the [MongoDB native driver](https://docs.mongodb.com/drivers/node/current/){:target="_blank"} and the other on [KnexJS](https://knexjs.org/){:target="_blank"}, one of the most consolidated NodeJS query builder libraries for SQL databases.

Here is an example that shows how to instantiate an EntityManager with two data sources, one SQL and one MongoDB:

```typescript
import { MongoClient } from 'mongodb';
import knex from 'knex'
import { EntityManager } from './dao';

const mongoClient = new MongoClient(process.env.MONGODB_URL!);
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

const knexInstance = knex({
  client: process.env.SLQ_DATABASE_TYPE, // 'pg' | 'mysql' | ...
  connection: process.env.SLQ_DATABASE_URL
})

const entityManager = new EntityManager({
  mongodb: { default: mongoDb },
  knex: { default: knexInstance },
});
```

The `EntityManager` is a centralised access point to data, which is why it is usually saved in the context of an application or service and used throughout its life cycle.

## Multi-database

The mechanism for defining data sources in the EntityManager allows for the possibility of indicating any number of MongoDB databases and KnexJS instances. To indicate additional data sources in addition to the default ones, simply add values to the `mongo` and `knex` key value maps, as shown below:

```typescript
const entityManager = new EntityManager({
  mongodb: {
    default: primaryMongoDb,
    secondary: secondaryMongoDb,
  },
  knex: {
    default: primaryKnexInstance,
    secondary: secondaryKnexInstance
  },
});
```

At this point, each stored entity can refer to a data source (therefore a database) by specifying its logical name. If no explicit data source is specified, the default, mandatory one will always be taken.

```typescript
type User @entity @mongodb(source: "secondary") {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @sql {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

In the above example, the `User` entity resides on the MongoDB data source with a `secondary` key, while the `Post` entity resides on the SQL data source with a `default` key.

Note that different entities can reside in different data sources, even heterogeneous in type (MongoDB / SQL), and can still be related to each other. Typetta manages entity resolution from different data sources automatically and in a way that is totally transparent to the user. The only limitation is related to transactions, which cannot be performed on entities stored on different data sources.

## Data Access Object (DAO)

The given code generator automatically creates a series of DAOs, one for each stored entity of the data model. Let's assume we have a simple schema like the one below:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @sql {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

The generated EntityManager will automatically contain the references to the two DAOs that correspond to the two stored entities. Obtaining a reference to a DAO is really simple: you can access the EntityManager as an associative array as follows:

```typescript
const userDAO = entityManager.user;
const postDAO = entityManager.post;
```
