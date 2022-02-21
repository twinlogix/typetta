# Security

Il concetto di sicurezza nell'accesso al dato può essere inteso a diversi livelli. In questo caso parliamo di sicurezza come un'insieme di regole che, a partire dall'identità per la quale si interroga il dato, sono in grado di stabilire se l'operazione richiesta è ammessa o vietata.

  - [Typetta, GraphQL enom Sicurezza?](#typetta-graphql-e-sicurezza)
  - [Definizioni e Concetti](#definizioni-e-concetti)
    - [Esempio pratico](#esempio-pratico)
  - [Come abilitare la sicurezza?](#come-abilitare-la-sicurezza)
  - [Permissions e security policies](#permissions-e-security-policies)
  - [Permissions su proiezioni dell'entità](#permissions-su-proiezioni-dellentità)
  - [Utilizzare i Security Domains](#utilizzare-i-security-domains)
  - [Note implementative](#note-implementative)
  
## Typetta, GraphQL e Sicurezza?
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

L'ultima componente dello strao di sicurezza è la `security policy`. La risorsa che si vuole mettere in sicurezza è l'entità `Post`, perciò ocorre definire una `security policy` per questa entità che contenga l'insieme delle regole che determinano l'autorizzazione o il divieto di accesso ad essa.

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

Oltre a specificare dei permessi di default per tutto il contesto, è possibile e decisamente frequente definire permessi diversi per ogni entità. Di seguito un semplice esempio riferito nuovamente al modello dati definito in precedenza:
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

Si noti come queste configurazioni, in gran parte dimostrative, mettano in mostra la semplicità e la gradualità di Typetta nella gestione della sicurezza, ma non coprano molti dei casi reali. Nelle definizioni di cui sopra, infatti, i permessi di accesso alle `resources` sono fissi e non dipendenti dall'`identity` chiamante. Nelle seguenti sezioni analizzeremo quindi come gestire i casi più complessi.
## Permissions e security policies


## Permissions su proiezioni dell'entità

## Utilizzare i Security Domains


## Note implementative