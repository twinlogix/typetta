# Logging

The possibility of having an accurate logging system is a very important feature for a library that manages the data access layer. Thanks to the logs, it is possible to investigate any correctness issues in the construction of the queries sent to the data source or regarding performance.

  - [How to enable Logs](#how-to-enable-logs)
  - [Log long-running queries](#log-long-running-queries)
  - [Custom logger](#custom-logger)
  - [Await async log](#await-async-log)

## How to enable Logs

You can enable logging simply by setting the ``log: true`` parameter when creating the ``EntityManager``.

```typescript
new EntityManager({
  log: true,
})
```

Alternatively, you can specify which log levels should be enabled among those provided by the system: ``debug``, ``query``, ``warning`` and ``error``. Note that the ``query`` level is the level at which the SQL and MongoDB queries that run on the respective databases are logged.

To explicitly specify the enabled levels, you must set an array in the ``log`` parameter:

```typescript
new EntityManager({
  log: ['warning', 'error'],
})
```

The logs produced by the system have the following form:
```
[2022-01-30T14:44:40.120Z] (dao: user, op: findAll, driver: mongo): collection.find({}) [3 ms]
```
In this example, we see the log of a query containing:
- the date the log was issued
- the DAO that issued the log
- the operation to which the log is connected
- the driver used by the DAO to connect to the data source
- the full query, in the format of the specific database
- running time

## Log long-running queries

If there are performance problems or there is simply the need to perform an analysis on the data access times, it is possible to enable the logging of all operations that take too long to be performed through the ``maxQueryExecutionTime`` parameter. Then configuring the ``EntityManager`` as follows:

```typescript
new EntityManager({
  log: { maxQueryExecutionTime: 2000 },
})
```

All operations that take more than 2 seconds to be performed will be logged.

## Custom logger

Typetta provides a default logger that writes logs of four different levels directly on the console. If you want to customise the destination of the logs, for example by sending them to a third-party service, or simply want to change the format by adding or deleting information with respect to the default, you can create a custom logger.

A custom logger is a function that the user can write and set to the log parameter and that is invoked at each event and for each log level. This function receives the following parameters:
- ``raw``: the string produced by the default logger, useful in case you do not want to manipulate it, but simply send it to a different destination
- ``date``: the date of the log
- ``level``: the level of the log, among ``debug``, ``query``, ``warning`` and ``error``.
- ``operation``: the name of the operation that generated the log, if available
- ``dao``: the name of the dao whose operation generated the log, if available
- ``driver``: the type of driver that the operation uses, either `mongo` or `knex`
- ``query``: the query sent to the database, if it is a ``query`` level log
- ``duration``: the duration of the operation, if available
- ``error``: the subject of the error, if it is an ``error`` level log

Here is an example of a custom logger:

```typescript
new EntityManager({
  log: async ({ raw }) => {
    console.log(`My custom log is: ${raw}`)
  },
})
```

## Await async log

By default Typetta awaits the logger async operation. In order to skip the await you can set `awaitLog` to false. All the exceptions thrown by the logger are ignored either if the operations are awaited or not.

```typescript
new EntityManager({
  log: async ({ raw }) => {
    await sendLogToKinesis(`[TYPETTA]: ${raw}`)
  },
  awaitLog: false
})
```
