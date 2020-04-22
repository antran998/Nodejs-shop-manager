'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
      'category',
      {
          name: DataTypes.STRING,
          code: DataTypes.STRING,
          description: DataTypes.STRING,
          image: DataTypes.STRING,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  category.associate = function(models) {
    // associations can be defined here
    category.hasMany(models.product);
  };
  return category;
};