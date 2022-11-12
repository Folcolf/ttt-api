import auth from '../controllers/auth.js'

const URL = '/auth'

const authRoutes = [
  {
    path: `${URL}/login`,
    method: 'post',
    handlers: [auth.login],
  },
  {
    path: `${URL}/register`,
    method: 'post',
    handlers: [auth.register],
  },
  {
    path: `${URL}/logged`,
    method: 'get',
    handlers: [auth.isLogged],
  },
]

export { authRoutes }
