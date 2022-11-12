import express from 'express'
import httpStatus from 'http-status'
import { jwtVerify, SignJWT } from 'jose'
import log from '../log.js'

import service from '../services/auth.js'
import { getJWT, handleResponse } from '../utils.js'

const privateKey = new Uint8Array(process.env.JWT_PRIVATE_KEY)

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  login: async (req, res) => {
    const { email, password } = req.body

    service
      .login(email, password)
      .then(user =>
        new SignJWT({ id: user.id, role: user.role })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(privateKey)
      )
      .then(token => handleResponse(res, token))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  register: async (req, res) => {
    service
      .register(req.body)
      .then(user => res.json(user.id))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */

  isLogged: async (req, res) => {
    const jwt = getJWT(req)
    if (!jwt) {
      return handleResponse(res, null, httpStatus.UNAUTHORIZED)
    }
    jwtVerify(jwt, privateKey, { algorithms: ['HS256'] })
      .then(() => handleResponse(res, jwt))
      .catch(err => handleResponse(res, err, httpStatus.UNAUTHORIZED))
  },
}
