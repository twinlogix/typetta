import { GenericProjection } from '../../projections/projections.types'

export class SecurityPolicyError extends Error {
  constructor(message: string) {
    super(`[Security Policy Middleware] ${message}`)
  }
}

export class SecurityPolicyWriteError extends SecurityPolicyError {
  public permissions: [string, unknown][]
  constructor(args: { permissions: [string, unknown][] }) {
    super(`Unauthorized write.`)
    this.permissions = args.permissions
  }
}

export class SecurityPolicyUpdateError extends SecurityPolicyError {
  public permissions: [string, unknown][]
  public operationDomains: unknown
  constructor(args: { permissions: [string, unknown][]; operationDomains: unknown }) {
    super(`Unauthorized update.`)
    this.permissions = args.permissions
    this.operationDomains = args.operationDomains
  }
}

export class SecurityPolicyDeleteError extends SecurityPolicyError {
  public permissions: [string, unknown][]
  public operationDomains: unknown
  constructor(args: { permissions: [string, unknown][]; operationDomains: unknown }) {
    super(`Unauthorized delete.`)
    this.permissions = args.permissions
    this.operationDomains = args.operationDomains
  }
}

export class SecurityPolicyReadError extends SecurityPolicyError {
  public allowedProjection: GenericProjection
  public requestedProjection: GenericProjection
  public unauthorizedProjection: GenericProjection
  public permissions: [string, unknown][]
  public operationDomains: unknown[]
  constructor(args: {
    permissions: [string, unknown][]
    operationDomains: unknown[]
    requestedProjection: GenericProjection
    allowedProjection: GenericProjection
    unauthorizedProjection: GenericProjection
  }) {
    super(`Unauthorized access to restricted fields.`)
    this.allowedProjection = args.allowedProjection
    this.requestedProjection = args.requestedProjection
    this.unauthorizedProjection = args.unauthorizedProjection
    this.permissions = args.permissions
    this.operationDomains = args.operationDomains
  }
}
