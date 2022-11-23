const express = require('express')
const rouletteController = require('../controllers/roulette')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.post('/spin', /* isAuth */ rouletteController.postSpin)

module.exports = router