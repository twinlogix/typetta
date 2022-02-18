# Type Safety

Typetta nasce dall'idea di creare un ORM scritto in linguaggio TypeScript in grado di fornire un accesso al dato completamente type safe. 

TypeScript si differenzia dai più comuni linguaggi di programmazione per il suo motore di typing in grado di effettuare in maniera molto avanzata **type checking**, **type inference** e **type narrowing**. Questo permette a librerie come Typetta di generare tipi di dato dinamici e dipendenti dagli input forniti in risposta ad un'operazione.

  - [Type Generation](#type-generation)
  - [Type from projection](#type-from-projection)
  - [Type Helpers](#type-helpers)
  
## Type Generation

Per aiutare l'utente a scrivere codice il più possibile type-safe, Typetta genera automaticamente una serie di tipi per ogni entità del modello dati.

Prendiamo ad esempio il seguente modello GraphQL:

```typescript
type User @entity {
  id: ID! @id
  firstName: String
  lastName: String
}
```

Da esso vengono generati automaticamente i seguenti tipi:
```typescript

type User = {
  id: string
  firstName?: string
  lastName?: string
}

type UserFilterFields = {
  id?: string | null | EqualityOperators<string> | ElementOperators
  firstName?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
  lastName?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
}
type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>

type UserProjection = {
  id?: boolean
  firstName?: boolean
  lastName?: boolean
}

type UserSortKeys = 'id' | 'firstName' | 'lastName'
type UserSort = OneKey<UserSortKeys, SortDirection>

type UserInsert = {
  firstName?: types.Scalars['String']
  lastName?: types.Scalars['String']
}

type UserUpdate = {
  id?: types.Scalars['ID']
  firstName?: types.Scalars['String'] | null
  lastName?: types.Scalars['String'] | null
}

```

Tutti questi tipi, esportati ed utilizzabili anche direttamente al di fuori di Typetta, permettono di scrivere operazioni per l'accesso al dato completamente type-safe.

## Type from projection

Ogni volta che si esegue un'operazione di lettura di dati specificando una proiezione, Typetta ritorna un tipo di dato che dipende dal tipo della proiezione, in maniera totalmente dinamica. Di seguito un semplice esempio in cui, a fronte di un'operazione ``findOne`` viene ritornato un oggetto il cui tipo di ritorno dipende dal parametro ``projection``:

```typescript 
const user = await daoContext.user.findOne({ 
  projection: {
    firstName: true,
    lastName: true
  }
});

type userType = typeof user;

/* 
type userType = {
    firstName: string
    lastName: string 
}
/*
```

Modificando il valore della ``projection`` si modifica automaticamente, a compile-time, il tipo di ritorno:

```typescript 
const user = await daoContext.user.findOne({ 
  projection: {
    firstName: true,
    lastName: true,
    address: {
      city: true
    }
  }
});

type userType = typeof user;

/* 
type userType = {
    firstName: string
    lastName: string
    address: {
      city: string
    }
}
/*
```

Questo meccanismo, reso possibile dai costrutti conditional type e mapped type di TypeScript, permette di creare codice estremamente type-safe senza l'overhead necessario alla definizione di un elevato numero di tipi parziali.
## Type Helpers

Per ogni entità viene anche generato un tipo di dato condizionale molto utile nella costruzione di codice type-safe che elabora dati recuperati tramite Typetta. Per il modello si cui sopra, viene ad esempio generato il seguente tipo:

```typescript
type UserParam<P extends UserProjection> = ParamProjection<User, UserProjection, P>
```

`ParamProjection` è un tipo di utilità che permette di ottenere un tipo che è il risultato dell'applicazione di una proiezione al relativo modello. Di seguito un esempio di utilizzo:

```typescript
const userProjection : UserProjection = {
  id: true,
  firstName: true
}

const user = dao.user.findOne({
  projection: userProjection
})
```

Nel codice di cui sopra vediamo come sia possibile creare un `UserProjection` per specificare un sottoinsieme dei campi dell'utente che si vogliono caricare dallla sorgente dati. Utilizzando poi l'operazione `findOne` si va a caricare un utente ed i relativi campi, coerentemente a tale projection. La costante `user` sarà quindi un oggetto con due campi: `id` e `firstName`.

Ipotizziamo ora di dover utilizzare questa costante come input di una funzione che fa un qualche tipo di elaborazione. Come potremmo dichiarare la funzione? L'ipotesi più semplice è replicare la struttura del dato di ritorno come segue:

```typescript
function elab(user: { id: string, firstName?: string}){
  //...
}
```
In questo modo, però, lo sviluppatore è obbligato a replicare tutta la struttura del dato, in maniera molto prolissa e di difficile manutenzione, quando in realtà quel tipo sarebbe inferibile dall'applicazione della `userProjection` al modello `User`.

Si noti che il parametro `user` non può essere di tipo `User`, altrimenti si obbligherebbe l'utilizzatore della funzione `elab` a fornire anche il campo `lastName` che non è invece necessario alla funzione.

Dato questo problema, in Typetta abbiamo creato un tipo per ogni entità, nel caso specifo `UserParam`, che permette di riscrivere la funzione precedente come segue:

```typescript
const userProjection : UserProjection = {
  id: true,
  firstName: true
}

function elab(user: UserParam<typeof userProjection>){
  //user.id => ok!
  //user.firstName => ok!
  //user.lastName => compile-time error!
}

const user = dao.user.findOne({
  projection: userProjection
})
if(user){
  elab(user);
}
```