const Badge = require("../../models/Badge");
const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const _ = require('lodash')

module.exports = {
    badges: async (parent) => {
        const badges = Array.from(parent.badges)
        if (parent.admin) {
            badges.push('admin')
        }
        const result = []
        for (const badge of badges) {
            const b = await Badge.findOne({id: badge})
            if (b) result.push(b)
        }
        return result
    },
    bots: async (parent, {page=1}) => {
        const bots = await Bot.find({owner: parent.id})

        for (const bot of bots) {
            await fetchBot(bot)
        }

        const chunks = _.chunk(bots, 9)

        return {
            result: chunks[page-1] || [],
            pages: chunks.length
        }
    }
}