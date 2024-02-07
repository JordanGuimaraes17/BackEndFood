const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')
const knex = require('../database/knex')

class DishesController {
  async create(request, response) {
    try {
      const { name, description, ingredients, price, category_id } =
        request.body
      if (!request.file || !request.file.filename) {
        throw new AppError('Por favor, selecione uma imagem para o prato.', 400)
      }
      const avatarFileName = request.file.filename
      const diskStorage = new DiskStorage()
      const filename = await diskStorage.saveFile(avatarFileName)
      const dish_id = await knex('dishes').insert({
        name,
        description,
        ingredients,
        price,
        avatar: filename,
        category_id
      })

      return response.status(201).json({ dish_id })
    } catch (error) {
      console.error('Error creating dish:', error) // Adiciona este log para capturar mais informações sobre o erro
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

      // Use Knex to update dish
      await knex('dishes')
        .where({ id })
        .update({ name, description, price, ingredients, category_id })

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

      // Use Knex to delete dish
      await knex('dishes').where({ id }).del()

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

      if (id) {
        const dish = await knex('dishes').where({ id }).first()

        if (!dish) {
          throw new AppError('Prato não encontrado.', 404)
        }

        return response.status(200).json(dish)
      } else {
        const dishes = await knex('dishes').select()

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
