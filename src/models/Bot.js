const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        required: false,
        default: null
    }
})

const Bot = mongoose.model('bot', schema, 'bots')

module.exports = Bot
