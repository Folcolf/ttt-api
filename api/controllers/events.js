import express from 'express'

import { SSEClient } from '../services/events.js'
import service from '../services/game.js'
import { getUserSession } from '../utils.js'

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  hello: (req, res) => {
    /* On crée notre client */
    const client = new SSEClient(res)

    client.send({ id: Date.now(), type: 'open', data: 'hello' })
  },

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  joined: (req, res) => {
    /* On crée notre client */
    const client = new SSEClient(res)

    const id = req.params.id
    const user = getUserSession(req)
    service.update(id, {
      opponentId: user.id,
    })

    client.send({ id: Date.now(), type: 'message', data: 'joined' })
  },

  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  position: (req, res) => {
    /* On crée notre client */
    const client = new SSEClient(res)

    const id = req.params.id
    const user = getUserSession(req)
    service
      .getById(id)
      .then(({ opponentId, board }) => {
        if (opponentId !== user.id) {
          throw new Error('not your game')
        }
        if (!board) {
          board = Array(9).fill(null)
        }
        board[req.body.position] = user.id
        service.update(id, {
          board,
        })

        client.send({ id: Date.now(), type: 'message', data: board })

        const winner = service.isFinished(board)
        if (winner !== null) {
          service.update(id, {
            win: winner == user.id ? true : false,
          })
          client.send({ id: Date.now(), type: 'close', data: winner })
        }
      })
      .catch((err) => {
        client.send({ id: Date.now(), type: 'error', data: err.message })
      })
  },
}
