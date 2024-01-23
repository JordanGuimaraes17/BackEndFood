const { Router } = require('express')
const RatingsController = require('../controllers/RatingController')
const ratingRoutes = Router()
const ratingsController = new RatingsController()
const ensuAuthenticated = require('../middlewares/ensuAuthenticated')
ratingRoutes.use(ensuAuthenticated)

ratingRoutes.post('/', ratingsController.create)
ratingRoutes.get('/:id', ratingsController.read)
ratingRoutes.put('/:id', ratingsController.update)

module.exports = ratingRoutes
