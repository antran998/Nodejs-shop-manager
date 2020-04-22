'use strict';
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
      'user',
      {
          name: DataTypes.STRING,
          email: DataTypes.STRING,
          password: DataTypes.STRING,
          phone: DataTypes.STRING,
          gender: DataTypes.STRING,
          age: DataTypes.STRING,
          resetPasswordCode: DataTypes.STRING,
          isEmailCheck: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
          },
          emailCode: DataTypes.STRING,
          //----GENERAL FIELD----//
          userCreated: DataTypes.STRING,
          userUpdated: DataTypes.STRING,
      },
      {
          freezeTableName: true,
          hooks: {
              beforeCreate: async (user, options) => {
                const hashedPassword = await bcrypt.hash(user.password, 12);
                user.password = hashedPassword;
              },
              beforeBulkCreate: async (users, options) => {
                for(const user of users) {
                  if(user.name != '_guest') {
                    const hashedPassword = await bcrypt.hash(user.password, 12);
                    user.password = hashedPassword;                  
                  }                  
                }
              },
          },
      },
  );
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.role, { through: 'user_role' });
    user.hasOne(models.address);
  };
  return user;
};