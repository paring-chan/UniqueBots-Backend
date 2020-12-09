const {evaluate} = require('./bot')


module.exports = async bot => {
    const tag = await evaluate(`
            client.users.cache.get(${JSON.stringify(bot.id.toString())})?.tag
            `)
    if (tag !== null && tag !== bot.tag) {
        bot.tag = tag
        await bot.save()
    }
    bot.tag = bot.tag || null
    bot.approved = bot.approved || false
    bot.status = await evaluate(`
            client.users.cache.get(${JSON.stringify(bot.id.toString())})?.presence?.status
            `) || 'unknown'
    return bot
}