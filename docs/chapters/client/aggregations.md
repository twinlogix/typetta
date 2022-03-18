# Aggregations

Typetta supports the reading of aggregated and/or grouped data through a specific API named [aggregate](/typedoc/classes/AbstractDAO.html#aggregate){:target="_blank"}.

  - [Aggregate fields](#aggregate-fields)
  - [Count](#count)
  - [Groups](#groups)
  - [Filters and sorts](#filters-and-sorts)

## Aggregate fields

In order to define aggregate fields, whose value is the result of applying an operator on all grouped records, the `aggregate` API accepts a specific `aggregations` parameter. Using this parameter, the user can specify a map whose keys are the names of the new aggregate fields that will be returned in the result and whose values are the definitions of how these fields are to be calculated.

Let's assume, for example, that you want to read the total number of users and their average age:

```typescript
const res = await dao.user.aggregate(
  {
    aggregations: {
      userCount: { field: 'id', operation: 'count' },
      averageAge: { field: 'age', operation: 'avg' }
    },
  }
)
```

The result of this operation will be of the following type:

```typescript
{
  userCount: 123,
  averageAge: 24.9
}
```

Note that, in the example, `userCount` and `averageAge` are two user-defined keys whose calculation logic depends on the `operation` parameter. `Aggregations` can only concern numeric fields and their `operations` can take the following values:
- `count`: count the number of occurrences
- `sum`: performs the sum of all the values
- `avg`: averages all values
- `min`: find the minimum of all values
- `max`: find the maximum of all the values

## Count

Unlike all other operators, which must necessarily be specified on `aggregations` of a specific field, the `count` operator can be applied globally to calculate the total number of results.

Here is an example of querying the total number of users:

```typescript
const res = await dao.user.aggregate(
  {
    aggregations: {
      userCount: { operation: 'count' }
    }
  }
)
```

The result will be:

```typescript
{
  userCount: 123
}
```

## Groups

The `aggregate` API allows the user to group the records for the value of one or more fields and to calculate the aggregations on each of the groups found. To do this, the API provides the `by` parameter through which it is possible to specify a sort of projection of the fields that must form the key of the various groups.

The following is an example of an aggregate in which users are grouped by gender and for each group the average age is calculated:

```typescript
const res = await dao.user.aggregate(
  {
    by: {
      gender: true
    },
    aggregations: {
      averageAge: { field: 'age', operation: 'avg' }
    }
  }
)
```

As seen above, groupings are optional, and if no value is set to the `by` parameter, the API performs a single grouping containing all records.

## Filters and sorts

The aggregate API can optionally receive a `filter` parameter exactly like all other read APIs. This filter limits the application of aggregation and grouping logics to a subset of the records determined by the conditions defined.

In addition to this possibility, as typically happens on the main SQL databases, Typetta also provides the possibility to filter and sort for the fields resulting from grouping or aggregation. This second processing step can be defined by a second `aggregate` API parameter.

Below is an example of a query of all users, grouped by city of residence, whose average age is greater than or equal to 18 years, sorted by average age:

```typescript
const res = await dao.user.aggregate(
  {
    by: {
      'address.city': true
    },
    aggregations: {
      averageAge: { field: 'age', operation: 'avg' }
    }
  }, {
    having: { averageAge: { gte: 18 } },
    sorts: [{ averageAge: 'asc' }]
  }
)
```
