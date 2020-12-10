const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')

module.exports = async (parent, {id}) => {
    const bot = await Bot.findOne({id, approved: true})
    if (!bot) return null
    await fetchBot(bot)
    return bot
}