# Audit

Per **auditing** si intende il processo di raccolta di informazioni accessorie utili all'analisi dell'acceso, dell'utilizzo e della modifica dei dati. Si tratta di un'esigenza tipica di sistemi informativi che necessitano di informazioni di controllo al fine di agevolare le operazioni di supporto e ricerca degli errori.

Generalmente le informazioni vengono storicizzare per ogni entità del modello dati con una logica omogenea che può essere fattorizzata, risparmiando un lavoro ripetitivo e costoso.

## Middleware

Typetta offre allo sviluppatore un middleware che facilita l'implementazione del meccanismo di auditing dei dati. Esso richiede la specifica di una funzione che ritorna un oggetto con due campi:

- `changes`: le modifiche da applicare al record ad ogni modifica.
  
- `insert`: i valori di default da applicare al record alla creazione.

Prendiamo ad esempio il seguente modello dati:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String

  createdOn: Date!
  createdBy: ID!
  modifiedOn: Date
  modifiedBy: ID
}
```

L'entità `User` presenta una serie di campi con finalità di auditing. Si tratta di un esempio semplificativo, il numero e la complessità di questi campi potrebbe essere notevolmente più elevata. In ogni caso, grazie al middleware di `audit` è possibile implementare questo semplice comportamento:
```typescript
const daoContext = new DAOContext({
  overrides: {
    user: {
      middlewares: [
        audit((metadata) => ({ 
          changes: { modifiedBy: metadata.user.id, modifiedOn: new Date() }, 
          insert: { createdBy: metadata.user.id, createdOn: new Date() } 
        })),
      ]
    }
  }
)
```
