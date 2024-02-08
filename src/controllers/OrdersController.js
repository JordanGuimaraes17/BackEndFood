const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class OrdersController {
  async addDishToOrder(request, response) {
    try {
      const { dish_id } = request.body
      const user_id = request.user.id

      // Obtenha os detalhes do prato por ID
      const dishDetails = await knex('dishes').where({ id: dish_id }).first()

      if (!dishDetails) {
        return response.status(404).json({ error: 'Prato não encontrado' })
      }

      // Verifique se o prato já está no pedido
      const existingOrder = await knex('orders')
        .where({ user_id, dish_id })
        .first()

      if (existingOrder) {
        // Se o prato já estiver no pedido, aumente a quantidade e atualize o total
        const newQuantity = existingOrder.quantity + 1
        const newTotalPrice = newQuantity * dishDetails.price

        await knex('orders')
          .where({ id: existingOrder.id })
          .update({ quantity: newQuantity, total_price: newTotalPrice })

        return response.json({
          success: 'Quantidade do prato no pedido aumentada com sucesso',
          orderId: existingOrder.id
        })
      } else {
        // Se o prato ainda não estiver no pedido, adicione-o normalmente
        const [orderId] = await knex('orders').insert({
          user_id,
          dish_id,
          quantity: 1,
          dish_price: dishDetails.price,
          total_price: dishDetails.price
        })

        return response.status(201).json({
          success: 'Prato adicionado ao pedido com sucesso',
          orderId
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async viewOrder(request, response) {
    const user_id = request.user.id

    try {
      // Obtenha os pratos do pedido do usuário
      const orderDetails = await knex('orders')
        .select(
          'orders.id',
          'orders.quantity',
          'orders.dish_price',
          'orders.total_price',
          'dishes.id AS dish_id',
          'dishes.name AS dish_name',
          'dishes.description AS dish_description',
          'dishes.price AS dish_price'
        )
        .leftJoin('dishes', 'orders.dish_id', 'dishes.id')
        .where({ 'orders.user_id': user_id })

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
    }
  }

  async removeOrder(req, res) {
    try {
      const { dish_id } = req.body
      const user_id = req.user.id

      if (!dish_id || dish_id.length === 0) {
        throw new AppError('A lista de pratos está vazia.')
      }

      // Verifique se o prato está no pedido
      const existingOrder = await knex('orders')
        .where({ user_id, dish_id })
        .first()

      if (!existingOrder) {
        throw new AppError('Prato não encontrado no pedido.')
      }

      if (existingOrder.quantity > 1) {
        // Se a quantidade for maior que 1, apenas diminua a quantidade
        const newQuantity = existingOrder.quantity - 1
        const newTotalPrice = newQuantity * existingOrder.dish_price

        await knex('orders')
          .where({ user_id, dish_id })
          .update({ quantity: newQuantity, total_price: newTotalPrice })
      } else {
        // Se a quantidade for 1, remova o prato do pedido
        await knex('orders').where({ user_id, dish_id }).del()
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
    }
  }
}

module.exports = OrdersController
