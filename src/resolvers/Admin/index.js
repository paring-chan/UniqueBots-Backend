const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const Judge = require("../../models/Judge");


module.exports = {
    bots: async () => {
        return Bot.find().then(async res => {
            for (const i of res) {
                await fetchBot(i)
            }
            return res
        })
    },
    judges: async () => {
        return Judge.find({pending: true})
    },
    judge: async (parent, {id}) => Judge.findOne({id, pending: true})
}