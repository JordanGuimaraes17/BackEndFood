const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class CategoriesController {
  async create(request, response) {
    const categoriesList = request.body // Agora, espera-se uma lista de categorias

    const dataBase = await sqliteConnection() // Conecta ao banco de dados

    const createdCategories = []

    // Itera sobre cada categoria na lista
    for (const category of categoriesList) {
      const { name } = category

      // Verifica se a categoria já existe pelo nome
      const checkCategoryExist = await dataBase.get(
        'SELECT * FROM categories WHERE name = ?',
        [name]
      )

      if (checkCategoryExist) {
        throw new AppError('Essa categoria já está disponível.')
      }

      // Insere a categoria na tabela 'categories'
      const { lastID } = await dataBase.run(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
      )

      createdCategories.push({ id: lastID })
    }

    return response.status(201).json(createdCategories)
  }

  async update(request, response) {
    const { id } = request.params
    const { name } = request.body
    const dataBase = await sqliteConnection()
    const checkCategoryExist = await dataBase.get(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    )
    if (!checkCategoryExist) {
      throw new AppError('Categoria não encontrada.')
    }
    await dataBase.run('UPDATE categories SET name = ? WHERE id = ?', [
      name,
      id
    ])
    return response
      .status(200)
      .json({ message: 'Categoria atualizada com sucesso.' })
  }
  async index(request, response) {
    const dataBase = await sqliteConnection() // Conecta ao banco de dados

    // Lista todos os pratos
    const categories = await dataBase.all('SELECT * FROM categories')

    return response.status(200).json(categories)
  }

  async delete(request, response) {
    const { id } = request.params
    const dataBase = await sqliteConnection()
    const checkCategoryExist = await dataBase.get(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    )
    if (!checkCategoryExist) {
      throw new AppError('Categoria não encontrada.')
    }
    await dataBase.run('DELETE FROM categories WHERE id = ?', [id])
    return response
      .status(200)
      .json({ message: 'Categoria excluída com sucesso.' })
  }
}

module.exports = CategoriesController
