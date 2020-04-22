'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('navigation', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
        },
        sub: {
            type: Sequelize.STRING,
        },
        route: {
            type: Sequelize.STRING,
        },
        commandId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'command',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
    return queryInterface.dropTable('navigation');
  }
};