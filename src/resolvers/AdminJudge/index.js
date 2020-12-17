const Bot = require("../../models/Bot");
const Audit = require("../../models/Audit");
const {ApolloError} = require("apollo-server-errors");
const {evaluate} = require('../../util/bot')

module.exports = {
    approve: async (parent, args, ctx) => {
        if (!parent.pending) return false

        const bot = await Bot.findOne({id: parent.id})

        bot.approved = true

        await bot.save()

        parent.pending = false

        parent.approved = true
        await parent.save()

        await evaluate(`
        (async () => {
            const bot = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(parent.id)})
        if (bot) { 
        await bot.roles.add(config.role.approved)
        await bot.roles.remove(config.role.pending) }
        const requester = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(parent.requester)})
        if (requester) await requester.user.send(\`봇 \${bot.user.tag}이(가) 승인되었습니다.\`).catch(e => null)
        })()
        `)

        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `봇 ${parent.id}을(를) 승인함`

        await audit.save()

        return true
    },
    deny: async (parent, {reason}, ctx) => {
        if (!parent.pending) return false

        if (!reason) throw new ApolloError('Reason must be provided', 'ERR_REASON_REQUIRED')

        const bot = await Bot.findOne({id: parent.id})

        await Bot.findByIdAndDelete(bot._id)

        parent.pending = false

        parent.approved = false

        parent.reason = reason

        await parent.save()

        await evaluate(`
        (async () => {
            const bot = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(parent.id)})
            const user = await client.users.fetch(${JSON.stringify(parent.id)}).catch(e=>({}))
        if (bot) return await bot.kick('봇이 승인 거부되었습니다.').catch(e=>null)
        const requester = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(parent.requester)})
        if (requester) await requester.user.send(\`봇 \${user.tag}이(가) 승인 거부되었습니다.\n사유: \` + ${JSON.stringify(reason)}).catch(e=>null)
        })()
        `)

        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `봇 ${parent.id}을(를) 거부함`

        await audit.save()

        return true
    },
    bot: async (parent) => {
        return Bot.findOne({
            id: parent.id
        })
    },
    requester: async (parent) => {
        return evaluate(`client.users.cache.get(${JSON.stringify(parent.requester)})?.tag || ${JSON.stringify(parent.requester)}`)
    }
}