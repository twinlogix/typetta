# Security

Il concetto di sicurezza nell'accesso al dato può essere inteso a diversi livelli. In questo caso parliamo di sicurezza come un'insieme di regole che, a partire dall'identità per la quale si interroga il dato, sono in grado di stabilire se l'operazione richiesta è ammessa o vietata.

- [Security](#security)
  - [Typetta, GraphQL e Sicurezza](#typetta-graphql-e-sicurezza)
  - [Definizioni e Concetti](#definizioni-e-concetti)
    - [Esempio pratico](#esempio-pratico)
  - [Come abilitare la sicurezza?](#come-abilitare-la-sicurezza)
  - [Permissions su proiezioni dell'entità](#permissions-su-proiezioni-dellentità)
  - [Permissions e security policies](#permissions-e-security-policies)
  - [Security Domains](#security-domains)
    - [Security domain fields mapping](#security-domain-fields-mapping)
    - [Operation security domain](#operation-security-domain)
  - [Note implementative](#note-implementative)
  
## Typetta, GraphQL e Sicurezza
Implementare politiche di sicurezza all'interno dello strato di accesso al dato è un'opportunità utile allo sviluppo di qualsiasi back-end, che diventa quasi una necessità per chi cerca di implementare back-end GraphQL.

In GraphQL, infatti, ogni query permette all'utente di richiedere una porzione del grafo, generalmente senza restrizioni di profondità. Se la risoluzione delle entità connesse e relative relazioni è gestita da una libreria, così come avviene in Typetta e nella maggior parte dei moderni ORM, allora è in questo processo che occorre definire le politiche di sicurezza. Farlo a livello di singolo resolver risulterebbe estremamente complesso, ripetitivo, poco monutenibile e poco performante.

Typetta offre quindi la possibilità di definire un livello di sicurezza direttamente all'interno del `DAOContext` e lo fa come sempre in maniera completamente type-safe.

## Definizioni e Concetti

Parlando di sicurezza, in Typetta ci riferiamo ai sequenti concetti:

- **Identity**: è il soggetto per il quale viene richiesto l'accesso al dato; può essere un utente fisico o logico del sistema, un'applicazione di terze parti, un sottosistema, un super-admin, ecc ecc.

- **Resource**: rappresenta tutto ciò che deve essere messo in sicurezza, il cui accesso per conto di una `identity` può essere determinato da una serie di regole. Nello specifico, le risorse sono i singoli record di ognuna delle entità del modello dati.

- **Permission**: è un'identificatore logico sotto forma di codice testuale univoco che rappresenta un insieme di operazioni ammesse su una o più `resources`.
  
- **Security Context**: è l'insieme delle informazioni che si riferiscono ad una `identity` e che servono a stabilire se essa è o meno autorizzata ad effettuare un'operazione. Il `security context` può ad esempio contenere un insieme di `permissions` o una struttura dati complessa che definisca un insieme di `permissions` limitate ad alcune condizioni. Esso viene generalmente creato contestualmente all'autenticazione dell'`identity`. 

- **Security Domain**: rappresenta una serie di regole per il raggruppamento di `resources` ed è utilizzato per restringere l'applicazione di una o più `permissions`. Alcuni esempi di `security domain` possono essere "l'insieme delle risorse che fanno riferimento all'utente U1", "l'insieme delle risorse che fanno riferimento al tenant T1", ecc. Il concetto di `security domain` è utile a modellare `security context` in cui una `identity` ha `permissions` diverse per gruppi di `resources` diverse.

- **Security Policy**: è l'insieme delle regole che determina l'autorizzazione o il divieto ad accedere ad una specifica `resource` a seconda dell'insieme di `permissions` a disposizione dell'`identity` per cui è richiesto l'accesso.

### Esempio pratico
Di seguito un modello dati di esempio e la relativa mappatura di tutti i concetti precedentemente definiti:
```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  permissions: []
}

type UserPermission {
  userId: [ID!]
  permission: Permission!
}

enum Permissions {
  VIEW_POSTS
  MANAGE_POSTS
}

type Post {
  id: ID!
  userId: ID!
  content: String!
}
```

Dato il modello di cui sopra, possiamo dire che ogni utente di tipo `User` è un'`identity` del sistema e i post sono le `resources` da mettere in sicurezza. Abbiamo poi due `permissions`, `VIEW_POSTS` e `MANAGE_POSTS`, che possono essere assegnate ad ogni utente e che possono far riferimento a qualsiasi post o ai post creati dall'utente stesso.

Ipotizziamo ora di avere due utenti a sistema, definiti dalle seguenti due istanze di `User`:
```typescript
const mattia : User = {
  id: '1',
  firstName: 'Mattia',
  lastName: 'Minotti',
  permissions: [{ permission: 'MANAGE_POSTS' }, { permission: 'VIEW_POSTS' }]
}

const edoardo : User = {
  id: '2',
  firstName: 'Edoardo',
  lastName: 'Barbieri',
  permissions: [{ permission: 'MANAGE_POSTS', userId: ['2']}, { permission: 'VIEW_POSTS' }]
}
```

Questa configurazione indica che l'utente `Mattia` ha il permesso di vedere e gestire tutti i post del sistema, in quanto la sue permissions non hanno alcuna restrizione, mentre l'utente `Edoardo` può vedere tutti i post del sistema ma può gestire solo quelli prodotti da lui stesso.

In questo esempio vediamo il concetto di `security domain` applicato alla permission `MANAGE_POSTS` dell'utente `Edoardo`. Essa è assegnata ad un solo gruppo di risorse: "tutti i post dell'utente con id pari a 2".

Possiamo quindi immaginare, per ognuno dei due utenti, un relativo `security context`: 
```typescript
const mattiaSecurityContext = {
  userId: '1',
  permissions: {
    'MANAGE_POSTS': true,
    'VIEW_POSTS': true
  }
}
const edoardoSecurityContext = {
  userId: '2',
  permissions: {
    'MANAGE_POSTS': [{ userId: '2' }],
    'VIEW_POSTS': true
  }
}
```
Come si può vedere, il `security context` non è altro che un estratto delle informazioni riguardanti l'`identity` utili a determinare se essa può o meno accedere alle `resources`. Nel caso specifico ogni permission è collegata ad uno specifico `security domain` oppure al valore `true`, che indica tutte le risorse senza restrizioni di dominio.

L'ultima componente dello strato di sicurezza è la `security policy`. La risorsa che si vuole mettere in sicurezza è l'entità `Post`, perciò ocorre definire una `security policy` per questa entità che contenga l'insieme delle regole che determinano l'autorizzazione o il divieto di accesso ad essa.

```typescript
const postSecurityPolicy = {
  domain: ['userId'],
  permissions: {
    MANAGE_POSTS: {
      create: true,
      read: true,
      update: true,
      delete: true
    },
    VIEW_POSTS: {
      create: false,
      read: true,
      update: false,
      delete: false
    }
  }
}
```

In questo modo abbiamo definito che:
- tutti gli utenti con la permission `MANAGE_POSTS` possono effettuare ogni operazione CRUD su entità del loro `security domain`.
- tutti gli utenti con la permission `VIEW_POSTS` possono effettuare solamente la lettura su entità del loro `security domain`.

## Come abilitare la sicurezza?

Il comportamento di default di un `DAOContext` è quello di non applicare alcuna politica di sicurezza, demandando all'utilizzatore di Typetta qualsiasi controllo. Qualora si intenda però gestire la sicurezza all'interno di Typetta, è possibile abilitare questa funzionalità configurando adeguatamente il `DAOContext`:

```typescript
const daoContext = new DAOContext({
  security: {
    defaultPermissions: PERMISSION.DENY
  }
)
```
In questo modo si sta dicendo al contesto che, in assenza di altre specifiche, l'accesso ad ogni entità è completamente proibito. Così facendo, in sostanza, nessuna operazione su nessuna entità del modello dati è autorizzata.

Oltre a `DENY`, il sistema offre altre configurazioni di permission di comodità, in particolare: `ALLOW`, `DENY`, `READ_ONLY`, `CREATE_ONLY`, `UPDATE_ONLY`, `DELETE_ONLY`. E' comunque possibile avere la massima flessibilità specificando singolarmente le singole operazioni ammesse come nel seguente esempio:

```typescript
const daoContext = new DAOContext({
  security: {
    defaultPermissions: {
      create: true,
      read: true,
      update: true,
      delete: false
    }
  }
)
```

Oltre a specificare dei permessi di default per tutto il contesto, è possibile, e decisamente più frequente, definire permessi diversi per ogni entità. Di seguito un semplice esempio riferito nuovamente al modello dati precedente:
```typescript
const daoContext = new DAOContext({
  security: {
    policies: {
      user: PERMISSION.READ_ONLY,
      userPermission: PERMISSION.READ_ONLY,
      post: PERMISSION.ALLOW,
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Si noti come queste configurazioni, in gran parte dimostrative, mettano in mostra la semplicità di Typetta nella gestione della sicurezza, ma non coprano molti dei casi reali. Nelle definizioni di cui sopra, infatti, i permessi di accesso alle `resources` sono fissi e non dipendenti dall'`identity` chiamante. Nelle seguenti sezioni analizzeremo quindi come gestire questi casi più complessi.

## Permissions su proiezioni dell'entità
Abbiamo visto in precedenza come sia possibile restringere singole operazioni su una `resource`, specificando esplicitamente l'abilitazione di `create`, `read`, `update` e `delete`. 

Le operazioni di lettura molto spesso necessitano di una maggiore granularità nella definizione di permessi e restrizioni. In particolare, è molto frequente la necessità di dover esprimere permessi diversi per singoli campi o porzioni di una `resource`. 

Typetta supporta questa necessità fornendo la possibilità di specificare nel parametro `read` una qualsiasi proiezione dell'entità interessata. Ipotizzando di scrivere una `security policy` per l'entità `User`, potremmo quindi restringere l'accesso in lettura ai soli campi `id`, `firstName` e `lastName`.

```typescript
const daoContext = new DAOContext({
  security: {
    policies: {
      user: {
        read: {
          id: true,
          firstName: true,
          lastName: true,
        },
        write: false,
        update: false,
        delete: false
      },
    }
  }
)
```
## Permissions e security policies
Per poter imporre restrizioni diverse a `identity` diverse risulta molto utile aggiungere il concetto di `permission` che è in grado di raggruppare e rendere riutilizzabili le regole di accesso alle varie `resources`.

Facendo riferimento al modello dato descritto nell'[esempio](#esempio-pratico) precedente, si può definire un `DAOContext` in cui le politiche di accesso alle singole entità dipende dai permessi dell'utente:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization 
    context: ['MANAGE_POSTS', 'VIEW_POSTS'], 
    policies: {
      user: PERMISSION.READ_ONLY,
      userPermission: PERMISSION.READ_ONLY,
      post: {
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Si noti in particolare la definizione del campo `context` in cui andranno passati i permessi dell'`identity` chiamante, tipicamente caricati durante un processo di autenticazione. In corrispondenza, la `security policy` per l'entità post contiene diverse `permissions` che vengono applicate a seconda dell'`identity` chiamante.

## Security Domains

Un `security domain` rappresenta un insieme di `resources`, identificate da un insieme di valori di uno o più campi. Esso è utilizzato per restringere l'applicazione delle `permissions` con maggior granularità.

Per utilizzare un `security domain` occorre:
- definire un `security context` in cui, per ogni `permission` dell'`identity` corrente si specifica il dominio a cui essa si applica.
- definire, per ogni `security policy`, a quali domini si deve applicare.

Prendiamo ad esempio il modello dati del precedente [esempio](#esempio-pratico). In esso è definita un'entità post che è collegata all'entità utente tramite un campo `userId`. Un utente, normalmente, è autorizzato a effettuare ogni operazione solo sui suoi post, ossia quelli che hanno `userId` pari al sui id. Tutti i post che hanno il suo `userId` costituiscono un `securityDomain`. 

Di seguito un esempio di come si può configurare il `DAOContext` per fare in modo che un utente possa avere il permesso `MANAGE_POSTS` solo sui suoi post e avere la permission `VIEW_POSTS` su tutti gli altri:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization 
    context: {
      permissions: {
        'MANAGE_POSTS': [{ userId: 2}]
        'VIEW_POSTS': true
      }
    }, 
    policies: {
      post: {
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Si noti che il `security context` in questo caso non è solamente un array di `permissions`, ma una mappa in cui per ogni permission è possibile restringere il dominio di applicazione. La specifica `'MANAGE_POSTS': [{ userId: 2}]` è da intendersi come: l'`identity` corrente ha la `permission` `MENAGE_POSTS` per tutte le `resources` che hanno il campo `userId = 2`. Il valore `true`, invece, indica che la specifica `permission` non ha alcuna restrizione di dominio.

Data questa configurazione, quindi, il sistema autorizzerà l'utente ad effettuare qualsiasi operazione sui suoi post, mentre la sola operazione di lettura su tutti gli altri.

### Security domain fields mapping

Ci sono casi in cui una specifica entità del modello dati non ha alcuni campi del `security domain`, oppure li ha ma con un nome diverso. Per entrambi i casi è possibile specificare un mapping su ogni `security policy`. Se ad esempio l'entità `Post` fosse definita come:

```typescript
type Post {
  id: ID!
  creatorId: ID!
  content: String!
}
```

Allora la `security policy` di cui sopra diventerebbe:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization 
    context: {
      permissions: {
        'MANAGE_POSTS': [{ userId: 2}]
        'VIEW_POSTS': true
      }
    }, 
    policies: {
      post: {
        domain: {
          userId: 'creatorId'
        },
        permissions: {
          MANAGE_POSTS: PERMISSION.ALLOW,
          VIEW_POSTS: PERMISSION.READ_ONLY,
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```

Nel caso un campo del `security domain` debba essere ignorato in una specifica `security policy` occorre specificare il valore `null` nel mapping di quel campo.

### Operation security domain

Ogni volta che viene eseguita un'operazione di un `DAOContext` su cui è specificata una configurazione di sicurezza, Typetta va ad applicare tutte le regole precedentemente descritte per stabilire se l'operazione è ammessa o vietata. In presenza di `security policy` diverse per `security domain` diversi, non sapendo quale `security domain` sarà target dell'operazione, il sistema applica un'intersezione tra tutte le `security policies` previste per l'entità in oggetto. Intersezione significa che un'operazione è ammessa (o un campo visibile) solo se è ammessa in tutte le `security policies`.

Ipotizziamo di avere due livelli di visibilità dei post, una che permette la lettura dell'interno post `VIEW_POSTS` e una che permette di leggere solo il contenuto e non l'autore `VIEW_POSTS_CONTENT`. Ipotizziamo poi che un utente abbia queste due `permissions` su `security domains` diversi. Di seguito la definizione del `DAOContext`:

```typescript
const daoContext = new DAOContext({
  security: {
    // context is generated by authorization 
    context: {
      permissions: {
        'VIEW_POSTS': [{ userId: 2}],
        'VIEW_POSTS_CONTENT': true
      }
    }, 
    policies: {
      post: {
        domain: {
          userId: 'creatorId'
        },
        permissions: {
          VIEW_POSTS: PERMISSION.READ_ONLY,
          VIEW_POSTS_CONTENT: {
            read: {
              id: true,
              content: true,
            }
          },
        },
        defaultPermissions: PERMISSION.DENY,
      },
    }
    defaultPermissions: PERMISSION.DENY
  }
)
```
Data questa configurazione, eseguendo una semplice operazione di `findAll` sul `DAO` dell'entità `Post`, il sistema applica la `permission` `VIEW_POSTS_CONTENT` in quanto, in assenza di un `security domain` esplicito, essa è la più restrittiva. Di conseguenza la seguente operazione:
```typescript
const posts = dao.post.findAll();
```
Genera un errore di accesso non consentito perchè l'utente non ha l'autorizzazione ad accedere al campo `userId` per tutti i post. La seguente, invece, è autorizzata in quanto permessa a prescindere dal `security domain`:
```typescript
const posts = dao.post.findAll({
  projection: {
    id: true,
    content: true,
  }
});
```

Per eseguire l'operazione di `findAll` senza restringere la richiesta ad alcuni campi occorre restringere la richiesta al `security domain` `userId = 2`. Per farlo Typetta utilizza il meccanismo di operation metadata che permette di specificare dati aggiuntivi per la richiesta:
```typescript
const posts = dao.post.findAll({
  metadata: {
    userId: [2]
  }
});
```
Questa richiesta non genera alcun errore e, al contrario, ritorna tutti i post dell'utente 2 e di questi post tutti i campi in quanto ammessi dalla `permission` `VIEW_POSTS`.
## Note implementative
Lo strato di sicurezza di Typetta è completamente implementato attraverso il meccanismo dei [middlewares](../client/middlewares.md), di cui rappresenta un ottimo esempio. 

Tutte le `security policies` vengono applicate a partire dagli input delle operazioni, dal `security context` e da eventuali `metadata` dell'operazioni. Tali controlli sono eseguiti prima dell'esecuzione delle operazioni, quindi nessuna query viene eseguita se non autorizzata e nessun controllo viene effettuato sui singoli record ritornati. In questo modo i controlli di sicurezza sono effettuati in maniera altamente efficiente.




