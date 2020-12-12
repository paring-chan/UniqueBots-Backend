const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        required: false,
        default: null
    },
    brief: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    invite: {
        type: String,
        default: doc => `https://discord.com/api/oauth2/authorize?client_id=${doc.id}&scope=bot&permissions=0`,
    },
    owner: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    prefix: {
        type: String,
        required: true,
        default: '!'
    },
    guilds: {
        type: String,
        default: 0
    },
    locked: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
})

const Bot = mongoose.model('bot', schema, 'bots')

module.exports = Bot
