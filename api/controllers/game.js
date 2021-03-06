import express from 'express'
import httpStatus from 'http-status'
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
  findByUser: async (req, res) => {
    const userId = req.params.userId
    const pagination = req.query

    service
      .findByUser(userId, pagination)
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**ame has ended
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
  count: async (_req, res) => {
    service
      .count()
      .then((data) => handleResponse(res, data))
      .catch((err) => handleResponse(res, err, httpStatus.BAD_REQUEST))
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  countById: async (req, res) => {
    service
      .count(req.params.id)
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
