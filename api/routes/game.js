import game from '../controllers/game.js'
import { isAdmin, isConnected, isOwner } from '../utils.js'

const gameRoutes = [
  {
    path: '/game',
    method: 'get',
    handlers: [isConnected, isAdmin, game.find],
  },
  {
    path: '/game/:id',
    method: 'get',
    handlers: [isConnected, game.getById],
  },
  {
    path: '/game',
    method: 'post',
    handlers: [isConnected, game.create],
  },
  {
    path: '/game/:id',
    method: 'put',
    handlers: [isConnected, isOwner, game.update],
  },
  {
    path: '/game/:id',
    method: 'delete',
    handlers: [isConnected, isOwner, game.remove],
  },
]

export { gameRoutes }