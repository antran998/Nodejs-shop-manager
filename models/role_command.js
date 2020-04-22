'use strict';
module.exports = (sequelize, DataTypes) => {
  const role_command = sequelize.define(
      'role_command',
      {
          roleId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'role',
                  key: 'id',
              },
          },
          commandId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'command',
                  key: 'id',
              },
          },
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  role_command.associate = function(models) {
    // associations can be defined here    
  };
  return role_command;
};