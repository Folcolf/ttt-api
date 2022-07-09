import { Router } from 'express'

import log from '../log.js'
import { authRoutes } from './auth.js'
import { eventRoutes } from './events.js'
import { gameRoutes } from './game.js'
import { userRoutes } from './user.js'

const router = Router()

const registerRoutes = (routes) => {
  routes.forEach(({ path, method, handlers }) => {
    log.debug(`Registering route: ${method.toUpperCase()} ${path}`)
    router[method](path, ...handlers)
  })
}

registerRoutes(authRoutes)
registerRoutes(userRoutes)
registerRoutes(gameRoutes)
registerRoutes(eventRoutes)

export { router }
