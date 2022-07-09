import express from 'express'

import { SSEClient } from '../services/events.js'

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  hello: (req, res) => {
    /* On crée notre client */
    const client = new SSEClient(res)

    client.send({ id: Date.now(), type: 'message', data: 'hello' })
  },
}
