const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    msg: {
        type: String,
        required: true
    }
})

const Audit = mongoose.model('audit', schema, 'audits')

module.exports = Audit
