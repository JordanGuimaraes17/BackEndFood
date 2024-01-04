const { Router } = require('express')
const RatingsController = require('../controllers/RatingController')
const ratingsRoutes = Router()
const ratingsController = new RatingsController()

ratingsRoutes.post('/', ratingsController.create)

module.exports = ratingsRoutes
