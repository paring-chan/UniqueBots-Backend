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
    judges: async () => {
        return Judge.find({pending: true})
    },
    judge: async (parent, {id}) => Judge.findOne({id, pending: true})
}