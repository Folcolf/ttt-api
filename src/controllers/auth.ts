import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { createJWT, getJWT, jwtValid } from '../jwt'
import { handleResponse } from '../middleware'
import service from '../services/auth'

export default {
  login: async (req: Request, res: Response) => {
    service
      .login(req.body)
      .then(user => createJWT({ id: user.id, role: user.role }))
      .then(token => handleResponse(res, token))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  register: async (req: Request, res: Response) => {
    service
      .register(req.body)
      .then(user => handleResponse(res, user.id))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  isLogged: async (req: Request, res: Response) => {
    const jwt = getJWT(req)
    if (!jwt) {
      return handleResponse(res, null, httpStatus.UNAUTHORIZED)
    }
    jwtValid(jwt)
      .then(() => handleResponse(res, jwt))
      .catch(err => handleResponse(res, err, httpStatus.UNAUTHORIZED))
  },
}
