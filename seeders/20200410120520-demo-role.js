'use strict';
const Roles = require('../models').role;
const Commands = require('../models').command;
const { Op } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const roles = await Roles.bulkCreate([
            {
                id: 1,
                name: 'Quản trị viên',
                code: 'admin',
            },
            {
                id: 2,
                name: 'Quản lý',
                code: 'manager',
            },
            {
                id: 3,
                name: 'Người dùng',
                code: 'user',
            },
        ]);
        const allCommands = await Commands.findAll({ attributes: ['id'] });
        const commandIds = allCommands.map((command) => {
            return command.id;
        });
        await roles[0].addCommands(commandIds);

        let need = await Commands.findAll({
            where: {
                code: {
                    [Op.in]: [
                        'access_category',
                        'add_category',
                        'update_category',
                        'delete_category',
                        'add_product',
                        'update_product',
                        'delete_product'
                    ],
                },
            },
            attributes: ['id'],
        });
        const managerCommands = need.map((command) => {
            return command.id;
        });
        await roles[1].addCommand(managerCommands);

        need = await Commands.findAll({
            where: {
                code: {
                    [Op.in]: [
                        'update_your_info',
                        'update_your_password',
                    ],
                },
            },
            attributes: ['id'],
        });
        const userCommands = need.map((command) => {
            return command.id;
        })
        await roles[2].addCommand(userCommands);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('role', null, {});
    },
};
