const Bot = require("../../models/Bot");
const {ApolloError} = require("apollo-server-errors");
const {evaluate} = require('../../util/bot')

module.exports = {
    approve: async (parent) => {
        const bot = await Bot.findOne({id: parent.id})

        bot.approved = true

        await bot.save()

        parent.pending = false

        parent.approved = true
        await parent.save()
        return true
    },
    deny: async (parent, {reason}) => {
        if (!reason) throw new ApolloError('Reason must be provided', 'ERR_REASON_REQUIRED')

        const bot = await Bot.findOne({id: parent.id})

        await Bot.findByIdAndDelete(bot._id)

        parent.pending = false

        parent.false = true

        parent.reason = reason

        await parent.save()
        return true
    },
    bot: async (parent) => {
        return Bot.findOne({
            id: parent.id
        })
    },
    requester: async (parent) => {
        return evaluate(`client.users.cache.get(${JSON.stringify(parent.requester)})?.tag || ${JSON.stringify(parent.id)}`)
    }
}