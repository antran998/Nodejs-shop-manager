'use strict';
module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define(
      'session',
      {
          sid: {
              type: DataTypes.STRING,
              primaryKey: true,
          },
          expires: DataTypes.DATE,
          data: DataTypes.TEXT,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      {
          freezeTableName: true,
      },
  );
  session.associate = function(models) {
    // associations can be defined here
  };
  return session;
};