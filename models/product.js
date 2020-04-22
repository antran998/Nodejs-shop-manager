'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
      'product',
      {
          name: DataTypes.STRING,
          code: DataTypes.STRING,
          price: DataTypes.DOUBLE,
          image: DataTypes.STRING,
          categoryId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'category',
                  key: 'id',
              },
          },
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      { freezeTableName: true },
  );
  product.associate = function(models) {
    // associations can be defined here
    product.belongsTo(models.category);
    product.hasOne(models.product_prop);

  };
  return product;
};