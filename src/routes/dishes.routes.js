const { Router } = require('express')
const DishesController = require('../controllers/DishesController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization')
const AvatarController = require('../controllers/AvatarController')
const uploadConfig = require('../configs/upload')
const dishesRoutes = Router()
const multer = require('multer')

const upload = multer(uploadConfig.MULTER)
const avatarController = new AvatarController()
const dishesController = new DishesController()
dishesRoutes.use(ensuAuthenticated)

dishesRoutes.post(
  '/',
  upload.single('image'),

  dishesController.create
)
dishesRoutes.put(
  '/:id',

  dishesController.update
)
dishesRoutes.delete(
  '/:id',
  verifyUserAuthorization(['admin']),
  dishesController.delete
)
dishesRoutes.get('/:id?', dishesController.show)
dishesRoutes.patch(
  '/avatar/:id',
  upload.single('avatar'),
  avatarController.update
)

module.exports = dishesRoutes
