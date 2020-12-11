const Audit = require("../../models/Audit");
module.exports = {
    delete: async (parent, args, ctx) => {
        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `봇 ${parent.id}을(를) 삭제함`
        await audit.save()
        await parent.delete()
        return true
    }
}