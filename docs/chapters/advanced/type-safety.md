# Type Safety

Typetta nasce dall'idea di creare un ORM scritto in linguaggio TypeScript in grado di fornire un accesso al dato completamente type safe. 

Typescript si differenzia dai più comuni linguaggi di programmazione per il suo motore di typing in grado di effettuare in maniera molto avanzata **type checking**, **type inference** e **type narrowing**. Questo permette a librerie come Typetta di generare tipi di dato dinamici e dipendenti dagli input forniti in risposta ad un'operazione.

Di seguito un semplice esempio in cui, a fronte di un'operazione ``findOne``, viene ritornato un oggetto il cui tipo di ritorno dipende dal valore del parametro ``projection``:

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

## Type Generation

## Type Helpers