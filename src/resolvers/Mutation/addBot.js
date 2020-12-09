const loginRequired = require('../../middlewares/loginRequired')

module.exports = loginRequired((parent, args, ctx) => {
    console.log(args)
})