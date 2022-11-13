import { Application, Instance } from 'express-ws'

import log from './log'
import { isConnectedWS } from './middleware'
import service from './services/game'
import { getJWTdata } from './jwt'

const URL = '/events'

export default (aWss: Instance, app: Application) => {
  /**
   * Sends a message to all clients.
   *
   * @param {*} data
   */
  const broadcast = (data: unknown) => {
    aWss.getWss().clients.forEach(client => {
      client.send(JSON.stringify(data))
    })
  }

  log.debug(`Registering websocket routes...`)
  app.ws(`${URL}/:id/position`, isConnectedWS, (ws, req) => {
    const userId = getJWTdata(req)?.id
    const id = req.params.id

    ws.onopen = () => {
      service.getById(id).then(game => {
        if (game.userId === userId || game.opponentId === userId) {
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

    ws.onmessage = message => {
      const data = JSON.parse(message.data.toString())

      service
        .getById(id)
        .then(game => {
          game.board = data.board
          return game
        })
        .then(game =>
          service.update(id, game).then(() => {
            broadcast(message.data)

            const winner = service.isFinished(game)
            if (winner === null) {
              return
            }
            service.update(id, {
              win: winner === userId ? true : false,
            })

            broadcast({
              id: game.id,
              type: 'close',
              data: winner,
            })
          })
        )
    }

    ws.onerror = error => {
      log.error(error)
    }
  })

  app.ws(`${URL}/:id`, isConnectedWS, (ws, req) => {
    const id = req.params.id
    log.debug(`WS ${URL}/${id} connected`)
  })

  app.ws(URL, ws => {
    ws.onopen = () => {
      ws.send('Hello world')
    }

    ws.onmessage = event => {
      log.info(event.data)
    }

    ws.onclose = () => {
      log.info('closed')
    }
  })
}
