import http from 'http'
import { WebSocketServer } from 'ws'

let instance = null

/**
 * Creates a new WebSocket server.
 *
 * @param {http.Server} server
 * @return {WebSocketServer}
 */
const createWSS = server => {
  instance = new WebSocketServer({
    noServer: true,
    path: '/websockets',
  })

  server.on('upgrade', (request, socket, head) =>
    instance.handleUpgrade(request, socket, head, websocket =>
      instance.emit('connection', websocket, request)
    )
  )
}

/**
 * Gets the WebSocket server.
 *
 * @return {WebSocketServer}
 */
const getInstance = () => instance

export { createWSS, getInstance }
