const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class AvatarController {
  async update(request, response) {
    const { id } = request.params
    const avatarFilename = request.file.filename

    const diskStorage = new DiskStorage()

    const dishe = await knex('dishes').where('id', id).first()

    if (!dishe) {
      throw new AppError('Prato não encontrado', 404)
    }

    if (dishe.avatar) {
      await diskStorage.deleFile(dishe.avatar)
    }

    const newAvatarFilename = await diskStorage.saveFile(avatarFilename)
    dishe.avatar = newAvatarFilename

    // Atualizar o avatar no banco de dados
    await knex('dishes').where('id', id).update({ avatar: newAvatarFilename })

    return response.json(dishe)
  }
}

module.exports = AvatarController
