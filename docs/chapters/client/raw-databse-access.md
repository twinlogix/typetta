# Accesso diretto al database

La filosofia di Typetta è quella di **uniformare**, **semplificare** e **tipizzare** tutto ciò che può essere comune tra le varie sorgenti dati e al tempo stesso non togliere alcuna possibilità all'utente nell'utilizzo delle **funzioni avanzate** dei sottostanti database. 

Se un utente necessità di una particolare funzionalità fornita solo da uno dei driver supportati, con la sua sintassi specifica, deve poterlo fare senza dover rinunciare a tutte le altre facilitazioni che Typetta offre. Questo approccio segue il principio generale a cui ci si è attenuti nella progettazione dell'intero sistema: aggiungere complessità per l'utilizzatore solo quando questi ne necessita e solo nei punti in cui ne necessita.

Typetta offre quindi all'utente la possibilità di creare interrogazioni specifiche a diversi livelli:
  - [Filtri dipendenti dal driver](#filtri-dipendenti-dal-driver)
  - [Ordinamenti dipendenti dal driver](#ordinamenti-dipendenti-dal-driver)
  - [Updates dipendenti dal driver](#updates-dipendenti-dal-driver)
  - [Raw queries](#raw-queries)
  
## Filtri dipendenti dal driver

Tutte le API che ricevono il parametro `filter` accettano, a discrezione dell'utente, una funzione che permette di esprimere il filtro utilizzando riferimenti, sintassi e potenzialità del driver sottostante.

Questo approccio permette di accedere alle potenzialità del database in utilizzo senza però rinunciare a tutte le altre funzionalità che offre Typetta, nello specifico il meccanismo di proiezioni, la risoluzione delle relazioni ed il typing dei risultati. Una descrizione più di dettaglio di questa funzionalità è fornita nell'apposita [sezione sull'utilizzo dei filtri](filters.md#filtri-avanzati-dipendenti-dal-driver) di questa guida.

## Ordinamenti dipendenti dal driver

Così come per il filtri, tutte le API che ricevono il parametro `sorts` accettano, a discrezione dell'utente, una funzione che permette di esprimere il l'ordinamento utilizzando riferimenti, sintassi e potenzialità del driver sottostante. Una descrizione più di dettaglio di questa funzionalità è fornita nell'apposita [sezione sull'utilizzo degli ordinamenti](sorting.md#ordinamenti-avanzati-dipendenti-dal-driver) di questa guida.

## Updates dipendenti dal driver

La terza possibilità di customizzazione che fa uso delle funzionalità dirette del driver è la definizione del parametro `changes` delle API `updateOne` e `updateAll`.

In pseudo-codice questa possibilità è esemplificata di seguito:
```typescript
await daoContext.user.updateOne({
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: (/* driverRefs... */) => {
    // ...something driver specific that returns a driver changes
  }
})
```

### MongoDB

Essendo il driver MongoDB sviluppato tramite il [MongoDB Node Driver ufficiale](https://docs.mongodb.com/drivers/node/current/){:target="_blank"}, la creazione di un oggetto di update specifico consiste in una funzione che ritorna `UpdateFilter<TSchema>`. 

Ipotizziamo per esempio di voler utilizzare l'operatore `$inc` di MongoDB per incrementare il valore di un campo numerico senza necessariamente leggerlo precedentemente. Con il meccanismo di changes specifiche per il driver è possibile scrivere una query come segue:

```typescript
await daoContext.user.updateOne({
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: () => {
    $inc: { ordersCount: 1 }
  }
})
```

### SQL

Il driver SQL, come già accennato in precedenza, è sviluppato utilizzando il celebre query builder [KnexJS](https://knexjs.org/){:target="_blank"}. La creazione di una query di update in questo caso consiste nell'invocazione di una serie di metodi sull'oggetto `Knex.QueryBuilder`.

Ipotizziamo per esempio di voler implementare anche in questo caso un'operazione di incremento di un campo tramite le funzionalità offerte da un database target PostgreSQL. Con il meccanismo di changes specifiche possiamo creare un update come segue:

```typescript
await daoContext.user.udpateOne({
  filter: { 
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: (builder: Knex.QueryBuilder) => {
    builder.update({ ordersCount: knex.raw('?? + 1', ['ordersCount']) })
    return builder;
  } 
})
```

## Raw queries

L'ultima possibilità di utilizzo di funzionalità di basso livello è costituita dall'API `execQuery` messa a disposizione direttamente dal `DAOContext`. Essa permette di eseguire una qualsiasi operazione (o più di una) utilizzando direttamente le API del driver sottostante.

Di seguito un semplice esempio in cui si utilizza direttamente il driver MongoDB per creare un indice sulla collection contenente l'entità user:
```typescript
await daoContext.execQuery(async (dbs, collections) => {
  await collections.user.createIndex({ firstName: 'text' })
})
```

Si noti che la funzione riceve un primo parametro (nell'esempio `dbs`) che è una mappa dei riferimenti alle sorgenti dati con cui il `DAOContext` viene inizializzato e un secondo parametro (nell'esempio lo abbiamo chiamato `collections`) che è una mappa dei riferimenti alle singole sorgenti dati di ogni entità. Nel caso specifico `collections` è una mappa delle collections MongoDB di ogni entità definita nel modello applicativo.

E' anche possibile scrive query con un valore di ritorno, il cui tipo viene inferito automaticamente dal compilatore in base al ritorno della funzione fornita. Di seguito un esempio in cui si ricerca la presenza di un indice su una collection MongoDB, il cui risultato è `true/false`:

```typescript
const firstNameIndexExists = await daoContext.execQuery(async (dbs, collections) => {
  return collections.user.indexExists('firstNameIndex');
})
if (!firstNameIndexExists) {
  await collections.user.createIndex({ firstName: 'text' })
}
```

L'API `rawQuery` offre quindi la massima flessibilità, a discapito di tutte le funzionalità di utilità introdotte da Typetta, che in questo caso non fa altro che veicolare i dati verso il database. Questo significa che i dati ritornati dall'invocazione diretta del database non sono soggetti a `Middlewares`, a `ScalarAdapters` e a qualsiasi altro pro/post processing effettuato da Typetta.

