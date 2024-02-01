const express = require('express')
const cors = require('cors')
require('express-async-errors')
const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const routes = require('./routes')

const app = express()
const uploadConfig = require('./configs/upload')
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

const PORT = 3333

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
