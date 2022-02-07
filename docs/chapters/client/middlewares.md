# Middlewares

I middleware sono un potente strumento con cui **estendere le funzionalità** base di Typetta, aggiungendo allo strato di accesso al dato una serie di controlli e automatismi customizzati. Essi sono costituiti da una o più funzioni che vengono invocate in cascata nel ciclo di vita di un'operazione, sia nella fase precedente che in quella successiva all'interazione con la sorgente dati. 

Queste funzioni ricevono tutti i parametri in input all'operazione e ne possono cambiare il valore, così da modificarne o estenderne il comportamento o.

  - [Definizione di un Middleware](#definizione-di-un-middleware)
  - [Applicazione di un Middleware](#applicazione-di-un-middleware)
    - [Middleware per uno specifico DAO](#middleware-per-uno-specifico-dao)
    - [Middleware per più DAO](#middleware-per-più-dao)
    - [Middleware per tutto il DAOContext](#middleware-per-tutto-il-daocontext)
  - [Modifica di input e output](#modifica-di-input-e-output)
  - [Pipeline di esecuzione](#pipeline-di-esecuzione)
  - [Interruzione flusso di esecuzione](#interruzione-flusso-di-esecuzione)

## Definizione di un Middleware

Di seguito un semplice middleware di log che stampa le varie fasi di esecuzione di ogni operazione del DAO di un utente:

```typescript
const middleware = {
  before: async (args, context) => {
    console.log(`Before operation ${args.operation}.`)
  },
  after: async (args, context) => {
    console.log(`After operation ${args.operation}.`)
  }
}
```

Si noti che ogni middleware è costituito da due funzioni, una invocata prima dell'esecuzione di ogni operazione (`findOne`, `findAll`, `insertOne`, ecc.) ed una invocata dopo ogni esecuzione. Entrambe le funzioni ricevono due parametri: il primo contiene tutte le informazioni a disposizione sull'operazione in corso, il secondo è un oggetto di contesto grazie al quale si può accedere direttamente al driver e ai metadati del DAO.

La struttura del primo parametro (`args` nell'esempio, è la seguente: 
```typescript
{
  // operazione corrente
  operation: 'find' | 'insert' | 'update' | 'replace' | 'delete' | 'aggregate', 
  // dipendente dall'operazione, contiene tutti gli input come filtri, proiezioni, ordinamenti, changes, ecc.
  params: { ... },
  // argomenti di input aggiuntivi, solo per l'operazione 'aggregate'
  args: { ... },
  // i record letti, disoponibili solo per l'operazione 'find' nella funzione 'after'
  records: [],
  // il record inserito, disoponibile solo per l'operazione 'insert' nella funzione 'after'
  record: { ... },
  // i risultati dell'operazione 'aggregate' nella funzione 'after'
  results: { ... },
}
```

Questo parametro è strettamente tipato e dipendente dal campo ``operation``. Per accedere ad esempio al filtro passato ad un'operazione ``find`` possiamo scrivere il seguente middleware:

```typescript
const middleware = {
  before: async (args, context) => {
    if(args.operation === 'find'){
      // type narrowing, now we can access args.params.filter
      console.log(`Find with filter ${args.params.filter}.`)
    }
  },
}
```

Il secondo parametro (``context`` nell'esempio) contiene invece i seguenti campi:
```typescript
{
  // riferimento al driver MongoDB o all'oggeto knexjs
  driver: ..., 
  // oggetto contentene metadati passati al DAOContext o allo specifico DAO
  metadata: {...},
  // oggetto generato che descrive la struttura dell'entità
  schema: { ... };
  // chiave del campo @id dell'entità
  idField: ...,
}
```

## Applicazione di un Middleware

Ogni middleware può essere applicato a tre diversi livelli all'interno di un ``DAOContext``:
  - [Middleware per uno specifico DAO](#middleware-per-uno-specifico-dao)
  - [Middleware per più DAO](#middleware-per-più-dao)
  - [Middleware per tutto il DAOContext](#middleware-per-tutto-il-daocontext)

### Middleware per uno specifico DAO

E' possibile assegnare un middleware ad un singolo DAO attraverso il campo ``overrides`` del costruttore di ogni ``DAOContext``:
```typescript
const daoContext = new DAOContext({
  overrides: {
    user: {
      middlewares: [
        middleware
      ]
    }
  }
})
```

Si noti che un middleware creato per una sola entità potrà usufruire del type narrowing di TypeScript, perciò i parametri delle funzioni `before` e `after` conterranno filtri, proiezioni, ordinamenti, record della specifica entità. Questo facilita molto la scrittura e la manutenzione della logica applicativa del singolo middleware.

### Middleware per più DAO

Può accadere che si renda necessario creare un middleware che deve essere applicato ad un sottoinsieme delle entità di un ``DAOContext``. Per farlo è possibile definire un override per ognuna di queste entità, come visto in precedenza, ma ciò può risultare prolisso e scarsamente manutenibile. Typetta offre una funzione di utilità con cui è possibile definire un middleware per un gruppo specifico di entità:

```typescript
const daoContext = new DAOContext({
  middlewares: [
    groupMiddleware.includes((
        {
          user: true,
          posts: true
        },
        middleware
      ),
    ],
  ]
})
```

Allo stesso modo, è possibile anche definire un middleware per un gruppo di entità utilizzando una logica di esclusione:

```typescript
const daoContext = new DAOContext({
  middlewares: [
    groupMiddleware.excludes((
        {
          posts: true
        },
        middleware
      ),
    ],
  ]
})
```

Anche in questo caso TypeScript effettua type narrowing in maniera perfetta e permette l'utilizzo all'interno del middleware dei tipi frutto dell'intersezione tra i tipi di tutte le entità. Nell'esempio di cui sopra, se tutte le entità selezionate hanno un campo ``id`` il middleware può accedere a quel campo.

### Middleware per tutto il DAOContext

E' infine possibile creare un middleware comune a tutto il ``DAOContext`` che viene quindi eseguito per ogni operazione di ogni ``DAO``. Per farlo è sufficiente configurare il middleware come segue:
```typescript
const daoContext = new DAOContext({
  middlewares: [
    middleware
  ]
})
```

## Modifica di input e output

Un middleware può modificare gli input ricevuti ritornandone in output una copia alterata. Questo può essere molto utile per creare funzionalità che alternao o forzano alcuni comportamenti del DAO. E' possibile, ad esempio, creare un middleware che forza il valore di un filtro ad un determinato valore indipendentemente da quanto definito dall'utilizzatore.

```typescript
const daoContext = new DAOContext({
  middlewares: [
    {
      before: async (args, context) => {
        if (args.operation === 'find') {
          return {
            ...args,
            params: {
              ...args.params,
              filter: [
                args.params.filter,
                {
                  id: '2fd16faf-6e75-4219-96ea-28f801e918de',
                }
              ],
            },
            continue: true,
          }
        }
      },
    },
  ]
})
```

Nell'esempio precedente il middleware, che si applica solamente alle operazioni di ``find``, lascia inalterati tutti gli input dell'utente ad eccezione del filtro che viene messo in and con un filtro fisso per id.

Si noti la presenza di un campo booleano aggiuntivo ``continue`` obbligatorio. Passando ``true`` il middleware al suo completamento lascia l'esecuzione al middleware successivo o all'esecuzione dell'operazione se non sono presenti altri middleware. Passando invece ``false`` il middlewre interrompe la catena di esecuzione, quindi nessun altro middleware successivo verrà eseguito. Se si tratta di una funzione ``before`` neanche l'operazione verrà eseguita.

Nel caso si ritorni ``continue: false`` il tipo di ritorno non dovrà contenere solamente tutti i parametri di input dell'operazione ma i relativi output, in quanto il middleware si va a sostituire alla normale esecuzione dell'operazione.


## Pipeline di esecuzione

I middleware permettono di creare livelli di mediazione precedenti e successivi all'esecuzione di un'operazione. Questi livelli vengono eseguiti in un ordine ben preciso che può essere riassunto come segue:

```
             ━━━━━┓
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE N (before function)
                  ┃
                  ▼
TYPETTA MIDDLEWARES (before function)
                  ┃
                  ▼
         OPERATION EXECUTION
                  ┃
                  ▼
TYPETTA MIDDLEWARES (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE N (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (after function)
                  ┃
             ◀━━━━┛
                  
```

L'ordine dei middleware custom, quelli cioè definiti dall'utente, è determinato dall'ordine dell'array con cui essi vengono configuari sul ``DAO`` o sul ``DAOContext``. Ogni middleware, utilizzando la funzione `before`, può modificare gli input dell'operazione e con la funzione `after` può modificare i suoi output. Sia input che output vengono passati al livello successivo fino all'ultimo livello in cui si ritornano i risultati al chiamante.

Nello schemo si possono vedere alcuni middleware interni a Typetta. Il sistema infatti sfrutta internamente questo meccanismo per implementare alcune funzionalità base già preconfigurate.

## Interruzione flusso di esecuzione

Ogni middleware, sia nella fase `before` che in quella `after` può decidere di interrompere la pipeline di esecuzione e terminare l'operazione fornendo degli output. Per fare questo, come visto nell'esempio precedente, occorre importare un campo ``continue: false`` nell'oggeto di ritorno. 

Se ipotizziamo quindi che il middleware custom 2 dell'esempio precedene fosse implementato come segue:

```typescript
const middlewareCustom2 = {
  before: async (args, context) => {
    return {
      ...args
      continue: false,
    }
  }
}
```

Esso interromperebbe la pipeline, che di fatto risulterebbe essere bloccata al secondo step:

```
             ━━━━━┓
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (before function)
                  ┃
             ◀━━━━┛
```