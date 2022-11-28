const { Server } = require('socket.io')

let io

function initIo(server) {
    io = new Server(server, { cors: { origin: 'http://localhost:3000' } })
    return io
}

function getIo() {
    if (!io) throw new Error('Socket is not initialized!')
    return io
}

module.exports = { initIo, getIo }