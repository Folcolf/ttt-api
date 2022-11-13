import { Router } from 'express'
import user from '../controllers/user'
import log from '../log'
import { isAdmin, isConnected, isOwner } from '../middleware'

const URL = '/users'

export default (router: Router) => {
  log.debug('Registering user routes...')
  router.get(URL, [isConnected, isAdmin, user.find])
  router.get(`${URL}/:id`, [isConnected, user.getById])
  router.put(`${URL}/:id`, [isConnected, isOwner, user.update])
  router.put(`${URL}/:id/password`, [isConnected, isOwner, user.updatePassword])
  router.delete(`${URL}/:id`, [isConnected, isOwner, user.remove])
}
