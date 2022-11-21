const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.postSignup = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed!')
            error.statusCode = 401
            error.data = errors.array()
            throw error
        }
        if (password !== confirmPassword) {
            const error = new Error('Passwords do not match!')
            error.statusCode = 401
            throw error
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User(username, email, hashedPassword)
        const result = await user.save()
        console.log(result)
        res.status(200).json({ message: 'User created successfully!', result })
    } catch (err) {
        next(err)
    }
}