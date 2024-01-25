const { Router } = require('express')
const DishesController = require('../controllers/DishesController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const AvatarController = require('../controllers/AvatarController')
const uploadConfig = require('../configs/upload')
const dishesRoutes = Router()
const multer = require('multer')

const upload = multer(uploadConfig.MULTER)
const avatarController = new AvatarController()
const dishesController = new DishesController()

dishesRoutes.use(ensuAuthenticated)

dishesRoutes.post('/', dishesController.create)
dishesRoutes.put('/:id', dishesController.update)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.delete('/:id', dishesController.delete)
dishesRoutes.patch('/avatar', upload.single('avatar'), avatarController.update)

module.exports = dishesRoutes
