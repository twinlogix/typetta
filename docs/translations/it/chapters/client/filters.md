# Filtri

Typetta permette di filtrare i record per ognuno dei campi del modello e supporta vari operatori in maniera completamente trasparente rispetto al database che si utilizza. 

La seguende operazione `findAll` ha un filtro che permette di trovare tutti gli utenti che:
- Hanno come nome `Mattia`
- Abitano a `Rome` o `Milan`
- Sono nati in una data che non comprende tutto l'anno `2020`

```typescript
await daoContext.user.findAll({
  filter: {
    firstName: "Mattia",
    "address.city": { $in: [ "Milan", "Rome" ]},
    birthDate: { 
      $or: { 
        $lt: new Date("2020-01-01T00:00:00"), 
        $gte: new Date("2021-01-01T00:00:00") 
      } 
    }
  }
})
```

  - [Operatori di uguaglianza](#operatori-di-uguaglianza)
    - [$eq](#eq)
    - [$ne](#ne)
    - [$in](#in)
    - [$nin](#nin)
  - [Operatori di comparazione](#operatori-di-comparazione)
    - [$lt](#lt)
    - [$lte](#lte)
    - [$gt](#gt)
    - [$gte](#gte)
  - [Operatori logici](#operatori-logici)
    - [$and](#and)
    - [$or](#or)
    - [$nor](#nor)
    - [Combinazione di operatori logici](#combinazione-di-operatori-logici)
  - [Operatori per stringhe](#operatori-per-stringhe)
    - [$contains](#contains)
    - [$startsWith](#startswith)
    - [$endsWith](#endswith)
  - [Altri operatori](#altri-operatori)
    - [$exist](#exist)
  - [Filtri avanzati, dipendenti dal driver](#filtri-avanzati-dipendenti-dal-driver)
    - [MongoDB](#mongodb)
    - [SQL](#sql)

## Operatori di uguaglianza

Di seguito l'elenco degli operatori che permettorno di controllare l'uguaglianza di un campo con uno o più valori:

### $eq

L'operatore `$eq` controlla che il valore sia uguale a quello fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { $eq: "Mattia" }
  }
})
```

L'operatore `$eq` può anche essere omesso, per cui la query di cui sopra è equivalente alla seguente:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: "Mattia"
  }
})
```

### $ne

L'operatore `$ne` controlla che il valore sia diverso da quello fornito, è complementare al precedene operatore `$eq`.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { $ne: "Mattia" }
  }
})
```

### $in

L'operatore `$in` controlla che il valore sia contenuto all'interno di un insieme di valori forniti.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { $in: ["Mattia", "Michele", "Stefano"] }
  }
})
```

### $nin

L'operatore `$nin` controlla che il valore non sia contenuto all'interno di un insieme di valori forniti.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { $nin: ["Piero", "Paolo", "Romeo"] }
  }
})
```

## Operatori di comparazione

Di seguito l'elenco degli operatori che permettorno di comparare un campo con uno o più valori:

### $lt

L'operatore `$lt` controlla che il valore sia strettamente minore di un valore fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { $lt: 100 }
  }
})
```

### $lte

L'operatore `$lte` controlla che il valore sia minore o uguale a un valore fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { $lte: 100 }
  }
})
```

### $gt

L'operatore `$gt` controlla che il valore sia strettamente maggiore di un valore fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { $gt: 100 }
  }
})
```

### $gte

L'operatore `$gte` controlla che il valore sia maggiore o uguale a un valore fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { $gte: 100 }
  }
})
```

## Operatori logici

E' possibile combinare le condizioni costruite con gli operatori precedenti attraverso i più classici operatori logici di seguito elencati:

### $and

L'operatore `$and` è verificato se tutte le condizioni passate sono verificate.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    $and: [
      { firstName: "Mattia" }
      { lastName: "Minotti" }
    ]
  }
})
```

### $or

L'operatore `$or` è verificato se almeno una delle condizioni passate è verificata.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      { "address.country": "Italy" },
      { "address.city": "Paris" }
    ]
  }
})
```

### $nor

L'operatore `$nor` è verificato se nessuna delle condizioni passate è verificata.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      { firstName: "Mattia" },
      { lastName: "Minotti" }
    ]
  }
})
```

### Combinazione di operatori logici

Gli operatori logici di cui sopra possono essere combinati a piacimento per creare condizioni complesse. Di seguito un esempio che mostra una query di ricerca di utenti il cui indirizzo è in Italia, oppure che vivono all'estero e il cui cognome è `Minotti` o `Barbieri`:

```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      { 
        "address.country": "Italy" 
      },
      { 
        $and: [
          { 
            $nor: [{ "address.country":  "Italy" }]
          },
          {
            lastName: { $in: ["Minotti", "Barbieri"]}
          }
        ]
      }
    ]
  }
})
```

## Operatori per stringhe

I seguenti operatori sono disponibili sono per i campi di tipo `String` e permetto di creare delle condizioni, anche complesse, su campi testuali.

### $contains

L'operatore `$contains` permette di controllare se il valore contiene al suo interno una stringa fornita. Di seguito alcuni esempi esplicativi:

```
"oggi fa caldo" contiene "oggi fa caldo" => sì
"oggi fa caldo" contiene "caldo" => sì
"oggi fa caldo" contiene "oggi" => sì
"oggi fa caldo" contiene "fa" => sì
"oggi fa caldo" contiene "ggi fa" => sì
"oggi fa caldo" contiene "freddo" => no
"oggi fa caldo" contiene "oggi caldo" => no
"oggi fa caldo" contiene "facaldo" => no
```

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { $contains: "Piave" }
  }
})
```


### $startsWith

L'operatore `$startsWith` permette di controllare se il valore contiene inizia con una stringa fornita:

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { $startsWith: "Via" }
  }
})
```

### $endsWith 

L'operatore `$endsWith` permette di controllare se il valore contiene termina con una stringa fornita:

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { $endWith: "48" } }
  }
})
```

## Altri operatori

Di seguito l'elenco degli ulteriori operatori messi a disposizione da Typetta:

### $exist

L'operatore `$exist` controlla che il campo sia o meno valorizzato su database, a seconda del valore true / false fornito.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    name: { $exist: true }
  }
})
```

