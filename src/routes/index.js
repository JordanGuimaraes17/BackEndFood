const { Router } = require('express')

const usersRouter = require('./users.routes')
const categoriesRoutes = require('./categorie.routes')
const ingredientsRoutes = require('./ingredients.routes')
const routes = Router()

routes.use('/users', usersRouter)
routes.use('/categorie', categoriesRoutes)
routes.use('/ingredients', ingredientsRoutes)

module.exports = routes
