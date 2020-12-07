require('graphql-import-node')
const mongoose = require('mongoose')

const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./schema.graphql')

const resolvers = require('./resolvers')

const express = require('express')

const config = require('../config.json')

const cors = require('cors')

const app = express()

app.use(cors())

const apollo = new ApolloServer({typeDefs, resolvers})

apollo.applyMiddleware({app})


mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(1234, () => console.log('Listening')))
