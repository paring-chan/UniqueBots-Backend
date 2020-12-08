require('graphql-import-node')
const mongoose = require('mongoose')
global.fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

const {ApolloServer} = require('apollo-server-express')

const typeDefs = require('./schema.graphql')

const resolvers = require('./resolvers')

const express = require('express')

const config = require('../config.json')

const cors = require('cors')

const app = express()

app.use(cors())

const apollo = new ApolloServer({
    typeDefs, resolvers, context: async context => {
        const token = context.req.headers.authorization
        const res = {}
        if (!token) res.user = null
        else {
            let user
            try {
                const meta = jwt.verify(token.slice('Bearer '.length), config.jwtSecret)
                user= {
                    meta
                }
                user.meta.tag = user.meta.username + '#' + user.meta.discriminator
            } catch(e) {
                user = null
            }
            res.user = user
        }
        return res
    }
})

apollo.applyMiddleware({app})


mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(1234, () => console.log('Listening')))
