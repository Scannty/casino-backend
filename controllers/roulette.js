const User = require('../models/user')

const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

exports.postSpin = async (req, res, next) => {
    const {
        selectedNumbers,
        selectedNumbersHalf,
        selectedRows,
        selectedThirds,
        selectedHalves,
        even,
        odd,
        red,
        black,
        totalStake
    } = req.body
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
        next(error)
    }
    if (totalStake > user.balance) {
        const error = new Error('User does not have enough funds to place this bet!')
        error.statusCode = 400
        next(error)
    }

    // Select a random number
    const randomNumber = Math.floor(Math.random() * 37)

    // Calculate win amount
    let randomRow
    if (randomNumber % 3 === 0) {
        randomRow = 1
    } else if (randomNumber % 3 === 2) {
        randomRow = 2
    } else {
        randomRow = 3
    }

    let randomThird
    if (randomNumber >= 1 && randomNumber <= 12) {
        randomThird = 1
    } else if (randomNumber >= 13 && randomNumber <= 24) {
        randomThird = 2
    } else {
        randomThird = 3
    }

    let randomHalf
    if (randomNumber >= 1 && randomNumber <= 18) {
        randomHalf = 1
    } else {
        randomHalf = 2
    }

    const randomEven = randomNumber % 2 === 0

    const randomBlack = BLACK_NUMBERS.includes(randomNumber)

    let winAmount = 0

    const winAmountNumbers = selectedNumbers.find(num => num === randomNumber) * 36
    const winAmountNumbersHalf = selectedNumbersHalf.find(num => num === randomNumber) * 18

    const winAmountRows = selectedRows[randomRow] * 3
    const winAmountThirds = selectedThirds[randomThird] * 3
    const winAmountHalves = selectedHalves[randomHalf] * 2

    winAmount += winAmountNumbers + winAmountNumbersHalf + winAmountThirds + winAmountHalves + winAmountRows

    if (randomEven) {
        winAmount += even * 2
    } else {
        winAmount += odd * 2
    }

    if (randomBlack) {
        winAmount += black * 2
    } else {
        winAmount += red * 2
    }

    // Calculate net win/loss
    /* const totalStake = 
        selectedNumbers.reduce((acc, curr) => acc + curr, 0) 
        + selectedNumbersHalf.reduce((acc, curr) => acc + curr, 0)
        + selectedRows.reduce((acc, curr) => acc + curr, 0)
        + selectedThirds.reduce((acc, curr) => acc + curr, 0)
        + selectedHalves.reduce((acc, curr) => acc + curr, 0)
        + red
        + black
        + even
        +odd */

    const netWin = winAmount - totalStake
    const newUserBalance = user.balance + netWin

    // Update user balance according to win amount
    try {
        const result = await user.updateBalance(newUserBalance)
        console.log(result)
        res.status(200).json({
            message: 'Roulette ended successfully!',
            selectedNumber: randomNumber,
            winAmount,
            netWin,
            newUserBalance
        })
    } catch (error) {
        next(error)
    }

}