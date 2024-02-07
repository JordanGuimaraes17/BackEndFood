const { Router } = require('express')

const sessionsRouter = require('./sessions.routes')
const usersRouter = require('./users.routes')
const categoriesRouter = require('./categorie.routes')
const dishesRouter = require('./dishes.routes')
const admDishesRouter = require('./admDishes.routes')

const ordersRouter = require('./orders.routes')
const ratingRouter = require('./rating.routes')

const routes = Router()
routes.use('/sessions', sessionsRouter)
routes.use('/rating', ratingRouter)
routes.use('/users', usersRouter)
routes.use('/category', categoriesRouter)
routes.use('/dishes', admDishesRouter)
routes.use('/dishesAdmin', dishesRouter)
routes.use('/orders', ordersRouter)

module.exports = routes
