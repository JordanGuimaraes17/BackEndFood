const { Router } = require('express')
const UsersController = require('../controllers/UsersController')
const UsersValidated = require('../controllers/UsersValidated')
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
const usersRoutes = Router()
const usersController = new UsersController()
const usersValidated = new UsersValidated()

usersRoutes.post('/', usersController.create)
usersRoutes.get('/validated', ensuAuthenticated, usersValidated.index)
usersRoutes.put('/', ensuAuthenticated, usersController.update)

module.exports = usersRoutes
