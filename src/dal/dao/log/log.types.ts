export type LogLevel = 'warning' | 'error' | 'debug' | 'info'
export type LogArgs<DAOName extends string> = {
  log: string
  dao: DAOName
  operation: 'find' | 'aggregate' | 'insert' | 'update' | 'replace' | 'delete'
  date: Date
  level: LogLevel
  info:
    | {
        state: 'pending'
      }
    | {
        state: 'completed'
        duration: number
        affectedRecords?: number
      }
}
export type LogFunction<DAOName extends string> = (args: LogArgs<DAOName>) => Promise<void>

export type LogInput<DAOName extends string> = LogFunction<DAOName> | LogLevel[] | true
