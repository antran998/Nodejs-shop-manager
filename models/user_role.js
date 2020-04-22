'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_role = sequelize.define(
      'user_role',
      {
          userId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'user',
                  key: 'id',
              },
          },
          roleId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'role',
                  key: 'id',
              },
          },
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  user_role.associate = function(models) {
    // associations can be defined here    
  };
  return user_role;
};