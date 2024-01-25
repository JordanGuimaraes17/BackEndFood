const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class OrdersController {
  async addDishToOrder(request, response) {
    try {
      const { dish_id } = request.body
      const user_id = request.user.id
      const database = await sqliteConnection()

      try {
        // Obtenha os detalhes do prato por ID
        const dishDetails = await database.get(
          'SELECT * FROM dishes WHERE id = ?',
          [dish_id]
        )

        if (!dishDetails) {
          return response.status(404).json({ error: 'Prato não encontrado' })
        }

        // Verifique se o prato já está no pedido
        const existingOrder = await database.get(
          'SELECT * FROM orders WHERE user_id = ? AND dish_id = ?',
          [user_id, dish_id]
        )

        if (existingOrder) {
          // Se o prato já estiver no pedido, aumente a quantidade e atualize o total
          const newQuantity = existingOrder.quantity + 1
          const newTotalPrice = newQuantity * dishDetails.price

          await database.run(
            'UPDATE orders SET quantity = ?, total_price = ? WHERE id = ?',
            [newQuantity, newTotalPrice, existingOrder.id]
          )

          return response.json({
            success: 'Quantidade do prato no pedido aumentada com sucesso',
            orderId: existingOrder.id
          })
        } else {
          // Se o prato ainda não estiver no pedido, adicione-o normalmente
          const { lastID: orderId } = await database.run(
            'INSERT INTO orders (user_id, dish_id, quantity, dish_price, total_price) VALUES (?, ?, ?, ?, ?)',
            [user_id, dish_id, 1, dishDetails.price, dishDetails.price]
          )

          return response.status(201).json({
            success: 'Prato adicionado ao pedido com sucesso',
            orderId
          })
        }
      } finally {
        // Feche a conexão com o banco de dados se ela estiver definida
        database && (await database.close())
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async viewOrder(request, response) {
    const user_id = request.user.id
    const database = await sqliteConnection()

    try {
      // Obtenha os pratos do pedido do usuário
      const orderDetails = await database.all(
        'SELECT o.id, o.quantity, o.dish_price, o.total_price, d.name AS dish_name, d.description AS dish_description, d.price AS dish_price FROM orders o LEFT JOIN dishes d ON o.dish_id = d.id WHERE o.user_id = ?',
        [user_id]
      )

      // Verifique se orderDetails é um array
      if (!Array.isArray(orderDetails)) {
        return response
          .status(500)
          .json({ error: 'Erro ao obter detalhes do pedido' })
      }

      if (orderDetails.length === 0) {
        return response.status(404).json({ message: 'Pedido não encontrado' })
      }

      // Calcule o total do pedido
      const totalOrderPrice = orderDetails.reduce(
        (total, dish) => total + dish.total_price,
        0
      )

      // Retorne os detalhes do pedido e o total
      return response.json({
        orderDetails,
        totalOrderPrice
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    } finally {
      // Feche a conexão com o banco de dados em todos os casos
      database && (await database.close())
    }
  }

  async removeOrder(req, res) {
    const database = await sqliteConnection()

    try {
      const { dish_id } = req.body
      const user_id = req.user.id

      if (!dish_id || dish_id.length === 0) {
        throw new AppError('A lista de pratos está vazia.')
      }

      // Verifique se o prato está no pedido
      const existingOrder = await database.get(
        'SELECT * FROM orders WHERE user_id = ? AND dish_id = ?',
        [user_id, dish_id]
      )

      if (!existingOrder) {
        throw new AppError('Prato não encontrado no pedido.')
      }

      if (existingOrder.quantity > 1) {
        // Se a quantidade for maior que 1, apenas diminua a quantidade
        const newQuantity = existingOrder.quantity - 1
        const newTotalPrice = newQuantity * existingOrder.dish_price

        await database.run(
          'UPDATE orders SET quantity = ?, total_price = ? WHERE user_id = ? AND dish_id = ?',
          [newQuantity, newTotalPrice, user_id, dish_id]
        )
      } else {
        // Se a quantidade for 1, remova o prato do pedido
        await database.run(
          'DELETE FROM orders WHERE user_id = ? AND dish_id = ?',
          [user_id, dish_id]
        )
      }

      return res.json({
        message: 'Uma unidade do prato removida do pedido com sucesso.'
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error:
          error.message || 'Erro ao remover uma unidade do prato do pedido.'
      })
    } finally {
      // Feche a conexão com o banco de dados em todos os casos
      database && (await database.close())
    }
  }
}

module.exports = OrdersController
