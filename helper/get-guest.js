const Users = require('../models').user;

const { SessionDataHandler } = require('./session-data');

module.exports = async (req, res, next) => {
    try {
        if (!req.session.user) {
            const user = await Users.findOne({ where: { name: '_guest' } });
            const sessionData = await SessionDataHandler(user);
            req.session.user = sessionData;
            global.username = req.session.user.name;
            next();
        }
        else next();
    } catch (err) {
        console.log(err);
    }
};
