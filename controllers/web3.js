const User = require('../models/user')
const transferFunds = require('../utils/transferFunds')

exports.updateBalance = async (req, res, next) => {
    const { userId } = req
    const { transferAmount } = req.query
    const user = await User.findById(userId)
    const oldBalance = user.balance
    try {
        const result = await User.updateBalanceById(userId, oldBalance + Number(transferAmount))
        console.log(result)
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
    const { userWallet, amount } = req.query
    try {
        const user = await User.findById(userId)
        if (user.balance < amount) {
            console.log('Pennis')
            const error = new Error('Not enough balance!')
            error.statusCode = 400
            throw error
        }
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