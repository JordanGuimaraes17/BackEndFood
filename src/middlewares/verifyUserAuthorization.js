const AppError = require('../utils/AppError')

function verifyUserAuthorization(roleToVerify) {
  return (resquest, response, next) => {
    const { role } = resquest.user
    if (role !== roleToVerify) {
      throw new AppError('Unauthorized', 401)
    }

    return next()
  }
}
module.exports = verifyUserAuthorization
