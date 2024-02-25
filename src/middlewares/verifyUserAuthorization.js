const AppError = require('../utils/AppError')

function verifyUserAuthorization(roleToVerify) {
  return (resquest, response, next) => {
    const { role } = resquest.user
    if (!roleToVerify.includes(role)) {
      throw new AppError('Unauthorized', 401)
    }

    return next()
  }
}
module.exports = verifyUserAuthorization
