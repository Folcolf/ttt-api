import { NextFunction, Request, Response } from 'express'
import {} from 'express-ws'
import httpStatus from 'http-status'
import { WebSocket } from 'ws'
import log from './log'
import { getJWT, getJWTdata, jwtValid } from './jwt'

/**
 * Check if request is coming from a valid origin
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 */
const headers = (_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
}

/**
 * Check if the user is authenticated
 */
const isConnected = (req: Request, res: Response, next: NextFunction) => {
  const jwt = getJWT(req)
  if (!jwt || !jwtValid(jwt)) {
    res.status(401).json({})
  } else {
    next()
  }
}

/**
 * Check if the user is authenticated
 */
const isConnectedWS = (ws: WebSocket, req: Request, next: NextFunction) => {
  const jwt = getJWT(req)
  if (!jwt || !jwtValid(jwt)) {
    ws.close()
  } else {
    next()
  }
}

/**
 * Check if the user is an admin
 */
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = getJWTdata(req)
  if (user?.role !== 'ADMIN') {
    res.status(httpStatus.UNAUTHORIZED).json({})
  } else {
    next()
  }
}

/**
 * Check if the user is the owner of the resource
 */
const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const user = getJWTdata(req)
  if (user?.id === req.params.id || user?.role === 'ADMIN') {
    next()
  } else {
    res.status(401).json({})
  }
}

const handleResponse = (res: Response, data: unknown, status = 200) => {
  const { req } = res

  let total

  if (status === 200) {
    if (Array.isArray(data)) {
      total = data.length
    } else if (data) {
      total = 1
    } else {
      total = undefined
    }
  } else {
    total = 0
  }

  const _metadata = {
    page: req.query.page ?? undefined,
    limit: req.query.limit ?? undefined,
    total,
    links: [{ self: req.originalUrl }],
  }

  const timestamp = new Date().toISOString()

  if (status !== 200 && data instanceof Error) {
    const error = {
      status,
      message: data.message,
    }

    log.error(JSON.stringify(error))

    res.status(400).json({
      _metadata,
      error,
      timestamp,
    })
    return
  }
  if (data !== undefined && data !== null) {
    res.status(status).json({
      _metadata,
      data,
      timestamp,
    })
    return
  }
  res.status(404).json({
    _metadata,
    data: null,
    timestamp,
  })
}

export { headers, isConnected, isConnectedWS, isAdmin, isOwner, handleResponse }
