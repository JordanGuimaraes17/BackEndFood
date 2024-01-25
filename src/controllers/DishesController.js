const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class DishesController {
  async create(request, response) {
    const dishesList = request.body // Agora, espera-se uma lista de pratos

    const dataBase = await sqliteConnection() // Conecta ao banco de dados

    const createdDishes = []

    // Itera sobre cada prato na lista
    for (const dish of dishesList) {
      const { name, description, price, ingredients, category_id } = dish

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
        'INSERT INTO dishes (name, description, price, ingredients, category_id) VALUES (?,?,?,?,?)',
        [name, description, price, ingredients, category_id]
      )

      createdDishes.push({ id: lastID })
    }

    return response.status(201).json(createdDishes)
  }

  async update(request, response) {
    const { id } = request.params
    const { name, description, price, ingredients, category_id } = request.body
    const dataBase = await sqliteConnection() // Conecta ao banco de dados
    // Verifica se o prato com o ID fornecido existe
    const checkDishExist = await dataBase.get(
      'SELECT * FROM dishes WHERE id = ?',
      [id]
    )
    if (!checkDishExist) {
      throw new AppError('Prato não encontrado.')
    }
    // Verifica se o ID da categoria fornecido existe na tabela categories
    const checkCategoryExist = await dataBase.get(
      'SELECT * FROM categories WHERE id = ?',
      [category_id]
    )
    if (!checkCategoryExist) {
      throw new AppError('ID de categoria inválido.')
    }
    // Atualiza o prato na tabela 'dishes' com o ID fornecido
    await dataBase.run(
      'UPDATE dishes SET name=?, description=?, ingredients=?, price=?, category_id=? WHERE id=?',
      [name, description, ingredients, price, category_id, id]
    )
    return response
      .status(200)
      .json({ message: 'Prato atualizado com sucesso.' })
  }

  async delete(request, response) {
    const { id } = request.params
    const dataBase = await sqliteConnection() // Conecta ao banco de dados

    // Verifica se o prato com o ID fornecido existe
    const checkDishExist = await dataBase.get(
      'SELECT * FROM dishes WHERE id = ?',
      [id]
    )
    if (!checkDishExist) {
      throw new AppError('Prato não encontrado.')
    }
    // Remove o prato da tabela 'dishes' com o ID fornecido
    await dataBase.run('DELETE FROM dishes WHERE id = ?', [id])
    return response.status(200).json({ message: 'Prato excluído com sucesso.' })
  }

  async index(request, response) {
    const dataBase = await sqliteConnection() // Conecta ao banco de dados

    // Lista todos os pratos
    const dishes = await dataBase.all('SELECT * FROM dishes')

    return response.status(200).json(dishes)
  }
}

module.exports = DishesController
