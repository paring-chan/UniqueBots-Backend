const loginRequired = require('../../middlewares/loginRequired')
const Bot = require("../../models/Bot");
const Judge = require("../../models/Judge");
const {ApolloError} = require("apollo-server-errors");
const {evaluate} = require('../../util/bot')


module.exports = loginRequired(async (parent, args, ctx) => {
    if (!args.id) throw new ApolloError('id Field required', 'ID_REQUIRED', {
        parameter: 'id'
    })
    if (!args.brief) throw new ApolloError('brief Field required', 'BRIEF_REQUIRED', {
        parameter: 'brier'
    })
    if (!args.description) throw new ApolloError('description Field required', 'DESCRIPTION_REQUIRED', {
        parameter: 'description'
    })
    if (args.id.length < 17 || args.id.length > 19 || isNaN(Number(args.id))) {
        throw new ApolloError('아이디의 길이는 17-19 사이어야 하고 숫자여야 합니다.')
    }

    if (!await evaluate(`
        client.users.fetch(${args.id}).then(res => res.bot).catch(e => false)
    `)) {
        throw new ApolloError('입력한 id에 일치하는 봇을 찾을 수 없어요!', 'ERR_INVALID_CLIENT_ID')
    }

    if (await Judge.findOne({requester: ctx.user.meta.id, pending: true})) {
        throw new ApolloError('이미 진행중인 심사가 있네요!', 'ERR_JUDGING_OTHER')
    }

    if (await Bot.findOne({id: args.id})) {
        throw new ApolloError('해당 ID의 봇이 이미 존재합니다.', 'ERR_BOT_ALREADY_EXISTS', {parameter: 'id'})
    }

    const judge = new Judge()

    judge.id = args.id
    judge.requester = ctx.user.meta.id

    await judge.save()

    const bot = new Bot()

    bot.owner = ctx.user.meta.id

    bot.id = args.id
    bot.description = args.description.slice(0,1500)
    bot.brief = args.brief.slice(0,50)
    bot.invite = args.invite
    bot.prefix = args.prefix

    await bot.save()

    return true
})