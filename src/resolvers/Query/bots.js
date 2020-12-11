const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const _ = require('lodash')

module.exports = async (parent, {page=1, sort}) => {
    /**
     * @type {Array}
     */
    const bot = await Bot.find({approved: true})
    await Promise.all(bot.map(fetchBot))
    switch (sort) {
        case 'servers':
            bot.sort((a, b) => b.guilds-a.guilds)
            break
    }
    const chunked = _.chunk(bot, 12)
    return {
        pages: chunked.length,
        result: chunked[page-1] || []
    }
}