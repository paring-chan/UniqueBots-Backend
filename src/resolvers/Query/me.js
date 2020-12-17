module.exports = async (_, args, ctx) => {
    return ctx.user?.meta
}