# Mocking

The ability to create a layer of access to mock data can be very useful to accelerate the development cycle of an application by helping to eliminate the dependency between the development of the application logic that a model uses and how this model translates on the database constructs used.

In a model-driven design context, it is therefore extremely convenient to be able to design the data model directly in GraphQL language and subsequently delegate the design of the underlying database.

The mocking functionality is also useful for testing purposes.

  - [Mocking some data sources](#mocking-some-data-sources)
  - [Mock customization](#mock-customization)
  - [Implementation details](#implementation-details)

## Mocking some data sources

In some cases, it may be useful to create an `EntityManager` that has some real and some mock data sources. Every entity associated with a data source instantied with the literal `'mock'` will be mocked.

Below is an example in which a default MongoDB database is mocked; the other data source instead is a real MongoDB instance.

```typescript
const mongoClient = new MongoClient(process.env.MONGODB_URL)
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME)

const entityManager = new EntityManager({
  mongodb: {
    default: 'mock',
    other: mongoDb,
  },
})
```

Every operation on entities belonging to the default MongoDB data source will be redirected to an in-memory implementation and will not use any MongoDB database. You can easily mock your entire data access layer mocking every data source. In this case you don't need a real database at all. 

You can also call `mock.clearMemory()` to clear all the data on the mocked entities, for example after each unit test.

## Mock customization

There are two additional configurations to make the mock work with your model:

- `mock.compare`: this is a function you can implement to specify how your custom scalars are compared to each others. This is needed to filter and sort entities. Following an example:

```typescript
class MyClass {
  public value: number = 0
}
mock.compare = (l, r) => {
  if (l instanceof MyClass && r instanceof MyClass) {
    return l.value - r.value
  }
}
```

- `mock.idSpecifications`: this is a map of objects where keys are the names of the ID scalars and values contain two functions. The first, named `generate`, defines how to generate the IDs, in particular if they are declared as `@id(from: "db")`. The second, named `stringify`, defines how to transform them into strings in order to support in-memory indexing.

```typescript
mock.idSpecifications = {
  MongoID: {
    generate: () => new ObjectId(),
    stringify: (t: unknown) => (t as ObjectId).toString(),
  },
}
```
## Implementation details

The implementation of the mock driver is lightweight and keeps all the data in memory. It doesn't require third-party dependencies and it's perfect for testing purposes. However, this implementation does not support database highly specific features, like those described here: [Direct access to the database](raw-databse-access).

In order to have a mock that supports all the database specific features it is possible to use third party tools to provide the mocked data sources:

For **MongoDB** it can be used the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server){: target="\_blank"} library, which actually downloads and starts a fully in-memory mongod process. This approach is clearly usable for testing and development purposes, but is not recommended for any production environment.

For **SQL**, by contrast, the official SQLite driver can be used, which allows you to use a database entirely in the memory instead of on files. Again, in this case, it is recommended to use it only for testing or development purposes.

