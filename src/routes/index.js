const { Router } = require('express')

const usersRouter = require('./users.routes')
const categoriesRouter = require('./categorie.routes')
const dishesRouter = require('./dishes.routes')
const ordersRouter = require('./orders.routes')
const ratingRouter = require('./rating.routes')
const ordersDishesRouter = require('./OrdersDishes.routes')

const routes = Router()
routes.use('/rating', ratingRouter)
routes.use('/users', usersRouter)
routes.use('/categories', categoriesRouter)
routes.use('/dishes', dishesRouter)
routes.use('/orders', ordersRouter)
routes.use('/order-dishes', ordersDishesRouter)

module.exports = routes
