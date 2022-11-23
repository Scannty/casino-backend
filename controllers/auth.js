const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

exports.postSignup = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed!')
            error.statusCode = 422
            error.data = errors.array()
            throw error
        }
        if (password !== confirmPassword) {
            const error = new Error('Passwords do not match!')
            error.statusCode = 422
            throw error
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User(email, username, hashedPassword)
        const result = await user.save()
        console.log(result)
        res.status(200).json({ message: 'User created successfully!', result })
    } catch (err) {
        next(err)
    }
}

exports.postLogin = async (req, res, next) => {
    const { username, password } = req.body
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed!')
            error.statusCode = 422
            error.data = errors.array()
            throw error
        }
        const user = await User.findByUsername(username)
        if (!user) {
            const error = new Error('User does not exist!')
            error.statusCode = 422
            throw error
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('Password is not correct!')
            error.statusCode = 422
            throw error
        }
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        )
        res.status(200).json({ token })
    } catch (err) {
        next(err)
    }
}