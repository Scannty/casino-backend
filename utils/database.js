const { MongoClient } = require('mongodb')

let db

function connectMongo(runServer) {
    MongoClient
        .connect('mongodb+srv://aleksa:vintor31@cluster0.yh5d1g4.mongodb.net/casino?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected to MongoDb')
            db = client.db()
            runServer()
        })
        .catch(err => console.log(err))
}

function getDb() {
    if (!db) throw new Error('No database found')
    return db
}

module.exports = { connectMongo, getDb }