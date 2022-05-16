# Scalars

  - [Basic Scalars](#basic-scalars)
  - [Additional Scalars](#additional-scalars)
    - [TypeScript mapping](#typescript-mapping)
    - [Scalar Adapter](#scalar-adapter)
    - [Validation](#validation)

## Basic Scalars

The GraphQL specification comes with a set of basic scalar types to draw from when modeling an entity. This set consists of:
- **Int**: a signed 32‐bit integer number.
- **Float**: a signed, double precision, floating point number.
- **String**: a UTF‐8 character sequence.
- **Boolean**: a true/false value.
- **ID**: a unique identifier.

These scalars can be used for modelling an entity as in the following example:
```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  active: Boolean
}
```

## Additional Scalars

This set of basic scalars can then be extended with any number of additional scalars, which can be defined in the GraphQL schema (by default in a *schema.graphql* file) with the following syntax:

```typescript
scalar Timestamp
scalar DateTime
```

Every time a new scalar is defined, the system must be configured so that it knows how it must be represented as a TypeScript type and how it must be serialised and deserialised on each driver (SQL, MongoDB and any other additional ones).

The extensibility mechanism given by the additional scalars allows the user to increase the expressiveness of the application domain model and to create validation rules for a more accurate and strict data model design.

### TypeScript mapping

Additional scalar mapping to TypeScript types must be set in the *codegen.yml* generator configuration file. As you can see in the following example, in this file we can add all the necessary mappings inside the *config* section of the standard [GraphQL CodeGen TypeScript](https://www.graphql-code-generator.com/plugins/typescript){:target="_blank"} generator:

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - "typescript"
    config:
      scalars:
        Timestamp: Date
        DateTime: Date
  [...]
```
The key represents the additional scalar name as it is defined in the GraphQL schema, while the value is the corresponding TypeScript type.

You can also create additional scalars that do not have a counterpart in a primitive TypeScript type, but rather in a type or a class from your own or a third-party library.

Below is an example of a Decimal scalar mapped to the BigNumber type of the library [bignumber.js](https://mikemcl.github.io/bignumber.js/){:target="_blank"}:

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - "typescript"
    config:
      scalars:
        Decimal: bignumber.js#BigNumber
  [...]
```

### Scalar Adapter

Additional scalars need a second specification that defines how Typetta must deal with them, a so-called *adapter*.

A ``Scalar Adapter`` is an object that contains all the details about how the system should behave with the specific scalar regarding:
- Database serialisation
- Database deserialisation
- Validation
- Auto-generation

Scalar adapters must be configured at the EntityManager level and are shared by all DAOs.

Below is an example of a Scalar Adapter for the Decimal scalar already described above. The TypeScript type this scalar is mapped to is BigNumber, while the data type to which it must be serialised on MongoDB is Decimal128.

```typescript
const decimalAdapter = {
  dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
  modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
};
```

If you are using different data sources, for example if you have both a MongoDB and a SQL databse, you can specify two different adapters for the same scalar. In the following additional example the Decimal type is also stored in a SQL database as a string:
```typescript
const decimalAdapter = {
  mongo: {
    dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
    modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
  },
  knexjs: {
    dbToModel: (o: String) => new BigNumber(o),
    modelToDB: (o: BigNumber) => o.toString(),
  }
};
```
The configuration of the EntityManager with the above scalar adapter is therefore the following:

```typescript
const entityManager = new EntityManager({
  scalars: {
    Decimal: decimalAdapter
  }
});
```

### Validation

A `Scalar Adapter` can also contain validation rules that are applied to both reading and writing the scalar on each data source.

For example, suppose we want to create an additional scalar that represents only positive integers:

```typescript
scalar IntPositive
```

We can define a simple validator and its `Scalar Adapter` as follows:

```typescript
const entityManager = new EntityManager({
  scalars: {
    IntPositive: {
      validate: (data: number) : Error | true => {
        if(Number.isInteger(value) && value > 0){
          return true;
        } else {
          return new Error('IntPositive must be a valid positive integer number.');
        }
      }
    }
  }
});
```
