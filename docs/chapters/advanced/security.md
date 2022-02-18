# Security

Il concetto di sicurezza nell'accesso al dato può essere inteso a diversi livelli. In questo caso parliamo di sicurezza come un'insieme di regole che, a partire dall'identità per la quale si interroga il dato, sono in grado di stabilire se l'operazione richiesta è ammessa o negata.

- [Security](#security)
  - [Definizioni e Concetti](#definizioni-e-concetti)
  - [Come abilitare la sicurezza?](#come-abilitare-la-sicurezza)
  - [Permissions e Security Policies](#permissions-e-security-policies)
  - [Utilizzare i Security Domains](#utilizzare-i-security-domains)
  - [Note implementative](#note-implementative)
  
## Definizioni e Concetti

Parlando di sicurezza, in Typetta ci riferiamo ai sequenti concetti:

- **Identity**: è il soggetto per il quale viene richiesto l'accesso al dato; può essere un utente fisico o logico del sistema, un'applicazione di terze parti, un sottosistema, un super-admin, ecc ecc.

- **Resource**: rappresenta tutto ciò che deve essere messo in sicurezza, il cui accesso per conto di una `identity` può essere determinato da una serie di regole. Nello specifico, le risorse sono i singoli record di ognuna delle entità del modello dati.

- **Permission**: è un'identificatore logico sotto forma di codice testuale univoco che rappresenta un insieme di operazioni ammesse su una o più `resources`.
  
- **Security Context**: è l'insieme delle informazioni che si riferiscono ad una `identity` e che servono a stabilire se essa è o meno autorizzata ad effettuare un'operazione. Il `security context` può ad esempio contenere un insieme di `permissions` o una struttura dati complessa che definisca un insieme di `permissions` limitate ad alcune condizioni. Esso viene generalmente creato contestualmente all'autenticazione dell'`identity`. 

- **Security Domain**: rappresenta una serie di regole per il raggruppamento di `resources` ed è utilizzato per restringere l'applicazione di una o più `permissions`. Alcuni esempi di `security domain` possono essere "l'insieme delle risorse che fanno riferimento all'utente U1", "l'insieme delle risorse che fanno riferimento al tenant T1", ecc. Il concetto di `security domain` è utile a modellare `security context` in cui una `identity` ha `permissions` diverse per gruppi di `resources` diverse.

- **Security Policy**: è l'insieme delle regole che determina l'autorizzazione o il divieto ad accedere ad una specifica `resource` a seconda dell'insieme di `permissions` a disposizione dell'`identity` per cui è richiesto l'accesso.

Di seguito un esempio pratico di tutti i precedenti concetti a partire da un semplice modello dati:

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

Dato il modello di cui sopra, possiamo dire che lo `user` è un'`identity` del sistema e i `post` sono le `resources` da mettere in sicurezza. Abbiamo poi due `permissions`: `VIEW_POSTS` e `MANAGE_POSTS`.

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

In questo esempio vediamo il concetto di `security domain` applicato alla permission `MANAGE_POSTS` dell'utente `Edoardo` che identifica il gruppo di risorse "tutti i post dell'utente con id pari a 2".

Partendo da questa definizione del modello dati e dalle specifiche istanze di utenti, possiamo immaginare di seguito i loro `security context`: 
```typescript
const mattiaSecurityContext = {
  userId: '1',
  permissions: {
    'MANAGE_POSTS': {},
    'VIEW_POSTS': {}
  }
}
const edoardoSecurityContext = {
  userId: '2',
  permissions: {
    'MANAGE_POSTS': [{ userId: '2' }],
    'VIEW_POSTS': {}
  }
}
```

Come si può vedere, il `security context` non è altro che un estratto delle informazioni riguardanti l'`identity` utili a determinare se essa può o meno accedere alle `resources`.

Andiamo ora a definire la security policy dell'entità `Post`, ossia l'insieme delle regole che determinano l'autorizzazione o il divieto di accesso alla `resource` sulla base delle `permissions`.

```typescript
const postSecurityPolicy = {
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

## Come abilitare la sicurezza?


## Permissions e Security Policies

## Utilizzare i Security Domains

## Note implementative