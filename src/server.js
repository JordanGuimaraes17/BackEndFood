const express = require('express')
const app = express()
app.use(express.json()) // receber informações do body

const routes = require('./routes')
app.use(routes)
const PORT = 3333

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
