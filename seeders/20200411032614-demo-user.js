'use strict';
const Users = require('../models').user;
const Addresses = require('../models').address;
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await Users.bulkCreate(
            [
                {
                    id: 1,
                    name: '_guest',
                },
                {
                    id: 2,
                    name: 'An Trần',
                    email: 'anan789@gmail.com',
                    password: '@Bcd1234',
                    phone: '0123456789',
                    gender: 'Nam',
                    age: '22',
                    isEmailCheck: true,
                    address: {
                        address: '21',
                        street: 'Le Trong Tan',
                        district: 'Tan Phu',
                        city: 'HCM',
                        country: 'Viet Nam',
                    },
                },
                {
                    id: 3,
                    name: 'Mai Nguyễn',
                    email: 'mainguyen123@gmail.com',
                    password: '@Bcd1234',
                    phone: '0123456789',
                    gender: 'Nữ',
                    age: '25',
                    isEmailCheck: true,
                    address: {
                        address: '30',
                        street: 'Le Trong Tan',
                        district: 'Tan Phu',
                        city: 'HCM',
                        country: 'Viet Nam',
                    },
                },
            ],
            {
                include: [Addresses],
            },
        );
        await users[1].addRoles([1, 2, 3]);
        await users[2].addRoles([2,3]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('user', null, {});
    },
};
