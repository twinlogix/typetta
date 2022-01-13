# Getting Started

Si seguito un tutorial che permette di esplorare le funzionalità base di Typetta con un semplice esempio passo passo di come installare ed utilizzare questo ORM su un qualsiasi progetto NodeJS su linguaggio TypeScript.

  - [Installazione](#installazione)
  - [Struttura del progetto](#struttura-del-progetto)
  - [Il modello applicativo](#il-modello-applicativo)
  - [I generatori di codice](#i-generatori-di-codice)
  - [Una semplice applicazione](#una-semplice-applicazione)

## Installazione

Typetta è un pacchetto dalle dimensioni contenute che può essere installato tramite npm su qualsiasi progetto TypeScript. L'unica dipendenza di cui necessita esplicitamente è GraphQL. Entrambi si possono aggiungere al progetto molto semplicemente tramite npm:
```bash
npm install @twinlogix/typetta --save
```

## Struttura del progetto

Typetta non richiede alcuna particolare struttura del progetto su cui viene utilizzato ed è quindi completamente configurabile. Ipotizziamo quindi di avere un progetto TypeScript di base con la seguente struttura:
```
MyProject
 ┣ src
 ┃  ┗ index.ts 
 ┣ package.json
 ┗ tsconfig.json
```

Tutto ciò che serve è aggiungere un modello applicativo in linguaggio GraphQL, tipicamente in un file di nome *schema.graphql* nella directory src e un file di configurazione *codegen.yml* nella root per la generazione di codice. 

La sruttura del progetto aggiornata risulta quindi la seguente:
<pre>
MyProject
 ┣ src
 ┃  ┣ <b style="color: #bf1c31;">schema.graphql</b>
 ┃  ┗ index.ts 
 ┣ package.json
 ┣ tsconfig.json
 ┗ <b style="color: #bf1c31;">codegen.yml</b>
</pre>

## Il modello applicativo

All'interno del file *schema.graphql* andrà inserito il modello applicativo in linguaggio GraphQL. Per una guida completa della sintassi GraphQL fare riferimento al sito ufficiale [graphql.org](https://graphql.org/learn/){:target="_blank"}.

Typetta utilizza alcune direttive customizzate per aumentare l'espressività del modello e permettere allo sviluppatore di specificare dettagli utili alla connessione alla sorgente dati. Fare riferimento alla sezione [Cos'è un'entità?](../data-model/entities) per una guida completa.

Di seguito la semplice definizone di un Utente con nome e cognome:
```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
}
```

## I generatori di codice

L'utilizzo di un linguaggio di modellazione standard come GraphQL mette a disposizione dello sviluppatore una serie di strumenti e librerie di terze parti che possono essere utilizzati in simbiosi con Typetta e rendono l'esperienza di sviluppo estremamente veloce e produttiva.

Lo strumento principale di cui fa uso Typetta è un generatore di codice altamente customizzabile ed estensibile che si chiama [GraphQL Code Generator](https://www.graphql-code-generator.com){:target="_blank"}. Grazie ad esso lo sviluppaore ha a disposizione un'ampia gamma di generatori standard per i più diffusi linguaggi di programmazione, oltre ad un generatore di nostra creazione per produrre i singoli DAO in linguaggio TypeScript, che serviranno ad accedere al database.

Di seguito i comandi per installare questo strumento ed il generatore di base per il linguaggio TypeScript:
```bash
npm install @graphql-codegen/cli --save-dev
npm install @graphql-codegen/typescript --save-dev
```
Si noti che le due dipendenze vengono aggiunte come dev dependencies e quindi non influiranno sulla dimensione del progetto compilato.

A questo punto occorre configurare lo strumento di generazione creando il file *codegen.yml* come anticipato in precedenza. Di seguito la configurazione minima:

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

Per agevolare il processo di generazione può essere utile aggiungere uno specifico script nel file *package.json*:
```json
{
  "scripts": {
    "generate": "graphql-codegen"
  }
}
```

A questo punto è possibile avviare la prima generazione eseguendo il comando appena aggiunto:

```bash
npm run generate
```

Data la configurazione d'esempio di cui sopra, il comando di generazione produrrà due distinti file *src/models.ts* contentente i tipi TypeScript relativi a tutte le entità di modello presenti nello *schema.graphql* e un file *src/dao.ts* contenente i DAO e il DAOContext che vedremo in seguito come utilizzare.

## Una semplice applicazione

Di seguito si mostra un utilizzo minimale di Typetta per la scrittura e lettura di un'entità su un database MongoDB (del tutto simile l'utilizzo per database SQL). 

Come prima cosa occorre creare connessione e database MongoDB utilizzano il driver ufficiale:

```typescript
import { MongoClient } from 'mongodb';
import { DAOContext } from './dao';

const main = async () => {
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URL!);
  const mongoDb = mongoConnection.db(process.env.MONGODB_DATABASE_NAME);
};
main();
```

Dopodiché possiamo già istanziare un DAOContext, prima classe generata da Typetta che rappresenta il repository centrale di tutte le entità del modello applicativo.

```typescript
const daoContext = new DAOContext({
  mongo: {
    default: mongoDb
  }
});
```

A questo punto possiamo iniziare ad interagire con il database con alcune semplici operazioni CRUD sull'entità User che abbiamo definito nel modello applicaitvo.

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

Questa semplicissima porzione di codice stamperà a console il seguente testo:
```
Mattia Minotti
Edoardo Barbieri
```

Di seguito il codice sorgente completo di questo primo esempio di utilizzo di Typetta con database MongoDB:

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
