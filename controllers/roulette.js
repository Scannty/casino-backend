const User = require('../models/user')
const Roulette = require('../models/roulette')

const CHIP_SIZE = 0.00001

exports.postSpin = async (req, res, next) => {
    const { totalStakeEth } = req.body
    const { userId } = req

    // Check if user has enough balance
    let user
    try {
        user = await User.findById(userId)
        if (!user) {
            const error = new Error('User not found!')
            error.statusCode = 401
            throw error
        }
    } catch (error) {
        return next(error)
    }
    if (totalStakeEth > user.balance) {
        const error = new Error('User does not have enough funds to place this bet!')
        error.statusCode = 400
        return next(error)
    }

    const roulette = new Roulette(req.body)
    const { randomNumber: selectedNumber, winAmount, netWin, totalStakeChips } = await roulette.spin()

    console.log('hey')
    console.log(winAmount, totalStakeChips, netWin, selectedNumber, user.balance)

    const newUserBalance = user.balance + (netWin * CHIP_SIZE)

    // Update user balance according to win amount
    try {
        const result = await User.updateBalanceById(newUserBalance)
        console.log(result)
        res.status(200).json({
            message: 'Roulette ended successfully!',
            selectedNumber,
            totalStakeChips,
            winAmount,
            netWin,
            newUserBalance
        })
    } catch (error) {
        next(error)
    }

}