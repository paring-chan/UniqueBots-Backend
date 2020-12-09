const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String
    }
})

const User = mongoose.model('user', schema, 'users')

module.exports = User
