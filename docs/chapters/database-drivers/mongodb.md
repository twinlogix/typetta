# MongoDB

Typetta offre un supporto completo a **MongoDB** e a tutti i database documentali compatibili. L'accesso al database è sviluppato utilizzando internamente il [MongoDB Node Driver ufficiale](https://docs.mongodb.com/drivers/node/current/){:targte=_Blank}. 

Tutte le funzionalità di Typetta permettono l'accesso diretto al driver, garantendo massima flessibilità e una veloce adozione delle funzionalità presenti nelle versioni più recenti del database.

## Creazione della connessione

In accordo con la documentazione ufficiale, la connessione add un'istanza di MongoDB o a un replica set utilizzando il driver Node JS può essere implementata come segue:

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

Si noti che è il driver ad occuparsi del connection pooling, quindi ogni processo Node JS deve generalmente effettuare una sola ``connect`` e prendere un solo riferimento al ``db`` che può poi riutilizzare in ogni chiamata o procedura. Non è quindi consigliabile effettuare ``connect`` ripetute.

## Creazione del DAOContext

Contrariamente alla connessione, il ``DAOContext`` può essere istanziato più volte e con parametri diversi. E' ad esempio consigliabile istanziare un ``DAOContext`` per ogni contesto chiamante (ogni chiamata REST o GraphQL ad esempio).

Il ``DAOContext`` richiede in input un riferimento al database MongoDB a cui dovrà accedere per fornire l'accesso alle varie entità del modello dati. Di seguito un esempio di configurazione:

```typescript
const daoContext = new DAOContext({
  mongo: {
    default: db,
  },
})
```

E infine un esempio completo:

```typescript
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = await client.db("dbname")
    const daoContext = new DAOContext({
      mongo: {
        default: db,
      },
    })

    // ...
    // const users = daoContext.user.findAll();
    // ...

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
```