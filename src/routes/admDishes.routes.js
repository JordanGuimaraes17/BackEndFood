const { Router } = require('express')
const admDishesController = require('../controllers/AdmDishesController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const AvatarController = require('../controllers/AvatarController')
const uploadConfig = require('../configs/upload')
const admDishesRoutes = Router()
const multer = require('multer')

const upload = multer(uploadConfig.MULTER)
const avatarController = new AvatarController()
const AdmdishesController = new admDishesController()
admDishesRoutes.use(ensuAuthenticated)

admDishesRoutes.post('/', upload.single('image'), AdmdishesController.create)
admDishesRoutes.put('/:id', AdmdishesController.update)
admDishesRoutes.delete('/:id', AdmdishesController.delete)
admDishesRoutes.get('/:id?', AdmdishesController.show)
admDishesRoutes.patch(
  '/avatar/:id',
  upload.single('avatar'),
  avatarController.update
)

module.exports = admDishesRoutes
