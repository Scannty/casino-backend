const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    const token = req.get('Authorization')
    if (!token) {
        const error = new Error('No authorization token provided.')
        error.statusCode = 401
        throw error
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    if (!decodedToken) {
        const error = new Error('Not authenticated!')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}