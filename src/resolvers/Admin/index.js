const Bot = require("../../models/Bot");
const _ = require('lodash')
const fetchBot = require('../../util/fetchBot')
const Judge = require("../../models/Judge");


module.exports = {
    bots: async (parent, {page=1, search=''}) => {

        const chunks = _.chunk(await Bot.find(), 18)

        const res = chunks[page-1] || []

        for (const i in res) {
            await fetchBot(res[i])
        }

        return {result: res, pages: chunks.length}
    },
    judges: async (parent, {page=1, search='', pending}) => {
        const chunks = _.chunk(pending ? await Judge.find({pending: true}) : await Judge.find(), 18)

        let res = chunks[page-1] || []

        return {result: res, pages: chunks.length}
    }
}