const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class OrdersController {
  async create(request, response) {
    try {
      const { user_id, dishes } = request.body
      const database = await sqliteConnection()

      const user = await database.get('SELECT * FROM users WHERE id = ?', [
        user_id
      ])
      if (!user) {
        throw new AppError('Usuário não encontrado.')
      }

      if (!dishes || dishes.length === 0) {
        throw new AppError('A lista de pratos está vazia.')
      }

      // Crie um novo pedido
      const { lastID } = await database.run(
        'INSERT INTO orders (user_id, total_quantity, total_price) VALUES (?, ?, ?)',
        [user_id, dishes.length, 0] // Definindo inicialmente total_price como 0
      )

      // Adicione os pratos ao pedido na tabela 'order_dishes'
      for (const dishId of dishes) {
        const dish = await database.get('SELECT * FROM dishes WHERE id = ?', [
          dishId
        ])
        await database.run(
          'INSERT INTO order_dishes (order_id, dish_id, quantity, dish_price) VALUES (?, ?, ?, ?)',
          [lastID, dishId, 1, dish.price || 0]
        )
      }

      // Calcula o total_price somando os preços dos pratos associados ao pedido
      const total_price = await database.get(
        'SELECT SUM(dish_price) AS total_price FROM order_dishes WHERE order_id = ?',
        [lastID]
      )

      // Atualiza o total_price no pedido
      await database.run('UPDATE orders SET total_price = ? WHERE id = ?', [
        total_price.total_price || 0,
        lastID
      ])

      return response.status(201).json({ order_id: lastID })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: error.message || 'Erro ao criar o pedido.' })
    }
  }

  async getOrderDetails(request, response) {
    try {
      const { order_id } = request.params
      const database = await sqliteConnection()

      // Obtenha detalhes específicos do pedido
      const orderDetails = await database.get(
        'SELECT * FROM orders WHERE id = ?',
        [order_id]
      )

      if (!orderDetails) {
        throw new AppError('Detalhes do pedido não encontrados.')
      }

      // Obtenha a lista de pratos no pedido
      const orderDishes = await database.all(
        'SELECT d.id, d.name, d.description, d.price, od.quantity FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?',
        [order_id]
      )

      orderDetails.dishes = orderDishes

      return response.json(orderDetails)
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: error.message || 'Erro ao obter detalhes do pedido.' })
    }
  }

  async removeOrder(request, response) {
    try {
      const { order_id } = request.params
      const database = await sqliteConnection()

      // Verifique se o pedido existe
      const order = await database.get('SELECT * FROM orders WHERE id = ?', [
        order_id
      ])

      if (!order) {
        throw new AppError('Pedido não encontrado.')
      }

      // Remova o pedido e pratos associados
      await database.run('DELETE FROM orders WHERE id = ?', [order_id])
      await database.run('DELETE FROM order_dishes WHERE order_id = ?', [
        order_id
      ])

      return response.json({ message: 'Pedido removido com sucesso.' })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: error.message || 'Erro ao remover o pedido.' })
    }
  }
}

module.exports = OrdersController
