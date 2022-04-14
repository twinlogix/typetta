# Filters

Typetta allows you to filter the records for each of the fields in the model and supports various operators in a completely transparent way compared to the database you are using.

The following `findAll` operation has a filter that allows you to find all users who:
- Have the name `Mattia`
- Live in `Rome` or `Milan`
- Were born on a date that does not include the whole year `2020`

```typescript
await daoContext.user.findAll({
  filter: {
    firstName: "Mattia",
    "address.city": { in: [ "Milan", "Rome" ]},
    birthDate: {
      $or: {
        lt: new Date("2020-01-01T00:00:00"),
        gte: new Date("2021-01-01T00:00:00")
      }
    }
  }
})
```

Typetta supports various operators and filters in order to give you a powerful data access layer.

  - [Equality operators](#equality-operators)
    - [eq](#eq)
    - [ne](#ne)
    - [in](#in)
    - [nin](#nin)
  - [Comparison operators](#comparison-operators)
    - [lt](#lt)
    - [lte](#lte)
    - [gt](#gt)
    - [gte](#gte)
  - [Logical operators](#logical-operators)
    - [$and](#and)
    - [$or](#or)
    - [$nor](#nor)
    - [Combination of logical operators](#combination-of-logical-operators)
  - [Operators for strings](#operators-for-strings)
    - [contains](#contains)
    - [startsWith](#startswith)
    - [endsWith](#endswith)
  - [Other operators](#other-operators)
    - [exists](#exist)
  - [Advanced, driver-dependent filters](#advanced-driver-dependent-filters)
    - [MongoDB](#mongodb)
    - [SQL](#sql)

## Equality operators

Below is a list of operators that allow you to check the equality of a field with one or more values:

### eq

The `eq` operator checks that the value is the same as the value provided.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { eq: "Mattia" }
  }
})
```

The `eq` operator can also be omitted, so the above query is equivalent to the following:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: "Mattia"
  }
})
```

### ne

The `ne` operator checks that the value is different from the one provided; it is complementary to the previous `eq` operator.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { ne: "Mattia" }
  }
})
```

### in

The `in` operator checks that the value is contained within a given set of values.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { in: ["Mattia", "Michele", "Stefano"] }
  }
})
```

### nin

The `nin` operator checks that the value is not contained within a given set of values.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    firstName: { nin: ["Piero", "Paolo", "Romeo"] }
  }
})
```

## Comparison operators

Below is the list of operators that allow you to compare a field with one or more values:

### lt

The `lt` operator checks that the value is strictly less than a given value.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { lt: 100 }
  }
})
```

### lte

The `lte` operator checks that the value is less than or equal to a given value.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { lte: 100 }
  }
})
```

### gt

The `gt` operator checks that the value is strictly greater than a given value.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { gt: 100 }
  }
})
```

### gte

The `gte` operator checks that the value is greater than or equal to a given value.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    numberOfFriends: { gte: 100 }
  }
})
```

## Logical operators

It is possible to combine the conditions built with the previous operators using the most traditional logical operators listed below:

### $and

The `$and` operator is verified if all the set conditions are true.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    $and: [
      { firstName: "Mattia" }
      { lastName: "Minotti" }
    ]
  }
})
```

### $or

The `$or` operator is verified if at least one of the set conditions is true.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      { "address.country": "Italy" },
      { "address.city": "Paris" }
    ]
  }
})
```

### $nor

The `$nor` operator is verified if none of the set conditions are true.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      { firstName: "Mattia" },
      { lastName: "Minotti" }
    ]
  }
})
```

Logical filters have a '$' prefix to avoid conflicts with entity fields as they are top level operators.

### Combination of logical operators

The above logical operators can be combined however you like to create complex conditions. Below is an example that shows a search query of users whose address is in Italy, or who live abroad and whose surname is `Minotti` or `Barbieri`:

```typescript
await daoContext.user.findAll({
  filter: {
    $or: [
      {
        "address.country": "Italy"
      },
      {
        $and: [
          {
            $nor: [{ "address.country":  "Italy" }]
          },
          {
            lastName: { in: ["Minotti", "Barbieri"]}
          }
        ]
      }
    ]
  }
})
```

## Operators for strings

The following operators are available for `String` fields and allow you to create conditions - even complex ones - on text fields.

### contains

The `contains` operator allows you to check whether the value contains a supplied string within it. Some examples are listed below:

```
"oggi fa caldo" contiene "oggi fa caldo" => sì
"oggi fa caldo" contiene "caldo" => sì
"oggi fa caldo" contiene "oggi" => sì
"oggi fa caldo" contiene "fa" => sì
"oggi fa caldo" contiene "ggi fa" => sì
"oggi fa caldo" contiene "freddo" => no
"oggi fa caldo" contiene "oggi caldo" => no
"oggi fa caldo" contiene "facaldo" => no
```

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { contains: "Piave" }
  }
})
```


### startsWith

The `startsWith` operator allows you to check whether the value starts with a supplied string:

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { startsWith: "Via" }
  }
})
```

### endsWith

The `endsWith` operator allows you to check whether the value ends with a supplied string:

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    { 'address.street': { $endWith: "48" } }
  }
})
```

## Other operators

Below is the list of additional operators made available by Typetta:

### exists

The `exists` operator checks whether or not the field has a value in the database, depending on the true / false value provided.

For example:
```typescript
await daoContext.user.findAll({
  filter: {
    name: { exists: true }
  }
})
```

## Advanced, driver-dependent filters

Typetta, like many other ORMs, offers the ability [to directly access database features](raw-databse-access) in order to provide maximum flexibility to the user. As for the filters, this allows you to create conditions that are completely dependent on the underlying driver.

All APIs that receive the `filter` parameter accept both a type of data generated by Typetta with the rules and operators described above, and a function that allows the filter to be expressed using SQL or MongoDB references, syntax and potential.

This possibility is exemplified in pseudo-code below:
```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: (/* driverRefs... */) => {
    // ...something driver specific that returns a driver filter
  }
})
```

Note that this approach allows you to describe a specific filter for a driver, while maintaining the use of all other features, specifically the mechanism of projections, the resolution of relationships and the typing of results.

### MongoDB

Since the MongoDB driver is developed through the [official MongoDB Node Driver](https://docs.mongodb.com/drivers/node/current/){:target="_blank"}, creating a specific filter consists of a function returned by `Filter<TSchema>`.

Let's assume, for example, that we want to use the `$text` operator of MongoDB, which is a very specific operator that, through a textual index of the collection, is able to perform a complex full text search. Since this feature is not available on other databases or available but in very different modes, it was not factored by Typetta. However, with the driver-specific filter mechanism, it is very easy to use:

```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: () => {
    $text: { $search: "via piave", $caseSensitive: true }
  }
})
```

### SQL

The SQL driver, as mentioned above, is developed using the popular [KnexJS](https://knexjs.org/){: target="_blank"} query builder. In this case, creating a specific filter involves invoking a set of methods on the `Knex.QueryBuilder` object.

Let's assume, for example, that in this case we again want to implement a full text search using the features offered by a PostgreSQL target database. Using the specific filter mechanism, we can create a search as follows:

```typescript
await daoContext.user.findAll({
  projection: {
    firstName: true
  },
  filter: (builder: Knex.QueryBuilder) => {
    builder.where('street @@ to_tsquery(?)', ['via & piave']);
    return builder;
  }
})
```
