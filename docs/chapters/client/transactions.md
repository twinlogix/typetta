# Transactions

A transaction is any sequence of read-write operations that, if performed correctly, results in a change in the state of a database. In the event of success, the result of the operations must be permanent or persistent, while, in the event of failure, it must return to the state prior to the start of the transaction.

  - [Transactions in Typetta](#transactions-in-typetta)
  - [MongoDB Transactions](#mongodb-transactions)
  - [SQL Transactions](#sql-transactions)
  - [Implicit Transactions](#implicit-transactions)
  - [Explicit Transactions](#explicit-transactions)

## Transactions in Typetta

Most modern databases have some form of transaction support. This support can vary both in form and content depending on the unique characteristics of each database.

Offering homogeneous functionality for all supported drivers would have forced us to make compromises that would have reduced the possibilities available to the user. For this reason, the approach chosen in Typetta is to support the different transaction management strategies of each driver, while keeping the data access layer homogeneous.

## MongoDB Transactions

MongoDB has offered full support for transactions on multiple documents since version 4.2. This support is provided through the `session` construct that provides a `startTransaction` method, as per the [official documentation](https://docs.mongodb.com/manual/core/transactions/){:target="_blank"}. Once a transaction is initiated, its `session` contains a reference to it and can be used to ensure that Typetta calls to APIs are made in its context.

Here is an example of starting, committing and aborting a transaction using the MongoDB driver:

```typescript
  const session = mongoClient.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  })

  try {    
    ...
    await session.commitTransaction()
  } catch(e) {
    await session.abortTransaction()
  } finally {
    await session.endSession();
  }
```

As shown in the example, the creation of the transaction is done directly using the official MongoDB driver, which ensures that you have all the potential that the database provides.

## SQL Transactions

All major SQL databases provide transaction support. Using the KnexJS library, creating and managing a transaction is identical regardless of the underlying SQL engine.

Using KnexJS, you can create a transaction directly by a `knexInstance` instance, on which to invoke the `transaction` method, which receives certain parameters specific to the SQL context. For a complete reference of these APIs, you can check the [official documentation](https://knexjs.org/#Transactions){:target="_blank"}.

Here is an example of starting, committing and rollbacking a transaction using the KnexJS driver:

```typescript
  const trx = await knexInstance.transaction({ isolationLevel: 'snapshot' })

  try {
    ...
    await trx.commit()
  } catch(e) {
    await trx.rollback()
  }
```

## Implicit Transactions
Typetta provides two different ways to perform multiple operations in a transaction. The first one is a ``transaction`` operation offered by the ``EntityManager``. Using it you can execute a user-defined function where every Typetta operation is performed in the transaction passed as a parameter. Following an example with a MongoDB data source:
 
```typescript
const session = connection.startSession()
session.startTransaction({
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
})
await entityManager.transaction(
  { 
    mongodb: { default: session } 
  }, 
  async (transactionEntityManager) => {
    const user = await dao.user.findOne({
      filter: { id: '1fc70958-b791-4855-bbb3-d7b02b22b39e' },
      projection: { id: true, balance: true }
    )
    await dao.user.updateOne({
      filter: { id: user.id },
      changes: { balance: user.balance + 10 }
    });
  }
)
const res = await session.commitTransaction()
```

Note that the first parameter allows you to provide a reference to a transaction for each data source, while the second is a function that receives only one parameter, a new ``EntityManager`` on which you can perform all the Typetta operations. It's important to use this provided context and not the outer one to be sure of executing those operation in transaction. 

## Explicit Transactions 
A second way to execute multiple operations in transaction is to pass a reference to it to each operation has an explicit `options` parameter. In this case it is possible to specify in which transaction an operation should be performed and you can even exclude some operations. Following an example to obtain the exact result of the previous but with this different approach:

```typescript
const session = connection.startSession()
session.startTransaction({
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
})
const user = await dao.user.findOne({
  filter: { id: '1fc70958-b791-4855-bbb3-d7b02b22b39e' },
  projection: { id: true, balance: true },
  options: { session }
)
await dao.user.updateOne({
  filter: { id: user.id },
  changes: { balance: user.balance + 10 },
  options: { session }
});
const res = await session.commitTransaction()
```