const { Router } = require('express')
const UsersController = require('../controllers/UsersController')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensuAuthenticated, usersController.update)

module.exports = usersRoutes
