# Relazioni

Una relazione è una connessione tra due entità del modello applicativo. Tale connessione permette l'accesso di una o più entità collegate in entrambe le direzioni, per rendere la consultazione del dato più veloce ed agevole.

In Typetta le relazioni tra entità sono definite tramite l'aggiunta di **riferimenti** tra un'entità ed un altra.

## Riferimento tra Entità

In Typetta una relazione è definita dichiarando su ogni entità connessa il riferimento alla controparte. E' possibile, se lo si vuole, creare anche delle connessioni mono direzionali da un'entità ad un'altra senza avere la connesione inversa.

Per definire un riferimento ad un'altra entità, Typetta mette a disposizione tre diverse direttive:
- [@innerRef](#innerref)
- [@foreignRef](#innerref)
- [@relationEntityRef](#relationEntityRef)

### InnerRef

Un `@innerRef` è un riferimento tra un campo dell'entità sorgente e l'id dell'entità destinazione. Prendiamo come esempio il seguente modello:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  postsId: [ID!]
  posts: [Post!] @innerRef
}

type Post @mongoEntity {
  id: ID! @id
  content: String!
}
```

In questo caso il campo `posts` dell'entità `User` è un campo virtuale che non viene valorizzato direttamente sulla collection dell'entità Utente, ma viene popolato successivamente caricando i post referenziati dal campo adiacente `postsId`.

Si chiama `@innerRef` perchè il riferimento alle entità collegate è all'interno dell'entità sorgente. Per convenzione, tale riferimento (nell'esempio il campo `postsId`) deve avere lo stesso identico nome del campo relazione con il suffisso `Id`. Sempre per convenzione, il campo dell'entità connessa che viene messo in relazione è il campo annotato come `@id`. 

Entrambe queste configurazioni possono comunque essere esplicitate e modificate, si veda il più complesso esempio di seguito:
```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  postsAnotherId: [ID!]
  posts: [Post!] @innerRef(refFrom: "postsAnotherId", refTo: "anotherId")
}

type Post @mongoEntity {
  id: ID! @id
  anotherId: ID!
  content: String!
}
```


Typetta supporta tutte e tre le tipiche cardinalità di relazione:
## Relazioni 1-1

Le relazioni uno-a-uno (1-1) sono relazioni in cui al massimo un recordo è collegato ad entrambi i lati della relazione. Nell'esempio di seguito abbiamo una relazione tra `Utente` e `Profilo` in cui un utente ha uno ed un solo profilo ed un profilo è di uno ed un solo utente:

```typescript
type User @mongoEntity {
  id: ID! @id
  profile: UserProfile @foreignRef(refFrom: "userId")
}

type UserProfile @mongoEntity {
  id: ID! @id
  userId: ID
  user: User @innerRef
  firstName: String
  lastName: String
}
```



## Inner relations

```typescript
type User @mongoEntity {
  id: ID! @id
  name: String!
  postsId: [ID!]
  posts: [Post!] @innerRef(refFrom: "postsId")
}

type Post @sqlEntity {
  id: ID! @id
  content: String!
}
```

## Foreign relations

## Entity relations

Questo tipo di relazione si basa su un'entità di supporto. Permette di definire relazione n<->m anche su sistemi SQL dove non è possibile sfruttare strutture ad array.

```graphql
type RefPointer = { refFrom: String!, refTo: String }
directive @relationEntityRef(entity: String!, refThis: RefPointer, refOther: RefPointer) on FIELD_DEFINITION
```

- `entity`: nome dell'entità di supporto
- `refThis`: entità sorgente
  - `refFrom`: nome del campo nell'entità di supporto a cui relazionare `refTo`
  - `refTo`: nome del campo nell'entità sorgente a cui relazionare `refFrom`
- `refOther`: entità destinazione
  - `refFrom`: nome del campo nell'entità di supporto a cui relazionare `refTo`
  - `refTo`: nome del campo nell'entità destinazione a cui relazionare `refFrom`

Esempio 1:

```graphql
type User @sqlEntity {
  id: ID! @id
  name: String!
  friends: [User!] @relationEntityRef(entity: "Friends", refThis: { refFrom: "from" }, refOther: { refFrom: "to" })
}

type Friends @sqlEntity {
  id: ID! @id
  from: ID!
  to: ID!
}
```

Carico tutti gli utenti con un massimo di 10 amici per utente.

```typescript
const users = await dao.user.findAll({
  projection: { name: true, friends: { name: true } },
  relations: { friends: { limit: 10 } }
})
```

Esempio 2:

È possibile omettere `refThis` e `refOther` se i campi nell'entità di supporto hanno i nomi nel formato `${name}Id` dove `name` è il nome delle entità collegate. `AuthorBook` infatti ha i due campi `authorId` e `bookId` che rispettano questo formalismo.

```graphql
type Author @mongoEntity {
  id: ID! @id
  name: String!
  books: [Book!] @relationEntityRef(entity: "AuthorBook")
}

type Book @mongoEntity {
  id: ID! @id
  title: String!
  content: String!
  authors: [Author!] @relationEntityRef(entity: "AuthorBook")
}

type AuthorBook @mongoEntity {
  id: ID! @id
  authorId: ID!
  bookId: ID!
}
```

Carico i primi 20 libri ordinati per nome, con relativi autori ordinati per nome.

```typescript
const users = await dao.book.findAll({
  projection: { title: true, authors: { name: true } },
  relations: { authors: { sorts: { name: SortDirection.ASC } } } ,
  sorts: { title: SortDirection.ASC },
  start: 0,
  limit: 20
})
```
