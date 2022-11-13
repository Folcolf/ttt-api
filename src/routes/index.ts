import { Router } from 'express'
import log from '../log'

import authRoutes from './auth'
import gameRoutes from './game'
import userRoutes from './user'

const router = Router()
log.debug('Registering routes...')
authRoutes(router)
userRoutes(router)
gameRoutes(router)

export { router }
