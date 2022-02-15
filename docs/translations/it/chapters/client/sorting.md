# Ordinamenti

Le API `findAll` e `findPage`, che ritornano un elenco di record, supportano la funzionalità di ordinamento dei risultati.

Di seguito un semplice esempio di utilizzo i cui vengono ricercati degli utenti ordinati per data di nascita:

```typescript
const users = await daoContext.user.findAll({
  sorts: [{ 
    birthDate: 'desc'
  }]
})
```

Come mostrato nell'esempio, la direzione di sort è definita tramite un semplice literal TypeScript e può essere `asc` o `desc`. Il parametro `sorts` è un array ordinato in cui si possono specificare un numero a piacere di criteri di ordinamento, che vengono applicati l'uno dopo l'altro.

Si noti che è possibile filtrare anche per campi di entità embedded, con la stessa notazione che si utilizza per i filtri. Di seguito un semplice esempio in cui si ordinano gli utenti per città in ordine alfabetico ascendente:

```typescript
const users = await daoContext.user.findAll({
  sorts: [{ 
    'address.city': 'asc'
  ]
})
```

## Ordinamenti avanzati, dipendenti dal driver

Tutte le API che ricevono il parametro sorts, così come già descritto per i filtri, accettano sia un tipo di dato generato da Typetta che una funzione che permette di esprimere i criteri di ordinamento utilizzando riferimenti, sintassi e funzionalità del driver sottostante.

In pseudo-codice risulta come nel seguente esempio:
```typescript
const users = await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  sorts: (/* driverRefs... */) => {
    // ...something driver specific that returns driver sorts
  }
})
```

Si noti che questo approccio permette di descrivere sorts specifici per un driver, mantenendo però l'utilizzo di tutte le altre funzionalità, nello specifico il meccanismo di proiezioni, la risoluzione delle relazioni ed il typing dei risultati.

### MongoDB

Essendo il driver MongoDB sviluppato tramite il [MongoDB Node Driver ufficiale](https://docs.mongodb.com/drivers/node/current/){:target="_blank"}, la creazione di sorts specifici consiste in una funzione che ritorna `Sort`. 

Ipotizziamo per esempio aver utilizzato l'operatore `$text` di MongoDB che è un'operatore molto specifico che, tramite un indice testuale sulla collection, è in grado di eseguire una ricerca full text complessa. Questo operatore di ricerca permette anche di ordinare i risultati in base ad uno score di matghing tra il risultato e il testo ricercato. Di seguito un esempio di utilizzo:

```typescript
const users = await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: () => {
    $text: { $search: "via piave", $caseSensitive: true }
  },
  sorts: () => {
    score: { $meta: "textScore"}
  }
})
```

### SQL

Il driver SQL è sviluppato utilizzando il celebre query builder [KnexJS](https://knexjs.org/){:target="_blank"}. La creazione di sorts specifici in questo caso consiste nell'invocazione di una serie di metodi sull'oggetto `Knex.QueryBuilder`.

Ipotizziamo per esempio di voler implementare un ordinamento di un elenco di utenti per mese di nascita (ignorando l'anno e il giorno) a partire da un campo data di nascita. Con il meccanismo di filtri specifici possiamo creare una ricerca come segue:

```typescript
const users = await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  sorts: (builder: Knex.QueryBuilder) => {
    builder.orderByRaw("date_part('hour', birthDate) ASC");
    return builder;
  }
})
```