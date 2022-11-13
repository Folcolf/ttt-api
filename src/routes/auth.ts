import { Router } from 'express'
import auth from '../controllers/auth'
import log from '../log'

const URL = '/auth'

export default (router: Router) => {
  log.debug('Registering auth routes...')
  router.post(`${URL}/login`, auth.login)
  router.post(`${URL}/register`, auth.register)
  router.post(`${URL}/logged`, auth.isLogged)
}
