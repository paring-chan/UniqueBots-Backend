const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const Judge = require("../../models/Judge");
const User = require("../../models/User");
const Audit = require("../../models/Audit");


module.exports = {
    bots: async () => {
        return Bot.find({approved:true}).then(async res => {
            for (const i of res) {
                await fetchBot(i)
            }
            return res
        })
    },
    bot: async (parent, {id}) => {
        return Bot.findOne({id, approved: true}).then(async res => {
            if (!res) return null
            await fetchBot(res)
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
    },
    audits: () => Audit.find()
}