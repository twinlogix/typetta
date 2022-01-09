# Proiezioni

Per **proiezione** si intende il sottoinsieme dei campi di un'entità di modello che vengono richiesti in una query, siano essi dell'entità principale, si una entità embedded o di una entità collegata. Typetta sfrutta il meccanismo delle proiezioni per garantise un accesso al dato **efficiente** e **type-safe**.

- [Proiezioni](#proiezioni)
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
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  address: Address
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @mongoEntity {
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
const users = daoContext.user.findOne({ filter: { firstName: "Mattia" } });
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
const users = daoContext.user.findOne({ 
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
const users = daoContext.user.findOne({ 
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

Sebbene sia buona norma specificare sempre l'elenco completo dei campi necessari, sia per questioni di efficienza che di correttezza, per le entità embedded è possibile selezionare l'intera entità in una proiezione con la seguente sintassi:

```typescript
const users = daoContext.user.findOne({ 
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

In questo caso il risltato sarà:

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



## L'importanza delle proiezioni


## Proiezioni e GraphQL

## Typing