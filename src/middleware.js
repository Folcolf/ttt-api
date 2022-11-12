import express from 'express'

import { getJWTdata } from './utils.js'

/**
 * Check if request is coming from a valid origin
 *
 * @param {express.Request} _req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const headers = (_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
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
  if (!getJWTdata(req)) {
    res.status(401).json({})
  } else {
    next()
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
  const user = getJWTdata(req)
  if (user?.role !== 'ADMIN') {
    res.status(httpStatus.UNAUTHORIZED).json({})
  } else {
    next()
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
  const user = getJWTdata(req)
  if (user?.id === req.params.id || user?.role === 'ADMIN') {
    next()
  } else {
    res.status(401).json({})
  }
}

export { headers, isConnected, isAdmin, isOwner }
