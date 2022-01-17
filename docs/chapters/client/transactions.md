# Transazioni

Una transazione è una qualunque sequenza di operazioni di lettua e scrittura che, se eseguita in modo corretto, produce una variazione nello stato di una base di dati. In caso di successo, il risultato delle operazioni deve essere permanente o persistente, mentre in caso di insuccesso si deve tornare allo stato precedente all'inizio della transazione.

## Le transazioni in Typetta

La maggior parte dei moderni database ha una qualche forma di supporto alle transazioni. Questo supporto può variare sia nella forma che nella sostanza a seconda delle caratteristiche più peculiari di ogni database. 

Offrire una funzionalità omogenea per tutti i driver supportati ci avrebbe obbligati a compromessi funzionali che avrebbero ridotto le possibilità a disposizione dell'utente. Per questo motivo l'approccio scelto in Typetta è quello di supportare le diverse strategie di gestione delle transazioni di ogni driver, mantenendo invece omogeneo lo strato di accesso al dato.

