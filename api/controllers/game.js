import express from 'express'
import service from '../services/game.js'
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
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  getById: async (req, res) => {
    service
      .getById(req.params.id)
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  create: async (req, res) => {
    service
      .create(req.body)
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  update: async (req, res) => {
    service
      .update(req.params.id, req.body)
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  remove: async (req, res) => {
    service
      .remove(req.params.id)
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },
}
