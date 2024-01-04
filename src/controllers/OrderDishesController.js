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

      // Atualize a quantidade total e o preço total no pedido em uma única consulta
      await database.run(
        'UPDATE orders SET total_quantity = (SELECT COUNT(*) FROM order_dishes WHERE order_id = ?), total_price = (SELECT SUM(d.price * od.quantity) FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?) WHERE id = ?',
        [order_id, order_id, order_id]
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

  async updateDishInOrder(request, response) {
    try {
      const { order_id, dish_id, quantity } = request.body
      const database = await sqliteConnection()

      // Verifique se o pedido existe
      const order = await database.get('SELECT * FROM orders WHERE id = ?', [
        order_id
      ])
      if (!order) {
        throw new AppError('Pedido não encontrado.')
      }

      // Verifique se o prato existe no pedido
      const orderDish = await database.get(
        'SELECT * FROM order_dishes WHERE order_id = ? AND dish_id = ?',
        [order_id, dish_id]
      )
      if (!orderDish) {
        throw new AppError('Prato não encontrado neste pedido.')
      }

      // Atualize a quantidade do prato no pedido
      await database.run(
        'UPDATE order_dishes SET quantity = ? WHERE order_id = ? AND dish_id = ?',
        [quantity, order_id, dish_id]
      )

      // Atualize a quantidade total e o preço total no pedido
      const updatedOrder = await database.get(
        'SELECT COUNT(*) AS total_quantity, SUM(d.price * od.quantity) AS total_price FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?',
        [order_id]
      )

      await database.run(
        'UPDATE orders SET total_quantity = ?, total_price = ? WHERE id = ?',
        [updatedOrder.total_quantity, updatedOrder.total_price, order_id]
      )

      return response.json({
        message: 'Prato atualizado no pedido com sucesso.'
      })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao atualizar prato no pedido.' })
    }
  }

  async removeDishFromOrder(request, response) {
    try {
      const { order_id, dish_id } = request.body
      const database = await sqliteConnection()

      // Verifique se o pedido existe
      const order = await database.get('SELECT * FROM orders WHERE id = ?', [
        order_id
      ])
      if (!order) {
        throw new AppError('Pedido não encontrado.')
      }

      // Remova o prato do pedido na tabela 'order_dishes'
      await database.run(
        'DELETE FROM order_dishes WHERE order_id = ? AND dish_id = ?',
        [order_id, dish_id]
      )

      // Atualize a quantidade total e o preço total no pedido
      const updatedOrder = await database.get(
        'SELECT COUNT(*) AS total_quantity, SUM(d.price * od.quantity) AS total_price FROM order_dishes od JOIN dishes d ON od.dish_id = d.id WHERE od.order_id = ?',
        [order_id]
      )

      await database.run(
        'UPDATE orders SET total_quantity = ?, total_price = ? WHERE id = ?',
        [updatedOrder.total_quantity, updatedOrder.total_price, order_id]
      )

      return response.json({ message: 'Prato removido do pedido com sucesso.' })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao remover prato do pedido.' })
    }
  }

  async getOrderDetails(request, response) {
    try {
      const { order_id } = request.params
      const database = await sqliteConnection()

      // Obtenha detalhes específicos do pedido
      const orderDetails = await database.get(
        'SELECT o.id, o.total_quantity, o.total_price, u.name AS user_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
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
        .json({ error: 'Erro ao obter detalhes do pedido.' })
    }
  }
}

module.exports = OrderDishesController
