const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class DishesController {
  async create(request, response) {
    try {
      const dishesList = request.body
      const dataBase = await sqliteConnection()

      const createdDishes = []

      for (const dish of dishesList) {
        const { name, description, price, ingredients, category_id } = dish

        const checkNameExist = await dataBase.get(
          'SELECT * FROM dishes WHERE name = ?',
          [name]
        )

        if (checkNameExist) {
          throw new AppError('Este prato já foi registrado anteriormente.', 400)
        }

        const checkCategoryExist = await dataBase.get(
          'SELECT * FROM categories WHERE id = ?',
          [category_id]
        )

        if (!checkCategoryExist) {
          throw new AppError('ID de categoria inválido.', 400)
        }

        const { lastID } = await dataBase.run(
          'INSERT INTO dishes (name, description, price, ingredients, category_id) VALUES (?,?,?,?,?)',
          [name, description, price, ingredients, category_id]
        )

        createdDishes.push({ id: lastID, ...dish })
      }

      return response.status(201).json(createdDishes)
    } catch (error) {
      return response
        .status(error.statusCode || 500)
        .json({ error: error.message })
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params
      const { name, description, price, ingredients, category_id } =
        request.body
      const dataBase = await sqliteConnection()

      const checkDishExist = await dataBase.get(
        'SELECT * FROM dishes WHERE id = ?',
        [id]
      )

      if (!checkDishExist) {
        throw new AppError('Prato não encontrado.', 404)
      }

      const checkCategoryExist = await dataBase.get(
        'SELECT * FROM categories WHERE id = ?',
        [category_id]
      )

      if (!checkCategoryExist) {
        throw new AppError('ID de categoria inválido.', 400)
      }

      await dataBase.run(
        'UPDATE dishes SET name=?, description=?, ingredients=?, price=?, category_id=? WHERE id=?',
        [name, description, ingredients, price, category_id, id]
      )

      return response
        .status(200)
        .json({ message: 'Prato atualizado com sucesso.' })
    } catch (error) {
      return response
        .status(error.statusCode || 500)
        .json({ error: error.message })
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params
      const dataBase = await sqliteConnection()

      const checkDishExist = await dataBase.get(
        'SELECT * FROM dishes WHERE id = ?',
        [id]
      )

      if (!checkDishExist) {
        throw new AppError('Prato não encontrado.', 404)
      }

      await dataBase.run('DELETE FROM dishes WHERE id = ?', [id])

      return response
        .status(200)
        .json({ message: 'Prato excluído com sucesso.' })
    } catch (error) {
      return response
        .status(error.statusCode || 500)
        .json({ error: error.message })
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params
      const dataBase = await sqliteConnection()

      if (id) {
        const dish = await dataBase.get('SELECT * FROM dishes WHERE id = ?', [
          id
        ])

        if (!dish) {
          throw new AppError('Prato não encontrado.', 404)
        }

        return response.status(200).json(dish)
      } else {
        const dishes = await dataBase.all('SELECT * FROM dishes')

        if (dishes.length === 0) {
          throw new AppError('Nenhum prato encontrado.', 404)
        }

        return response.status(200).json(dishes)
      }
    } catch (error) {
      return response
        .status(error.statusCode || 500)
        .json({ error: error.message })
    }
  }
}

module.exports = DishesController
