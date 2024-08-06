/* eslint-disable prettier/prettier */

const AuthController = () => import('#controllers/auth_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const LeftbarsController = () => import('#controllers/leftbar_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return { message: 'Hello world' }
})

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

// bisa login dan anonymous
router.get('/projects', [ProjectsController, 'index'])
router.post('/defaulturl/:slug', [ProjectsController, 'defaultUrl'])

router.group(() => {
  router.get('/me', [AuthController, 'me'])
  router.put('/me', [AuthController, 'update']) 
  router.delete('/logout', [AuthController, 'logout']) 

  router.post('/projects', [ProjectsController, 'store'])
  

  router.post('/projects/:projectSlug/versions/:version/topbars/:topbarSlug/leftbars', [LeftbarsController, 'store'])
  router.put('/projects/:projectSlug/versions/:version/topbars/:topbarSlug/leftbars/:leftbarSlug', [LeftbarsController, 'update'])
  router.delete('/projects/:projectSlug/versions/:version/topbars/:topbarSlug/leftbars/:leftbarSlug', [LeftbarsController, 'destroy'])

}).use(middleware.auth())
