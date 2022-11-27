const { getDb } = require('../utils/database')

const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

class Roulette {
    constructor(fields) {
        console.log(fields)
        this.selectedNumbers = fields.selectedNumbers.map(number => number.value)
        this.selectedRows = fields.selectedRows.map(row => row.value)
        this.selectedThirds = fields.selectedThirds.map(third => third.value)
        this.selectedHalves = fields.selectedHalves.map(half => half.value)
        this.even = fields.even
        this.odd = fields.odd
        this.red = fields.red
        this.black = fields.black
        this.totalStakeChips = this._calculateTotalStake()
    }

    calculateWinAmount(
        randomNumber,
        randomRow,
        randomThird,
        randomHalf,
        randomEven,
        randomBlack,
    ) {
        let winAmount = 0

        const winAmountNumbers = this.selectedNumbers.find((num, index) => index === randomNumber) * 36
        /* const winAmountNumbersHalf = this.selectedNumbersHalf.find((num, index) => index === randomNumber) * 18 */
        console.log(winAmountNumbers)

        console.log(this.selectedRows, randomRow)
        console.log(this.selectedThirds, randomThird)
        console.log(this.selectedHalves, randomHalf)

        const winAmountRows = this.selectedRows[randomRow] * 3
        const winAmountThirds = this.selectedThirds[randomThird] * 3
        const winAmountHalves = this.selectedHalves[randomHalf] * 2

        winAmount += winAmountNumbers + winAmountThirds + winAmountHalves + winAmountRows

        if (randomEven) {
            winAmount += this.even * 2
        } else {
            winAmount += this.odd * 2
        }

        if (randomBlack) {
            winAmount += this.black * 2
        } else {
            winAmount += this.red * 2
        }

        const netWin = winAmount - this.totalStakeChips
        console.log(winAmount, this.totalStakeChips, netWin)
        return { winAmount, totalStakeChips: this.totalStakeChips, netWin }
    }

    async spin() {
        const db = getDb()

        const randomNumber = Math.floor(Math.random() * 37)
        console.log(randomNumber)

        let randomRow
        if (randomNumber % 3 === 0) {
            randomRow = 0
        } else if (randomNumber % 3 === 2) {
            randomRow = 1
        } else {
            randomRow = 2
        }

        let randomThird
        if (randomNumber >= 1 && randomNumber <= 12) {
            randomThird = 0
        } else if (randomNumber >= 13 && randomNumber <= 24) {
            randomThird = 1
        } else {
            randomThird = 2
        }

        let randomHalf
        if (randomNumber >= 1 && randomNumber <= 18) {
            randomHalf = 0
        } else {
            randomHalf = 1
        }

        const randomEven = randomNumber % 2 === 0

        const randomBlack = BLACK_NUMBERS.includes(randomNumber)
        const color = randomBlack ? 'black' : 'red'
        console.log(
            randomRow,
            randomThird,
            randomHalf,
            randomEven,
            color
        )
        await db.collection('roulette').insertOne({ number: randomNumber, color })
        const { winAmount, totalStakeChips, netWin } = this.calculateWinAmount(
            randomNumber,
            randomRow,
            randomThird,
            randomHalf,
            randomEven,
            randomBlack
        )
        console.log(winAmount, netWin)
        return { randomNumber, winAmount, netWin, totalStakeChips }
    }

    _calculateTotalStake() {
        return (
            this.selectedNumbers.reduce((acc, curr) => acc + curr, 0)
            + this.selectedRows.reduce((acc, curr) => acc + curr, 0)
            + this.selectedThirds.reduce((acc, curr) => acc + curr, 0)
            + this.selectedHalves.reduce((acc, curr) => acc + curr, 0)
            + this.red
            + this.black
            + this.even
            + this.odd
        )
    }
}

module.exports = Roulette