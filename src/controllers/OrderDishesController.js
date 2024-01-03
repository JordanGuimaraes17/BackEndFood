const sqliteConnection = require('../database/sqlite')

class OrderDishesController {
  async create(order_id, dish_id, quantity, dish_price) {
    try {
      const database = await sqliteConnection()

      // Insere o prato do pedido na tabela order_dishes
      await database('order_dishes').insert({
        order_id,
        dish_id,
        quantity,
        dish_price
      })
    } catch (error) {
      console.error(error)
      throw new Error('Erro ao adicionar prato ao pedido.')
    }
  }
}

module.exports = OrderDishesController
