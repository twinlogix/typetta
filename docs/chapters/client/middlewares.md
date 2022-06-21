# Middlewares

Middleware is a powerful tool with which **to extend the basic features** of Typetta, adding a series of customised checks and automatisms to the data access layer. They consist of one or more functions that are invoked as a cascade in the life cycle of an operation, both in the phase before and after the interaction with the data source.

These functions receive all the parameters as input to the operation and can change their value, so as to modify or extend their behaviour.

  - [Defining a Middleware](#defining-a-middleware)
  - [Applying a Middleware](#applying-a-middleware)
  - [Editing inputs and outputs](#editing-inputs-and-outputs)
  - [Execution pipeline](#execution-pipeline)
  - [Execution flow interruption](#execution-flow-interruption)

## Defining a Middleware

Below is a simple log middleware that prints the various steps of executing each operation of a user's DAO:

```typescript
const middleware = {
  before: async (args, context) => {
    console.log(`Before operation ${args.operation}.`)
  },
  after: async (args, context) => {
    console.log(`After operation ${args.operation}.`)
  }
}
```

Note that each middleware consists of two functions, one invoked before the execution of each operation (`findOne`, `findAll`, `insertOne`, etc.) and one invoked after each execution. Both functions receive two parameters: the first contains all the available information about the operation in progress; the second is a context object thanks to which you can directly access the driver and the metadata of the DAO.

The structure of the first parameter (`args` in the example) is as follows:
```typescript
{
  // operazione corrente
  operation: 'find' | 'insert' | 'update' | 'replace' | 'delete' | 'aggregate',
  // dipendente dall'operazione, contiene tutti gli input come filtri, proiezioni, ordinamenti, changes, ecc.
  params: { ... },
  // argomenti di input aggiuntivi, solo per l'operazione 'aggregate'
  args: { ... },
  // i record letti, disoponibili solo per l'operazione 'find' nella funzione 'after'
  records: [],
  // il record inserito, disoponibile solo per l'operazione 'insert' nella funzione 'after'
  record: { ... },
  // i risultati dell'operazione 'aggregate' nella funzione 'after'
  results: { ... },
}
```

This parameter is strictly typed and dependent on the ``operation`` field. For example, to access the filter set to a ``find`` operation we can write the following middleware:

```typescript
const middleware = {
  before: async (args, context) => {
    if(args.operation === 'find'){
      // type narrowing, now we can access args.params.filter
      console.log(`Find with filter ${args.params.filter}.`)
    }
  },
}
```

By contrast, the second parameter (``context`` in the example) contains the following fields:
```typescript
{
  // MongoDB's driver reference or knexjs's driver reference
  driver: ...,
  // object that contains metadata passed to the EntityManager or to the specific DAO
  metadata: {...},
  // generated object that describes the structure of the entity
  schema: { ... };
  // key of the @id field of the entity
  idField: ...,
}
```

## Applying a Middleware

Each middleware can be applied to three different levels within an ``EntityManager``:
  - [Middleware for a specific DAO](#middleware-for-a-specific-dao)
  - [Middleware for several DAOs](#middleware-for-several-daos)
  - [Middleware for the whole EntityManager](#middleware-for-the-whole-entity-manager)

### Middleware for a specific DAO

It is possible to assign a middleware to a single DAO through the ``overrides`` field of the constructor of each ``EntityManager``:
```typescript
const entityManager = new EntityManager({
  overrides: {
    user: {
      middlewares: [
        middleware
      ]
    }
  }
})
```

Note that a middleware created for a single entity can make use of TypeScript type narrowing, so the parameters of the `before` and `after` functions will contain filters, projections, sorts and records of the specific entity. This makes it very easy to write and maintain the application logic of the individual middleware.

### Middleware for several DAOs

You may need to create middleware that must be applied to a subset of the entities in an ``EntityManager``. To do this, it is possible to define an override for each of these entities, as seen above, but this can be lengthy and difficult to maintain. Typetta provides a utility function with which you can define a middleware for a specific group of entities:

```typescript
const entityManager = new EntityManager({
  middlewares: [
    groupMiddleware.includes((
        {
          user: true,
          posts: true
        },
        middleware
      ),
    ],
  ]
})
```

Similarly, you can also define a middleware for a group of identities using a logic of exclusion:

```typescript
const entityManager = new EntityManager({
  middlewares: [
    groupMiddleware.excludes((
        {
          posts: true
        },
        middleware
      ),
    ],
  ]
})
```

Again in this case TypeScript performs type narrowing perfectly and allows the use within the middleware of the types resulting from the intersection between the types of all entities. In the above example, if all selected entities have an ``id`` field, the middleware can access that field.

### Middleware for the whole EntityManager

Lastly, you can create a middleware that is common to the whole ``EntityManager`` and then run it for each operation of each ``DAO``. To do this, simply configure the middleware as follows:
```typescript
const entityManager = new EntityManager({
  middlewares: [
    middleware
  ]
})
```

## Editing inputs and outputs

A middleware can edit the received inputs, returning a modified copy as output. This can be very useful for creating features that alternate or force certain DAO behaviours. For example, you can create middleware that forces the value of a filter to a certain value regardless of what the user defines.

```typescript
const entityManager = new EntityManager({
  middlewares: [
    {
      before: async (args, context) => {
        if (args.operation === 'find') {
          return {
            ...args,
            params: {
              ...args.params,
              filter: [
                args.params.filter,
                {
                  id: '2fd16faf-6e75-4219-96ea-28f801e918de',
                }
              ],
            },
            continue: true,
          }
        }
      },
    },
  ]
})
```

In the above example, the middleware, which applies only to ``find`` operations, leaves all user inputs unchanged except for the filter that is implemented and with a fixed filter for id.

Note that there is a mandatory additional ``continue`` boolean field. If the middleware has the value of ``true`` at its completion, this lets the next middleware run or the operation run if no other middleware is present. If it has the value of ``false``, the middleware breaks the execution chain, so no other subsequent middleware will run. If it is a ``before`` function, the operation will not be performed either.

If ``continuous: false`` is returned, the return type must not only contain all the input parameters of the operation but the relative outputs, as the middleware replaces the normal execution of the operation.


## Execution pipeline

Middleware allows you to create mediation levels before and after the execution of an operation. These levels are executed in a very precise order which can be summarised as follows:

```
             ━━━━━┓
                  ┃
                  ▼
TYPETTA MIDDLEWARES (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE N (before function)
                  ┃
                  ▼
TYPETTA MIDDLEWARES (before function)
                  ┃
                  ▼
         OPERATION EXECUTION
                  ┃
                  ▼
TYPETTA MIDDLEWARES (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE N (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (after function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (after function)
                  ┃
                  ▼
TYPETTA MIDDLEWARES (after function)
                  ┃
             ◀━━━━┛

```

The order of the custom middleware, that is, those defined by the user, is determined by the order of the array with which they are configured on the ``DAO`` or ``EntityManager``. Using the `before` function, each middleware can edit the inputs of the operation and, with the `after` function, it can edit the outputs. Both input and output are passed to the next level until the last level at which point the results are returned to the caller.

In the diagram you can see some middleware within Typetta. Indeed, the system uses this mechanism internally to implement some basic features that are already preconfigured.

## Execution flow interruption

In both the `before` and `after` phases, each middleware can decide to stop the execution pipeline and end the operation, providing outputs. To do this, as seen in the previous example, you need to import a ``continue: false`` field into the return object.

Therefore, if we assume that the custom middleware 2 of the preceding example was implemented as follows:

```typescript
const middlewareCustom2 = {
  before: async (args, context) => {
    return {
      ...args
      continue: false,
    }
  }
}
```

It would interrupt the pipeline, which would be blocked at the second step:

```
             ━━━━━┓
                  ┃
                  ▼
TYPETTA MIDDLEWARES (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 1 (before function)
                  ┃
                  ▼
CUSTOM MIDDLEWARE 2 (before function)
                  ┃
             ◀━━━━┛
```
