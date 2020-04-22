'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define(
      'address',
      {
          address: DataTypes.STRING,
          street: DataTypes.STRING,
          district: DataTypes.STRING,
          city: DataTypes.STRING,
          country: DataTypes.STRING,
          userId:{
            type: DataTypes.INTEGER,
            references: {
              model: 'user',
              key: 'id'
            }
          },
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  address.associate = function(models) {
    // associations can be defined here
    address.belongsTo(models.user);
  };
  return address;
};