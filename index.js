import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'

import log, { accessLogStream } from './src/log.js'
import { headers } from './src/middleware.js'
import { router } from './src/routes/index.js'
import { createWSS } from './src/ws.js'

const app = express()
const server = http.createServer(app)

const args = process.argv.slice(2)
const appLevel = args[0] || 'info'

app.enable('trust proxy')
app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(headers)

app.use(
  cors({
    credentials: true,
    origin: appLevel === 'debug' ? '*' : 'http://localhost:3000',
  })
)

morgan.token('data', request => {
  return ' ' + request.method === 'POST' || request.method === 'PUT'
    ? JSON.stringify(request.body)
    : ''
})

app.use(
  morgan(
    ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms',
    { stream: accessLogStream }
  )
)

// WebSocket server
createWSS(server)

app.use('/api', router)

//
// Start the server.
//
server.listen(8080, () => log.info('Listening on http://localhost:8080'))
