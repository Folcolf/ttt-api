import user from '../controllers/user.js'
import { isAdmin, isConnected, isOwner } from '../middleware.js'

const URL = '/users'

const userRoutes = [
  {
    path: URL,
    method: 'get',
    handlers: [isConnected, isAdmin, user.find],
  },
  {
    path: `${URL}/:id`,
    method: 'get',
    handlers: [isConnected, user.getById],
  },
  {
    path: `${URL}/:id`,
    method: 'put',
    handlers: [isConnected, isOwner, user.update],
  },
  {
    path: `${URL}/:id/password`,
    method: 'put',
    handlers: [isConnected, isOwner, user.updatePassword],
  },
  {
    path: `${URL}/:id`,
    method: 'delete',
    handlers: [isConnected, isOwner, user.remove],
  },
]

export { userRoutes }
