import { DAOGenerics, MiddlewareContext } from '../../dao.types'
import { DAOMiddleware, MiddlewareInput } from '../middlewares.types'

class ValidationError<T extends DAOGenerics> extends Error {
  public errors: string[]
  public args: MiddlewareInput<T>
  public context: MiddlewareContext<T>

  constructor(args: MiddlewareInput<T>, context: MiddlewareContext<T>, errors: string[]) {
    super(`validation error: [${errors.join(', ')}]`)
    this.errors = errors
    this.args = args
    this.context = context
  }
}
type ValidationResult = boolean | { valid: boolean; errors: string[] }
type ValidationLogic<T extends DAOGenerics> = {
  insert?: (record: T['insert']) => ValidationResult
  update?: (changes: T['update']) => ValidationResult
}
function throwIfInvalid<T extends DAOGenerics>(args: MiddlewareInput<T>, context: MiddlewareContext<T>, result: ValidationResult) {
  if (typeof result === 'boolean' && !result) {
    throw new ValidationError(args, context, [])
  }
  if (typeof result !== 'boolean' && !result.valid) {
    throw new ValidationError(args, context, result.errors)
  }
}
export function validation<T extends DAOGenerics>(input: ValidationLogic<T>): DAOMiddleware<T> {
  return {
    before: async (args, context) => {
      if (args.operation === 'insert') {
        const validate = input.insert ? input.insert(args.params.record) : true
        throwIfInvalid(args, context, validate)
      } else if (args.operation === 'update') {
        const validate = input.update ? input.update(args.params.changes) : true
        throwIfInvalid(args, context, validate)
      }
    },
  }
}
