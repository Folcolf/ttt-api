import compression from 'compression'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import fs from 'fs'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'
import path from 'path'

import log from './api/log.js'
import { router } from './api/routes/index.js'
import { createWSS } from './api/ws.js'

const app = express()
const server = http.createServer(app)

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: true,
})
app.enable('trust proxy')
app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(sessionParser)
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
})

morgan.token('data', (request) => {
  if (request.method === 'POST' || request.method === 'PUT')
    return ' ' + JSON.stringify(request.body)
  else return ' '
})

// create a write stream (in append mode)
const date = new Date()
const accessLogStream = fs.createWriteStream(
  path.join(
    './logs',
    `access.${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`
  ),
  { flags: 'a' }
)

app.use(
  morgan(
    ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms',
    {
      stream: accessLogStream,
    }
  )
)

// WebSocket server

createWSS(server)

app.use('/api', router)

//
// Start the server.
//
server.listen(8080, () => {
  log.info('Listening on http://localhost:8080')
})
