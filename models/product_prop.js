'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_prop = sequelize.define(
      'product_prop',
      {
          productId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'product',
                  key: 'id',
              },
          },
          size: DataTypes.STRING,
          color: DataTypes.STRING,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  product_prop.associate = function(models) {
    // associations can be defined here
    product_prop.belongsTo(models.product);
  };
  return product_prop;
};