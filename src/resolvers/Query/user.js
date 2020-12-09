const User = require("../../models/User");
module.exports = async (parent, {id}) => {
    const user = await User.findOne({id})
    if (!user) return null

    user.avatarURL = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : 'https://cdn.discord.app.com/embed/avatars/' + user.discriminator

    return user
}