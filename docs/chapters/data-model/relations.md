# Relations

A relation is a connection between two entities of the data model. This connection allows the user to load entites starting from a root and selecting a projection of an entire graph, making data loading a faster and easier activity.

In Typetta relations between entities are defined by adding **references** between one entity and another.

  - [References between Entities](#references-between-entities)
    - [InnerRef](#innerref)
    - [ForeignRef](#foreignref)
    - [RelationEntityRef](#relationentityref)
  - [Cardinality](#cardinality)
    - [1-1 relation](#1-1-relation)
    - [1-n relation](#1-n-relation)
    - [n-m relation](#n-m-relation)
  - [Recursive Relations](#recursive-relations)

## References between Entities

In Typetta a relation is defined by creating a reference from a field and to the counterpart on each connected entity. It is possible, if desired, to also create mono-directional connections from one entity to another without having the inverse connection.

To define a reference to another entity, Typetta provides three different directives: `@innerRef`, `@foreignRef` and `@relationEntityRef`.

### InnerRef


`@ innerRef` identifies a connection through a reference between a field of the source entity and the id of the target entity. Let's take the following model as an example:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

In this case, the `user` field of the `Post` entity is a virtual field that isn't stored directly in the data source inside the `Post` entity, but is subsequently populated by loading the user referenced by the adjacent `userId` field.

It is called `@innerRef` because the reference to the connected entities is inside the entity containing the relation. By convention, this reference (in the example the `userId` field) must have the exact same name as the relation field with the suffix `Id`. Again by convention, the connected entity field that is referenced is the field annotated as `@id`. So in this case `Post.userId` refers to `User.id`.

Both of these configurations can still be modified and made explicit by the user to have more flexibility, see the more complex example below:

```typescript
type User @entity @mongodb {
  id: ID! @id
  anotherId: ID!
  firstName: String
  lastName: String
}

type Post @entity @mongodb {
  id: ID! @id
  anotherUserId: ID!
  user: User! @innerRef(refFrom: "anotherUserId", refTo: "anotherId")
  content: String!
}
```

### ForeignRef

`@foreignRef` identifies a complementary connection to the previous `@innerRef` and gets this name because the reference to the connected entities is the connected entities themselves and not in the entity containing the relation. Let's take as an example the previous model that we are going to enrich with a reference between the user and his posts:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

Also in this case the `posts` field of the `User` entity is a virtual field that isn't stored on the data source structure that represent the User entity, but is subsequently populated, on request, from another data source structure (another table or collection).

In this case, contrary to what was the case with `@innerRef`, it is always necessary to specify a `refFrom` parameter that identifies the connected entity field referencing the target entity identifier. In the example we have that `Post.userId` refers to `User.id`.

There is also the possibility to specify the `refTo` parameter to handle more complex cases, as demostated in the following example:

```typescript
type User @entity @mongodb {
  id: ID! @id
  anotherId: ID!
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "anotherUserId", refTo: "anotherId")
}

type Post @entity @mongodb {
  id: ID! @id
  anotherUserId: ID!
  user: User! @innerRef(refFrom: "anotherUserId", refTo: "anotherId")
  content: String!
}
```

### RelationEntityRef 

Relations with cardinality n-m are tipically designed using a third entity that connects both other entities referencing them by id. Let's assume a data model like the following:

```typescript
type Post @entity @mongodb {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory")
}

type Category @entity @mongodb {
  id: ID! @id
  name: String!
}

type PostCategory @entity @mongodb {
  id: ID! @id
  postId: ID!
  categoryId: ID!
}
```

Each post can have multiple categories and each category can have multiple posts. It would have been possible to create a `@foreignRef` between Post and PostCategory and a further `@innerRef` between PostCategory and Category, but doing so forced the data model to make explicit the presence of a purely connection structure (a MongoDB collection or SQL table) linked to the representation of the data on the database.

Thanks to the reference `@relationEntityRef` the relation `Post.categories` turns out to be much clearer and more transparent for the user. Note that this directive, like the previous ones, is based on a convention that fields within the connecting entity must have the same name as the connected entities, with a lowercase initial, followed by `Id`.

As in the previous cases, however, each single reference can be made explicit:

```typescript
type Post @entity @mongodb {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory", refThis: { refFrom: "idOfAPost" }, refOther: { refFrom: "idOfACategory" })
}

type Category @entity @mongodb {
  id: ID! @id
  name: String!
}

type PostCategory @entity @mongodb {
  id: ID! @id
  idOfAPost: ID!
  idOfACategory: ID!
}
```

Nell'esempio di cui sopra, come si può intuire, `PostCategory.idOfAPost` fa riferimento a `Post.id`, mentre `PostCategory.idOfACategory` fa riferimento a `Category.id`.

In the above example, as you can guess, `PostCategory.idOfAPost` refers to `Post.id`, while `PostCategory.idOfACategory` refers to `Category.id`.

## Cardinality

Using references as described in the previous sections, Typetta allows you to manage relations between entities with any type of cardinality and maximum flexibility. Some examples of relations 1-1, 1-n and n-m are shown below.

### 1-1 relation

Following is an example of a 1-1 relation between a user and their profile:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  profile: Profile @foreignRef(refFrom: "userId") 
}

type Profile @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  language: String!
}
```

### 1-n relation

Below is an example of a 1-n relation between a user and his posts:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}
```

### n-m relation

Finally an example of an n-m relation between posts and categories:

```typescript
type Post @entity @mongodb {
  id: ID! @id
  content: String!
  categories: [Category!] @relationEntityRef(entity: "PostCategory", refThis: { refFrom: "idOfAPost" }, refOther: { refFrom: "idOfACategory" })
}

type Category @entity @mongodb {
  id: ID! @id
  name: String!
}

type PostCategory @entity @mongodb {
  id: ID! @id
  idOfAPost: ID!
  idOfACategory: ID!
}
```

## Recursive Relations

A relation can also connect an entity with itself and can be of any cardinality. Recursive relations are handled in the same way as other relations, through the `@innerRef`,` @foreignReg` and `@relationEntityRef` directives.

Here is an example of a recursive relationship with cardinality 1-1:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  fatherId: ID!
  father: User! @innerRef
}
```

With 1-n cardinality:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  sonsId: [ID!]
  sons: [User!] @innerRef
}
```

Anc with n-m cardinality using `@relationEntityRef`:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  friends: [User!] @relationEntityRef(entity: "Friends", refThis: { refFrom: "from" }, refOther: { refFrom: "to" })
}

type Friends @entity @mongodb {
  id: ID! @id
  from: ID!
  to: ID!
}
```
