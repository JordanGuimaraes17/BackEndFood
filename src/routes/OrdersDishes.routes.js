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
orderDishesRoutes.put(
  '/update-dish-in-order',
  orderDishesController.updateDishInOrder
)
orderDishesRoutes.delete(
  '/remove-dish-from-order',
  orderDishesController.removeDishFromOrder
)
orderDishesRoutes.get(
  '/order-details/:order_id',
  orderDishesController.getOrderDetails
)

module.exports = orderDishesRoutes
