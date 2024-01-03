const sqliteConnection = require('../database/sqlite')
const OrderDishesController = require('./OrderDishesController')

class OrdersController {
  async create(request, response) {
    try {
      const { user_id, dishes } = request.body
      const database = await sqliteConnection()
      const orderDishesController = new OrderDishesController()

      // Insere o pedido na tabela de pedidos com total_quantity e total_price iniciados como zero
      const [order_id] = await database('orders').insert({
        user_id,
        total_quantity: 0,
        total_price: 0
      })

      // Calcula a quantidade total e o valor total dos pratos
      let totalQuantity = 0
      let totalPrice = 0

      for (const dish of dishes) {
        const { dish_id, quantity } = dish

        // Busca o preço do prato no banco de dados
        const dishData = await database('dishes')
          .select('dish_price')
          .where('id', dish_id)
          .first()

        if (dishData) {
          const dishPrice = dishData.dish_price
          totalQuantity += quantity
          totalPrice += quantity * dishPrice

          // Adiciona o prato ao pedido usando o controller de order_dishes
          await orderDishesController.create(
            order_id,
            dish_id,
            quantity,
            dishPrice
          )
        }
      }

      // Atualiza o pedido com a quantidade e o valor total
      await database('orders').where('id', order_id).update({
        total_quantity: totalQuantity,
        total_price: totalPrice
      })

      return response.status(201).json({
        message: 'Pedido criado com sucesso.',
        order_id,
        totalQuantity,
        totalPrice
      })
    } catch (error) {
      console.error(error)
      return response
        .status(error.statusCode || 500)
        .json({ error: error.message || 'Erro ao criar o pedido.' })
    }
  }
}

module.exports = OrdersController
