const express = require('express')
const { body } = require('express-validator')
const User = require('../models/user')
const authController = require('../controllers/auth')
const router = express.Router()

router.post(
    '/signup',
    [
        body('username')
            .trim()
            .isLength({ min: 5, max: 15 })
            .withMessage('Not a valid username! Must be between 5 and 15 chars.')
            .custom(value => {
                return User.findByUsername(value)
                    .then(user => {
                        if (user) return Promise.reject('Username already exists!')
                    })
            }),
        body('email')
            .isEmail()
            .withMessage('Not a valid email!')
            .custom(value => {
                return User.findByEmail(value)
                    .then(user => {
                        if (user) return Promise.reject('Email already exists!')
                    })
            }),
        body('password').trim().isLength({ min: 5 })
    ],
    authController.postSignup
)

module.exports = router