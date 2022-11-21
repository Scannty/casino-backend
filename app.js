const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const { connectMongo } = require('./utils/database')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors())
app.use(bodyparser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})


app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    console.log('Aleksa je car')
    const { statusCode, message, data } = error
    res.status(statusCode || 500).json({ message, data })
})

connectMongo(() => {
    app.listen(8000, () => console.log('Server started...'))
})