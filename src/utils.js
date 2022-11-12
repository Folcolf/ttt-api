import client from '@prisma/client'
import express from 'express'
import { decodeJwt } from 'jose'

import log from './log.js'

/**
 * @param {express.Response} res
 * @param {Object} data
 */
const handleResponse = (res, data, status = 200) => {
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
    const error = JSON.parse(
      JSON.stringify(data, Object.getOwnPropertyNames(data))
    )

    log.debug(error)

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

/**
 * Get jwt from request
 *
 * @param {express.Request} req
 * @returns {string | undefined}
 */
const getJWT = req => {
  const jwt = req.headers.authorization?.split(' ')[1]
  if (!jwt) {
    return undefined
  }
  return jwt
}

/**
 * Get the user from jwt
 *
 * @param {express.Request} req
 * @returns {client.User | undefined}
 */
const getJWTdata = req => {
  const jwt = getJWT(req)
  log.debug(jwt)
  if (!jwt) {
    return undefined
  }
  return decodeJwt(jwt)
}


export { handleResponse, getJWTdata, getJWT }
