const { Router } = require('express')
const admDishesController = require('../controllers/AdmDishesController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization')
const AvatarController = require('../controllers/AvatarController')
const uploadConfig = require('../configs/upload')
const admDishesRoutes = Router()
const multer = require('multer')

const upload = multer(uploadConfig.MULTER)
const avatarController = new AvatarController()
const AdmdishesController = new admDishesController()
admDishesRoutes.use(ensuAuthenticated)

admDishesRoutes.post(
  '/',
  upload.single('image'),
  verifyUserAuthorization(['admin']),
  AdmdishesController.create
)
admDishesRoutes.put(
  '/:id',
  verifyUserAuthorization(['admin']),
  AdmdishesController.update
)
admDishesRoutes.delete(
  '/:id',
  verifyUserAuthorization(['admin']),
  AdmdishesController.delete
)
admDishesRoutes.get('/:id?', AdmdishesController.show)
admDishesRoutes.patch(
  '/avatar/:id',
  upload.single('avatar'),
  avatarController.update
)

module.exports = admDishesRoutes
