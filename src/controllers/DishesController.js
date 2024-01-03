const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class DishesController {
  async create(request, response) {
    const { name, description, price, category_id } = request.body
    const dataBase = await sqliteConnection() // Conecta ao banco de dados
    // Verifica se o prato já existe pelo nome
    const checkNameExist = await dataBase.get(
      'SELECT * FROM dishes WHERE name = ?',
      [name]
    )
    if (checkNameExist) {
      throw new AppError('Este prato já foi registrado anteriormente.')
    }
    // Verifica se o ID da categoria fornecido existe na tabela categories
    const checkCategoryExist = await dataBase.get(
      'SELECT * FROM categories WHERE id = ?',
      [category_id]
    )
    if (!checkCategoryExist) {
      throw new AppError('ID de categoria inválido.')
    }

    // Insere o prato na tabela 'dishes' com o ID da categoria fornecido
    const { lastID } = await dataBase.run(
      'INSERT INTO dishes (name, description, price, category_id) VALUES (?, ?, ?, ?)',
      [name, description, price, category_id]
    )

    return response.status(201).json({ id: lastID })
  }
}

module.exports = DishesController
