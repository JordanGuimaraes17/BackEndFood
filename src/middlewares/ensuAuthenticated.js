const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensuAuthenticated(request, response, next) {
  const authHeader = request.headers
  if (!authHeader.cookie) {
    throw new AppError('JWT token não informado', 401)
  }
  const [, token] = authHeader.cookie.split('token=')
  try {
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret)
    request.user = {
      id: Number(user_id),
      role
    }
    return next()
  } catch {
    throw new AppError('JWT token inválido', 401)
  }
}
module.exports = ensuAuthenticated
