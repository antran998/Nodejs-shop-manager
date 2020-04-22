'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
      'role',
      {
          name: DataTypes.STRING,
          code: DataTypes.STRING,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  role.associate = function(models) {
    // associations can be defined here
    role.belongsToMany(models.command, {through: 'role_command'});
    role.belongsToMany(models.user, {through: 'user_role'});    
  };
  return role;
};