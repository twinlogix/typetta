# Transazioni

Una transazione è una qualunque sequenza di operazioni di lettua e scrittura che, se eseguita in modo corretto, produce una variazione nello stato di una base di dati. In caso di successo, il risultato delle operazioni deve essere permanente o persistente, mentre in caso di insuccesso si deve tornare allo stato precedente all'inizio della transazione.

  - [Le transazioni in Typetta](#le-transazioni-in-typetta)
  - [Transazioni MongoDB](#transazioni-mongodb)
  - [Transazioni SQL](#transazioni-sql)
  
## Le transazioni in Typetta

La maggior parte dei moderni database ha una qualche forma di supporto alle transazioni. Questo supporto può variare sia nella forma che nella sostanza a seconda delle caratteristiche più peculiari di ogni database. 

Offrire una funzionalità omogenea per tutti i driver supportati ci avrebbe obbligati a compromessi funzionali che avrebbero ridotto le possibilità a disposizione dell'utente. Per questo motivo l'approccio scelto in Typetta è quello di supportare le diverse strategie di gestione delle transazioni di ogni driver, mantenendo invece omogeneo lo strato di accesso al dato.

## Transazioni MongoDB

MongoDB offre un supporto completo alle transazioni su più documenti dalla versione 4.2. Tale supporto è fornito tramite il costrutto `session` che prevede un metodo `startTransaction`, come da [documentazione ufficiale](https://docs.mongodb.com/manual/core/transactions/){:target="_blank"}. Una volta avviata una transazione, la relativa `session` contiene un riferimento alla stessa e può essere per fare in modo che le chiamate ad API di Typetta vengano eseguite nel suo contesto.

Di seguito un esempio di avvio di una transazione, recupero e modifica di informazioni di un utente ed infine commit della transazione utilizzando il driver MongoDB:

```typescript
  const session = mongoClient.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  })

  try {
    const user = await dao.user.findOne({ 
      filter: { id: '1fc70958-b791-4855-bbb3-d7b02b22b39e' },
      projection: { id: true, balance: true },
      options: { session }
    )
    await dao.user.updateOne({ 
      filter: { id: user.id },
      changes: { balance: user.balance + 10 }, 
      options: { session }
    });
    await session.commitTransaction()
  } catch(e) {
    await session.abortTransaction()
  } finally {
    await session.endSession();
  }
```

Come mostrato nell'esempio, la creazione della transazione è effettuata utilizzando direttamente il driver ufficiale MongoDB, il che assicura di avere tutte le potenzialità che il database fornisce. E' poi possibile scegliere, operazione per operazione, se essa deve essere eseguita in transazione o meno, semplicemente passando o meno il parametro `session` tra le `options`.

## Transazioni SQL

Tutti i principali database SQL offrono un supporto alle transazioni. Grazie all'utilizzo della libreria KnexJS, la creazione e la gestione di una transazione risulta identica a prescindere dall'engine SQL sottostante. 

Utilzzando KnexJS, la creazione di una transazione può essere eseguita direttamente utilizzando un'istanza `knexInstance`, sulla quale invocare il metodo `transaction`, che riceve alcuni parametri specific per il contesto SQL. Per un riferimento completo di queste API è possibile controllare la [documentazione ufficiale](https://knexjs.org/#Transactions){:target="_blank"}

Di seguito un esempio di avvio di una transazione, recupero e modifica di informazioni di un utente ed infine commit della transazione utilizzando il driver KnexJS:

```typescript
  const trx = await knexInstance.transaction({ isolationLevel: 'snapshot' })

  try {
    const user = await dao.user.findOne({ 
      filter: { id: '1fc70958-b791-4855-bbb3-d7b02b22b39e' },
      projection: { id: true, balance: true },
      options: { trx }
    )
    await dao.user.updateOne({ 
      filter: { id: user.id },
      changes: { balance: user.balance + 10 }, 
      options: { trx }
    });
    await trx.commit()
  } catch(e) {
    await trx.rollback()
  }
```