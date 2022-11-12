import express from 'express'
import httpStatus from 'http-status'
import service from '../services/user.js'
import { handleResponse } from '../utils.js'

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  find: async (req, res) => {
    const pagination = req.query
    service
      .find(pagination)
      .then(users => handleResponse(res, users))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  getById: async (req, res) => {
    service
      .getById(req.params.id)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  update: async (req, res) => {
    const { id } = req.params
    const body = req.body

    service
      .update(id, body)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  updatePassword: async (req, res) => {
    const { id } = req.params
    const body = req.body

    service
      .updatePassword(id, body)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  remove: async (req, res) => {
    const { id } = req.params

    service
      .remove(id)
      .then(user => handleResponse(res, user))
      .catch(err => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },
}
