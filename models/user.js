const { getDb } = require('../utils/database')

class User {
    constructor(username, email, password) {
        this.username = username
        this.email = email
        this.password = password
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