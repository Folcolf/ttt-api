import events from '../controllers/events.js'
import { isConnected } from '../middleware.js'

const URL = '/events'

const eventRoutes = [
  {
    path: `${URL}/:id`,
    method: 'get',
    handlers: [events.joined],
  },
  {
    path: `${URL}/:id/position`,
    method: 'get',
    handlers: [isConnected, events.position],
  },
]

export { eventRoutes }
