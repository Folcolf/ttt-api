import events from '../controllers/events.js'
import { isConnected } from '../utils.js'
const URL = '/events'

const eventRoutes = [
  {
    path: URL,
    method: 'get',
    handlers: [isConnected, events.hello],
  },
]

export { eventRoutes }
