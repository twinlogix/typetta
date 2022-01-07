# Relazioni

Una relazione è una connessione tra due entità del modello applicativo. Tale connessione permette l'accesso di una o più entità collegate in entrambe le direzioni, per rendere la consultazione del dato più veloce ed agevole.

In Typetta le relazioni tra entità sono definite tramite l'aggiunta di **riferimenti** tra un'entità ed un altra.

  - [Riferimento tra Entità](#riferimento-tra-entità)
    - [InnerRef](#innerref)
    - [ForeignRef](#foreignref)
    - [RelationEntityRef](#relationentityref)
  - [Cardinalità Relazioni](#cardinalità-relazioni)
    - [Relazione 1-1](#relazione-1-1)
    - [Relazione 1-n](#relazione-1-n)
    - [Relanzione n-m](#relanzione-n-m)
  - [Relazioni ricorsive](#relazioni-ricorsive)

## Riferimento tra Entità

In Typetta una relazione è definita dichiarando su ogni entità connessa il riferimento alla controparte. E' possibile, se lo si vuole, creare anche delle connessioni mono direzionali da un'entità ad un'altra senza avere la connesione inversa.

Per definire un riferimento ad un'altra entità, Typetta mette a disposizione tre diverse direttive: `@innerRef`, `@foreignRef` e `@relationEntityRef`

### InnerRef

Un `@innerRef` identifica una connessione tramite un riferimento tra un campo dell'entità sorgente e l'id dell'entità destinazione. Prendiamo come esempio il seguente modello:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
}

type Post @mongoEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

In questo caso il campo `user` dell'entità `Post` è un campo virtuale che non viene valorizzato direttamente sulla collection dell'entità `Post`, ma viene popolato successivamente caricando l'utente referenziato dal campo adiacente `userId`.

Si chiama `@innerRef` perchè il riferimento alle entità collegate si trova all'interno dell'entità contenente la relazione. Per convenzione, tale riferimento (nell'esempio il campo `userId`) deve avere lo stesso identico nome del campo relazione con il suffisso `Id`. Sempre per convenzione, il campo dell'entità connessa che viene messo in relazione è il campo annotato come `@id`. Quindi in questo caso `Post.userId` fa riferimento a `User.id`.

Entrambe queste configurazioni possono comunque essere modificate ed esplicitate dall'utente per avere più flessibilità, si veda il più complesso esempio di seguito:
```typescript
type User @mongoEntity {
  id: ID! @id
  anotherId: ID!
  firstName: String
  lastName: String
}

type Post @mongoEntity {
  id: ID! @id
  anotherUserId: ID!
  user: User! @innerRef(refFrom: "anotherUserId", refTo: "anotherId")
  content: String!
}
```

### ForeignRef

Un `@foreignRef` identifica una connessione complementare rispetto alla precedente `@innerRef` e prende questo nome perchè il riferimento alle entità collegate si trova nelle entità collegate stesse e non nell'entità contenente la relazione. Prendiamo come esempio il modello precedente che andiamo ad arricchire con un riferimento tra utente ed i suoi post:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @mongoEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

Anche in questo caso il campo `posts` dell'entità `User` è un campo virtuale che non viene valorizzato direttamente sulla collection dell'entità User, ma viene popolato successivamente, su richiesta, quando vengono caricati tutti i post di un utente.

In questo caso, contrariamente a quanto era per gli `@innerRef`, è sempre necessario specificare un parametro `refFrom` che identifica il campo dell'entità connessa che fa riferimento all'id dell'entità destinazione. Nell'esempio abbiamo che `Post.userId` fa riferimento a `User.id`. 

Anche in questo caso c'è la possibilità di esplicitare anche il parametro `refTo` per gestire casi più complessi. Si veda l'esempio di seguito:
```typescript
type User @mongoEntity {
  id: ID! @id
  anotherId: ID!
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "anotherUserId", refTo: "anotherId")
}

type Post @mongoEntity {
  id: ID! @id
  anotherUserId: ID!
  user: User! @innerRef(refFrom: "anotherUserId", refTo: "anotherId")
  content: String!
}
```

### RelationEntityRef 

Può capitare, tipicamente nelle relazioni con cardinalità n-m, che due entità siano collegate da riferimenti che non risiedono né nell'una né nell'altra, bensì in un'entità terza. Ipotizziamo un modello applicativo come il seguente:

```typescript
type Post @mongoEntity {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory")
}

type Category @mongoEntity {
  id: ID! @id
  name: String!
}

type PostCategory @mongoEntity {
  id: ID! @id
  postId: ID!
  categoryId: ID!
}
```

Ogni post può avere più categorie ed ogni categoria può avere più post. Sarebbe stato possibile creare un `@foreignRef` tra Post e PostCategory ed un ulteriore `@innerRef` tra PostCategory e Category, ma così facendo si obbligava il modello applicativo ad esplicitare la presenza di una collection (o una tabella su SQL) di collegamento puramente legata alla rappresentazione del dato su database.

Grazie al riferimento `@relationEntityRef` la relazione `Post.categories` risulta invece essere molto più chiara e trasparente per l'utilizzatore. Si noti che questa direttiva, come le precedenti, si basa su una convenzione per cui i campi all'interno dell'entità di collegamento devono avere lo stesso nome dell'entità collegata, con iniziale minuscola, seguito da `Id`. 

Come nei casi precedenti, tuttavia, è possibile esplicitare ogni signolo riferimento, come nell'esempio seguente:

```typescript
type Post @mongoEntity {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory", refThis: { refFrom: "idOfAPost" }, refOther: { refFrom: "idOfACategory" })
}

type Category @mongoEntity {
  id: ID! @id
  name: String!
}

type PostCategory @mongoEntity {
  id: ID! @id
  idOfAPost: ID!
  idOfACategory: ID!
}
```

Nell'esempio di cui sopra, come si può intuire, `PostCategory.idOfAPost` fa riferimento a `Post.id`, mentre `PostCategory.idOfACategory` fa riferimento a `Category.id`.

## Cardinalità Relazioni

Utilizzando i riferimenti descritti nelle sezioni precedenti, Typetta permette di gestire con la massima flessibilità relazioni tra entità con ogni tipo di cardinalità. Di seguito vengono mostrati alcuni esempi di relazioni 1-1, 1-n ed n-m. 

### Relazione 1-1

Di seguito un esempio di relazione 1-1 fra un utente e il suo profilo:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  profile: Profile @foreignRef(refFrom: "userId") 
}

type Profile @mongoEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  language: String!
}
```

### Relazione 1-n

Di seguito un esempio di relazione 1-n fra un utente ed i suoi post:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @mongoEntity {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

### Relanzione n-m

Di seguito un esempio di relazione n-m fra post e categorie:

```typescript
type Post @mongoEntity {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory", refThis: { refFrom: "idOfAPost" }, refOther: { refFrom: "idOfACategory" })
}

type Category @mongoEntity {
  id: ID! @id
  name: String!
}

type PostCategory @mongoEntity {
  id: ID! @id
  idOfAPost: ID!
  idOfACategory: ID!
}
```

## Relazioni ricorsive

Una relazione può essere connettere anche un'entità con sè stessa e può essere di qualsiasi cardinalità. Le relazioni ricorsive sono gestite nello stesso modo delle altre relazioni, tramite le direttive `@innerRef`, `@foreignReg` e `@relationEntityRef`.

Di seguito un esempio si relazione ricorsiva con cardinalità 1-1:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  fatherId: ID!
  father: User! @innerRef
}
```

Con cardinalità 1-n:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  sonsId: [ID!]
  sons: [User!] @innerRef
}
```

E con cardinalità n-m tramite `@relationEntityRef`:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  friends: [User!] @relationEntityRef(entity: "Friends", refThis: { refFrom: "from" }, refOther: { refFrom: "to" })
}

type Friends @mongoEntity {
  id: ID! @id
  from: ID!
  to: ID!
}
```
