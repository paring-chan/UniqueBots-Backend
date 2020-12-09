module.exports = (fn) => {
    return (...params) => {
        if (!params[2].user) return null
        return fn(...params)
    }
}