const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false
    }
})

const Bot = mongoose.model('bot', schema, 'bots')

module.exports = Bot
