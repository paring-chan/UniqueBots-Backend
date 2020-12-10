module.exports = {
    user: (parent) => {
        return parent
    },
    promote: async parent => {
        parent.admin = true
        await parent.save()
        return true
    },
    removeMod: async parent => {
        parent.admin = false
        await parent.save()
        return true
    }
}