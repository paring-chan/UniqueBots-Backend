module.exports = {
    delete: async (parent) => {
        await parent.delete()
        return false
    }
}