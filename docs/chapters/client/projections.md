# Proiezioni

Per **proiezione** si intende il sottoinsieme dei campi di un'entità di modello che vengono richiesti in una query, siano essi dell'entità principale, si una entità embedded o di una entità collegata. Typetta sfrutta il meccanismo delle proiezioni per garantise un accesso al dato **efficiente** e **type-safe**.

  - [Proiezioni di default](#proiezioni-di-default)
  - [Proiezioni esplicite](#proiezioni-esplicite)
  - [Proiezioni e relazioni](#proiezioni-e-relazioni)
  - [L'importanza delle proiezioni](#limportanza-delle-proiezioni)
    - [Proiezioni e GraphQL](#proiezioni-e-graphql)
    - [Typing](#typing)

## Proiezioni di default

In ogni query che ritorna un elenco di record, i risultati includono di default:
- **Tutti** gli scalari e le entità embedded con i loro scalari
- **Nessuna** delle relazioni

Questo comportamento di base è giustificato dal fatto che il sistema recupera di default tutte le informazioni contenute nella tabella/collection relativa all'entità in un'unica query e non esegue ulteriori query per recuperare le informazioni di entità collegate a meno che non venga esplicitamente richiesto.

Prendendo ad esempio il seguente modello applicativo:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  address: Address
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}

type Address {
  street: String
  city: String
  district: String
  zipcode: String
  country: String
}
```

Una query che non specifica alcuna proiezione esplicita come la seguente: 

```typescript
const users = await daoContext.user.findOne({ filter: { firstName: "Mattia" } });
```

Ritornerà un oggetto del tipo: 

```typescript
{
  id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    street: "Via Piave 48",
    city: "Milan",
    district: "MI",
    zipcode: "20019"
    country: "Italy"
  }
}
```


## Proiezioni esplicite

Tutte le operazione che ritornano dei record prevedono anche la possibilità di esplicitare una proiezione, ossia un elenco dei campi richiesti. Per farlo, ogni API che lo prevede mette a disposizione un parametro opzionare di nome `projection`. 

Di seguito una query di ricerca di un utente che richiede solamente il nome e il cognome:

```typescript
const user = await daoContext.user.findOne({ 
  filter: { 
    firstName: "Mattia" 
  },
  projection: {
    firstName: true,
    lastName: true
  }
});
```

La query precedente ritornerà un oggetto come il seguente:
```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
}
```

Allo stesso modo è possibile selezionare i campi di un'entità embedded, quindi la seguente query: 

```typescript
const user = await daoContext.user.findOne({ 
  filter: { 
    firstName: "Mattia" 
  },
  projection: {
    firstName: true,
    lastName: true,
    address: {
      city: true
    }
  }
});
```

Ritornerà il seguente risultato:

```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    city: "Milan"
  }
}
```

Sebbene sia buona norma specificare sempre l'elenco completo dei campi necessari, sia per questioni di efficienza che di correttezza, per le entità embedded è possibile selezionare anche l'intera entità in una proiezione con la seguente sintassi:

```typescript
const user = await daoContext.user.findOne({ 
  filter: { 
    firstName: "Mattia" 
  },
  projection: {
    firstName: true,
    lastName: true,
    address: true
  }
});
```

In questo caso il risultato sarà:

```typescript
{
  firstName: "Mattia",
  lastName: "Minotti",
  address: {
    street: "Via Piave 48",
    city: "Milan",
    district: "MI",
    zipcode: "20019"
    country: "Italy"
  }
}
```

## Proiezioni e relazioni

Tramite la specifica di una proiezione esplicita l'utente può decidere di selezionare le relazioni che intende caricare. Dal punto di vista delle proiezioni, le relazioni sono gestite esattamente come le entità embedded.

Dato il modello applicativo precedente, è quindi possibile selezionare un utente con i suoi post:

```typescript
const user = await daoContext.user.findOne({ 
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true, 
      content: true
    }
  }
});
```

Il sistema supporta la possibilità di richiedere campi con una profondità a piacere, è quindi possibile caricare per esempio un utente, i suoi post e per ogni post nuovamente l'utente:

```typescript
const user = await daoContext.user.findOne({ 
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true, 
      user: {
        firstName: true,
        lastName: true
      },
      content: true
    }
  }
});
```

Ovviamente richiedere una relazine ha un effetto molto diverso sull'interazione con il database sottostante, infatti il sistema dovrà sostenere tutte le query necessarie al caricamento dei dati, su tutte le tabelle/collection interessate. Typetta si occupa comunque di rendere questa complessità completamente trasparente all'utente.

## L'importanza delle proiezioni

Come detto in precedenza, un corretto utilizzo delle proiezioni è importante sia per efficientare l'accesso al dato, sia per una corretta gestione dei tipi di ritorno.

### Proiezioni e GraphQL
La filosofia GraphQL, da cui Typetta è fortemente ispirato, prevede che ogni richiesta definisca esplicitamene ed esattamente i campi necessari. Questo permette di eseguire il numero minimo di query necessarie al recupero del dato che è sempre caricato in maniera *eager*.

Per agevolare l'integrazione di Typetta proprio con i back-end GraphQL, ogni API di recupero dei dati può ricevere al posto di una proiezione esplicita un oggetto ``GraphQLResolveInfo`` che contiene l'AST di una richiesta GraphQL. E' quindi il sistema a trasformare in maniera automatica l'input dell'utente in una proiezione di Typetta.

Di seguito un esempio di un resolver GraphQL implementato utilizzando un DAO Context:

```typescript
Query: {
  user: async (parent: never, args: never, ctx: GraphQLContext, info: GraphQLResolveInfo) => {
      return await ctx.daoContext.user.findOne({
        filter: { 
          id: ctx.user.id 
        },
        projection: info,
      })
    }
  }
}
```

### Typing
Nella maggior parte dei linguaggi di programmazione, l'accesso al dato tramite DAO prevede la creazione di oggetti chiamati DTO (data transfer object), ossia oggetti che definiscono quale porzione o composizione del dato storicizzato viene ritornato da un'API. La definizione dei DTO è un processo costoso sia in termini di sviluppo che di manutenzione.

Il linguaggio TypeScript, grazie al suo evoluto concetto di *tipo* e alla sua possibilità di manipolazione, ci offre l'opportunità di superare il design pattern DTO ed offrire allo sviluppatore uno strumento in grado di conciliare produttività e type-safety.

Nello specifico, ogni API di Typetta ritorna un tipo di dato che dipende dalla proiezione passata in input, sia in termini di insieme di campi che di loro opzionalità.

Prendendo come esempio il modello applicativo di cui sopra, con la seguente chiamata ad API:

```typescript
const user = await ctx.daoContext.user.findOne({
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  projection: {
    firstName: true,
    lastName: true,
    posts: {
      id: true, 
      content: true
    }
  }
})
```

La costante `user` avrà come tipo: 

```typescript
type GeneratedUserType = {
  firstName?: string,
  lastName?: string,
  posts?: {
    id: string, 
    content: string
  }[]
} | null
```

Questo significa che a livello di compilatore (e di controlli/suggerimenti dell'IDE) sarà possibile accedere, per esempio, ai campi `firstName` e `lastName` del risultato, ma non al campo `address`, il tutto senza la necessità di definire esplicitamente un DTO e tenerlo allineato al modello applicativo.
