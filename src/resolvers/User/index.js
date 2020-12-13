const Badge = require("../../models/Badge");
const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const _ = require('lodash')
const Judge = require("../../models/Judge");

module.exports = {
    badges: async (parent) => {
        const badges = Array.from(parent.badges)
        if (parent.admin) {
            badges.push('admin')
        }

        if (await Bot.findOne({owner: parent.id, approved: true})) {
            badges.push('bot_developer')
        }

        const result = []
        for (const badge of badges) {
            const b = await Badge.findOne({id: badge})
            if (b) result.push(b)
        }

        return result
    },
    avatarURL: user => user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : 'https://cdn.discord.app.com/embed/avatars/' + user.discriminator,
    bots: async (parent, {page=1}) => {
        const bots = await Bot.find({owner: parent.id, approved: true})

        for (const bot of bots) {
            await fetchBot(bot)
        }

        const chunks = _.chunk(bots, 9)

        return {
            result: chunks[page-1] || [],
            pages: chunks.length
        }
    },
    bot: async (parent, {id}) => {
        return Bot.findOne({id, approved: true}).then(res => fetchBot(res))
    },
    judges: async (parent, {page=1}, ctx) => {
        if (ctx.user.meta.id !== parent.id) return

        const bots = await Judge.find({requester: ctx.user.meta.id})

        for (const bot of bots) {
            await fetchBot(bot)
        }

        const chunks = _.chunk(_.reverse(bots), 12)

        return {
            items: chunks[page-1] || [],
            pages: chunks.length
        }
    }
}