const { Router } = require('express')
const CategoriesController = require('../controllers/CategoriesController')
const categoriesRoutes = Router()
const categoriesController = new CategoriesController()
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')

categoriesRoutes.use(ensuAuthenticated)

categoriesRoutes.post('/', categoriesController.create)
categoriesRoutes.put('/:id', categoriesController.update)
categoriesRoutes.get('/', categoriesController.index)
categoriesRoutes.delete('/:id', categoriesController.delete)

module.exports = categoriesRoutes
