# Mocking

The ability to create a layer of access to mock data can be very useful to accelerate the development cycle of an application by helping to eliminate the dependency between the development of the application logic that a model uses and how this model translates on the database constructs used.

In a model-driven design context, it is therefore extremely convenient to be able to design the data model directly in GraphQL language and subsequently delegate the design of the underlying database.

The mocking functionality is also useful for testing purposes.

  - [Mocking some data sources](#mocking-some-data-sources)
  - [Implementation details](#implementation-details)

## Mocking some data sources

In some cases, it may be useful to create a ``DAOContext`` that has some real and some mock data sources. Every entity associated with a data source instantied with the literal ``'mock'`` will be mocked.

Below is an example in which a default mongodb database is mocked; the other data source instead is a real mongodb instance.

```typescript
const mongoClient = new MongoClient(process.env.MONGODB_URL!);
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

const daoContext = new DAOContext({
  mongodb: {
    default: 'mock',
    other: mongoDb
  }
});
```

All the access to entities belonging to the default mongodb data source will be redirected to an in-memory implementation and will not use any mongodb database.


## Implementation details

The implementation of the mock driver is very lightweight and keeps all the data in memory. However, this implementation does not support the feature described here: [Direct access to the database](raw-databse-access).

In order to have a mock that supports all the database specific features it is possible to use third party tools to provide the mocked data sources:

For **MongoDB** it can be used the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server){: target="_blank"} library, which actually downloads and starts a fully in-memory mongod process. This approach is clearly usable for testing and development purposes, but is not recommended for any production environment.

For **SQL**, by contrast, the official SQLite driver can be used, which allows you to use a database entirely in the memory instead of on files. Again, in this case, it is recommended to use it only for testing or development purposes.