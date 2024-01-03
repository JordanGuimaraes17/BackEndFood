const { hash, compare } = require('bcryptjs')

class UsersController {
  create(resquest, response) {
    const { name, email, password } = resquest.body
    response.json({ name, email, password })
  }
}
module.exports = UsersController
