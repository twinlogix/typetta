# Relationships

A relationship is a connection between two entities of the data model. This connection allows the user to load entities starting from a root and select a projection of an entire graph, making data loading faster and easier.

In Typetta, relationships between entities are defined by adding **references** between one entity and another.

  - [References between Entities](#references-between-entities)
    - [InnerRef](#innerref)
    - [ForeignRef](#foreignref)
    - [RelationEntityRef](#relationentityref)
  - [Cardinality](#cardinality)
    - [1-1 relation](#1-1-relation)
    - [1-n relation](#1-n-relation)
    - [n-m relationship](#n-m-relationship)
  - [Recursive Relationships](#recursive-relationships)

## References between Entities

In Typetta, a relationship is defined by creating a reference from a field to the counterpart on each connected entity. It is possible, if desired, to also create mono-directional connections from one entity to another without having the inverse connection.

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

In this case, the `user` field of the `Post` entity is a virtual field that is not stored directly in the data source inside the `Post` entity, but is subsequently populated by loading the user referenced by the adjacent `userId` field.

It is called `@innerRef` because the reference to the connected entities is inside the entity containing the relationship. By convention, this reference (in the example the `userId` field) must have the exact same name as the relation field with the suffix `Id`. Again by convention, the connected entity field that is referenced is the field annotated as `@id`. So, in this case, `Post.userId` refers to `User.id`.

Both of these configurations can still be modified and made explicit by the user to have more flexibility; see the more complex example below:

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

`@foreignRef` identifies a complementary connection to the previous `@innerRef` and is so named because the reference to the connected entities is the connected entities themselves and not in the entity containing the relationship. Let's take as an example the previous model that we are going to enrich with a reference between the user and their posts:

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

Again in this case the `posts` field of the `User` entity is a virtual field that is not stored on the data source structure that represents the User entity, but is subsequently populated, on request, from another data source structure (another table or collection).

Here, unlike the case of `@innerRef`, it is always necessary to specify a `refFrom` parameter that identifies the connected entity field referencing the target entity identifier. In the example, `Post.userId` refers to `User.id`.

It is also possible to specify the `refTo` parameter to handle more complex cases, as demonstrated in the following example:

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

Relationships with cardinality n-m are typically designed using a third entity that connects both other entities referencing them by id. Let's assume a data model like the following:

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

Thanks to the reference `@relationEntityRef`, the relationship `Post.categories` is much clearer and more transparent for the user. Note that this directive, like the previous ones, is based on a convention that fields within the connecting entity must have the same name as the connected entities, with a lower initial case, followed by `Id`.

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

In the above example, as you can guess, `PostCategory.idOfAPost` refers to `Post.id`, while `PostCategory.idOfACategory` refers to `Category.id`.

In the above example, as you can guess, `PostCategory.idOfAPost` refers to `Post.id`, while `PostCategory.idOfACategory` refers to `Category.id`.

## Cardinality

Using references as described in the previous sections, Typetta allows you to manage relations between entities with any type of cardinality and maximum flexibility. Some examples of relations 1-1, 1-n and n-m are shown below.

### 1-1 relation

Below is an example of a 1-1 relation between a user and their profile:

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

Below is an example of a 1-n relationship between a user and their posts:

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

### n-m relationship

Lastly, an example of an n-m relationship between posts and categories:

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

## Recursive Relationships

A relationship can also connect an entity with itself and can be of any cardinality. Recursive relationships are handled in the same way as other relationships, through the `@innerRef`,` @foreignReg` and `@relationEntityRef` directives.

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
