const { Router } = require('express')

const usersRouter = require('./users.routes')
const categoriesRoutes = require('./categorie.routes')

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/categorie', categoriesRoutes)

module.exports = routes
