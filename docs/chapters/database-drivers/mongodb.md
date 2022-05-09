# MongoDB

Typetta offers full support for **MongoDB** and all compatible document databases. Access to the database is developed using the [official MongoDB Node Driver](https://docs.mongodb.com/drivers/node/current/){:target="_blank"} internally.

All the features of Typetta allow direct access to the driver, ensuring maximum flexibility and fast adoption of the features present in the latest versions of the database.

## How to connect

In line with official documentation, connecting to an instance of MongoDB or to a replica set using the Node JS driver can be implemented as follows:

```typescript
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = await client.db("dbname")
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
```

Note that it is the driver that deals with the connection pooling, that is, each JS Node process usually has to make only one ``connection`` and take only one reference from the ``db`` that can then be reused in each call or procedure. Therefore, it is not recommended to make repeated ``connections``.

## Creation of the EntityManager

Unlike connection, the ``EntityManager`` can be instantiated multiple times and with different parameters. For example, it is advisable to create an ``EntityManager`` for each calling context (for example, each REST or GraphQL call).

The ``EntityManager`` requires as input a reference to the MongoDB database to be accessed to provide access to the various entities of the data model. Here is an example configuration:

```typescript
const entityManager = new EntityManager({
  mongo: {
    default: db,
  },
})
```

And finally a complete example:

```typescript
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = await client.db("dbname")
    const entityManager = new EntityManager({
      mongo: {
        default: db,
      },
    })

    // ...
    // const users = entityManager.user.findAll();
    // ...

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
```
