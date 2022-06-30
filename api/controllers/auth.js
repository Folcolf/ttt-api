import express from 'express'
import httpStatus from 'http-status'
import service from '../services/auth.js'
import { handleResponse } from '../utils.js'

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  login: async (req, res) => {
    const { email, password } = req.body

    service
      .login(email, password)
      .then((user) => {
        req.session.user = user
        handleResponse(res, user)
      })
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  register: async (req, res) => {
    service
      .register(req.body)
      .then((user) => res.json(user))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  logout: async (req, res) => {
    req.session.destroy()
    res.json({})
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */

  isLogged: async (req, res) => {
    if (req.session.user) {
      handleResponse(res, req.session.user)
    } else {
      handleResponse(
        res,
        {
          message: 'User is not logged in',
        },
        httpStatus.UNAUTHORIZED
      )
    }
  },
}
