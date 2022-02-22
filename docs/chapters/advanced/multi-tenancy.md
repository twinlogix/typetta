# Multi Tenancy

La gestione della **multi tenancy** è un problema estremamente comune nei moderni sistemi cloud e consiste nel servire più utenti (tenant) con un'unica architettura software quindi, per quanto riguarda Typetta, un un'unico strato di accesso al dato.

Ci sono tre approcci alla gestione della multi tenancy:

- **Database separati**: la base dati di ogni tenant è su un database dedicato a lui.

- **Schema separati**: la base dati di ogni tenant sono su schema diversi di un unico database.

- **Partizionamento**: tutti i tenant sono su un unico database e un unico schema partizionato grazie ad un campo detto discriminatore.

## Partizionamento

Utilizzando il meccanismo dei middlewares, Typetta offre una gestine completamente automatica dello scenario di multi tenancy tramite partizionamento. Di seguito un esempio di come configurare un ``DAOContext``:

```typescript
const daoContext = new DAOContext({
  metadata: {
    tenantId: 'user-tenant-id'
  },
  middlewares: [
    tenantSecurityPolicy({
      tenantKey: 'tenantId',
    }),
  ]
}
```

Il campo ``tenantKey``, che nell'esempio specifico è valorizzato come ``tenantId``, identifica il nome del discriminatore che ogni entità del modello dati avrà e che rappresenta la sua appartenenza ad un tenant. Il ``DAOContext`` inoltre, dovrà essere inizializzato con i metadati dell'utente chiamante e in particolare dovrà contenere il discriminatore definito con la stessa chiave ``tenantId``. Si noti che, in alternativa, è possibile passare i metadati ad ogni operazione invece che alla creazione del ``DAOContext``. 

Il middleware aggiunge allo strato di accesso al dato i seguenti comportamenti:

- In tutte le operazioni che ricevono un filtro in input si assicura che l'utente abbia inserito una condizione che controlla l'appartenenza di un'entità al suo tenant. Se l'utente non setta alcun filtro, il middleware ne impone uno di default del tipo:

```typescript
{ tenantId: 'user-tentant-id' }
```

- In tutte le operazioni di scrittura il middleware si assicura che il record inserito o modificato appartenga allo stesso tenanto dell'utente chiamante.

Questo fa sì che, definendo l'attributo ``tenantId`` in tutte le entità del modello, lo sviluppatore non debba più preoccuparsi di valorizzarlo correttamente e di controllarlo ad ogni operazione.