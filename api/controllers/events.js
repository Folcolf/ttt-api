import express from 'express'

import { SSEClient } from '../services/events.js'
import service from '../services/game.js'
import { getUserSession } from '../utils.js'
import { getInstance } from '../ws.js'

const clients = new Map()

const wss = getInstance()

export default {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  joined: (req, res) => {
    const client = new SSEClient(res)
    const user = getUserSession(req)
    clients.set(user.id, client)

    const id = req.params.id
    service.getById(id).then((game) => {
      if (game.userId === user.id) {
        client.send({ id: Date.now(), type: 'open', data: 'joined' })
      } else {
        service.update(id, {
          opponentId: user.id,
        })

        const clientOwner = clients.get(game.userId)
        if (clientOwner) {
          clientOwner.send({ id: Date.now(), type: 'close', data: 'joined' })
          client.send({ id: Date.now(), type: 'close', data: 'joined' })

          clients.delete(game.userId)
        } else {
          client.send({ id: Date.now(), type: 'error', data: 'close' })
        }
        clients.delete(user.id)
      }
    })

    client.on('close', () => {
      clients.delete(user.id)
    })
  },

  /**
   *
   * @param {express.Request} req
   * @param {express.Response} _res
   */
  position: (req, _res) => {
    const user = getUserSession(req)
    const id = req.params.id

    wss.on('connection', (ws) => {
      ws.onopen = () => {
        service.getById(id).then((game) => {
          if (game.userId === user.id || game.opponentId === user.id) {
            ws.send(JSON.stringify({ id: Date.now(), type: 'open' }))
          } else {
            ws.send(
              JSON.stringify({
                id: Date.now(),
                type: 'close',
                data: new Error('This game is not yours'),
              })
            )
          }
        })
      }

      /**
       * @param {MessageEvent} message
       */
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data)

        service.getById(id).then((game) => {
          game.board = data.board

          service.update(id, game).then(() => {
            sendToClients(message.data)

            const winner = service.isFinished(game)
            if (winner !== null) {
              service.update(id, {
                win: winner == user.id ? true : false,
              })

              sendToClients({
                id: game.id,
                type: 'close',
                data: winner,
              })
            }
          })
        })
      }

      ws.onerror = (error) => {
        console.error(error)
      }
    })
  },
}

/**
 * Sends a message to all clients.
 *
 * @param {*} data
 */
const sendToClients = (data) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data))
  })
}
