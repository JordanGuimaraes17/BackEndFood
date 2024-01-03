const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class CategoriesController {
  async create(request, response) {
    const { name } = request.body
    const dataBase = await sqliteConnection()

    const checkCategorieExist = await dataBase.get(
      // get busca informções
      'SELECT * FROM categories WHERE name =(?)', // SELECT seleciona a  coluna da tabela
      [name]
    )
    if (checkCategorieExist) {
      throw new AppError('Essa categoria já está disponível.')
    }

    await dataBase.run(
      // run executa o comando sql
      'INSERT INTO categories (name) VALUES (?)', // INSERT INTO onde cai inserir na tabela
      [name]
    )
    return response.status(201).json()
  }
}
module.exports = CategoriesController
