import { DAOGenerics } from '../../dao.types'
import { DAOMiddleware } from '../middlewares.types'

export function loggingMiddleware<T extends DAOGenerics>(log: (str: string) => Promise<void>): DAOMiddleware<T> {
  return {
    before: async (args) => {
      await log(`[before] ${JSON.stringify(args)}`)
    },
    after: async (args) => {
      const a = args.operation === 'find' ? { ...args, records: args.records.length } : args
      await log(`[after] ${JSON.stringify(a)}`)
    },
  }
}
