'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.STRING,
        },
        age: {
            type: Sequelize.STRING,
        },
        resetPasswordCode: {
            type: Sequelize.STRING,
        },
        isEmailCheck: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        emailCode: {
            type: Sequelize.STRING,
        },
        //----GENERAL FIELD----//
        userCreated: Sequelize.STRING,
        userUpdated: Sequelize.STRING,
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};