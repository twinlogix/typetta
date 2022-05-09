# Relazioni

Una delle funzionalità principali di Typetta è la possibilità di definire [relazioni](../data-model/relations.md) tra le entità. 

  - [Leggere entità collegate](#leggere-entità-collegate)
  - [Filtrare entità collegate](#filtrare-entità-collegate)
  - [Filtrare per campi di entità collegate *[presto disponibile]*](#filtrare-per-campi-di-entità-collegate-presto-disponibile)

## Leggere entità collegate

Quando un modello applicativo contiene entità connesse tra loro, tutte le API di lettura supportano la specifica di [proiezioni](projections.md) che permettono di navigare il grafo delle relazioni a piacimento. 

Prendendo come esempio il seguente modello applicativo:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
  categoriesId: [ID!]!
  categories: [Category!]! @innerRef
}

type Category @entity @mongodb {
  id: ID! @id
  name: String!
}
```

E' quindi possibile eseguire un'API di lettura di un utente, includendo i relativi post e, per ogni post, le sue categorie:

```typescript
const user = await entityManager.user.findOne({ 
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  }
});
```

Il risultato di un'interrogazione di questo tipo sarà il seguente:
```typescript
{
  id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  firstName: "Minotti",
  lastName: "Mattia",
  posts: [
    {
      id: "ddc4d722-dc86-4648-ba18-06e37423624c",
      content: "Today is a fantastic day!",
      categories: [{
        id: "b169110c-f620-404f-84c7-a1b594dc36bfe",
        name: "mood"
      }]
    },
    {
      id: "19f0bc5f-93f3-45f1-85be-8050db5338c9",
      content: "Well done, my friend.",
      categories: [{
        id: "de81b41f-544d-481b-b8be-eeba4e02cda2",
        name: "social"
      }]
    }
  ]
}
```

## Filtrare entità collegate

Quando si seleziona un'entità collegata attraverso la specifica di una proiezione, come default il sistema ritorna tutte le entità collegate. Nell'esempio precedente per ogni utente vengono caricati tutti i post, indipendentemente dal loro numero.

Capita spesso che per questioni di performance o applicative, sia necessario limitare o filtrare anche le entità collegate. Typetta offre questa possibilità attraverso il parametro `relations` presente in ogni API di lettura. `relations` è una mappa chiave-valore che permette di esprire, per ogni relazione, i parametri di lettura `start`, `limit`, `filter`, `sorts` e, ricorsivamente, `relations`. In pratica permette di customizzare la richiesta di recupero delle entità collegate così come si potrebbe fare con una nuova lettura.

Si noti che non è data la possibilità di specifica `projection` in quanto le proiezioni sono già definite in maniera innestata nella chiamata API.

Di seguito un esempio in cui, rispetto alla lettura precedente, si richiede un solo post per ogni utente:

```typescript
const user = await entityManager.user.findOne({ 
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  },
  relations: {
    posts: { limit: 1 }
  }
});
```

A seguire invece un esempio più complesso in cui, per ogni utente, si richiedoono solo i post contenenti la parola ``friend`` e per ogni post solo le categorie in ordine alfabetico.

```typescript
const user = await entityManager.user.findOne({ 
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e"
  },
  projection: {
    id: true,
    firstName: true,
    lastName: true,
    posts: {
      id: true,
      content: true,
      categories: {
        id: true,
        name: true
      }
    }
  },
  relations: {
    posts: { 
      filter: { 
        content: { contains: "friend" }
      },
      relations: {
        categories: {
          sorts: [{ name: 'asc' }]
        }
      }
    }
  }
});
```

## Filtrare per campi di entità collegate *[presto disponibile]*

Questa funzionalità non è ancora disponibile ed è attualmente in fase di progettazione.