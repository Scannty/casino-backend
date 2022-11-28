const express = require('express')
const web3Controller = require('../controllers/web3')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/getBalance', isAuth, web3Controller.getBalance)

router.put('/updateBalance', isAuth, web3Controller.updateBalance)

router.put('/withdraw', isAuth, web3Controller.withdraw)

module.exports = router