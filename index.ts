import compression from 'compression'
import cors from 'cors'
import express from 'express'
import expressWs from 'express-ws'
import helmet from 'helmet'
import morgan from 'morgan'

import log, { accessLogStream } from './src/log'
log.info('Starting server')

import { headers } from './src/middleware'
import { router } from './src/routes/index'
import ws from './src/ws'

const aWss = expressWs(express())
const app = aWss.app

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
app.use(
  morgan(
    ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms',
    { stream: accessLogStream }
  )
)

app.use('/api', router)
ws(aWss, app)

//
// Start the server.
//
app.listen(8080, () => {
  log.info('Listening on http://localhost:8080')
})
