require('express-async-errors')
require('dotenv/config')
const express = require('express')

const uploadConfig = require('./configs/upload')
const cors = require('cors')
const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const routes = require('./routes')

const app = express()
migrationsRun()

app.use(cors())
app.use(express.json()) // receber informações do body

app.use(routes)
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
migrationsRun()
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.error(error)
  return response.status(500).json({
    status: 'error',
    message: 'internal server error'
  })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
