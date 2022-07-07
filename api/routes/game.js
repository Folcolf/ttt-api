import game from '../controllers/game.js'
import { isAdmin, isConnected, isOwner } from '../utils.js'

const URL = '/games'

const gameRoutes = [
  {
    path: `${URL}/count/:id`,
    method: 'get',
    handlers: [isConnected, game.countById],
  },
  {
    path: `${URL}/count`,
    method: 'get',
    handlers: [game.count],
  },
  {
    path: `${URL}/:id`,
    method: 'get',
    handlers: [isConnected, game.getById],
  },
  {
    path: URL,
    method: 'get',
    handlers: [isConnected, isAdmin, game.find],
  },
  {
    path: URL,
    method: 'post',
    handlers: [isConnected, game.create],
  },
  {
    path: `${URL}/:id`,
    method: 'put',
    handlers: [isConnected, isOwner, game.update],
  },
  {
    path: `${URL}/:id`,
    method: 'delete',
    handlers: [isConnected, isOwner, game.remove],
  },
]

export { gameRoutes }
