import { ApolloError } from 'apollo-server-errors'
import { NextFunction, Request, Response } from 'express'
import { valid, gt, lt } from 'semver'

export function versioningGraphQLMiddleware<T extends { request: Request; response: Response }>({ current, lastSupported }: { current: string; lastSupported: string }) {
  if (!valid(current)) {
    throw new Error(`${current} is not a valid current version.`)
  }

  if (!valid(lastSupported)) {
    throw new Error(`${lastSupported} is not a valid last supported version.`)
  }

  if (gt(lastSupported, current)) {
    throw new Error(`Last supported version ${lastSupported} must
            be less than equal to current version ${current}.`)
  }

  return async ({ context }: { context: T }, next: () => Promise<any>): Promise<any> => {
    context.response.set('Version', current)
    context.response.set('Version-Last-Supported', lastSupported)

    const requestAcceptVersion = context.request.get('Accept-Version')

    const details = {
      version: current,
      versionLastSupported: lastSupported,
    }

    if (!requestAcceptVersion) {
      throw new ApolloError('No Accept-Version header found in current request. API version is mandatory.', 'MISSING_VERSION', details)
    }
    if (!valid(requestAcceptVersion)) {
      throw new ApolloError(
        `Accept-Version header ${requestAcceptVersion} is not a valid semantic version string. Please refer to https://semver.org/ specifications and retry with a valid version.`,
        'MALFORMED_VERSION',
        details,
      )
    }
    if (gt(requestAcceptVersion, current)) {
      throw new ApolloError(`Accept-Version header ${requestAcceptVersion} is greater than current acceptable version ${current}.`, 'INVALID_VERSION', details)
    }
    if (lt(requestAcceptVersion, lastSupported)) {
      throw new ApolloError(
        `Accept-Version header ${requestAcceptVersion} is less than last supported version ${lastSupported}. Please upgrade your client to a recent version.`,
        'UNSUPPORTED_VERSION',
        details,
      )
    }

    return next()
  }
}

export function versioningExpressMiddleware({ current, lastSupported }: { current: string; lastSupported: string }) {
  if (!valid(current)) {
    throw new Error(`${current} is not a valid current version.`)
  }

  if (!valid(lastSupported)) {
    throw new Error(`${lastSupported} is not a valid last supported version.`)
  }

  if (gt(lastSupported, current)) {
    throw new Error(`Last supported version ${lastSupported} must
            be less than equal to current version ${current}.`)
  }

  return (req: Request, res: Response, next: NextFunction) => {
    res.set('Version', current)
    res.set('Version-Last-Supported', lastSupported)

    const requestAcceptVersion = req.get('Accept-Version')
    if (!requestAcceptVersion) {
      res.send(`No Accept-Version header found in current request. API version is mandatory.`)
      res.status(400)
      return
    }
    if (!valid(requestAcceptVersion)) {
      res.send(`Accept-Version header ${requestAcceptVersion} is not a valid semantic version string. Please refer to https://semver.org/ specifications and retry with a valid version.`)
      res.status(400)
      return
    }
    if (gt(requestAcceptVersion, current)) {
      res.send(`Accept-Version header ${requestAcceptVersion} is greater than current acceptable version ${current}.`)
      res.status(400)
      return
    }
    if (lt(requestAcceptVersion, lastSupported)) {
      res.send(`Accept-Version header ${requestAcceptVersion} is less than last supported version ${lastSupported}. Please upgrade your client to a recent version.`)
      res.status(426)
      return
    }

    next()
  }
}
