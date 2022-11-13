import { Router } from 'express'
import game from '../controllers/game'
import log from '../log'
import { isAdmin, isConnected, isOwner } from '../middleware'

const URL = '/games'

export default (router: Router) => {
  log.debug('Registering game routes...')
  router.get(`${URL}/count/:id`, [isConnected, isOwner, game.countById])
  router.get(`${URL}/count`, [isConnected, isAdmin, game.count])
  router.get(`${URL}/:id`, [isConnected, game.getById])
  router.get(URL, [isConnected, isAdmin, game.find])
  router.post(URL, [isConnected, isAdmin, game.create])
  router.delete(`${URL}/:id`, [isConnected, isAdmin, game.remove])
}
