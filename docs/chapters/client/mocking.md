# Mocking

The ability to create a layer of access to mock data can be very useful to accelerate the development cycle of an application by helping to eliminate the dependency between the development of the application logic that a model uses and how this model translates on the database constructs used.

In a model-driven design context, it is therefore extremely convenient to be able to design the data model directly in GraphQL language and subsequently delegate the design of the underlying database.

The mocking functionality is also useful for testing purposes.

  - [Mocking the entire context](#mocking-the-entire-context)
  - [Mocking some data sources](#mocking-some-data-sources)
  - [Implementation details](#implementation-details)

## Mocking the entire context

To create a fully mock context, Typetta provides a utility function, generated similarly to the ``DAOContext``, which receives exactly the same parameters as its constructor, excluding references to the data source.

```typescript
const daoContext = mockedDAOContext();
```

The ``DAOContext`` thus obtained can be used in the same way as that already described in the previous chapters, making the presence or otherwise of the data source transparent to the rest of the system. The mock data source will start empty, with no data and no structure.

Note that the creation of a mock context allows the use of entities declared in the data model as ``@entity`` but without the annotation of the specific driver ``@mongodb`` or ``@sql``. This is particularly useful in contexts where you want to use Typetta even before designing the database in which you want to historicise the data.

For entities declared only as ``@entity``, the DAO that is produced will appear and function like a DAO accessing MongoDB, and the same applies for entities declared as ``@entity @mongodb``. For entities declared as ``@entity @sql``, by contrast, a DAO with SQL database access capabilities will be produced.

If there are entities of the type ``@entity @sql``, since access to data on relational databases requires the presence of previously created tables, it is necessary to call an additional ``createTables`` initialisation method on the mock ``DAOContext``.Below is an example:

```typescript
const daoContext = mockedDAOContext();
daoContext.createTables();
```

## Mocking some data sources

In some cases, it may be useful to create a ``DAOContext`` that has some real and some mock data sources.

The ``mockedDAOContext`` feature allows you to explicitly specify all the data sources foreseen by the data model, exactly as you can do by instantiating the ``DAOContext`` directly. Data sources that are not specified are automatically mocked by the system.

Below is an example in which a default MongoDB database is configured; each additional datasource is automatically mocked by Typetta.

```typescript
const mongoClient = new MongoClient(process.env.MONGODB_URL!);
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

const daoContext = mockedDAOContext({
  mongodb: {
    default: mongoDb,
    // another not specified data source => mocked
  }
});
```

## Implementation details

The implementation of the mock drivers makes use of two third-party libraries that allow you to create a MongoDB database and a SQLite database in the memory, with different implementation details and technical implications.

**MongoDB** uses the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server){: target="_blank"} library, which actually downloads and starts a fully in-memory mongod process. This approach is clearly usable for testing and development purposes, but is not recommended for any production environment.

For **SQL**, by contrast, the official SQLite driver is used, which allows you to use a database entirely in the memory instead of on files. Again, in this case, it is recommended to use it only for testing or development purposes.