// OrdersDishes.routes.js
const { Router } = require('express')
const OrderDishesController = require('../controllers/OrderDishesController')
const orderDishesRoutes = Router()
const orderDishesController = new OrderDishesController()

orderDishesRoutes.post('/', orderDishesController.addDishesToOrder)
orderDishesRoutes.get(
  '/list-dishes-in-order/:order_id',
  orderDishesController.listDishesInOrder
)

module.exports = orderDishesRoutes
