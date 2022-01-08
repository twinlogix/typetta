# Lettura e Scrittura

Il componente fondamentale per eseguire operazioni di lettura o scrittura sulle entità di modello è il `DAO`. Esiste un DAO per ogni entità ed il suo riferimento si può ottenere semplicemente dal `DAOContext`, come descritto nella sezion della guida riguardante [il contesto](dao-context.md).

Ogni DAO, indipendentemente da quale sia la sua sorgente dati, sia essa SQL o MongoDB, offre le principali funzionalità di lettura e manipolazione delle entità e delle loro relazioni. 

Di seguito un elenco di queste operazioni:


## Schema applicativo di esempio

Nelle successive sezioni verranno mostrate le principali operazioni che ogni DAO mette a disposizione per leggere e manipolare i dati relativi ad una o più entità di modello. Tutti gli esempi che verranno mostrati faranno riferimento al seguente modello applicativo:

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

## Insert One

L'API [insertOne](/typedoc/classes/AbstractDAO.html#insertOne){:target="_blank"} permette di inserire un record. L'API richiede tutti i campi obbligatori dell'entità interessata ad esclusione dell'ID se questo è auto-generato.

Di seguito un esempio di creazione di un utente:

```typescript
const user = await daoContext.user.insertOne({
  record: {
    firstName: "Mattia",
    lastName: "Minotti",
    address: {
      street: "Via Piave 48",
      city: "Milan",
      country: "Italy"
    }
  }
})
```

