const { getDb } = require('../utils/database')

class User {
    constructor(email, username, password) {
        this.email = email
        this.username = username
        this.password = password
        this.balance = 0
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    static findByEmail(email) {
        const db = getDb()
        return db.collection('users').find({ email: email }).next()
    }

    static findByUsername(username) {
        const db = getDb()
        return db.collection('users').find({ username: username }).next()
    }
}

module.exports = User