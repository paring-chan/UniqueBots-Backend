const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true
    }
})

const Heart = mongoose.model('heart', schema, 'hearts')

module.exports = Heart
