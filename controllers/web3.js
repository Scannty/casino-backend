const User = require('../models/user')
const transferFunds = require('../utils/transferFunds')

exports.updateBalance = async (req, res, next) => {
    const { userId } = req
    const { transferAmount } = req.url
    try {
        const result = await User.updateBalanceById(userId, transferAmount)
        console.log(result)
        const user = await User.findById(userId)
        res.status(200).json({
            message: "Balance updated successfully!",
            newBalance: user.balance,
            result
        })
    } catch (error) {
        next(error)
    }
    console.log('Balance updated!')
}

exports.withdraw = async (req, res, next) => {
    const { userId } = req
    const { userWallet, amount } = req.url
    const user = await User.findById(userId)
    if (user.balance < amount) {
        const error = new Error('Not enough balance!')
        error.statusCode = 400
        next(error)
    }
    try {
        transferFunds(userWallet, amount)
        const newBalance = user.balance - amount
        const result = await User.updateBalanceById(userId, newBalance)
        console.log(result)
        res.status(200).json({
            message: 'Funds withdrawn successfully!',
            newBalance,
            result
        })
    } catch (error) {
        next(error)
    }
}