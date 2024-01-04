const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class OrdersController {
  async create(request, response) {
    try {
      const { user_id, dishes } = request.body
      const database = await sqliteConnection()

      // Certifique-se de que o usuário exista
      const user = await database.get('SELECT * FROM users WHERE id = ?', [
        user_id
      ])
      if (!user) {
        throw new AppError('Usuário não encontrado.')
      }

      // Verifique se a lista de pratos está vazia
      if (!dishes || dishes.length === 0) {
        throw new AppError('A lista de pratos está vazia.')
      }

      // Crie um novo pedido
      const { lastID } = await database.run(
        'INSERT INTO orders (user_id, total_quantity) VALUES (?, ?)',
        [user_id, dishes.length]
      )

      // Adicione os pratos ao pedido na tabela 'order_dishes'
      for (const dishId of dishes) {
        await database.run(
          'INSERT INTO order_dishes (order_id, dish_id) VALUES (?, ?)',
          [lastID, dishId]
        )
      }

      return response.status(201).json({ order_id: lastID })
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar o pedido.' })
    }
  }

  async list(request, response) {
    try {
      const database = await sqliteConnection()

      // Obtenha a lista de pedidos
      const orders = await database.all('SELECT * FROM orders')

      // Mapeie os resultados para um formato mais limpo, se necessário
      const formattedOrders = orders.map(order => {
        // Implemente o formato desejado
        return {
          order_id: order.id,
          user_id: order.user_id,
          total_quantity: order.total_quantity,
          created_at: order.created_at
          // Adicione mais informações conforme necessário
        }
      })

      return response.json(formattedOrders)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao listar os pedidos.' })
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
      return response
        .status(500)
        .json({ error: 'Erro ao obter detalhes do pedido.' })
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
      return response.status(500).json({ error: 'Erro ao remover o pedido.' })
    }
  }
}

module.exports = OrdersController
