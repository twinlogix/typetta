# SQL

Typetta provides comprehensive support for major **SQL** databases, including PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, Oracle, and Amazon Redshift. Such extensive support is ensured by the fact that, internally, the [KnexJS](https://knexjs.org/){:target="_blank"} library is used. KnexJS is an open.source query-builder that is widely used in Node JS and is supported by a large community. With a test coverage greater than 90%, it is also commonly considered a software suitable for use in a corporate setting.

All the features of Typetta allow direct access to a KnexJS instance, ensuring great flexibility and a wide range of features with which to directly access the database.

## How to connect

In line with official documentation, connecting to an SQL database using KnexJS can be implemented as follows:

```typescript
import knex from 'knex'

async function run() {
  const knexInstance = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    }
  });
}
run().catch(console.dir);
```

Note that it is the knex instance that handles connection pooling, so each JS Node process must generally use a single KnexJS instance, configuring it specifically:

```typescript
import knex from 'knex'

async function run() {
  const knexInstance = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    },
    pool: { min: 0, max: 7 }
  });
}
run().catch(console.dir);
```

## Creation of the DAOContext

Unlike connection, the ``DAOContext`` can be instantiated multiple times and with different parameters. For example, it is advisable to create a ``DAOContext`` for each calling context (for example, each REST or GraphQL call).

The ``DAOContext`` requests an input reference to the KnexJS instance that it will use to access the various data model entities. Here is an example configuration:

```typescript
const daoContext = new DAOContext({
  knex: {
    default: knexInstace,
  },
})
```

And finally a complete example:

```typescript
import knex from 'knex'

async function run() {
  const knexInstance = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    },
    pool: { min: 0, max: 7 }
  });

  const daoContext = new DAOContext({
    knex: {
      default: knexInstance,
    },
  })

  // ...
  // const users = daoContext.user.findAll();
  // ...
}
run().catch(console.dir);
```
