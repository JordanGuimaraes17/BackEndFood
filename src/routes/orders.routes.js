const { Router } = require('express')
const OrdersController = require('../controllers/OrdersController')
const ordersRoutes = Router()
const ordersController = new OrdersController()
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')

ordersRoutes.use(ensuAuthenticated)

ordersRoutes.post('/', ordersController.create)
ordersRoutes.get('/:order_id', ordersController.getOrderDetails)
ordersRoutes.delete('/:order_id', ordersController.removeOrder)

module.exports = ordersRoutes
