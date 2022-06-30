import user from '../controllers/user.js'
import { isAdmin, isConnected, isOwner } from '../utils.js'

const userRoutes = [
  {
    path: '/user',
    method: 'get',
    handlers: [isConnected, isAdmin, user.find],
  },
  {
    path: '/user/:id',
    method: 'get',
    handlers: [isConnected, user.getById],
  },
  {
    path: '/user/:id',
    method: 'put',
    handlers: [isConnected, isOwner, user.update],
  },
  {
    path: '/user/:id/password',
    method: 'put',
    handlers: [isConnected, isOwner, user.updatePassword],
  },
  {
    path: '/user/:id',
    method: 'delete',
    handlers: [isConnected, isOwner, user.remove],
  },
]

export { userRoutes }
