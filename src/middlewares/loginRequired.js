const {ApolloError} = require("apollo-server-errors");
module.exports = (fn) => {
    return (...params) => {
        if (!params[2].user) throw new ApolloError('Login required', 'LOGIN_REQUIRED')
        return fn(...params)
    }
}