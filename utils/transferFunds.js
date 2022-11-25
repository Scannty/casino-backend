const ethers = require('ethers')

async function transferFunds(userWallet, amount) {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
    const signer = provider.getSigner(1)
    const tx = await signer.sendTransaction({
        to: userWallet,
        value: ethers.utils.parseEther(amount)
    })
    console.log(tx)
    console.log('Funds Trasnfered!')
}

module.exports = transferFunds