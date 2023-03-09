# Caching

**Caching** is a technique that can improve the performance of applications by storing frequently accessed data in memory or another fast-access storage medium, such as Redis or Memcached. This can reduce the need to fetch the data from a slower data source, such as a MongoDB or Postgres.

Typetta supports caching at the entity manager level, which means that you can configure the cache engine and cache settings for each entity type. You can also override the cache settings for individual operations, such as find, insert, update, or delete. In addition, you can group cache entries by criteria, such as filter values or user roles, and invalidate cache entries selectively by groups.


## Enabling cache at entity manager level

To enable caching for an entity manager, you need to provide an instance of a cache engine that implements the TypettaCache interface. Currently, Typetta supports Redis cache engine, which can be initialized with a Redis client instance, as follows:

```typescript
import { createClient } from 'reids'

const redisClient = createClient() // create your Redis client
await redisClient.connect()
const cacheEngine = new RedisTypettaCache({ client: redisClient })
const entityManager = new EntityManager({
  cache: {
    engine: cacheEngine,
    entities: {
      user: { ms: 1000 }, //retain cache for 1 second
      post: true //no expiration time
    }
  }
})
```
In this example, we create an EntityManager with a Redis cache engine. We then pass the cache engine to the cache property of the entity manager configuration, along with a map of entity names and their cache settings. The cache settings consist of an optional expiration time in milliseconds (ms) or a flag (true or false) to indicate whether to cache the entity or not.

If you omit the cache configuration, Typetta will use the default cache engine (TypettaMemoryCache) that stores cache in memory. By default the caching is disabled for all entities but can be overwritten in any specific operation.

## Overriding cache settings on single operation
To override the cache settings for a single operation, you can pass a cache option to the corresponding method of the DAO. The cache option can be true to use the cache, false to avoid using the cache, or an object that specifies the cache expiration time and group name, if any.

Here an example that use the previous instance of entity manager:
```typescript
// use the cache or cache the result
await entityManager.tenant.findAll({ cache: true })
// use the cache or cache the result with a retantion of 1 second
await entityManager.tenant.findAll({ cache: { ms: 1000 }) 
// do not use the cache for this operation
await entityManager.user.findAll({ cache: false })
// still use the 1 second expiration time (specified in the entity manager configuration)
await entityManager.user.findAll({ cache: true }) 
// use 2 seconds expiration time
await entityManager.user.findAll({ cache: { ms: 2000 } }) 
```

## Cache Groups
Before explaining the invalidation mechanisms it is necessary to talk about groups. 

Typetta allows you to group cached data together based on a specific group-key. This can help you to manage and invalidate cached data more effectively, as you can invalidate entire groups of data at once, rather than invalidating all the cached data of a specific entity. We can see groups as another level of granularity after the entity.

You can also specify a cache group-key when performing individual find operations or a list of cache group-keys when performing write operations. By default, any cached data is stored in the 'default' group. However, you can create additional cache groups and associate them with specific entity, allowing you to manage your cached data more effectively.

For example:
```typescript
await entityManager.user.findAll({ filter: { isAdmin: true }, cache: true }) // use 'default' group
await entityManager.user.findAll({ filter: { isAdmin: true }, cache: { group: 'admin' } }) //use 'admin' group
```

## Invalidating cache
Typetta allows for invalidating cache at various levels of granularity. You can invalidate cache for all groups, specific groups or disable invalidation completely for an operation.

 - Invalidate cache for all groups: to invalidate cache for all groups, you can use the cache property with the value of `{ groups: 'all' }`. This will invalidate the cache for all groups, including the 'default' group.
 ```typescript
 await entityManager.user.insertOne({ 
    record: { name: "Name" },
    cache: { groups: 'all' }
})
 ``` 
 - Invalidate cache for specific groups: to invalidate cache for specific groups, you can use the cache property with the value of `{ groups: ['admin'] }`. This will invalidate the cache for the specific groups only.
 ```typescript
 await entityManager.user.insertOne({ 
    record: { name: "Name", isAdmin: true },
    cache: { groups: ['default', 'admins'] }
})
 ```
 - Invalidate cache for default group: to invalidate cache for the 'default' group, you can use the cache property with the value of true. This will invalidate the cache for the 'default' group only. This is equivalent to not setting anything if the entity is specified at the entity manager level.
 ```typescript
 await entityManager.user.insertOne({ 
    record: { name: "Name", isAdmin: true },
    cache: true
})
 ```
 - Disable invalidation: to disable invalidation of cache for an operation, you can use the cache property with the value of false. This will ensure that the cache is not invalidated for the operation.
  ```typescript
 await entityManager.user.insertOne({ 
    record: { name: "Name", isAdmin: true },
    cache: false
})
 ```
## Cache Engines
Typetta supports two different cache engines: TypettaMemoryCache and TypettaRedisCache.

 - TypettaMemoryCache: this engine stores the data in memory, making it fast and efficient for small to medium-sized data sets. However, it is not suitable for larger data sets as it can quickly consume system memory. A big downside is that the cache is not shared between multiple deployed machines.
 - TypettaRedisCache: this engine stores the data in a Redis server, making it more scalable and suitable for larger data sets and for production environment.

In addition to the two built-in cache engines, you can also implement your own custom engine by following the TypettaCache interface. This interface provides a set of methods that your custom engine must implement, including set, get, delete, and stats. By implementing this interface, you can use any data store or caching mechanism that you prefer, allowing for greater flexibility and customization of the cache implementation.
