const sqliteConnection = require('../database/sqlite')

class IngredientsController {
  async create(request, response) {
    const { title, description } = request.body
    const dataBase = await sqliteConnection()

    await dataBase.run(
      // run executa o comando sql
      'INSERT INTO ingredients (title,description ) VALUES (?,?)', // INSERT INTO onde vai inserir na tabela
      [title, description]
    )
    return response.status(201).json()
  }
}
module.exports = IngredientsController
