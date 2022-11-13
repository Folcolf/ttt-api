import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { handleResponse } from '../middleware'
import service from '../services/user'
import type { Pagination } from '../types/pagination'

export default {
  find: async (req: Request, res: Response) => {
    const pagination: Pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    }
    service
      .find(pagination)
      .then(users => handleResponse(res, users))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  getById: async (req: Request, res: Response) => {
    service
      .getById(req.params.id)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body

    service
      .update(id, body)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  updatePassword: async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body

    service
      .updatePassword(id, body)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  remove: async (req: Request, res: Response) => {
    const { id } = req.params

    service
      .remove(id)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },
}
