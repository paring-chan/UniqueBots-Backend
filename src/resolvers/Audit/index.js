const User = require("../../models/User");
module.exports = {
    user: (parent) => User.findOne({id: parent.id})
}