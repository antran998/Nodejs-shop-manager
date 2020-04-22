'use strict';
const Navigation = require('../models').navigation;
module.exports = {
    up:async (queryInterface, Sequelize) => {
        await Navigation.bulkCreate([
            {
                name: 'Đăng nhập',
                sub: 'authentication',
                route: 'login',
            },
            {
                name: 'Đăng xuất',
                sub: '/',
                route: 'logout',
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('navigation', null, {});
    },
};
