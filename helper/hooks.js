const Users = require('../models').user;

exports.setUpHook = () => {
    return {
        beforeCreate: (item, options) => {
            item.userCreated = username;
            item.userUpdated = username;
        },
        beforeBulkCreate: (items, options) => {
            for (const item of items) {
                item.userCreated = username;
                item.userUpdated = username;
            }
        },
        beforeUpdate: (item, options) => {
            item.userCreated = username;
            item.userUpdated = username;
        },
    };
}