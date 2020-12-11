const router = require('express').Router()
const ed = require('noble-ed25519')
const config = require('../../config.json')
const Judge = require("../models/Judge");
const User = require("../models/User");
const Bot = require("../models/Bot");
const {evaluate} = require('../util/bot')

const verify = async (req, res, next) => {
    const signed = await ed.verify(req.headers['x-signature-ed25519'], Buffer.concat([Buffer.from(req.headers['x-signature-timestamp']), Buffer.from(JSON.stringify(req.body))]), config.internal.publicKey)
    if (!signed) {
        return res.status(401).json({
            success: false,
            error: 'Forbidden',
            code: 403
        })
    }
    next()
}

router.post('/', verify, async (req, res) => {
    console.log(req.body)
    if (req.body.type === 1) {
        return res.json({
            type: 1
        })
    }
    // res.json({
    //     type: 4,
    //     data: {
    //         tts: false,
    //         content: 'test'
    //     }
    // })
    if (req.body.data.name === 'approve') {
        const user = await User.findOne({id: req.body.member.user.id})

        if (!user || !user.admin) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '이 명령어는 관리자만 사용 가능합니다.'
                }
            })
        }

        const id = req.body.data.options.find(r => r.name === 'bot').value
        const bot = await Bot.findOne({id})
        const judge = await Judge.findOne({id: id, pending: true})
        if (!bot) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '봇을 찾을 수 없습니다.'
                }
            })
        }
        if (!judge) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '심사를 찾을 수 없습니다.'
                }
            })
        }
        bot.approved = true
        judge.pending = false
        judge.approved = true
        await bot.save()
        await judge.save()

        await evaluate(`
        (async () => {
            const bot = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(judge.id)})
        if (bot) { 
        await bot.roles.add(config.role.approved)
        await bot.roles.remove(config.role.pending) }
        const requester = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(judge.requester)})
        if (requester) await requester.user.send(\`봇 \${bot.user.tag}이(가) 승인되었습니다.\`).catch(e => null)
        })()
        `)

        return res.json({
            type: 4,
            data: {
                tts: false,
                content: '봇이 승인되었습니다.'
            }
        })
    } else if (req.body.data.name === 'deny') {
        const user = await User.findOne({id: req.body.member.user.id})

        if (!user || !user.admin) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '이 명령어는 관리자만 사용 가능합니다.'
                }
            })
        }

        const id = req.body.data.options.find(r => r.name === 'bot').value
        const reason = req.body.data.options.find(r => r.name === 'reason').value
        const bot = await Bot.findOne({id})
        const judge = await Judge.findOne({id: id, pending: true})
        if (!bot) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '봇을 찾을 수 없습니다.'
                }
            })
        }
        if (!judge) {
            return res.json({
                type: 4,
                data: {
                    tts: false,
                    content: '심사를 찾을 수 없습니다.'
                }
            })
        }

        await bot.delete()

        judge.pending = false

        judge.false = true

        judge.reason = reason

        await parent.save()

        await evaluate(`
        (async () => {
            const bot = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(judge.id)})
            const user = await client.users.fetch(${JSON.stringify(judge.id)}).catch(e=>({}))
        if (bot) return await bot.kick('봇이 승인 거부되었습니다.').catch(e=>null)
        const requester = client.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(judge.requester)})
        if (requester) await requester.user.send(\`봇 \${user.tag}이(가) 승인 거부되었습니다.\n사유: \` + ${JSON.stringify(reason)}).catch(e=>null)
        })()
        `)

        return res.json({
            type: 4,
            data: {
                tts: false,
                content: '봇이 승인 거부되었습니다.'
            }
        })
    }
})

module.exports = router
