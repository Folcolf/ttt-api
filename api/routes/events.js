import events from '../controllers/events.js'
import { isConnected } from '../utils.js'
const URL = '/events'

const eventRoutes = [
  {
    path: `${URL}/:id`,
    method: 'get',
    handlers: [isConnected, events.joined],
  },
  {
    path: `${URL}/:id/position`,
    method: 'get',
    handlers: [isConnected, events.position],
  },
]

export { eventRoutes }
