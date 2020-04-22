'use strict';
module.exports = (sequelize, DataTypes) => {
  const command = sequelize.define(
      'command',
      {
          name: DataTypes.STRING,
          code: DataTypes.STRING,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  command.associate = function(models) {
    // associations can be defined here
    command.belongsToMany(models.role, { through: 'role_command' });
    command.hasOne(models.navigation);
  };
  return command;
};