# Cos'è Typetta

Typetta è un **ORM open-source** utilizzabile sulle piattaforme Node JS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo ed Electron. E' scritto interamente in linguaggio TypeScript ed il suo obiettivo è di fornire un accesso evoluto e completamente tipato a tutti i **principali database SQL** (MySQL, PostgreSQL, Microsoft SQL Server, SQLLite3, CockroachDB, MariaDB, Oracle e Amazon Redshift) e al database NoSQL **MongoDB**.

Typetta può essere utilizzato in qualsiasi backend TypeScript (incluse applicazioni serverless e microservizi), ma il nostro consiglio è di utilizzarlo nello sviluppo di backend **GraphQL**, perchè noi amiamo GraphQL.

  - [Come si usa Typetta?](#come-si-usa-typetta)
  - [Principali Funzonalità](#principali-funzionalità)
  - [Perchè Typetta?](#perchè-typetta)
  
## Come si usa Typetta?
In Typetta tutto ruota intorno al *modello applicativo*, cioè all'insieme delle entità che rappresentano il dominio applicativo e alle loro relazioni. Questo modello viene definito in linguaggio standard GraphQL, sfruttandone i costruttti di base (scalari, tipi, enumerazioni, ecc.) ed alcune direttive custom.

A partire dal modello, frutto dell'analisi del dominio, Typetta fornisce una serie di generatori di codice in grado di produrre:

- I tipi in linguaggio TypeScript di ciascuna delle entità del modello.

- I DAO (Data Access Object) di ciascuna entità che è storicizzata in una sorgente dati. Ogni DAO è un oggetto su cui l'utente può invocare le più avanzate operazioni CRUD.

- Un DAOContext, ossia un oggetto di contesto su cui configurare le varie sorgenti dati e da cui è possibile recuperare il riferimento ad ogni DAO.

## Principali Funzionalità

Di seguito le principali funzionalità che contraddistinguono Typetta:

- Supporto completo ai principali database SQL e a MongoDB.
- Multi database, inclusa la possibilità di query cross database.
- Connessioni multiple e connection pooling.
- Relazioni tra entità: 1-1, 1-n, n-m.
- Typing dinamico dipendete dalle proiezioni di dato richieste.
- Supporto di filtri geospaziali.
- Paginazione.
- Estensibile tramite sistema di middlewares.
- Scalari customizzati e relativa serializzazione su database.
- Gestione ID autogenerati.
- Regole di validazione.
- Campi calcolati.
- Possibilità di creare query completamente customizzate.
- Implementazione security policies di accesso al dato.
- Supporto embedded documents sia su MongoDB che su SQL.
- Generazione di codice automatica.
- Integrazione semplice con backend GraphQL.
- Transazioni.
- Logging.

## Perchè Typetta?

Typetta nasce dalla necessità di avere un ORM completamente tipato in grado di accedere sia a database SQL che NoSQL e di garantire una grande produttività senza rinunciare alla flessibilità.

L'approccio utilizzato nella progettazione di ogni singolo componente di Typetta è quello di assicurare semplicità e velocità di sviluppo, aggiungendo complessità (fino a coinvolgere l'accesso diretto alla sorgente dati) solo quando questo è giustificato.

Perchè usare Typetta rispetto ad altri ORM? Di seguito alcune caratteristiche peculiari:

- E' l'unico ORM TypeScript ad avere un supporto completo **sia a database SQL che MongoDB**.
  
- Ha un sistema di **typing** molto rigoroso che sfrutta al 100% le potenzialità del linguaggio TypeScript per fornire tipi di ritorno dinamici sulla base delle proiezioni di dato richieste.

- Prevede la definizione di un modello applicativo in linguaggio standard **GraphQL**, il che apre alla possibilità di utilizzare un ampio ecosistema di strumenti e framework di terze parti sviluppati su questo standard.
