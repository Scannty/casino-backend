const User = require('../models/user')
const { getIo } = require('../utils/socket')
const transferFunds = require('../utils/transferFunds')

exports.getBalance = async (req, res, next) => {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) {
        const error = new Error('User not found!')
        error.statusCode(422)
        return next(error)
    }
    res.status(200).json({ balance: user.balance })
}

exports.updateBalance = async (req, res, next) => {
    const { userId } = req
    const { transferAmount } = req.query
    const user = await User.findById(userId)
    const oldBalance = user.balance
    const newBalance = oldBalance + Number(transferAmount)
    try {
        const result = await User.updateBalanceById(userId, newBalance)
        console.log(result)
        const io = getIo()
        io.emit('balanceChange', { balance: newBalance })
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
            const error = new Error('Not enough balance!')
            error.statusCode = 400
            throw error
        }
        await transferFunds(userWallet, amount)
        const newBalance = user.balance - amount
        const result = await User.updateBalanceById(userId, newBalance)
        console.log(result)
        const io = getIo()
        io.emit('balanceChange', { balance: newBalance })
        res.status(200).json({
            message: 'Funds withdrawn successfully!',
            newBalance,
            result
        })
    } catch (error) {
        next(error)
    }
}