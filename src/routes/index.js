const { Router } = require('express')

const usersRouter = require('./users.routes')
const categoriesRoutes = require('./categorie.routes')
const dishesRoutes = require('./dishes.routes')
const ordersRoutes = require('./orders.routes')
const ordersDishesRoutes = require('./OrdersDishes.routes')

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/categories', categoriesRoutes)
routes.use('/dishes', dishesRoutes)
routes.use('/orders', ordersRoutes)
routes.use('/order-dishes', ordersDishesRoutes)

module.exports = routes
