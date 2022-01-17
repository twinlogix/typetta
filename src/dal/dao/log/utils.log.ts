import { LogFunction, LogInput } from './log.types'

export function logInputToLogger<DAOName extends string>(info: LogInput<DAOName>): LogFunction<DAOName> {
  if (typeof info === 'boolean') {
    return async (args) => {
      const f = args.level === 'warning' ? 'warn' : args.level
      console[f](args.log)
    }
  }
  if (typeof info === 'function') {
    return info
  }
  return async (args) => {
    if (info.includes(args.level)) {
      const f = args.level === 'warning' ? 'warn' : args.level
      console[f](args.log)
    }
  }
}
