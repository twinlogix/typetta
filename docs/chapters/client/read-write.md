# Lettura e Scrittura

Il componente fondamentale per eseguire operazioni di lettura o scrittura sulle entità di modello è il `DAO`. Esiste un DAO per ogni entità ed il suo riferimento si può ottenere semplicemente dal `DAOContext`, come descritto nella sezion della guida riguardante [il contesto](dao-context.md).

Ogni DAO, indipendentemente da quale sia la sua sorgente dati, sia essa SQL o MongoDB, offre le principali funzionalità di lettura e manipolazione delle entità e delle loro relazioni. 

Di seguito un elenco di queste operazioni:

  - [Insert One](#insert-one)
  - [Find One](#find-one)
  - [Find All](#find-all)
  - [Find Page](#find-page)
  - [Update One](#update-one)
  - [Update All](#update-all)
  - [Replace One](#replace-one)
  - [Delete One](#delete-one)
  - [Delete All](#delete-all)

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

L'oggetto ritornato rappresenta uno User e, nel caso di ID auto-generato, contiene anche l'id creato dal sistema o dal database, a seconda dell'opzione scelta.

## Find One

L'API [findOne](/typedoc/classes/AbstractDAO.html#findOne){:target="_blank"} permette di ricercare un record filtrando per uno o più dei suoi campi.

Di seguito un esempio di ricerca di un utente filtrando per nome:

```typescript
const user = await daoContext.user.findOne({
  filter: {
    firstName: "Mattia",
    lastName: "Minotti"
  },
})
```
Nel caso la query identifichi più di un record viene ritornato solo il primo con l'ordinamento specificato, oppure con l'ordinamento standard del database.

## Find All

L'API [findAll](/typedoc/classes/AbstractDAO.html#findAll){:target="_blank"} permette di ricercare tutti i record filtrando per uno o più dei loro campi.

Di seguito un esempio di ricerca di utenti filtrando per città:

```typescript
const users = await daoContext.user.findAll({
  filter: {
    "address.city": "Milan"
  },
  sorts: [
    { 
      lastName: SortDirection.DESC 
    }
  ]
})
```

Il ritorno di questa query è un array di utenti che vivono a Milano, ordinati per cognome in ordine alfabetico.

## Find Page

L'API [findPage](/typedoc/classes/AbstractDAO.html#findPage){:target="_blank"} permette di ricercare tutti i record filtrando per uno o più dei loro campi e ritorna una pagina di risultati e il loro numero totale. 

Questa API differisce dalla precedente `findAll` non per la possibilità di richiedere una pagina di risultati, cosa possibile anche con la `findAll`, ma per il valore di ritorno che contiene l'elenco dei record della pagina ed il conteggio totale dei record che rispondo alla query passata.

Il parametro `skip` identifica quanti record saltare, quindi se si vuole iniziare dal primo deve essere settato a 0 oppure omesso; il parametro `limit` identifica invece la dimensione della pagina, ossia il numero massimo di record tornati.

Di seguito un esempio di ricerca di una pagina di utenti filtrando per città:

```typescript
const users = await daoContext.user.findAll({
  skip: 0,
  limit: 10,
  filter: {
    "address.city": "Milan"
  },
  sorts: [
    { 
      lastName: SortDirection.DESC 
    }
  ]
})
```

Il ritorno di questa query è il seguente oggetto:

```typescript
{
  totalCount: 1,
  records: [
    {
        id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
        firstName: "Mattia",
        lastName: "Minotti",
        address: {
          street: "Via Piave 48",
          city: "Milan",
          country: "Italy"
        }
    }
  ]
})
```

## Update One

L'API [updateOne](/typedoc/classes/AbstractDAO.html#updateOne){:target="_blank"} permette aggiornare uno o più campi di un record identificato tramite un apposito filtro. Questa API aggiorna al massimo un record, il primo trovato dal filtro nel caso più di uno corrisponda ai criteri di ricerca.

Di seguito un esempio di aggiornamento dell'indirizzo di un utente:

```typescript
await daoContext.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: {
    address: {
      street: "Via Carducci 12",
      city: "Rome",
      country: "Italy"
    }
  }
})
```

Si noti che per entità composte come è il caso dell'utente e dell'indirizzo, l'API permette sia di aggiornare l'intera entità embedded che solamente uno dei suoi campi. Se si vuole per esempio modificare solamente il campo `street` di un utente lasciando invariato il resto dell'indirizzo si può eseguire il seguente codice:

```typescript
await daoContext.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: {
    "address.street": "Via G. Bovio 50"
  }
})
```

## Update All

L'API [updateAll](/typedoc/classes/AbstractDAO.html#updateAll){:target="_blank"} permette aggiornare uno o più campi di un insieme di record identificati tramite un apposito filtro. Il funzionamento è del tutto simile alla precedente API `updateOne` ma esteso a tutti i record che soddisfano il filtro passato come parametro.

Di seguito un esempio di aggiornamento di tutti gli utenti che hanno per nome `mattia`, modificando il nome in `Mattia` con la lettera maiuscola:

```typescript
await daoContext.user.updateAll({
  filter: {
    firstName: "mattia",
  },
  changes: {
    firstName: "Mattia",
  }
})
```

Si noti che è possibile aggiornare tutti i record presenti passando esplicitamente un filtro vuoto, come nel seguente esempio in cui si aggiorna il nome di tutti gli utenti:

```typescript
await daoContext.user.updateAll({
  filter: {},
  changes: {
    firstName: "Mattia",
  }
})
```

## Replace One

L'API [replaceOne](/typedoc/classes/AbstractDAO.html#replaceOne){:target="_blank"} permette di sostituire un record identificato tramite un apposito filtro con uno completamente nuovo. In quanto sostituzione, il vecchio recond viene completamente perso e quello sostitutivo può differire completamente dal precedente.

Di seguito un esempio di sostituzione di un utente:

```typescript
await daoContext.user.replaceOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  replace: {
    firstName: "Edoardo",
    lastName: "Barbieri",
    address: {
      street: "Via San Giorgio 12",
      city: "Cesena",
      country: "Italy"
    }
  }
})
```

## Delete One

L'API [deleteOne](/typedoc/classes/AbstractDAO.html#deleteOne){:target="_blank"} permette di eliminare un record identificato tramite un apposito filtro. Questa API elimina al massimo un record, il primo trovato dal filtro nel caso più di uno corrisponda ai criteri di ricerca.

Di seguito un esempio di eliminazione di un utente:

```typescript
await daoContext.user.deleteOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  }
})
```

## Delete All

L'API [deleteAll](/typedoc/classes/AbstractDAO.html#deleteAll){:target="_blank"} permette eliminare un insieme di record identificati tramite un apposito filtro. Il funzionamento è del tutto simile alla precedente API `deleteOne` ma esteso a tutti i record che soddisfano il filtro passato come parametro.

Di seguito un esempio di eliminazione di tutti gli utenti che hanno per nome `Mattia`:

```typescript
await daoContext.user.deleteAll({
  filter: {
    firstName: "Mattia",
  }
})
```

Si noti che è possibile eliminare tutti i record presenti passando esplicitamente un filtro vuoto, come nel seguente esempio in cui si eliminano tutti gli utenti:

```typescript
await daoContext.user.deleteAll({
  filter: {},
})
```