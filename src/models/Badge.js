const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        require: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
})

const Badge = mongoose.model('badge', schema, 'badges')

module.exports = Badge
