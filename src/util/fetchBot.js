const User = require("../models/User");
const {evaluate} = require('./bot')


module.exports = async bot => {
    const tag = await evaluate(`
            client.users.cache.get(${JSON.stringify(bot.id.toString())})?.tag
            `)
    if (tag !== null && tag !== bot.tag) {
        bot.tag = tag
    }
    bot.tag = bot.tag || null
    bot.approved = bot.approved || false
    bot.status = await evaluate(`
            client.users.cache.get(${JSON.stringify(bot.id.toString())})?.presence?.status
            `) || 'unknown'
    bot.avatar = await evaluate(`
            client.users.cache.get(${JSON.stringify(bot.id.toString())})?.displayAvatarURL()
            `) || bot.avatar
    bot.discordVerified = await evaluate(`client.users.cache.get(${JSON.stringify(bot.id.toString())}).flags?.has('VERIFIED_BOT')`)
    if (typeof bot.discordVerified !== 'boolean') {
        bot.discordVerified = false
    }
    // bot.discordVerified = false
    bot.invite = bot.invite || `https://discord.com/api/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0`
    await bot.save()
    bot._owner = await User.findOne({id: bot.owner})

    return bot
}