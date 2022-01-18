import { DAO, DAOGenerics } from "../dao.types"

export type LogLevel = 'warning' | 'error' | 'debug'
export type LogArgs<DAOName extends string> = {
  log: string
  dao: DAOName
  operation: 'find' | 'aggregate' | 'insert' | 'update' | 'replace' | 'delete'
  date: Date
  level: LogLevel
  driver: 'mongo' | 'knex'
  query: unknown
  info:
    | {
        state: 'pending'
      }
    | {
        state: 'completed'
        duration: number
      }
    | {
        state: 'failed'
        duration: number
        error?: unknown
      }
}
export type LogFunction<DAOName extends string> = (args: LogArgs<DAOName>) => Promise<void>

export type LogInput<DAOName extends string> = LogFunction<DAOName> | LogLevel[] | boolean | { maxQueryExecutionTime: number, level?: LogLevel[] }
