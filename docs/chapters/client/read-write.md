# Read and Write

The fundamental component for performing read or write operations on model entities is `DAO`. There is a DAO for each entity and its reference can be obtained simply from the `DAOContext`, as described in the [context](dao-context) section of the guide.

Each DAO, regardless of its data source, whether SQL or MongoDB, offers the main features of reading and manipulating entities and their relationships.

Below is a list of these operations:

  - [Insert One](#insert-one)
  - [Find One](#find-one)
  - [Find All](#find-all)
  - [Find Page](#find-page)
  - [Update One](#update-one)
  - [Update All](#update-all)
  - [Replace One](#replace-one)
  - [Delete One](#delete-one)
  - [Delete All](#delete-all)

## Sample application diagram

In the following sections, the main operations that each DAO makes available to read and manipulate the data related to one or more model entities will be shown. All the examples that will be shown will refer to the following application model:

```typescript
type User @entity @mongodb {
  id: ID! @id
  firstName: String
  lastName: String
  address: Address
  posts: [Post!] @foreignRef(refFrom: "userId")
}

type Post @entity @mongodb {
  id: ID! @id
  userId: ID!
  user: User! @innerRef
  content: String!
}

type Address {
  street: String
  city: String
  district: String
  zipcode: String
  country: String
}
```

## Insert One

The [insertOne](/typedoc/classes/AbstractDAO.html#insertOne){:target="_blank"} API allows you to insert a record. The API requests all required fields of the affected entity except for the ID if it is self-generated.

Here is an example of creating a user:

```typescript
const user = await daoContext.user.insertOne({
  record: {
    firstName: "Mattia",
    lastName: "Minotti",
    address: {
      street: "Via Piave 48",
      city: "Milan",
      country: "Italy"
    }
  }
})
```

The returned object represents a User and, in the case of a self-generated ID, also contains the id created by the system or database, depending on the option chosen.

## Find One

The [findOne](/typedoc/classes/AbstractDAO.html#findOne){:target="_blank"} API allows you to search for a record by filtering one or more of its fields.

Below is an example of a user search by filtering by name:

```typescript
const user = await daoContext.user.findOne({
  filter: {
    firstName: "Mattia",
    lastName: "Minotti"
  },
})
```
If the query identifies more than one record, only the first record is returned with the specified sort order, or the standard sort order of the database.

## Find All

The [findAll](/typedoc/classes/AbstractDAO.html#findAll){:target="_blank"} API allows you to search for all records by filtering one or more of their fields.

Below is an example of user search filtering by city:

```typescript
const users = await daoContext.user.findAll({
  filter: {
    "address.city": "Milan"
  },
  sorts: [
    {
      lastName: SortDirection.DESC
    }
  ]
})
```

The return of this query is an array of users living in Milan, sorted by last name in alphabetical order.

## Find Page

The [findPage](/typedoc/classes/AbstractDAO.html#findPage){:target="_blank"} API allows you to search all records, filtering by one or more of their fields and returns a page of results and their total number.

This API differs from the previous `findAll` not because of the ability to request a results page, which is also possible with the `findAll`, but because of the return value that contains the list of records on the page and the total count of records that answer the query sent.

The `skip` parameter identifies how many records to skip, so if you want to start from the first one it must be set to 0 or omitted; the `limit` parameter identifies the size of the page, that is, the maximum number of records returned.

Below is an example of a search for a page of users, filtering by city:

```typescript
const users = await daoContext.user.findAll({
  skip: 0,
  limit: 10,
  filter: {
    "address.city": "Milan"
  },
  sorts: [
    {
      lastName: SortDirection.DESC
    }
  ]
})
```

The return of this query is the following object:

```typescript
{
  totalCount: 1,
  records: [
    {
        id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
        firstName: "Mattia",
        lastName: "Minotti",
        address: {
          street: "Via Piave 48",
          city: "Milan",
          country: "Italy"
        }
    }
  ]
})
```

## Update One

The [updateOne](/typedoc/classes/AbstractDAO.html#updateOne){:target="_blank"} API allows you to update one or more fields of a record identified by a specific filter. This API updates a maximum of one record, the first one found by the filter if more than one matches the search criteria.

Here is an example of updating a user's address:

```typescript
await daoContext.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: {
    address: {
      street: "Via Carducci 12",
      city: "Rome",
      country: "Italy"
    }
  }
})
```

Note that for composite entities such as the user and address, the API allows both updating the entire embedded entity and only one of its fields. For example, if you want to change only the `street` field of a user leaving the rest of the address unchanged, you can execute the following code:

```typescript
await daoContext.user.updateOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  changes: {
    "address.street": "Via G. Bovio 50"
  }
})
```

## Update All

The [updateAllAPI](/typedoc/classes/AbstractDAO.html#updateAll){:target="_blank"} allows you to update one or more fields of a set of records identified by a specific filter. The behaviour is very similar to the previous `updateOne` API but extended to all records that satisfy the filter set as a parameter.

Below is an example of updating all users whose name is `mattia`, changing the name to `Mattia` with a capital letter:

```typescript
await daoContext.user.updateAll({
  filter: {
    firstName: "mattia",
  },
  changes: {
    firstName: "Mattia",
  }
})
```

Note that you can update all the records present by explicitly setting a blank filter, as in the following example where you update the names of all users:

```typescript
await daoContext.user.updateAll({
  filter: {},
  changes: {
    firstName: "Mattia",
  }
})
```

## Replace One

The [replaceOne](/typedoc/classes/AbstractDAO.html#replaceOne){:target="_blank"} API allows you to replace a record identified by a specific filter with a completely new one. As it has been replaced, the old record is completely lost and the replacement may differ completely from the previous one.

Here is an example of replacing a user:

```typescript
await daoContext.user.replaceOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  },
  replace: {
    firstName: "Edoardo",
    lastName: "Barbieri",
    address: {
      street: "Via San Giorgio 12",
      city: "Cesena",
      country: "Italy"
    }
  }
})
```

## Delete One

The [deleteOne](/typedoc/classes/AbstractDAO.html#deleteOne){:target="_blank"} API allows you to delete an identified record using a specific filter. This API updates a maximum of one record, the first one found by the filter if more than one matches the search criteria.

Here is an example of deleting a user:

```typescript
await daoContext.user.deleteOne({
  filter: {
    id: "1fc70958-b791-4855-bbb3-d7b02b22b39e",
  }
})
```

## Delete All

The [deleteAll](/typedoc/classes/AbstractDAO.html#deleteAll){:target="_blank"} API allows you to delete a set of records identified by a specific filter. The behaviour is very similar to the previous `deleteOne` API but extended to all records that satisfy the filter set as a parameter.

Here is an example of deleting all users named `Mattia`:

```typescript
await daoContext.user.deleteAll({
  filter: {
    firstName: "Mattia",
  }
})
```

Note that you can update all the records present by explicitly setting a blank filter, as in the following example where you update the names of all users:

```typescript
await daoContext.user.deleteAll({
  filter: {},
})
```
