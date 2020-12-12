module.exports = {
    guilds: async (parent, args) => {
        if (args.patch !== undefined) {
            parent.guilds = args.patch
            await parent.save()
        }
        return parent.guilds
    }
}