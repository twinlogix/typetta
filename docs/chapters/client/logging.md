# Logging

La possibilità di avere un accurato sistema di log è una funzionalità molto importante per una libreria che gestisce lo strato di accesso al dato. Grazie ai log è possibile approfondire eventuali problemi di correttezza nella costruzione delle query inviata alla sorgente dati o di performance.

  - [How to enable Logs](#how-to-enable-logs)
  - [Log long-running queries](#log-long-running-queries)
  - [Custom logger](#custom-logger)
 
## How to enable Logs

E' possibile abilitare la funzionalità di log semplicemente passando il parametro ``log: true`` alla creazione del ``DAOContext``. 

```typescript
new DAOContext({
  log: true,
})
```

In alternativa, è possibile specificare quali livelli di log devono essere abilitati tra quelli previsti dal sistema: ``debug``, ``query``, ``warning`` ed ``error``. Si noti che il livello ``query`` è quello in cui vengono loggate le query SQL e MongoDB che vengono eseguite sui rispettivi database.

Per specificare esplicitamente i livelli abilitati occorre passare un array al parametro ``log``:

```typescript
new DAOContext({
  log: ['warning', 'error'],
})
```

I log prodotti dal sistema hanno la seguente forma:
```
[2022-01-30T14:44:40.120Z] (dao: user, op: findAll, driver: mongo): collection.find({}) [3 ms]
```
Nell'esempio vediamo il log di una query in cui è presente:
- la data si emissione del log
- il DAO che ha emesso il log
- l'operazione a cui è connesso il log
- il driver utilizzato dal DAO per connettersi al data source
- la query completa, nel formato dello specifico database
- il tempo di esecuzione

## Log long-running queries

Se ci sono problmi di performance o semplicemente c'è la necessità di effettuare un'analisi sui tempi di accesso al dato, è possibile abilitare il log di tutte le operazioni che impiegano troppo tempo ad essere eseguite attraverso il parametro ``maxQueryExecutionTime``. Configurando quindi il ``DAOContext`` come segue:

```typescript
new DAOContext({
  log: { maxQueryExecutionTime: 2000 },
})
```

Verranno loggate tutte le operazioni che impiegano più di 2 secondi ad essere eseguite.

## Custom logger

Typetta fornisce un logger di default che scrive log di quattro diversi livelli direttamente sulla console. Se si vuole customizzare la destinazione dei log, ad esempio inviandoli ad un servizio di terze parti, oppure si vuole semplicemente cambiare il formato aggiungendo o eliminando informazioni rispetto al default, è possibile creare un logger customizzato.

Un logger customizzato consiste in una funzione che l'utente può scrivere e passare al parametro log e che viene invocata ad ogni evento e per ogni livello di log. Questa funzione riceve i seguenti parametri:
- ``raw``: la stringa prodotta dal logger di default, utile nel caso non si vogli manipolare ma semplicemente inviare ad una destinazione diversa
- ``date``: la data del log
- ``level``: il livello del log, tra ``debug``, ``query``, ``warning`` ed ``error``.
- ``operation``: il nome dell'operazione che ha generato il log, se disponibile
- ``dao``: il nome del dao la cui operazione ha generato il log, se disponibile
- ``driver``: il tipo di driver che l'operazione utilizza, tra `mongo` e `knex`
- ``query``: la query inviata al database, se si tratta di un log di livello ``query``
- ``duration``: la durata dell'operazione, se disponibile
- ``error``: l'oggetto di errore, se si tratt di un log di livello ``error``

Di seguito un esempio di logger customizzato:

```typescript
new DAOContext({
  log: async ({ raw }) => {
    console.log(`My custom log is: ${raw}`)
  },
})
```