const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class RatingsController {
  async create(request, response) {
    const { dish_id, rating, comment } = request.body
    const dataBase = await sqliteConnection()
    const user_id = request.user.id
    const checkDishExist = await dataBase.get(
      'SELECT * FROM dishes WHERE id = ?',
      [dish_id]
    )
    if (!checkDishExist) {
      throw new AppError('ID de prato inválido.')
    }
    // Insere a avaliação na tabela 'ratings' com os IDs do usuário e do prato fornecidos
    const { lastID } = await dataBase.run(
      'INSERT INTO ratings (user_id, dish_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
      [user_id, dish_id, rating, comment, new Date().toISOString()]
    )
    return response.status(201).json({ id: lastID })
  }
}

module.exports = RatingsController
