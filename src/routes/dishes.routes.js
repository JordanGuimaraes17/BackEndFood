const { Router } = require('express')
const DishesController = require('../controllers/DishesController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const dishesRoutes = Router()
const dishesController = new DishesController()

dishesRoutes.use(ensuAuthenticated)

dishesRoutes.post('/', dishesController.create)
dishesRoutes.put('/:id', dishesController.update)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.delete('/:id', dishesController.delete)

module.exports = dishesRoutes
