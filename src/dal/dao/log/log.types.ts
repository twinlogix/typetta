export type LogLevel = 'warning' | 'error' | 'debug'
export type LogArgs<DAOName extends string> = {
  raw: string
  date: Date
  level: LogLevel
  operation?: 'find' | 'aggregate' | 'insert' | 'update' | 'replace' | 'delete'
  dao?: DAOName
  driver?: 'mongo' | 'knex'
  query?: string
  duration?: number
  error?: unknown
}
export type LogFunction<DAOName extends string> = (args: LogArgs<DAOName>) => Promise<void>

export type LogInput<DAOName extends string> = LogFunction<DAOName> | LogLevel[] | boolean | { maxQueryExecutionTime: number; level?: LogLevel[] }
