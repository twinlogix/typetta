# Mocking

La possibilità di creare uno strato di accesso al dato mock è può essere molto utle ad accelerare il ciclo di sviluppo di un'applicazione aiutando ad eliminare la dipendenza tra lo sviluppo della logica applicativa che utilizza un modello e come questo modello si traduce sui costrutti del database utilizzato. 

In un contesto di progettazione model-driven risulta quindi estremamente comodo poter progettare il modello del dato direttamente in linguaggio GraphQL e demandare ad un secondo momento la progettazione del sottostante database.

La funzionalità di mocking è inoltre utile per finalità di testing.

  - [Mocking dell'intero contesto](#mocking-dellintero-contesto)
  - [Mocking di alcune sorgenti dati](#mocking-di-alcune-sorgenti-dati)
  - [Dettagli implementativi](#dettagli-implementativi)

## Mocking dell'intero contesto

Per creare un contesto interamente mock, Typetta mette a disposizione una funzione di utilità, generata analogamente al ``DAOContext``, che riceve gli stessi identici parametri del suo costruttore ad esclusione dei riferimenti alla sorgente dati. 

```typescript
const daoContext = mockedDAOContext();
```

Il ``DAOContext`` così ottenuto può essere utilizzato allo stesso identico modo di quello già descritto nei capitoli precedenti, rendendo la presenza o meno della sorgente dati trasparente al resto del sistema. La sorgente dati mock partirà vuota, senza alcun dato ed alcuna struttura.

Si noti che la creazione di un contesto mock permette l'utilizzo di entità dichiarate nel modello dati come ``@entity`` ma senza l'annotazione dello specifico driver ``@mongodb`` o ``@sql``. Questo è particolarmente utile nei contesti in cui si vuole utilizzare Typetta ancora prima di progettare il database su cui si vorranno storicizzare i dai.

Nel caso di entità dichiarare solo come ``@entity``, il DAO che viene prodotto presenterà le sembianze e le funzionalità di un DAO di accesso a MongoDB, così come per le entità dichiarare ``@entity @mongodb``. Per entità dichiarate come ``@entity @sql``, invece, verrà prodotto un DAO con le funzionalità di accesso a database SQL. 

Nel caso ci siano entità di tipo ``@entity @sql``, siccome l'accesso al dato su database relazionali richiede la presenza di tabelle precedentemente create, occorre chiamare sul ``DAOContext`` mock un ulteriore metodo di inzializzazione ``createTables``. Di seguito un esempio:

```typescript
const daoContext = mockedDAOContext();
daoContext.createTables();
```

## Mocking di alcune sorgenti dati

In certi casi può essere utile creare un ``DAOContext`` che abbia solo alcune sorgenti dati mock e altre reali. Per fare questo la funzione ``mockedDAOContext`` permette la specifica, opzionale, delle sorgenti dati prevesti dal modello dati. Le sorgenti dati non specificata vengono mockate.

```typescript
const mongoClient = new MongoClient(process.env.MONGODB_URL!);
const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

const daoContext = mockedDAOContext({
  mongodb: {
    default: mongoDb,
    // another not specified data source => mocked
  }
});
```

## Dettagli implementativi

L'implementazione dei driver mock fa uso di due librerie di terze parti che permettono di creare un database MongoDB e uno SQLite in memoria, con dettagli implementativi e implicazioni tecniche diverse.

Per **MongoDB** viene utilizzata la libreria [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server){:target="_blank"} che di fatto effettua il download e l'avvio di un processo mongod totalmente in memoria. Questo approccio è chiaramente utilizzabile per scopi di test e sviluppo, ma è sconsigliato per qualsiasi ambiente di produzione.

Per **SQL** invece viene utilizzato il driver ufficiale di SQLite che permette di utilizzare un database totalmente in memoria invece che su file. Anche in questo caso se ne consiglia l'uso solo per scopi di test o svilppo.