const Badge = require("../../models/Badge");
module.exports = {
    badges: async (parent) => {
        const badges = Array.from(parent.badges)
        if (parent.admin) {
            badges.push('admin')
        }
        const result = []
        for (const badge of badges) {
            const b = await Badge.findOne({id: badge})
            if (b) result.push(b)
        }
        return result
    }
}