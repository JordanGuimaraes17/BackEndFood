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
      console.error(error)
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
      console.error(error)
      return response.status(500).json({ error: 'Erro ao listar os pedidos.' })
    }
  }
}

module.exports = OrdersController
