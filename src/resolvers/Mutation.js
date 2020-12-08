const config = require('../../config.json')
const safeFetch = require('../util/rateLimitHandle')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (_, {code}) => {
        const body = new URLSearchParams()

        body.set('client_id', config.oauth2.clientID)

        body.set('client_secret', config.oauth2.clientSecret)

        body.set('grant_type', 'authorization_code')

        body.set('code', code)

        body.set('redirect_uri', config.oauth2.authCallback)

        body.set('scope', 'identify')

        let res = await fetch('https://discord.com/api/v8/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        })

        if (res.status !== 200) return null

        const tokens = await res.json()

        const result = await (await safeFetch('https://discord.com/api/v8/users/@me', {
            headers: {
                Authorization: `${tokens.token_type} ${tokens.access_token}`
            }
        })).json()

        return jwt.sign(result, config.jwtSecret)
    }
}