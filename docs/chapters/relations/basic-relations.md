---
title: Cosa sono le Relazioni?
menus:
  relations:
    weight: 1
---

# Relations

In questo capitolo vengono descritte i tre tipi di relazioni che è possibile definire nello schema GraphQL.

## Inner relations

```graphql
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
