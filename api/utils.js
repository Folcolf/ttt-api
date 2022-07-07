import client from '@prisma/client'
import express from 'express'
import httpStatus from 'http-status'
import log from './log.js'

/**
 * @param {express.Response} res
 * @param {Object} data
 */
const handleResponse = (res, data, status = 200) => {
  const { req } = res
  const _metadata = {
    page: req.query.page ?? undefined,
    limit: req.query.limit ?? undefined,
    total:
      status !== 200
        ? 0
        : Array.isArray(data)
        ? data.length
        : data
        ? 1
        : undefined,
    links: [{ self: req.originalUrl }],
  }

  if (status !== 200) {
    const error = JSON.parse(
      JSON.stringify(data, Object.getOwnPropertyNames(data))
    )

    log.debug(error)

    res.status(400).json({
      _metadata,
      error,
      timestamp: new Date().toISOString(),
    })
  } else if (data) {
    res.status(status).json({
      _metadata,
      data,
      timestamp: new Date().toISOString(),
    })
  } else {
    res.status(404).json({
      _metadata,
      data: {},
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Get the user from the session
 *
 * @param {express.Request} req
 * @returns {client.User | undefined}
 */
const getUserSession = (req) => {
  const userSession = req.session.user
  return userSession
}

/**
 * Check if the user is authenticated
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
const isConnected = (req, res, next) => {
  if (getUserSession(req)) {
    next()
  } else {
    res.status(401).json({})
    return
  }
}

/**
 * Check if the user is an admin
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
const isAdmin = (req, res, next) => {
  const user = getUserSession(req)
  if (user?.role === 'ADMIN') {
    next()
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({})
    return
  }
}

/**
 * Check if the user is the owner of the resource
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
const isOwner = (req, res, next) => {
  const user = getUserSession(req)
  if (user?.id === req.params.id || user?.role === 'ADMIN') {
    next()
  } else {
    res.status(401).json({})
    return
  }
}

export { handleResponse, isConnected, isAdmin, isOwner, getUserSession }
