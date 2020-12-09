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
    pending: {
        type: Boolean,
        default: true
    },
    reason: {
        type: String
    },
    requester: {
        type: String,
        required: true
    }
})

const Judge = mongoose.model('judge', schema, 'judges')

module.exports = Judge
