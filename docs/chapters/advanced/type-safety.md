# Type Safety

Typetta was born out of the idea of creating an ORM written in TypeScript language capable of providing access to completely type-safe data.

TypeScript differs from the most common programming languages for its typing engine able to perform very advanced **type checking**, **type inference** and **type narrowing**. This allows libraries such as Typetta to generate dynamic and dependent data types from the inputs provided in response to an operation.

  - [Type Generation](#type-generation)
  - [Type from projection](#type-from-projection)
  - [Type Helpers](#type-helpers)

## Type Generation

To help the user write code in as type-safe a manner as possible, Typetta automatically generates a set of types for each entity in the data model.

Take, for example, the following GraphQL model:

```typescript
type User @entity {
  id: ID! @id
  firstName: String
  lastName: String
}
```

The following types are automatically generated from it:
```typescript

type User = {
  id: string
  firstName?: string
  lastName?: string
}

type UserFilterFields = {
  id?: string | null | EqualityOperators<string> | ElementOperators
  firstName?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
  lastName?: string | null | EqualityOperators<string> | ElementOperators | StringOperators
}
type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>

type UserProjection = {
  id?: boolean
  firstName?: boolean
  lastName?: boolean
}

type UserSortKeys = 'id' | 'firstName' | 'lastName'
type UserSort = OneKey<UserSortKeys, SortDirection>

type UserInsert = {
  firstName?: types.Scalars['String']
  lastName?: types.Scalars['String']
}

type UserUpdate = {
  id?: types.Scalars['ID']
  firstName?: types.Scalars['String'] | null
  lastName?: types.Scalars['String'] | null
}

```

All these types, exported and usable even directly outside Typetta, allow you to write operations to access completely type-safe data.

## Type from projection

Whenever you perform a data read operation specifying a projection, Typetta returns a type of data that depends on the type of projection, in a totally dynamic way. Here is a simple example in which, in a ``findOne`` operation, an object whose return type depends on the ``projection`` parameter is returned:

```typescript
const user = await entityManager.user.findOne({
  projection: {
    firstName: true,
    lastName: true
  }
});

type userType = typeof user;

/*
type userType = {
    firstName: string
    lastName: string
}
/*
```

Changing the value of the ``projection`` automatically changes the return type in compile-time:

```typescript
const user = await entityManager.user.findOne({
  projection: {
    firstName: true,
    lastName: true,
    address: {
      city: true
    }
  }
});

type userType = typeof user;

/*
type userType = {
    firstName: string
    lastName: string
    address: {
      city: string
    }
}
/*
```

This mechanism, made possible by TypeScript's conditional type and mapped type constructs, allows extremely type-safe code to be created without the overhead required to define a large number of partial types.
## Type Helpers

For each entity, a type of conditional data is also generated that is very useful in the construction of type-safe code that processes data retrieved through Typetta. For example, for the above model, the following type is generated:

```typescript
type UserParam<P extends UserProjection> = ParamProjection<User, UserProjection, P>
```

`ParamProjection` is a type of utility that allows you to obtain a type that is the result of applying a projection to its model. Below is an example of how this is used:

```typescript
const userProjection : UserProjection = {
  id: true,
  firstName: true
}

const user = dao.user.findOne({
  projection: userProjection
})
```

In the above code we see how you can create a `UserProjection` to specify a subset of the user fields that you want to load from the data source. Then, using the `findOne` operation, a user and their fields are loaded, consistent with this projection. The `user` constant will then be an object with two fields: `id` and `firstName`.

Now let's assume that we have to use this constant as input for a function that does some kind of processing. How can we declare the function? The simplest hypothesis is to replicate the structure of the return data as follows:

```typescript
function elab(user: { id: string, firstName?: string}){
  //...
}
```
In this way, however, the developer is obliged to replicate the entire structure of the data, in a very prolonged and difficult-to-maintain way, when in reality that type would be inferable through the application of the `userProjection` to the `User` model.

Note that the `user` parameter cannot be of the `User` type, otherwise the user of the `elab` function would be obliged to provide the `lastName` field, which is not necessary for the function.

Given this problem, in Typetta we have created a type for each entity, in this specific case `UserParam`, which allows for the rewriting of the previous function as follows:

```typescript
const userProjection : UserProjection = {
  id: true,
  firstName: true
}

function elab(user: UserParam<typeof userProjection>){
  //user.id => ok!
  //user.firstName => ok!
  //user.lastName => compile-time error!
}

const user = dao.user.findOne({
  projection: userProjection
})
if(user){
  elab(user);
}
```
