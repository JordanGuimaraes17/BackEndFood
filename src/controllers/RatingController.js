const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class RatingsController {
  async create(request, response) {
    try {
      const { user_id, dish_id, rating, comment } = request.body
      const database = await sqliteConnection()

      // Verifique se o prato e o usuário existem
      const dish = await database.get('SELECT * FROM dishes WHERE id = ?', [
        dish_id
      ])
      const user = await database.get('SELECT * FROM users WHERE id = ?', [
        user_id
      ])

      if (!dish || !user) {
        throw new AppError('Prato ou usuário não encontrado.')
      }

      // Verifique se o usuário já avaliou o prato
      const existingRating = await database.get(
        'SELECT * FROM ratings WHERE user_id = ? AND dish_id = ?',
        [user_id, dish_id]
      )

      if (existingRating) {
        throw new AppError('Você já avaliou este prato.')
      }

      // Insira a avaliação na tabela 'ratings'
      const { lastID } = await database.run(
        'INSERT INTO ratings (user_id, dish_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, dish_id, rating, comment]
      )

      return response.status(201).json({ rating_id: lastID })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao criar a avaliação.' })
    }
  }

  async read(request, response) {
    try {
      const { id } = request.params
      const database = await sqliteConnection()

      // Busca a avaliação pelo ID na tabela 'ratings'
      const rating = await database.get('SELECT * FROM ratings WHERE id = ?', [
        id
      ])

      if (!rating) {
        throw new AppError('Avaliação não encontrada.')
      }

      return response.json(rating)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao obter a avaliação.' })
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params
      const { rating, comment } = request.body
      const database = await sqliteConnection()

      // Verifica se a avaliação existe
      const existingRating = await database.get(
        'SELECT * FROM ratings WHERE id = ?',
        [id]
      )

      if (!existingRating) {
        throw new AppError('Avaliação não encontrada.')
      }

      // Atualiza a avaliação na tabela 'ratings'
      await database.run(
        'UPDATE ratings SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, id]
      )

      return response.json({ message: 'Avaliação atualizada com sucesso.' })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao atualizar a avaliação.' })
    }
  }
}

module.exports = RatingsController
