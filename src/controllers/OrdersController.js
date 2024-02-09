const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class OrdersController {
  async addDishToOrder(request, response) {
    try {
      const { dish_id, quantity } = request.body
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
          quantity,
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
          'orders.quantity AS order_quantity',
          'orders.dish_price',
          knex.raw('orders.quantity * orders.dish_price AS total_price'), // total do prato multiplicando a quantidade pelo preço unitário
          'dishes.id AS dish_id',
          'dishes.name AS dish_name',
          'dishes.description AS dish_description',
          'dishes.price AS dish_price',
          'categories.name AS category_name'
        )
        .leftJoin('dishes', 'orders.dish_id', 'dishes.id')
        .leftJoin('categories', 'dishes.category_id', 'categories.id')
        .where({ 'orders.user_id': user_id })

      if (orderDetails.length === 0) {
        return response.status(404).json({ message: 'Pedido não encontrado' })
      }

      //  total do pedido levando em consideração a quantidade de cada prato
      const totalOrderPrice = orderDetails.reduce(
        (total, dish) => total + dish.total_price,
        0
      )

      //  detalhes do pedido e o total
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
      const { dish_id, removeAll } = req.body
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

      if (removeAll) {
        // Remover todas as unidades do prato do pedido
        await knex('orders').where({ user_id, dish_id }).del()
      } else {
        // Reduzir a quantidade do prato no pedido em 1 unidade
        let newQuantity = existingOrder.quantity - 1
        if (newQuantity < 0) {
          newQuantity = 0 // Não permitir quantidades negativas
        }
        const newTotalPrice = newQuantity * existingOrder.dish_price

        if (newQuantity === 0) {
          // Se a quantidade for zero, remova o prato do pedido
          await knex('orders').where({ user_id, dish_id }).del()
        } else {
          // Atualize a quantidade e o preço total do prato no pedido
          await knex('orders')
            .where({ user_id, dish_id })
            .update({ quantity: newQuantity, total_price: newTotalPrice })
        }
      }

      return res.json({
        message: `Prato removido do pedido com sucesso.`
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: error.message || 'Erro ao remover prato do pedido.'
      })
    }
  }
}

module.exports = OrdersController
