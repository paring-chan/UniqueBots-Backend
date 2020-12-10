const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const Judge = require("../../models/Judge");
const User = require("../../models/User");


module.exports = {
    bots: async () => {
        return Bot.find({approved:true}).then(async res => {
            for (const i of res) {
                await fetchBot(i)
            }
            return res
        })
    },
    judges: async () => {
        return Judge.find({pending: true})
    },
    judge: async (parent, {id}) => Judge.findOne({id, pending: true}),
    users: async () => {
        return User.find()
    },
    user: async (parent, {id}) => {
        return User.findOne({id})
    }
}