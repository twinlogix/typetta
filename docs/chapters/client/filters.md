# Filtri

Typetta permette di filtrare i record per ognuno dei campi del modello e supporta vari operatori in maniera completamente trasparente rispetto al database che si utilizza. 

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
    - [$not](#not)
    - [Combinatione di operatori logici](#combinatione-di-operatori-logici)
  - [Operatori per stringhe](#operatori-per-stringhe)
    - [$contains *[presto disponibile]*](#contains-presto-disponibile)
    - [$startsWith *[presto disponibile]*](#startswith-presto-disponibile)
    - [$endsWith *[presto disponibile]*](#endswith-presto-disponibile)
  - [Altri operatori](#altri-operatori)
    - [$exist](#exist)
    - [$near *[presto disponibile]*](#near-presto-disponibile)

La seguende operazione `findAll` ha un filtro che permette di trovare tutti gli utenti che:
- Hanno come nome `Mattia`
- Abitano a `Rome` o `Milan`
- Sono nati in na data che non comprende tutto l'anno `2020`


```typescript
await daoContext.user.findAll({
  filter: {
    firstName: "Mattia",
    "address.city": { $in: [ "Milan", "Rome" ]},
    "birthDate": { 
      $or: { 
        $lt: new Date("2020-01-01T00:00:00"), 
        $gte: new Date("2021-01-01T00:00:00") 
      } 
    }
  }
})
```

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

### $not

L'operatore `$not` è verificato se la condizione passata non è verificata.

Esempio:
```typescript
await daoContext.user.findAll({
  filter: {
    $not: { firstName: "Mattia" }
  }
})
```

### Combinatione di operatori logici

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
            $not: { "address.country":  "Italy" }
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

### $contains *[presto disponibile]*

L'operatore `$contains` è disponibile solo per i campi di tipo `String` e permette di controllare se il valore contiene una stringa fornita al suo interno.

### $startsWith *[presto disponibile]*

L'operatore `$startsWith` è disponibile solo per i campi di tipo `String` e permette di controllare se il valore inizia con una stringa fornita.

### $endsWith *[presto disponibile]*

L'operatore `$endsWith` è disponibile solo per i campi di tipo `String` e permette di controllare se il valore termina con una stringa fornita.


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

### $near *[presto disponibile]*

L'operatore `$near` in combinazione con i parametri aggiuntivi `$maxDistance` e `$minDistance` permette di effettuare query geografiche con distanza massima e minima da un punto fornito.