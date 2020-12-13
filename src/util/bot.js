const config = require('../../config.json')
const io = require('socket.io-client')
const uuid = require('uuid')

const socket = io(`http://${config.internal.host}:${config.internal.port}`)

const resolvers = {}

module.exports.evaluate = async (code) => {
    const id = uuid.v4()

    return new Promise(resolve => {
        resolvers[id] = resolve
        socket.emit('eval', {
            id,
            code
        })
    })
}

socket.on('eval', data => {
    if (resolvers[data.id]) {
        resolvers[data.id](data.result)
        delete resolvers[data.id]
    }
})
