# Pagination

Pagination of results can generally be done in two ways:

  - [Offset Pagination](#offset-pagination)
  - [Cursor pagination *[coming soon]*](#cursor-pagination-coming-soon)

## Offset Pagination

Offset pagination uses two `skip` and `limit` parameters to define which record to start from and limit the total number of results. The following reading allows you to retrieve 10 users starting from the third (thus skipping the first two).

```typescript
const users = await entityManager.user.findAll({
  skip: 2,
  limit: 10
})
```

`limit` by default is set to the `pageSize` (by default it's 50). The following example will return a maximum o 50 users.
```typescript
const users = await entityManager.user.findAll({
  skip: 2
})
```

In order to get all the users the field `limit` must be set to `'unlimited'`.
```typescript
const users = await entityManager.user.findAll({
  skip: 2,
  limit: 'unlimited'
})
```

## Cursor pagination *[coming soon]*

This feature is not yet available and is currently being designed.