# Direct access to the database

Typetta's philosophy is to **standardise**, **simplify** and **typify** everything that can be shared among the various data sources and at the same time not take away any possibility from the user in the use of the **advanced features** of the underlying databases.

If a user needs a particular feature provided only by one of the supported drivers, with its specific syntax, they must be able to do so without having to give up all the other facilities that Typetta offers. This approach follows the general principle that has been adhered to in the design of the entire system: adding complexity for the user only when and where they need it.

Typetta therefore offers the user the possibility to create specific queries at different levels:
  - [Driver-dependent filters](#driver-dependent-filters)
  - [Driver-dependent sorts](#driver-dependent-sorts)
  - [Driver-dependent updates](#driver-dependent-updates)
  - [Raw queries](#raw-queries)

## Driver-dependent filters

All APIs that receive the `filter` parameter accept, at the user's discretion, a function that allows the filter to be applied using the references, syntax and potential of the underlying driver.

This approach allows you to access the potential of the database in use without sacrificing all the other features that Typetta offers, specifically the projection mechanism, the resolution of relationships and the typing of results. A more detailed description of this feature is provided in the [filter usage section](filters#advanced-driver-dependent-filters) of this guide.

## Driver-dependent sorts

As with the filters, all APIs that receive the `sorts` parameter accept, at the user's discretion, a function that allows for sorting using the references, syntax and potential of the underlying driver. A more detailed description of this feature is provided in the [sorting usage section](sorts#advanced-driver-dependent-sorts) of this guide.

## Driver-dependent updates

The third customisation option that makes use of the direct functions of the driver is the definition of the `changes` parameter of the `updateOne` and `updateAll` APIs.

This possibility is exemplified in pseudo-code below:
```typescript
await entityManager.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: (/* driverRefs... */) => {
    // ...something driver specific that returns a driver changes
  }
})
```

### MongoDB

Since the MongoDB driver is developed through the [official MongoDB Node Driver](https://docs.mongodb.com/drivers/node/current/){:target="_blank"}, creating a specific update object consists of a function returned by `UpdateFilter<TSchema>`.

Let's assume, for example, that you want to use the `inc` operator of MongoDB to increase the value of a numeric field without necessarily reading it beforehand. With the driver-specific changes mechanism, you can write a query as follows:

```typescript
await entityManager.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: () => {
    inc: { ordersCount: 1 }
  }
})
```

### SQL

The SQL driver, as mentioned above, is developed using the popular [KnexJS](https://knexjs.org/){: target="_blank"} query builder. Creating an update query in this case involves invoking a set of methods from the object `Knex.QueryBuilder`.

Let's assume, for example, that we again want to implement an operation to increase a field through the features offered by a PostgreSQL target database. Using the specific changes mechanism, we can create an update as follows:

```typescript
await entityManager.user.udpateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: (builder: Knex.QueryBuilder) => {
    builder.update({ ordersCount: knex.raw('?? + 1', ['ordersCount']) })
    return builder;
  }
})
```

## Raw queries

The last option to use low-level functionality is the `execQuery` API provided directly by the `EntityManager`. It allows you to perform any operation (or more than one), directly using the underlying driver APIs.

Here is a simple example where you directly use the MongoDB driver to create an index on the collection containing the user entity:
```typescript
await entityManager.execQuery(async (dbs, collections) => {
  await collections.user.createIndex({ firstName: 'text' })
})
```

Note that the function receives a first parameter (`dbs` in the example), which is a map of the references to the data sources with which the `EntityManager` is initialised and a second parameter (in the example we called it `collections`) which is a map of the references to the individual data sources of each entity. In this case, `collections` is a map of the MongoDB collections of each entity defined in the application model.

You can also write queries with a return value, the type of which is automatically inferred by the compiler based on the return of the function provided. Below is an example that looks for the presence of an index on a MongoDB collection, the result of which is `true/false`:

```typescript
const firstNameIndexExists = await entityManager.execQuery(async (dbs, collections) => {
  return collections.user.indexExists('firstNameIndex');
})
if (!firstNameIndexExists) {
  await collections.user.createIndex({ firstName: 'text' })
}
```

The `rawQuery` API therefore offers maximum flexibility, to the detriment of all the utility features introduced by Typetta, which in this case only conveys the data to the database. This means that data returned from a direct call to the database is not subject to `Middlewares`, `ScalarAdapters` and any other pre/post processing performed by Typetta.

