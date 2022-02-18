# Using with GraphQL

GraphQL è un linguaggio che permette di definire ed interrogare un API ed il suo modello dati. Esporre un'API tramite un endpoint GraphQL permette di sviluppare client in grado di effettuare interrogazioni **efficienti**, **espressive** e **tipate**. Questo grande risultato viene però ad un prezzo: la complessità di creare un back-end in grado di soddisfare questo tipo di richieste e di recuperare i dati dalle verie sorgenti. Typetta entra in gioco in questo punto ed è in grado di semplificare il lavoro dello sviluppatore.

In quanto ORM completamente tipato in grado di supportare proiezioni e filtri complessi, Typetta più essere utilizzato nello sviluppo dei resolver GraphQL di qualunque libreria di back-end, come ad esempio Apollo Server, NestJS o Express.

  - [Perchè utilizzare Typetta con GraphQL?](#perchè-utilizzare-typetta-con-graphql)
    - [End-to-end type safety](#end-to-end-type-safety)
    - [Un modello unico](#un-modello-unico)
    - [Comodo, conciso ed espressivo](#comodo-conciso-ed-espressivo)
    - [Accesso al dato ottimizzato](#accesso-al-dato-ottimizzato)
    - [Sicurezza](#sicurezza)
  - [Anatomia di un Resolver](#anatomia-di-un-resolver)
  - [Typetta nell'implementazione dei resolvers](#typetta-nellimplementazione-dei-resolvers)
  
## Perchè utilizzare Typetta con GraphQL?
Typetta nasce da un'esperienza pluriennare di sviluppo di back-end GraphQL e di conseguenza trova nel connubio con questa tecnologia la sua massima utilità.

### End-to-end type safety
Utilizzando entrambe le tecnologie è possibile creare uno stack completamente type safe, a partire dal database fino al front-end. Questo aumenta la produttività del sistema riducendo gli errori e facilando la manutenzione.

### Un modello unico
Typetta prevede la definizione di un modello dati direttamente in linguaggio GraphQL. Contrariamente alla maggior parte degli altri ORM, si può quindi condividere il modello dati con il modello dell'API e velocizzare lo sviluppo del back-end, permettendo allo sviluppatore di decidere se e quando suddividere i due livelli e investire tempo nella traduzione da uno all'altro.

### Comodo, conciso ed espressivo
Typetta condivide molti dei principali concetti con GraphQL e permette quindi di implementare resolver in maniera chiara, concisa e veloce, aumentando la produttività dello sviluppatore.

### Accesso al dato ottimizzato
Un problema tipico nel caricamento dei dati in un back-end GraphQL è dovuto alle performance di N+1 query. Grazie all'utilizzo della tecnologia di [DataLoader](https://github.com/graphql/dataloader){:target="_blank"} esso viene risolto automaticamente da Typetta e non costituisce una criticità.

### Sicurezza
Uno degli aspetti più critici nello sviluppo di un backend GraphQL è la creazione di uno strato di sicurezza che regolamenti l'accesso ai dati a prescindere da dove inizia la navigazione del grafo. Per fare questo la definizione delle politiche di sicurezza devono necessariamente essere accoppiate al modello dati. Typetta offre la possibilità di definire un livello di [sicurezza](./security.md) direttamente dal `DAOContext` in maniera molto semplice ed espressiva.
## Anatomia di un Resolver

Un resolver è una funzione che si occupa di popolare i dati di ogni singolo campo di una richiesta GraphQL. Esso rappresenta l'implementazione delle operazioni GraphQL nell'applicativo di back-end.

Ipotizziamo un endpoint GraphQL con il seguente schema:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  posts: [Post!]
}

type Post {
  id: ID!
  userId: ID!
  content: String!
}

type Query {
  users: [User!]
}
```

Il resolver della query `users` si presenta come di seguito:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      const users = //users loading
      return users
    },
  },
}
```

L'operazione di caricamento degli utenti, per garantire efficienza e correttezza, deve caricare dalla sorgente dati tutti e soli i campi richiesti analizzando il contenuto del parametro `info` che contiene lo schema AST della richiesta.

Siccome il tipo `User` contiene a sua volta un campo `posts: [Post!]`, occorre specificare un ulteriore resolver in grado di caricare tutti i post di ogni utente:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      const users = //users loading
      return users
    },
  },
  User: {
    posts: async (parent, args, context, info) => {
      const posts = //posts with userId == parent.id loading
      return posts
    },
  }
}
```

L'implementazione delle due funzioni di cui sopra è il requisito minimo per implementare correttamente la logica di risoluzione della query GraphQL `users`. Si noti che tale implementazione presenta alcune possibili difficoltà:

- In entrambi i resolver occorre interpretare il campo `info` per determinare esattamente i campi richiesti.
  
- Nel resolver `posts` occorre caricare tutti i post il cui userId è uguale all'id dell'utente, presente nel parametro `parent.id`.
  
- Nel caso l'utente selezioni il campo `posts` occorre asscurarsi di caricare comunque il campo `id` dell'utente necessario alla risoluzione della relazione.
  
- Il resolver `posts` viene invocato per ogni risultato del resolver `users`, il che può generale un elevano numero di interrogazioni alla sorgente dati.


## Typetta nell'implementazione dei resolvers

Utilizzando Typetta l'implementazione dei precedenti resolvers risulta estremamente semplice, come mostrato nel seguente esempio:

```typescript
export const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      return context.dao.user.findAll({ projection: info });
    },
  }
}
```

Il codice è estremamente semplice e conciso in quanto è Typetta a prendersi carico delle complessità descritte precedentemente. In particolare:

- La `projection` viene automaticamente desunta dal parametro `info`, compresa la parte relativa alle entità connesse e i campi necessari per risolvere tutte le relazioni.
  
- Le entità connesse vengono caricate automaticamente, non è quindi necessario implementare tutti i relativi resolvers (nello specifico `User.posts`).
  
- Il caricamento delle entità connesse è effettuato in maniera efficiente, utilizzando i dataloader ed è quindi immune all'N+1 problem.




