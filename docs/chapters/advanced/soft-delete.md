# Soft-delete

In molti sistemi l'**eliminazione** dei dati, da requisito, non deve essere fisica ma **logica**. Questo significa che ogni entità deve avere un campo che ne identifica lo stato eliminato/non eliminato e che l'operazione di delete agisce su questo campo piuttosto che eliminare il record dalla sorgente dati. Di conseguenza ogni operazione di lettura deve filtrare tutti i record eliminati in maniera automatica.

Il meccanismo sopra descritto viene comunemente chiamato **soft delete** ed è utilizzato per:

- Mantenere i dati per un certo periodo di tempo anche dopo la loro eliminazione da parte dell'utente.

- Costruire una funzionalità di "cestino" e permettere all'utente di ripristinare dati precedentemente eliminati.


## Middleware

Typetta offre allo sviluppatore un middleware che facilita enormemente l'implementazione del meccanismo di soft delete. Esso richiede solamente la specifica di una funzione che ritorna un oggetto con due campi:

- `changes`: le modifiche da applicare al record al posto dell'eliminazione fisica.
  
- `filter`: il filtro da applicare in tutte le letture per escludere i record eliminati.

Prendiamo ad esempio il seguente modello dati:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  live: Boolean!
  deletedOn: Date
}
```

E' possibile implementare il comportamento di soft delete per l'entità `User` utilizzando questo middleware come segue:
```typescript
const daoContext = new DAOContext({
  overrides: {
    user: {
      middlewares: [
        softDelete(() => ({ 
          changes: { live: false, deletedOne: new Date() }, 
          filter: { live: true } 
        })),
      ]
    }
  }
)
```