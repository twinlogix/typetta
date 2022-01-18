import { LogFunction, LogInput } from './log.types'

export function logInputToLogger<DAOName extends string>(info?: LogInput<DAOName>): LogFunction<DAOName> | undefined {
  if (!info) {
    return undefined
  }
  if (typeof info === 'function') {
    return info
  }
  return async (args) => {
    if (
      info === true ||
      (typeof info === 'object' &&
        ((Array.isArray(info) && info.includes(args.level)) ||
          ('maxQueryExecutionTime' in info && 'duration' in args.info && info.maxQueryExecutionTime <= args.info.duration && (!info.level || info.level.includes(args.level)))))
    ) {
      const f = args.level === 'warning' ? 'warn' : args.level
      console[f](args.log)
    }
  }
}
