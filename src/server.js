const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const uploadConfig = require('./configs/upload')
const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const routes = require('./routes')

const app = express()
app.use(cookieParser())
migrationsRun()
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173/'],
    credentials: true
  })
)
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

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
    message: 'Erro interno do servidor'
  })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`))
