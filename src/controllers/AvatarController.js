const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class AvatarController {
  async update(request, response) {
    const dishes_id = request.params.id
    const avatarFilename = request.file.filename

    // Verificar se o usuário é um admin (coloque a lógica de verificação de admin aqui)

    const dishes = await knex('dishes').where('id', dishes_id).first()

    if (!dishes) {
      return response.status(404).json({ error: 'Prato não encontrado' })
    }

    const diskStorage = new DiskStorage()

    try {
      if (dishes.avatar) {
        await diskStorage.deleteFile(dishes.avatar)
      }

      const filename = await diskStorage.saveFile(avatarFilename)
      dishes.avatar = filename

      // Atualizar o avatar no banco de dados
      await knex('dishes').where('id', dishes_id).update({ avatar: filename })

      return response.json(dishes)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao atualizar o avatar' })
    }
  }
}

module.exports = AvatarController
