/* eslint-disable prettier/prettier */

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return { message: 'Hello world' }
})

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

router.group(() => {
  router.get('/me', [AuthController, 'me'])
  router.delete('/logout', [AuthController, 'logout']) 
}).use(middleware.auth())
