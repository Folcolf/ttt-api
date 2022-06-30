import auth from '../controllers/auth.js'

const authRoutes = [
  {
    path: '/auth/login',
    method: 'post',
    handlers: [auth.login],
  },
  {
    path: '/auth/register',
    method: 'post',
    handlers: [auth.register],
  },
  {
    path: '/auth/logout',
    method: 'post',
    handlers: [auth.logout],
  },
  {
    path: '/auth/logged',
    method: 'get',
    handlers: [auth.isLogged],
  },
]

export { authRoutes }
