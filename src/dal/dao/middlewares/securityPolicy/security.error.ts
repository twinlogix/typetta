import { GenericProjection } from '../../projections/projections.types'

export class SecurityPolicyError extends Error {
  constructor(message: string) {
    super(`[Security Policy Middleware] ${message}`)
  }
}

export class SecurityPolicyWriteError extends SecurityPolicyError {
  public permissions: string[]
  constructor(args: { permissions: string[] }) {
    super(`Unauthorized write.`)
    this.permissions = args.permissions
  }
}

export class SecurityPolicyUpdateError extends SecurityPolicyError {
  public permissions: string[]
  public domains: unknown
  constructor(args: { permissions: string[]; domains: unknown }) {
    super(`Unauthorized update.`)
    this.permissions = args.permissions
    this.domains = args.domains
  }
}

export class SecurityPolicyDeleteError extends SecurityPolicyError {
  public permissions: string[]
  public domains: unknown
  constructor(args: { permissions: string[]; domains: unknown }) {
    super(`Unauthorized delete.`)
    this.permissions = args.permissions
    this.domains = args.domains
  }
}

export class SecurityPolicyReadError extends SecurityPolicyError {
  public allowedProjection: GenericProjection
  public requestedProjection: GenericProjection
  public unauthorizedProjection: GenericProjection
  public permissions: string[]
  public domains: unknown
  constructor(args: { permissions: string[]; domains: unknown; requestedProjection: GenericProjection; allowedProjection: GenericProjection; unauthorizedProjection: GenericProjection }) {
    super(`Unauthorized access to restricted fields.`)
    this.allowedProjection = args.allowedProjection
    this.requestedProjection = args.requestedProjection
    this.unauthorizedProjection = args.unauthorizedProjection
    this.permissions = args.permissions
    this.domains = args.domains
  }
}
