const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersValidated {
  async index(request, response) {
    const { user } = request
    const dataBase = await sqliteConnection()
    const checkUserExist = await dataBase.get(
      'SELECT * FROM users WHERE id = ?',
      [user.id]
    )

    if (!checkUserExist) {
      throw new AppError('Unauthorized', 401)
    }

    return response.status(200).json()
  }
}
module.exports = UsersValidated
