import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ForbiddenError } from 'apollo-server-errors'
import gql from 'graphql-tag'

export const authDirectiveTypeDefs = gql`
  directive @auth(isAuthenticated: Boolean! = true, role: String, permissions: [String!], devNoAuth: Boolean! = false) on OBJECT | FIELD_DEFINITION
`

export abstract class AbstractAuthDirective extends SchemaDirectiveVisitor {
  public static getTypeDefs(): any {
    return authDirectiveTypeDefs
  }

  abstract applyAuth(context: {}, requiredRole: string, requiredPermissions: string[]): Promise<true | Error>

  visitObject(type: any) {
    this.ensureFieldsWrapped(type)
    type._isAuthenticated = this.args.isAuthenticated
    type._requiredAuthRole = this.args.role
    type._requiredAuthPermissions = this.args.permissions
    type._devNoAuth = this.args.devNoAuth
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field: any, details: any) {
    this.ensureFieldsWrapped(details.objectType)
    field._isAuthenticated = this.args.isAuthenticated
    field._requiredAuthRole = this.args.role
    field._requiredAuthPermissions = this.args.permissions
    field._devNoAuth = this.args.devNoAuth
  }

  ensureFieldsWrapped(objectType: any) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    const _this = this
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (...args: any) {
        const requiredAuthentication = (field._isAuthenticated || objectType._isAuthenticated) && !((field._devNoAuth || objectType._devNoAuth) && process.env.NODE_ENV === 'development')

        if (requiredAuthentication) {
          const requiredRole = field._requiredAuthRole || objectType._requiredAuthRole

          const requiredPermissions = field._requiredAuthPermissions || objectType._requiredAuthPermissions

          const authOutcome = await _this.applyAuth(args[2], requiredRole, requiredPermissions)
          if (authOutcome === true) {
            return resolve.apply(this, args)
          } else {
            throw authOutcome
          }
        } else {
          return resolve.apply(this, args)
        }
      }
    })
  }
}
