const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class AvatarController {
  async update(request, response) {
    const { id } = request.params
    const avatarFilename = request.file.filename

    const diskStorage = new DiskStorage()

    try {
      const dish = await knex('dishes').where('id', id).first()

      if (!dish) {
        throw new AppError('Prato não encontrado', 404)
      }

      if (dish.avatar) {
        await diskStorage.deleFile(dish.avatar)
      }

      const newAvatarFilename = await diskStorage.saveFile(avatarFilename)
      dish.avatar = newAvatarFilename

      // Atualizar o avatar no banco de dados
      await knex('dishes').where('id', id).update({ avatar: newAvatarFilename })

      return response.json(dish)
    } catch (error) {
      // Tratar o erro de maneira apropriada (por exemplo, enviar uma resposta de erro)
      console.error('Erro ao atualizar avatar:', error)
      return response.status(500).json({ error: 'Erro ao atualizar avatar' })
    }
  }
}

module.exports = AvatarController
