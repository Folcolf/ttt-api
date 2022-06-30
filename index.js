import cors from 'cors'
import express from 'express'
import session from 'express-session'
import http from 'http'
import morgan from 'morgan'

import log from './api/log.js'
import { router } from './api/routes/index.js'

const app = express()
app.listen
//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
})

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

app.use(
  morgan(
    ':date[iso] :method :url :status :res[content-length] - :response-time ms :data'
  )
)

app.use('/api', router)

//
// Create an HTTP server.
//
const server = http.createServer(app)

//
// Start the server.
//
server.listen(8080, () => {
  log.info('Listening on http://localhost:8080')
})
