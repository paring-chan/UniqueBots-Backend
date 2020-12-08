const config = require('../../config.json')

module.exports.evaluate = async (code) => {
    return fetch(`http://localhost:${config.internal.port}/evaluate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code})
    }).then(res => res.json()).then(res => res.result || res.err)
}