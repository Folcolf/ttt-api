import express from 'express'
import { decodeJwt } from 'jose'

import log from '../log.js'
import { SSEClient } from '../services/events.js'
import service from '../services/game.js'
import { getJWTdata } from '../utils.js'
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
    log.info('Client connected')

    client.on('message', ({ data }) => {
      log.info('Client sent message', data)
      const user = decodeJwt(data)
      clients.set(user.id, client)
      log.info(`Client ${user.id} joined.`)

      const id = req.params.id
      service.getById(id).then(game => {
        if (game.userId === user.id) {
          client.send({ id: Date.now(), type: 'open', data: 'joined' })
          log.info(`Client ${user.id} joined game ${id}.`)
        } else {
          service.update(id, {
            opponentId: user.id,
          })
          log.info(`Client ${user.id} joined game ${id}.`)

          const clientOwner = clients.get(game.userId)
          if (clientOwner) {
            clientOwner.send({ id: Date.now(), type: 'close', data: 'joined' })
            client.send({ id: Date.now(), type: 'close', data: 'joined' })

            // clients.delete(game.userId)
          } else {
            client.send({ id: Date.now(), type: 'error', data: 'close' })
          }
          clients.delete(user.id)
        }
      })
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
    const user = getJWTdata(req)
    const id = req.params.id

    wss.on('connection', ws => {
      ws.onopen = () => {
        service.getById(id).then(game => {
          if (game.userId === user.id || game.opponentId === user.id) {
            ws.send(JSON.stringify({ id: Date.now(), type: 'open' }))
            return
          }
          ws.send(
            JSON.stringify({
              id: Date.now(),
              type: 'close',
              data: new Error('This game is not yours'),
            })
          )
        })
      }

      /**
       * @param {MessageEvent} message
       */
      ws.onmessage = message => {
        const data = JSON.parse(message.data)

        service.getById(id).then(game => {
          game.board = data.board

          service.update(id, game).then(() => {
            sendToClients(message.data)

            const winner = service.isFinished(game)
            if (winner === null) {
              return
            }
            service.update(id, {
              win: winner == user.id ? true : false,
            })

            sendToClients({
              id: game.id,
              type: 'close',
              data: winner,
            })
          })
        })
      }

      ws.onerror = error => {
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
const sendToClients = data => {
  wss.clients.forEach(client => client.send(JSON.stringify(data)))
}
