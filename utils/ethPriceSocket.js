/* const CoinGecko = require('coingecko-api')
const { getIo } = require('./socket')

const CoinGeckoClient = new CoinGecko()
const io = getIo()

function getPrices() {
    setInterval(() => {
        CoinGeckoClient.simple
            .price({
                ids: ['bitcoin', 'ethereum'],
                vs_currencies: ['eur', 'usd'],
            })
            .then(data => io.emit('priceUpdate', { prices: data.data }))
    }, 10000)
}

module.exports = getPrices
 */