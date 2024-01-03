const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')

class OrderDishesController {
  async addDishesToOrder(request, response) {
    try {
      const { order_id, dishes } = request.body
      const database = await sqliteConnection()

      // Verifique se o pedido existe
      const order = await database.get('SELECT * FROM orders WHERE id = ?', [
        order_id
      ])
      if (!order) {
        throw new AppError('Pedido não encontrado.')
      }

      // Adicione os pratos ao pedido na tabela 'order_dishes'
      for (const dishId of dishes) {
        await database.run(
          'INSERT INTO order_dishes (order_id, dish_id) VALUES (?, ?)',
          [order_id, dishId]
        )
      }

      // Atualize a quantidade total e o preço total no pedido
      const updatedOrder = await database.get(
        'SELECT COUNT(*) AS total_quantity, SUM(d.price) AS total_price FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?',
        [order_id]
      )

      await database.run(
        'UPDATE orders SET total_quantity = ?, total_price = ? WHERE id = ?',
        [updatedOrder.total_quantity, updatedOrder.total_price, order_id]
      )

      return response
        .status(201)
        .json({ message: 'Pratos adicionados ao pedido com sucesso.' })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao adicionar pratos ao pedido.' })
    }
  }

  async listDishesInOrder(request, response) {
    try {
      const { order_id } = request.params
      const database = await sqliteConnection()

      // Obtenha a lista de pratos no pedido
      const orderDishes = await database.all(
        'SELECT d.id, d.name, d.description, d.price FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?',
        [order_id]
      )

      return response.json(orderDishes)
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao listar pratos do pedido.' })
    }
  }
}

module.exports = OrderDishesController
