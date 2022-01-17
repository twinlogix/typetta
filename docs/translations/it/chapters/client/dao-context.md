# Il Contesto

  - [Come istanziare il DAOContext](#come-istanziare-il-daocontext)
  - [Multi-database](#multi-database)
  - [DAO](#dao)

Il cuore di Typetta è costituito da un query builder type-safe e auto-generato tagliato sul modello applicativo. Il modo migliore per iniziare ad utilizzarlo è seguire tutti i passi del [Getting Started](../overview/getting-started.md).

Ogni volta che si modifica il modello applicativo occorre avviare il generatore in modo che vengano prodotti i tipi TypeScript, il DAOContext e tutti i relativi DAO che permettono all'utilizzatore di accesedere alle sorgenti dati tramite il query builder.

Per avviare la generazione è sufficiente eseguire il comando:

```bash
npx graphql-codegen
```

E' anche possibile eseguirlo in modalità *watch* in modo che qualsiasi modifica allo schema avvii automaticamente una nuova generazione:

```bash
npx graphql-codegen --watch
```

Per ogni dettaglio aggiuntivo sullo strumento di generazione fare riferimento alla guida ufficiale [GraphQL Code Generatore](https://www.graphql-code-generator.com/docs/getting-started){:target="_blank"}.

Il principale risultato della generazione di codice è un componente che abbiamo chiamato `DAOContext`. Il DAOContext è un container per tutti i `DAO`, i data access objects che permettono di eseguire tutte le operazioni sulle entità del modello applicativo.

Il ruolo del DAOContext è fondamentale perchè è su di esso che si possono configurare tutta una serie di impostazioni in grado di modificare il comportamento dell'intero sistema di accesso al dato o di un singolo DAO. Esso inoltre rappresenta un contesto perimetrato e replicabile, quindi è possibile istanziare un numero a piacere di DAOContext, ognuno con impostazioni diverse.

## Come istanziare il DAOContext

Istanziare il `DAOContext` è molto semplice. Le uniche configurazioni obbligatorie sono le sorgenti dati SQL e MongoDB (entrambe se si utilizzano entrambi i database, oppure solo quello necessario).

Si noti che Typetta implementa due diversi driver per connettersi ai vari database supportati, uno è costruito sul [driver nativo MongoDB](https://docs.mongodb.com/drivers/node/current/){:targte="_blank"} e l'altro su [KnexJS](https://knexjs.org/){:targte="_blank"}, una delle librerie in ambito Node JS più consolidate per l'accesso a database SQL.

Di seguito quindi un esempio che mostra come istanziare un DAOContext con due data source, uno SQL e uno MongoDB:

```typescript
import { MongoClient } from 'mongodb';
import knex from 'knex'
import { DAOContext } from './dao';

const mongoClient = new MongoClient(process.env.MONGODB_URL!);
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

const knexInstance = knex({
  client: process.env.SLQ_DATABASE_TYPE, // 'pg' | 'mysql' | ...
  connection: process.env.SLQ_DATABASE_URL
})

const daoContext = new DAOContext({
  mongo: { default: mongoDb },
  knex: { default: knexInstance },
});
```

Il `DAOContext` è un punto di accesso centralizzato al dato, per questo motivo viene generalmente salvato nel contesto di un'applicazione o di un servizio e utilizzato per tutto il suo ciclo di vita.

## Multi-database

Il meccanismo di definizione delle sorgenti dati nel DAOContext prevede la possibilità di indicare un numero a piacere di database MongoDB e istanze KnexJS. Per indicare delle sorgenti dati aggiuntive oltre a quelle di default è sufficiente aggiungere dei valori alle mappe chiave valore `mongo` e `knex`, come mostrato di seguito:

```typescript
const daoContext = new DAOContext({
  mongo: { 
    default: primaryMongoDb,
    secondary: secondaryMongoDb,
  },
  knex: { 
    default: primaryKnexInstance, 
    secondary: secondaryKnexInstance 
  },
});
```

A questo punto, ogni entità storicizzata può far riferimento ad una sorgente dati (quindi un database) specificandone il nome logico. Nel caso non venga specificata alcuna sorgente dati esplicita verrà sempre presa quella di default, obbligatoria. 

```typescript
type User @mongoEntity(source: "secondary") {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @sqlEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

Nell'esempio precedente l'entità `User` risiede sulla sorgente dati MongoDB con chiave `secondary`, mentre l'entità `Post` risiede sulla sorgente dati SQL con chiave `default`.

Si noti che entità diverse possono risiedere in sorgenti dati diverse, anche eterogennee in tipo (MongoDB / SQL), e possono essere comunque rlazionate tra di loro. Typetta gestisce il caricamento da sorgenti dati eterogenee in maniera automatica e totalmente trasparente all'utente. Le uniche limitazioni sono legate alle transazioni, che non possono essere eseguite su entità storicizzate su sorgenti dati diverse.

## DAO

Come detto in precedenza, la generazione di codice crea automaticamente una serie di DAO, uno per ogni entità storicizzata del modello applicativo. Ipotizziamo di avere un semplice modello applicativo come il precedente, qui di seguito riportato:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @sqlEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

Il DAOContext generato conterrà automaticamente il riferimento ai due DAO che corrispondono alle due entità storicizzate. L'accesso ad ogni DAO si ottiene direttamente in maniera associativa dall'istanza del DAOContext:

```typescript
const userDAO = daoContext.user;
const postDAO = daoContext.post;
```