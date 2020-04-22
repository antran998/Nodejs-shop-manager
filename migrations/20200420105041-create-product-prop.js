'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_prop', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        productId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'product',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        size: {
            type: Sequelize.STRING,
        },
        color: {
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
    return queryInterface.dropTable('product_prop');
  }
};