const { Router } = require('express')
const OrdersController = require('../controllers/OrdersController')
const ordersRoutes = Router()
const ordersController = new OrdersController()
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')

ordersRoutes.use(ensuAuthenticated)

ordersRoutes.post('/', ordersController.addDishToOrder)
ordersRoutes.put('/:order_id', ordersController.updateOrder)
ordersRoutes.delete('/:order_id', ordersController.removeOrder)
ordersRoutes.get('/', ordersController.viewOrder)

module.exports = ordersRoutes
