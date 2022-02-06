# SQL

Typetta offre un supporto completo ai principali database **SQL**, tra cui PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, Oracle, e Amazon Redshift. Un supporto così ampio è garantito dal fatto che, internamente, viene utilizzata la libreria [KnexJS](https://knexjs.org/){:target="_blank"}. KnexJS è un query-builder open.source estremamente diffuso in ambito Node JS e vanta il supporto di un'ampia community. Con una test coverage maggiore del 90% è inoltre comunemente considerato un software adatto all'utilizzo in ambito enterprise.

Tutte le funzionalità di Typetta permettono l'accesso diretto ad un'istanza KnexJS, garantendo grande flessibilità e un'ampia gamma di funzionalità con cui effettuare un accesso diretto al database.

## Creazione della connessione

In accordo con la documentazione ufficiale, la connessione ad un database SQL utilizzando KnexJS può essere implementata come segue:

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

Si noti che è l'istanza knex ad occuparsi del connection pooling, quindi ogni processo Node JS deve generalmente può utilizzare un'unica istanza KnexJS, configurandola appositamente:

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

## Creazione del DAOContext

Contrariamente alla connessione, il ``DAOContext`` può essere istanziato più volte e con parametri diversi. E' ad esempio consigliabile istanziare un ``DAOContext`` per ogni contesto chiamante (ogni chiamata REST o GraphQL ad esempio).

Il ``DAOContext`` richiede in input un riferimento all'istanza KnexJS che utilizzerà per accedere alle varie entità del modello dati. Di seguito un esempio di configurazione:

```typescript
const daoContext = new DAOContext({
  knex: {
    default: knexInstace,
  },
})
```

E infine un esempio completo:

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