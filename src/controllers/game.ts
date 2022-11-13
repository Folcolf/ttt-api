import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { handleResponse } from '../middleware'
import service from '../services/game'
import type { Pagination } from '../types/pagination'

export default {
  find: async (req: Request, res: Response) => {
    const id = req.query.id as string
    const pagination: Pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    }
    service
      .find(id, pagination)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  findByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId
    const pagination: Pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    }

    service
      .findByUser(userId, pagination)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  getById: async (req: Request, res: Response) => {
    service
      .getById(req.params.id)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  count: async (_req: Request, res: Response) => {
    service
      .count()
      .then(data => handleResponse(res, data))
      .catch(() => handleResponse(res, 0))
  },

  countById: async (req: Request, res: Response) => {
    service
      .count(req.params.id)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  create: async (req: Request, res: Response) => {
    service
      .create(req.body)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  remove: async (req: Request, res: Response) => {
    service
      .remove(req.params.id)
      .then(data => handleResponse(res, data))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },
}
