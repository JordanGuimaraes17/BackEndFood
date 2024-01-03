const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body
    const dataBase = await sqliteConnection() // conecta a api
    const checkUsersExist = await dataBase.get(
      // get busca informções
      'SELECT * FROM users WHERE email =(?)', // SELECT seleciona a  coluna da tabela
      [email]
    )
    if (checkUsersExist) {
      throw new AppError('Este e-email já está em uso.')
    }
    const hashedPassword = await hash(password, 8) // adiciona a criptografia na senha

    await dataBase.run(
      // run executa o comando sql
      'INSERT INTO users (name, email,password) VALUES (?,?,?)', // INSERT INTO onde cai inserir na tabela
      [name, email, hashedPassword] // hashedPassword era o password, agora com criptografia
    )
    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id
    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id =(?)', [
      // get busca informções
      user_id // SELECT seleciona a  coluna id
    ])
    if (!user) {
      throw new AppError('Usuário não econtrado')
    }
    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    // se existir conteudo em name o primeiro é utilizado,se não o segundo continua o que ja estava
    // isso é usado para quando atualizar senha sem  colocar name e email ou por algum motivo name e email não chegue

    if (password) {
      if (!old_password) {
        throw new AppError(
          'Você deve digitar sua senha antiga para alterar a senha'
        )
      }

      const checkOldPassword = await compare(old_password, user.password) // compare é do bcryptjs compara as senhas

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere.')
      }

      user.password = await hash(password, 8)
    } else if (old_password) {
      throw new AppError(
        'Você deve fornecer uma nova senha para alterar a senha antiga.'
      )
    }

    await database.run(
      // run executa o comando sql
      `UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`, // UPDATE  atualiza a tabela
      [user.name, user.email, user.password, user_id] // dados inseridos na atualaização
    )
    return response.json()
  }
}
module.exports = UsersController
