module.exports = (...params) => {
    return new Promise(resolve => {
        return fetch(...params).then(async res => {
            if (res.status === 429) {
                const json = await res.json()
                return new Promise(resolve1 => setTimeout(() => resolve(module.exports(...params)), json.retry_after))
            }
            return resolve(res)
        })
    })
}