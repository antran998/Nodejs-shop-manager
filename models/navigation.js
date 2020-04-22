'use strict';
module.exports = (sequelize, DataTypes) => {
    const navigation = sequelize.define(
        'navigation',
        {
            name: DataTypes.STRING,
            sub: DataTypes.STRING,
            route: DataTypes.STRING,
            commandId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'command',
                    key:'id'
                }
            },
            //----GENERAL FIELD----//
            userCreated: DataTypes.STRING,
            userUpdated: DataTypes.STRING,
        },
        { freezeTableName: true },
    );
    navigation.associate = function(models) {        
        navigation.belongsTo(models.command);
    };
    return navigation;
};
