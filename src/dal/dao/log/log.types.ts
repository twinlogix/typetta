import { DriverType } from '../dao.types'

export type LogLevel = 'warning' | 'error' | 'query' | 'debug'
export type LogArgs<DAOName extends string> = {
  raw: string
  date: Date
  level: LogLevel
  operation?: 'count' | 'findAll' | 'findPage' | 'exists' | 'aggregate' | 'insertOne' | 'updateOne' | 'updateAll' | 'replaceOne' | 'deleteOne' | 'deleteAll' | 'middlewareBefore' | 'middlewareAfter'
  dao?: DAOName
  driver?: DriverType
  query?: string
  duration?: number
  error?: unknown
}
export type LogFunction<DAOName extends string> = (args: LogArgs<DAOName>) => Promise<void>

export type LogInput<DAOName extends string> = LogFunction<DAOName> | LogLevel[] | boolean | { maxQueryExecutionTime: number; level?: LogLevel[] }
