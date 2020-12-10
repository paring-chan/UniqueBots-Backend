const User = require("../../models/User");
module.exports = async (parent, {id}) => {
    const user = await User.findOne({id})
    if (!user) return null
    return user
}