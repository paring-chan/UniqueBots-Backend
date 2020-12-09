module.exports = (parent, args, ctx) => {
    if (!ctx.user || !ctx.user.meta.admin) {
        return null
    }
    return {
        _meta: {
            user: ctx.user
        }
    }
}
