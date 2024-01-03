const { Router } = require('express')
const IngredientsController = require('../controllers/IngredientsController')
const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

ingredientsRoutes.post('/', ingredientsController.create)

module.exports = ingredientsRoutes
