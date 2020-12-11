const Audit = require("../../models/Audit");
module.exports = {
    user: (parent) => {
        return parent
    },
    promote: async (parent, args, ctx) => {
        parent.admin = true
        await parent.save()
        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `유저 ${parent.tag}을(를) 관리자로 설정함`

        await audit.save()
        return true
    },
    removeMod: async (parent, args, ctx) => {
        parent.admin = false
        await parent.save()
        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `유저 ${parent.tag}의 관리자 권한을 제거함`

        await audit.save()
        return true
    }
}