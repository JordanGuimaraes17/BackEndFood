const { Router } = require('express')
const CategoriesController = require('../controllers/CategoriesController')
const categoriesRoutes = Router()
const categoriesController = new CategoriesController()
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization')

categoriesRoutes.use(ensuAuthenticated)

categoriesRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  categoriesController.create
)
categoriesRoutes.put(
  '/:id',
  verifyUserAuthorization(['admin']),
  categoriesController.update
)
categoriesRoutes.get('/', categoriesController.index)
categoriesRoutes.delete(
  '/:id',
  verifyUserAuthorization(['admin']),
  categoriesController.delete
)

module.exports = categoriesRoutes
