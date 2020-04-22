'use strict';
const Commands = require('../models').command;
const Navigation = require('../models').navigation;
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await Commands.bulkCreate(
            [
                {
                    id: 1,
                    name: 'Quản lý loại sản phẩm',
                    code: 'access_category',
                    navigation: {
                        name: 'Quản lý loại sản phẩm',
                        sub: 'category-manager',
                        route: 'admin',
                    },
                },
                {
                    id: 2,
                    name: 'Quản lý sản phẩm',
                    code: 'access_product',
                    navigation: {
                        name: 'Quản lý sản phẩm',
                        sub: 'product-manager',
                        route: 'admin',
                    },
                },
                {
                    id: 3,
                    name: 'Quản lý phân quyền',
                    code: 'access_role',
                    navigation: {
                        name: 'Quản lý phân quyền',
                        sub: 'role-manager',
                        route: 'admin',
                    },
                },
                {
                    id: 4,
                    name: 'Quản lý người dùng',
                    code: 'access_user',
                    navigation: {
                        name: 'Quản lý người dùng',
                        sub: 'user-manager',
                        route: 'admin',
                    },
                },
                {
                    name: 'Thêm loại sản phẩm',
                    code: 'add_category',
                },
                {
                    name: 'Sửa loại sản phẩm',
                    code: 'update_category',
                },
                {
                    name: 'Xóa loại sản phẩm',
                    code: 'delete_category',
                },
                {
                    name: 'Thêm sản phẩm',
                    code: 'add_product',
                },
                {
                    name: 'Sửa sản phẩm',
                    code: 'update_product',
                },
                {
                    name: 'Xóa sản phẩm',
                    code: 'delete_product',
                },
                {
                    name: 'Thêm vai trò',
                    code: 'add_role',
                },
                {
                    name: 'Sửa vai trò',
                    code: 'update_role',
                },
                {
                    name: 'Xóa vai trò',
                    code: 'delete_role',
                },
                {
                    name: 'Sửa người dùng',
                    code: 'update_user',
                },
                {
                    name: 'Sửa mật khẩu',
                    code: 'update_your_password',
                },
                {
                    name: 'Sửa thông tin của bạn',
                    code: 'update_your_info',
                },
            ],
            { include: [Navigation] },
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('command', null, {});
    },
};