## Filtri avanzati, dipendenti dal driver

La filosofia di Typetta è quella di uniformare, semplificare e tipizzare tutto ciò che può essere comune tra le varie sorgenti dati e al tempo stesso non togliere alcuna possibilità all'utente nell'utilizzo delle funzioni avanzate dei sottostanti database. Se un utente necessità di una particolare funzionalità fornita solo da uno dei database supportati, con la sua sintassi specifica, deve poterlo fare senza dover rinunciare a tutte le altre facilitazioni che Typetta offre.

Per questo motivo tutte le API che ricevono il parametro filter accettano sia un tipo di dato generato da Typetta con le regole e gli operatori descritti precedentemente, ma in alternativa anche una funzione che permette di esprimere il filtro utilizzando riferimenti, sintassi e funzionalità del driver sottostante.

In pseudo-codice risulta come nel seguente esempio:
```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: (/* driverRefs... */) => {
    // ...something driver specific that returns a driver filter
  }
})
```

Si noti che questo approccio permette di descrivere un filtro specifico per un driver, mantenendo però l'utilizzo di tutte le altre funzionalità, nello specifico il meccanismo di proiezioni, la risoluzione delle relazioni ed il typing dei risultati.

### MongoDB

Essendo il driver MongoDB sviluppato tramite il [MongoDB Node Driver ufficiale](https://docs.mongodb.com/drivers/node/current/){:target="_blank"}, la creazione di un filtro specifico consiste in una funzione che ritorna `Filter<WithId<Document>>`. 

Ipotizziamo per esempio di voler utilizzare l'operatore `$text` di MongoDB che è un'operatore molto specifico che, tramite un indice testuale sulla collection, è in grado di eseguire una ricerca full text complessa. Non essendo una funzionalità disponibile su altri database o disponibile ma in modalità molto diverse, non è stata fattorizzata da Typetta. Con il meccanismo di filtri specifici per il driver è tuttavia molto semplice utilizzarla:

```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: () => {
    $text: { $search: "via piave", $caseSensitive: true }
  }
})
```

### SQL

Il driver SQL, come già accennato in precedenza, è sviluppato utilizzando il celebre query builder [KnexJS](https://knexjs.org/){:target="_blank"}. La creazione di un filtro specifico in questo caso consiste nell'invocazione di una serie di metodi sull'oggetto `Knex.QueryBuilder`.

Ipotizziamo per esempio di voler implementare anche in questo caso una ricerca full text tramite le funzionalità offerte da un database target PostgreSQL. Con il meccanismo di filtri specifici possiamo creare una ricerca come segue:

```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: (builder: Knex.QueryBuilder) => {
    builder.where('street @@ to_tsquery(?)', ['via & piave']);
    return builder;
  }
})
```